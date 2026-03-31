import type { FastifyInstance } from "fastify";
import { RecruiterService } from "./recruiter.service";

export async function recruiterRoutes(app: FastifyInstance) {
  const svc = new RecruiterService();

  // Dashboard stats
  app.get("/dashboard/stats", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getDashboardStats((req as any).user.recruiterId);
    },
  });

  // Get drive candidates
  app.get("/drives/:id/candidates", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.getDriveCandidates(id, req.query);
    },
  });

  // Bulk status update
  app.put("/drives/candidates/status", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { candidateIds, newStatus } = req.body as any;
      return await svc.bulkUpdateStatus(candidateIds, newStatus);
    },
  });

  // AI shortlist
  app.post("/drives/:id/shortlist/ai", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      const { weights } = req.body as any;
      return await svc.aiShortlist(id, weights);
    },
  });

  // Schedule batch interviews
  app.post("/drives/:id/schedule-batch", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      const { candidateIds, duration, availableSlots } = req.body as any;
      return await svc.scheduleBatch(id, candidateIds, duration, availableSlots.map((s: string) => new Date(s)));
    },
  });
}
