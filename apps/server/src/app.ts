import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

import { authRoutes } from "./modules/auth/auth.router";
import { userRoutes } from "./modules/users/users.router";
import { jobsRoutes } from "./modules/jobs/jobs.router";
import { applicationsRoutes } from "./modules/applications/applications.router";
import { testsRoutes } from "./modules/tests/tests.router";
import { notificationRoutes } from "./modules/notifications/notifications.router";
import { resumeRoutes } from "./modules/resume/resume.router";
import { aiRoutes } from "./modules/ai/ai.router";
import { calendarRoutes } from "./modules/calendar/calendar.router";
import { chatRoutes } from "./modules/chat/chat.router";
import { meetingsRoutes } from "./modules/meetings/meetings.router";
import { recruiterRoutes } from "./modules/recruiter/recruiter.router";
import { adminRoutes } from "./modules/admin/admin.router";
import { practiceRoutes } from "./modules/practice/practice.router";
import { registerSocketHandlers } from "./shared/socket/socket.gateway";
import { env } from "./config/env";
import { redis } from "./shared/database/redis";

const app = Fastify({ logger: { level: env.LOG_LEVEL } });
const httpServer = createServer(app.server as any);

// ── Plugins ───────────────────────────────────────────────────────────
app.register(cors, { origin: env.CLIENT_URL, credentials: true });
app.register(jwt, { secret: env.JWT_SECRET });
app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// ── Auth Decorator ────────────────────────────────────────────────────
app.decorate("authenticate", async (req: any, reply: any) => {
  try {
    await req.jwtVerify();
    const blocked = await redis.get(`user:block:${req.user.id}`);
    if (blocked) return reply.code(403).send({ message: "Account blocked" });
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
});

// ── Custom Validator Compiler for Zod ───────────────────────────────────────
app.setValidatorCompiler(({ schema }) => {
  return (data) => {
    try {
      // @ts-ignore
      return { value: schema.parse(data) };
    } catch (error) {
      return { error: error as Error };
    }
  };
});

// ── Routes ────────────────────────────────────────────────────────────
app.register(authRoutes,         { prefix: "/api/auth" });
app.register(userRoutes,         { prefix: "/api/users" });
app.register(jobsRoutes,          { prefix: "/api/jobs" });
app.register(applicationsRoutes,  { prefix: "/api/applications" });
app.register(testsRoutes,         { prefix: "/api/tests" });
app.register(notificationRoutes, { prefix: "/api/notifications" });
app.register(resumeRoutes,       { prefix: "/api/resume" });
app.register(aiRoutes,           { prefix: "/api/ai" });
app.register(calendarRoutes,    { prefix: "/api/calendar" });
app.register(chatRoutes,         { prefix: "/api/chat" });
app.register(meetingsRoutes,    { prefix: "/api/meetings" });
app.register(recruiterRoutes,    { prefix: "/api/recruiter" });
app.register(adminRoutes,        { prefix: "/api/admin" });
app.register(practiceRoutes,      { prefix: "/api/practice" });

// ── Health ────────────────────────────────────────────────────────────
app.get("/health", async () => ({ status: "ok", ts: new Date().toISOString() }));

// ── Socket.io ─────────────────────────────────────────────────────────
const io = new SocketServer(httpServer, { cors: { origin: env.CLIENT_URL } });
registerSocketHandlers(io);

// ── Start ─────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`Server running on http://0.0.0.0:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
