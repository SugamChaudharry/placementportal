import type { FastifyInstance } from "fastify";
export async function testsRoutes(app: FastifyInstance) {
  app.get("/", { handler: async () => ({ data: [], total: 0 }) });
}
