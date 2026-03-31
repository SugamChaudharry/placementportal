import type { FastifyInstance } from "fastify";
import { AIService } from "./ai.service";

export async function aiRoutes(app: FastifyInstance) {
  const svc = new AIService();

  // Resume tailor
  app.post("/resume/tailor", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { resumeData, jobDescription } = req.body as any;
      return await svc.tailorResume(resumeData, jobDescription);
    },
  });

  // Improve bullet
  app.post("/resume/improve-bullet", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { bulletText } = req.body as any;
      return await svc.improveBullet(bulletText);
    },
  });

  // Mock interview - start
  app.post("/mock/start", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { role, difficulty, duration } = req.body as any;
      return await svc.startMockInterview(role, difficulty, duration);
    },
  });

  // Mock interview - chat
  app.post("/mock/chat", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { sessionId, context, answer } = req.body as any;
      return await svc.continueMockInterview(sessionId, context, answer);
    },
  });

  // Mock interview - finish
  app.post("/mock/finish", {
    onRequest: [(app as any).authenticate],
    handler: async (req) => {
      const { sessionId, context, answers } = req.body as any;
      return await svc.finishMockInterview(sessionId, context, answers);
    },
  });
}
