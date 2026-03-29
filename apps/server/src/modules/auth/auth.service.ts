import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";
import { prisma } from "../../shared/database/prisma";
import type { RegisterDto, LoginDto } from "./auth.schema";
export class AuthService {
  async register(dto: RegisterDto) {
    const exists = await prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw { statusCode: 409, message: "Email already in use" };
    const hash = await bcrypt.hash(dto.password, 12);
    const user = await prisma.user.create({ data: { name: dto.name, email: dto.email, passwordHash: hash, role: dto.role }, select: { id: true, name: true, email: true, role: true } });
    return { user };
  }
  async login(dto: LoginDto, app: FastifyInstance) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw { statusCode: 401, message: "Invalid credentials" };
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw { statusCode: 401, message: "Invalid credentials" };
    const token = app.jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, { expiresIn: "7d" });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}
