import type { FastifyInstance } from "fastify";
import { MeetingsService } from "./meetings.service";

export async function meetingsRoutes(app: FastifyInstance) {
  const svc = new MeetingsService();

  // Get upcoming meetings
  app.get("/upcoming", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getUpcoming((req as any).user.id);
    },
  });

  // Get meeting by ID
  app.get("/:id", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.getById(id);
    },
  });

  // Join meeting
  app.post("/:id/join", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.joinMeeting((req as any).user.id, id);
    },
  });

  // Submit feedback
  app.post("/:id/feedback", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.submitFeedback((req as any).user.id, id, req.body as any);
    },
  });

  // Reschedule
  app.put("/:id/reschedule", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      const { newTime, reason } = req.body as any;
      return await svc.reschedule((req as any).user.id, id, new Date(newTime), reason);
    },
  });
}
