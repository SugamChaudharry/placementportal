import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";
import { prisma } from "../../shared/database/prisma";
import { redis, redisKeys } from "../../shared/database/redis";
import { queueJobs } from "../../shared/queue/queue";
import { env } from "../../config/env";
import { v4 as uuidv4 } from "uuid";
import type { RegisterDto, LoginDto, GoogleDto, ResetPasswordDto } from "./auth.schema";

function generateUsernameFromName(name: string): string {
  // Clean name: lowercase, remove non-alphanumeric, replace spaces with empty
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12);
  
  // Add random 4-char suffix (alphanumeric)
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}${random}`;
}

async function generateUniqueUsername(name: string): Promise<string> {
  let username = generateUsernameFromName(name);
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (!existing) {
      return username;
    }
    // Collision - regenerate with new random suffix
    username = generateUsernameFromName(name);
    attempts++;
  }

  // Fallback: use timestamp if too many collisions
  const timestamp = Date.now().toString(36).slice(-4);
  return `${generateUsernameFromName(name)}${timestamp}`;
}

export class AuthService {
  async register(dto: RegisterDto, app: FastifyInstance) {
    const exists = await prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw { statusCode: 409, message: "Email already in use" };

    // Auto-generate username if not provided
    let username = dto.username;
    if (!username) {
      username = await generateUniqueUsername(dto.name);
    } else {
      // Check if username is already taken
      const usernameExists = await prisma.user.findUnique({ where: { username } });
      if (usernameExists) throw { statusCode: 409, message: "Username already in use" };
    }

    // Check for super admin email - allow admin role only for this email
    const isSuperAdmin = env.SUPER_ADMIN_EMAIL && dto.email.toLowerCase() === env.SUPER_ADMIN_EMAIL.toLowerCase();
    const role = isSuperAdmin ? "admin" : dto.role;

    // Prevent direct admin registration unless it's the super admin email
    if ((dto.role as string) === "admin" && !isSuperAdmin) {
      throw { statusCode: 403, message: "Admin registration is not allowed. Contact an existing admin." };
    }

    const hash = await bcrypt.hash(dto.password, 12);
    const user = await prisma.user.create({
      data: { name: dto.name, username, email: dto.email, passwordHash: hash, role },
      select: { id: true, name: true, username: true, email: true, role: true, avatar: true }
    });

    // Generate token for auto-login
    const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, { expiresIn: "7d" });
    await redis.setex(redisKeys.session(user.id), 7 * 24 * 60 * 60, token);

    return { token, user, needsOnboarding: true };
  }

  async login(dto: LoginDto, app: FastifyInstance) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw { statusCode: 401, message: "Invalid credentials" };
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw { statusCode: 401, message: "Invalid credentials" };
    const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, { expiresIn: "7d" });
    await redis.setex(redisKeys.session(user.id), 7 * 24 * 60 * 60, token);

    // Check if role-specific profile exists and is complete to determine if onboarding is needed
    let needsOnboarding = false;
    if (user.role === "student") {
      const student = await prisma.student.findUnique({ where: { userId: user.id } });
      needsOnboarding = !student || student.profileComplete < 100;
    } else if (user.role === "recruiter") {
      const recruiter = await prisma.recruiter.findUnique({ where: { userId: user.id }, include: { company: true } });
      needsOnboarding = !recruiter || !recruiter.companyId;
    }

    return { token, user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role, avatar: user.avatar }, needsOnboarding };
  }

  async google(dto: GoogleDto, app: FastifyInstance) {
    let user = await prisma.user.findUnique({ where: { email: dto.email } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;

      // Check for super admin email
      const isSuperAdmin = env.SUPER_ADMIN_EMAIL && dto.email.toLowerCase() === env.SUPER_ADMIN_EMAIL.toLowerCase();
      const role = isSuperAdmin ? "admin" : (dto.role || "student");

      // Prevent direct admin registration via Google unless it's the super admin email
      if ((dto.role as string) === "admin" && !isSuperAdmin) {
        throw { statusCode: 403, message: "Admin registration is not allowed. Contact an existing admin." };
      }

      const username = await generateUniqueUsername(dto.name);

      user = await prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          username,
          avatar: dto.avatar,
          passwordHash: await bcrypt.hash(uuidv4(), 10),
          role
        }
      });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, { expiresIn: "7d" });
    await redis.setex(redisKeys.session(user.id), 7 * 24 * 60 * 60, token);

    // Check if role-specific profile exists and is complete to determine if onboarding is needed
    let needsOnboarding = false;
    if (user.role === "student") {
      const student = await prisma.student.findUnique({ where: { userId: user.id } });
      needsOnboarding = !student || student.profileComplete < 100;
    } else if (user.role === "recruiter") {
      const recruiter = await prisma.recruiter.findUnique({ where: { userId: user.id }, include: { company: true } });
      needsOnboarding = !recruiter || !recruiter.companyId;
    }

    return {
      token,
      user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role, avatar: user.avatar },
      needsOnboarding
    };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: "If an account exists, a reset link has been sent." };
    const token = uuidv4();
    await redis.setex(redisKeys.passwordReset(token), 15 * 60, user.id);
    if (env.RESEND_API_KEY) {
      await queueJobs.email({ to: email, subject: "Password Reset - PlaceMe", html: `<p>Click <a href="${env.CLIENT_URL}/reset-password?token=${token}">here</a> to reset your password. This link expires in 15 minutes.</p>` });
    }
    return { message: "If an account exists, a reset link has been sent." };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const userId = await redis.get(redisKeys.passwordReset(dto.token));
    if (!userId) throw { statusCode: 400, message: "Invalid or expired reset token" };
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    await redis.del(redisKeys.passwordReset(dto.token));
    await redis.del(redisKeys.session(userId));
    return { message: "Password reset successfully. Please login with your new password." };
  }

  async updateRole(userId: string, role: "student" | "recruiter" | "admin", app: FastifyInstance) {
    const user = await prisma.user.update({ where: { id: userId }, data: { role } });
    const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, { expiresIn: "7d" });
    await redis.setex(redisKeys.session(user.id), 7 * 24 * 60 * 60, token);
    return { token, user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role, avatar: user.avatar } };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, username: true, name: true, role: true, avatar: true, createdAt: true, student: true, recruiter: { include: { company: true } } } });
    if (!user) throw { statusCode: 404, message: "User not found" };
    return user;
  }

  async logout(userId: string) {
    await redis.del(redisKeys.session(userId));
    return { message: "Logged out successfully" };
  }
}
