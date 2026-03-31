import Anthropic from "@anthropic-ai/sdk";
import { env } from "../../config/env";
import { redis, redisKeys } from "../../shared/database/redis";

const anthropic = env.CLAUDE_API_KEY ? new Anthropic({ apiKey: env.CLAUDE_API_KEY }) : null;

export class AIService {
  // Cache AI responses for 1 hour
  private async getCachedOrGenerate(cacheKey: string, prompt: string): Promise<string> {
    if (!anthropic) throw { statusCode: 503, message: "AI service not configured" };

    const cached = await redis.get(redisKeys.aiCache(cacheKey));
    if (cached) return cached;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0]?.type === "text" ? response.content[0].text : "";
    await redis.setex(redisKeys.aiCache(cacheKey), 3600, content);
    return content;
  }

  // Resume tailor - rewrite resume to match job description
  async tailorResume(resumeData: any, jobDescription: string) {
    const cacheKey = `tailor:${Buffer.from(jobDescription).toString("base64").slice(0, 50)}`;
    const prompt = `Given this resume data: ${JSON.stringify(resumeData)}, tailor it to match this job description: ${jobDescription}. Return a JSON with improved bullets and skills alignment.`;
    const result = await this.getCachedOrGenerate(cacheKey, prompt);
    return JSON.parse(result);
  }

  // Improve bullet point
  async improveBullet(bulletText: string) {
    const cacheKey = `bullet:${Buffer.from(bulletText).toString("base64").slice(0, 30)}`;
    const prompt = `Improve this resume bullet point: "${bulletText}". Provide 3 alternatives with rationale for each.`;
    const result = await this.getCachedOrGenerate(cacheKey, prompt);
    return { alternatives: result.split("\n").filter((l: string) => l.trim()) };
  }

  // ATS Score calculation
  async calculateAtsScore(resumeData: any) {
    const prompt = `Analyze this resume for ATS compatibility: ${JSON.stringify(resumeData)}. Return a JSON with score (0-100), breakdown by category, and improvement suggestions.`;
    const result = await this.getCachedOrGenerate(`ats:${Date.now()}`, prompt);
    return JSON.parse(result);
  }

  // Code review after test submission
  async reviewCode(code: string, language: string, problem: string) {
    const cacheKey = `review:${Buffer.from(code).toString("base64").slice(0, 50)}`;
    const prompt = `Review this ${language} code for problem: ${problem}\n\n${code}\n\nProvide: 1) Score (0-100), 2) Time/Space complexity, 3) Issues found, 4) Improvement suggestions.`;
    const result = await this.getCachedOrGenerate(cacheKey, prompt);
    return { feedback: result };
  }

  // Mock interview - start session
  async startMockInterview(role: string, difficulty: string, duration: number) {
    const prompt = `You are an experienced interviewer for a ${role} position. Start a mock interview at ${difficulty} difficulty level. Ask your first question.`;
    const result = await this.getCachedOrGenerate(`mock:${role}:${difficulty}:${Date.now()}`, prompt);
    return {
      sessionId: `mock_${Date.now()}`,
      question: result,
      context: { role, difficulty, duration, questionNumber: 1 },
    };
  }

  // Mock interview - continue conversation
  async continueMockInterview(sessionId: string, context: any, answer: string) {
    const prompt = `Context: Mock interview for ${context.role} position. Previous Q${context.questionNumber}: ${context.lastQuestion || "N/A"}\nCandidate's answer: ${answer}\n\nProvide: 1) Brief feedback on the answer (2-3 sentences), 2) Ask the next relevant question.`;
    const result = await this.getCachedOrGenerate(`${sessionId}:${context.questionNumber}`, prompt);
    return {
      feedback: result.split("\n")[0],
      nextQuestion: result.split("\n").slice(1).join("\n"),
      questionNumber: context.questionNumber + 1,
    };
  }

  // Mock interview - finish and generate report
  async finishMockInterview(sessionId: string, context: any, answers: string[]) {
    const prompt = `Mock interview completed for ${context.role}. Review these ${answers.length} answers and generate a final report with: 1) Overall score (0-100), 2) Radar chart scores (communication, technical, problem-solving), 3) Per-question feedback, 4) Model answers.`;
    const result = await this.getCachedOrGenerate(`${sessionId}:report`, prompt);
    return JSON.parse(result);
  }

  // AI ranking for candidate shortlisting
  async rankCandidates(candidates: any[], weights: { cgpa: number; skills: number; projects: number }) {
    const prompt = `Rank these candidates for a software engineering role using weights: CGPA ${weights.cgpa}%, Skills ${weights.skills}%, Projects ${weights.projects}%.\n\nCandidates: ${JSON.stringify(candidates)}\n\nReturn ranked list with scores and reasoning.`;
    const result = await this.getCachedOrGenerate(`rank:${Date.now()}`, prompt);
    return JSON.parse(result);
  }

  // Generate practice problem solution
  async generateSolution(problemStatement: string, language: string) {
    const prompt = `Provide an optimal solution in ${language} for this problem: ${problemStatement}. Include: 1) Algorithm explanation, 2) Code, 3) Time/Space complexity.`;
    const result = await this.getCachedOrGenerate(`sol:${Buffer.from(problemStatement).toString("base64").slice(0, 30)}:${language}`, prompt);
    return { solution: result };
  }

  // Generate hint for practice problem
  async generateHint(problemStatement: string, attemptCount: number) {
    const hints = [
      "Think about the approach: brute force vs optimized.",
      "Consider using a hash map for O(1) lookups.",
      "Look for patterns in the input that can help reduce complexity.",
    ];
    return { hint: hints[Math.min(attemptCount - 1, hints.length - 1)] };
  }
}
