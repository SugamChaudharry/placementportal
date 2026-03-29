import type { FastifyInstance } from "fastify";
import { AuthService } from "./auth.service";
export async function authRoutes(app: FastifyInstance) {
  const svc = new AuthService();
  app.post("/register", async (req, reply) => reply.code(201).send(await svc.register(req.body as any)));
  app.post("/login",    async (req, reply) => reply.send(await svc.login(req.body as any, app)));
  app.get("/me",        { onRequest: [(app as any).authenticate], handler: async (req) => (req as any).user });
}
