import type { FastifyInstance } from "fastify";
export async function usersRoutes(app: FastifyInstance) {
  app.get("/", { handler: async () => ({ data: [], total: 0 }) });
}
