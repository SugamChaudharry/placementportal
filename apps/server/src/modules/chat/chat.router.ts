import type { FastifyInstance } from "fastify";
import { ChatService } from "./chat.service";

export async function chatRoutes(app: FastifyInstance) {
  const svc = new ChatService();

  // Get rooms
  app.get("/rooms", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getRooms((req as any).user.id);
    },
  });

  // Get DMs
  app.get("/dms", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getDMs((req as any).user.id);
    },
  });

  // Get messages
  app.get("/conversations/:id/messages", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      const { cursor, limit } = req.query as any;
      return await svc.getMessages(id, cursor, parseInt(limit) || 50);
    },
  });

  // Send message
  app.post("/conversations/:id/messages", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      const { content, type } = req.body as any;
      return await svc.sendMessage((req as any).user.id, id, content, type);
    },
  });

  // Search users
  app.get("/users/search", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { q, page, limit } = req.query as any;
      return await svc.searchUsers(q, parseInt(page) || 1, parseInt(limit) || 20);
    },
  });

  // Mark as read
  app.post("/conversations/:id/read", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      const { messageIds } = req.body as any;
      return await svc.markAsRead((req as any).user.id, id, messageIds);
    },
  });
}
