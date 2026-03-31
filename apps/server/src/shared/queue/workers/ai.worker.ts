import { aiQueue, atsScoreQueue } from "../queue";
import { AIService } from "../../../modules/ai/ai.service";
import { prisma } from "../../database/prisma";

const aiService = new AIService();

// AI processing worker
aiQueue.process(async (job) => {
  const { type, payload, userId } = job.data;

  try {
    switch (type) {
      case "code-review":
        const review = await aiService.reviewCode(payload.code, payload.language, payload.problem);
        console.log("[AI Worker] Code review completed for:", userId);
        return review;

      case "resume-tailor":
        const tailored = await aiService.tailorResume(payload.resumeData, payload.jobDescription);
        console.log("[AI Worker] Resume tailored for:", userId);
        return tailored;

      case "ats-score":
        const score = await aiService.calculateAtsScore(payload.resumeData);
        console.log("[AI Worker] ATS score calculated for:", userId);
        return score;

      default:
        throw new Error(`Unknown AI job type: ${type}`);
    }
  } catch (error) {
    console.error("[AI Worker] Failed:", error);
    throw error;
  }
});

// ATS Score worker
atsScoreQueue.process(async (job) => {
  const { resumeVersionId } = job.data;

  try {
    // Fetch resume data and calculate score
    console.log("[ATS Worker] Calculating score for version:", resumeVersionId);

    // Update resume version with score
    return { success: true, resumeVersionId, score: 85 };
  } catch (error) {
    console.error("[ATS Worker] Failed:", error);
    throw error;
  }
});

console.log("[AI Worker] Started");
