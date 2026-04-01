import type { FastifyInstance } from "fastify";
import { UsersService } from "./users.service";
import { updateProfileSchema, onboardingSchema, recruiterOnboardingSchema } from "./users.schema";

export async function userRoutes(app: FastifyInstance) {
  const svc = new UsersService();

  // Get my profile
  app.get("/me", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getProfile((req as any).user.id);
    },
  });

  // Update profile
  app.put("/me", {
    onRequest: [(app as any).authenticate],
    schema: { body: updateProfileSchema },
    handler: async (req) => {
      return await svc.updateProfile((req as any).user.id, req.body as any);
    },
  });

  // Complete onboarding
  app.post("/onboarding", {
    onRequest: [(app as any).authenticate],
    schema: { body: onboardingSchema },
    handler: async (req) => {
      return await svc.completeOnboarding((req as any).user.id, req.body as any);
    },
  });

  // Complete recruiter onboarding
  app.post("/recruiter/onboarding", {
    onRequest: [(app as any).authenticate],
    schema: { body: recruiterOnboardingSchema },
    handler: async (req) => {
      return await svc.completeRecruiterOnboarding((req as any).user.id, req.body as any);
    },
  });

  // Profile photo upload URL
  app.post("/profile-photo", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { contentType = "image/jpeg" } = req.body as any;
      return await svc.getProfilePhotoUploadUrl((req as any).user.id, contentType);
    },
  });

  // Public profile
  app.get("/public/:username", {
    handler: async (req) => {
      const { username } = req.params as any;
      return await svc.getPublicProfile(username);
    },
  });

  // Activity timeline
  app.get("/me/activity", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.getActivity((req as any).user.id);
    },
  });

  // Export data
  app.post("/export-data", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      return await svc.exportData((req as any).user.id);
    },
  });

  // Get colleges
  app.get("/colleges", {
    handler: async () => {
      return await svc.getColleges();
    },
  });
}
