import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";

import { authRoutes } from "./modules/auth/auth.router";
import { userRoutes } from "./modules/users/users.router";
import { jobRoutes } from "./modules/jobs/jobs.router";
import { applicationRoutes } from "./modules/applications/applications.router";
import { testRoutes } from "./modules/tests/tests.router";
import { notificationRoutes } from "./modules/notifications/notifications.router";
import { registerSocketHandlers } from "./shared/socket/socket.gateway";
import { env } from "./config/env";

const app = Fastify({ logger: { level: env.LOG_LEVEL } });
const httpServer = createServer(app.server as any);

// ── Plugins ───────────────────────────────────────────────────────────
app.register(cors, { origin: env.CLIENT_URL, credentials: true });
app.register(jwt, { secret: env.JWT_SECRET });
app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

// ── Routes ────────────────────────────────────────────────────────────
app.register(authRoutes,         { prefix: "/api/auth" });
app.register(userRoutes,         { prefix: "/api/users" });
app.register(jobRoutes,          { prefix: "/api/jobs" });
app.register(applicationRoutes,  { prefix: "/api/applications" });
app.register(testRoutes,         { prefix: "/api/tests" });
app.register(notificationRoutes, { prefix: "/api/notifications" });

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
