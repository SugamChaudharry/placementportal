import type { FastifyInstance } from "fastify";
export async function applicationsRoutes(app: FastifyInstance) {
  app.get("/", { handler: async () => ({ data: [], total: 0 }) });
}
