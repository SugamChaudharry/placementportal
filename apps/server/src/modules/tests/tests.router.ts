import type { FastifyInstance } from "fastify";
import { TestsService } from "./tests.service";

export async function testsRoutes(app: FastifyInstance) {
  const svc = new TestsService();

  // Get candidate tests
  app.get("/candidate", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getCandidateTests((req as any).user.id);
    },
  });

  // Get test details
  app.get("/:id", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.getTestDetails(id);
    },
  });

  // Start test
  app.post("/:id/start", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.startTest(id, (req as any).user.id);
    },
  });

  // Run code
  app.post("/:id/run", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.runCode(id, (req as any).user.id, req.body as any);
    },
  });

  // Submit question
  app.post("/:id/submit-question", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.submitQuestion(id, (req as any).user.id, req.body as any);
    },
  });

  // Flag violation
  app.post("/:id/flag", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.flagViolation(id, (req as any).user.id, req.body as any);
    },
  });

  // Finish test
  app.post("/:id/finish", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.finishTest(id, (req as any).user.id);
    },
  });

  // Get result
  app.get("/:id/result", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.getResult(id, (req as any).user.id);
    },
  });
}
