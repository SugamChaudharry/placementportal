import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service";
import { registerSchema, loginSchema, googleSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.schema";
import type { RegisterDto, LoginDto, GoogleDto, ForgotPasswordDto, ResetPasswordDto } from "./auth.schema";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function authRoutes(app: FastifyInstance) {
  const svc = new AuthService();

  // Register
  app.post<{ Body: RegisterDto }>("/register", {
    schema: { body: registerSchema },
    handler: async (req, reply) => {
      const result = await svc.register(req.body, app);
      reply.code(201).send(result);
    },
  });

  // Login
  app.post<{ Body: LoginDto }>("/login", {
    schema: { body: loginSchema },
    handler: async (req, reply) => {
      const result = await svc.login(req.body, app);
      reply.send(result);
    },
  });

  // Google OAuth
  app.post<{ Body: GoogleDto }>("/google", {
    schema: { body: googleSchema },
    handler: async (req, reply) => {
      const result = await svc.google(req.body, app);
      reply.send(result);
    },
  });

  // Forgot Password
  app.post<{ Body: ForgotPasswordDto }>("/forgot-password", {
    schema: { body: forgotPasswordSchema },
    handler: async (req, reply) => {
      const result = await svc.forgotPassword(req.body.email);
      reply.send(result);
    },
  });

  // Reset Password
  app.post<{ Body: ResetPasswordDto }>("/reset-password", {
    schema: { body: resetPasswordSchema },
    handler: async (req, reply) => {
      const result = await svc.resetPassword(req.body);
      reply.send(result);
    },
  });

  // Get current user (protected)
  app.get("/me", {
    onRequest: [async (req, reply) => app.authenticate(req, reply)],
    handler: async (req) => {
      const user = req.user as { id: string };
      return await svc.getMe(user.id);
    },
  });

  // Update user role (protected, for onboarding)
  app.post<{ Body: { role: "student" | "recruiter" | "admin" } }>("/update-role", {
    onRequest: [async (req, reply) => app.authenticate(req, reply)],
    handler: async (req, reply) => {
      const user = req.user as { id: string };
      const result = await svc.updateRole(user.id, req.body.role, app);
      reply.send(result);
    },
  });
}
