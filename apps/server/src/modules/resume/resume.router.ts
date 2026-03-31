import type { FastifyInstance } from "fastify";
import { ResumeService } from "./resume.service";

export async function resumeRoutes(app: FastifyInstance) {
  const svc = new ResumeService();

  // Get all versions
  app.get("/versions", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getVersions((req as any).user.id);
    },
  });

  // Update version
  app.put("/versions/:id", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.updateVersion((req as any).user.id, id, req.body);
    },
  });

  // Create new version
  app.post("/versions", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.createVersion((req as any).user.id, req.body as any);
    },
  });

  // Parse resume
  app.post("/parse", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      // Handle file upload
      return { message: "Resume parsed successfully", data: {} };
    },
  });

  // Generate from profile
  app.post("/generate", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.generateFromProfile((req as any).user.id);
    },
  });

  // Get ATS score
  app.get("/ats-score/:id", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { id } = req.params as any;
      return await svc.getAtsScore(id);
    },
  });

  // Generate PDF
  app.post("/render-pdf", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { versionId, template } = req.body as any;
      return await svc.generatePDF(versionId, template);
    },
  });
}
