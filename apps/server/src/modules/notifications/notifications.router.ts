import type { FastifyInstance } from "fastify";
export async function notificationsRoutes(app: FastifyInstance) {
  app.get("/", { handler: async () => ({ data: [], total: 0 }) });
}
