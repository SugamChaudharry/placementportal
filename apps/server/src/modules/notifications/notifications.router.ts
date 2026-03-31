import type { FastifyInstance } from "fastify";
import { NotificationsService } from "./notifications.service";

export async function notificationRoutes(app: FastifyInstance) {
  const svc = new NotificationsService();

  // Get notifications
  app.get("/", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { unread_only, type, page, limit } = req.query as any;
      return await svc.getNotifications((req as any).user.id, {
        unreadOnly: unread_only === "true",
        type,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });
    },
  });

  // Mark as read
  app.put("/read", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { ids } = req.body as any;
      return await svc.markAsRead((req as any).user.id, ids);
    },
  });

  // Get notification settings
  app.get("/settings", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getSettings((req as any).user.id);
    },
  });

  // Update notification settings
  app.put("/settings", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.updateSettings((req as any).user.id, req.body);
    },
  });
}
