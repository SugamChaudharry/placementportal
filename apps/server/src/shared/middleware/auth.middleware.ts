import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export const authPlugin = fp(async (app: FastifyInstance) => {
  app.decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
});
