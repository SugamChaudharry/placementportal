import type { FastifyInstance } from "fastify";
import { AdminService } from "./admin.service";

export async function adminRoutes(app: FastifyInstance) {
  const svc = new AdminService();

  // Middleware to check admin role
  const requireAdmin = async (req: any) => {
    if (req.user.role !== "admin") {
      throw { statusCode: 403, message: "Admin access required" };
    }
  };

  // Get platform stats
  app.get("/stats", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async () => {
      return await svc.getStats();
    },
  });

  // Get system health
  app.get("/health", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async () => {
      return await svc.getSystemHealth();
    },
  });

  // Get all users
  app.get("/users", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { page, limit, role, search } = req.query as any;
      return await svc.getUsers(
        parseInt(page) || 1,
        parseInt(limit) || 50,
        role,
        search
      );
    },
  });

  // Block user
  app.put("/users/:id/block", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { id } = req.params as any;
      const { reason } = req.body as any;
      return await svc.blockUser(id, reason);
    },
  });

  // Unblock user
  app.put("/users/:id/unblock", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.unblockUser(id);
    },
  });

  // Get all companies
  app.get("/companies", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { page, limit } = req.query as any;
      return await svc.getCompanies(parseInt(page) || 1, parseInt(limit) || 50);
    },
  });

  // Get all drives
  app.get("/drives", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { page, limit, status } = req.query as any;
      return await svc.getDrives(parseInt(page) || 1, parseInt(limit) || 50, status);
    },
  });

  // Get pending recruiter verifications
  app.get("/recruiters/pending", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { page, limit } = req.query as any;
      return await svc.getPendingRecruiters(parseInt(page) || 1, parseInt(limit) || 50);
    },
  });

  // Get all recruiters with filter
  app.get("/recruiters", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { page, limit, status } = req.query as any;
      return await svc.getAllRecruiters(parseInt(page) || 1, parseInt(limit) || 50, status);
    },
  });

  // Verify or reject a recruiter
  app.put("/recruiters/:id/verify", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { id } = req.params as any;
      const { status, adminNotes } = req.body as any;
      if (!["APPROVED", "REJECTED"].includes(status)) {
        throw { statusCode: 400, message: "Status must be APPROVED or REJECTED" };
      }
      return await svc.verifyRecruiter(id, status, adminNotes);
    },
  });

  // Create a new admin
  app.post("/admins", {
    onRequest: [(app as any).authenticate, requireAdmin],
    handler: async (req) => {
      const { email, name } = req.body as any;
      if (!email || !name) {
        throw { statusCode: 400, message: "Email and name are required" };
      }
      return await svc.createAdmin(email, name, (req as any).user.id);
    },
  });
}
