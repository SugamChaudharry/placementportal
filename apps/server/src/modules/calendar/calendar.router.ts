import type { FastifyInstance } from "fastify";
import { CalendarService } from "./calendar.service";

export async function calendarRoutes(app: FastifyInstance) {
  const svc = new CalendarService();

  // Get events
  app.get("/events", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { start, end, type } = req.query as any;
      return await svc.getEvents(
        (req as any).user.id,
        new Date(start),
        new Date(end),
        type?.split(",")
      );
    },
  });

  // Create event
  app.post("/events", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.createEvent((req as any).user.id, (req as any).user.role, req.body as any);
    },
  });

  // Update event
  app.put("/events/:id", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.updateEvent((req as any).user.id, id, req.body);
    },
  });

  // Delete event
  app.delete("/events/:id", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.deleteEvent((req as any).user.id, id);
    },
  });
}
