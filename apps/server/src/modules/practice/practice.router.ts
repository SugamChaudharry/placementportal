import type { FastifyInstance } from "fastify";
import { PracticeService } from "./practice.service";

export async function practiceRoutes(app: FastifyInstance) {
  const svc = new PracticeService();

  // Get problems
  app.get("/problems", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { difficulty, tags, company, status, search, page, limit } = req.query as any;
      return await svc.getProblems(
        { difficulty, tags: tags?.split(","), company, status, search },
        parseInt(page) || 1,
        parseInt(limit) || 20
      );
    },
  });

  // Get problem details
  app.get("/problems/:id", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.getProblem(id);
    },
  });

  // Run code
  app.post("/problems/:id/run", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.runCode(id, req.body as any);
    },
  });

  // Submit solution
  app.post("/problems/:id/submit", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.submitSolution((req as any).user.id, id, req.body as any);
    },
  });

  // Get solution
  app.get("/problems/:id/solution", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.getSolution((req as any).user.id, id);
    },
  });

  // Get hint
  app.post("/problems/:id/hint", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      const { attemptCount } = req.body as any;
      return await svc.getHint(id, attemptCount);
    },
  });

  // Get leaderboard
  app.get("/leaderboard", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { period, branch } = req.query as any;
      return await svc.getLeaderboard(period, branch);
    },
  });

  // Get student dashboard stats
  app.get("/dashboard/streak", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getStudentStats((req as any).user.id);
    },
  });
}
