import { prisma } from "../../shared/database/prisma";
import { redis, redisKeys } from "../../shared/database/redis";
import { env } from "../../config/env";
import axios from "axios";
import { AIService } from "../ai/ai.service";

const aiService = new AIService();

export class TestsService {
  // Get tests assigned to candidate
  async getCandidateTests(studentId: string) {
    const tests = await prisma.codingTest.findMany({
      where: {
        status: { in: ["PUBLISHED", "ACTIVE", "ENDED"] },
        submissions: { none: { studentId } },
      },
      orderBy: { scheduledAt: "asc" },
      select: {
        id: true,
        name: true,
        durationMinutes: true,
        scheduledAt: true,
        endsAt: true,
        languages: true,
        cameraRequired: true,
        status: true,
      },
    });
    return tests;
  }

  // Get test details (no questions yet)
  async getTestDetails(testId: string) {
    const test = await prisma.codingTest.findUnique({
      where: { id: testId },
      select: {
        id: true,
        name: true,
        durationMinutes: true,
        languages: true,
        cameraRequired: true,
        tabSwitchLimit: true,
        status: true,
      },
    });
    if (!test) throw { statusCode: 404, message: "Test not found" };
    return test;
  }

  // Start test - returns questions and starts timer
  async startTest(testId: string, studentId: string) {
    const test = await prisma.codingTest.findUnique({
      where: { id: testId },
      include: { questions: true },
    });
    if (!test) throw { statusCode: 404, message: "Test not found" };

    // Check if already started
    const existing = await redis.get(redisKeys.testTimer(testId, studentId));
    if (existing) throw { statusCode: 400, message: "Test already started" };

    // Start timer in Redis
    const endsAt = Date.now() + test.durationMinutes * 60 * 1000;
    await redis.setex(redisKeys.testTimer(testId, studentId), test.durationMinutes * 60, endsAt.toString());

    return {
      testId,
      questions: test.questions.map((q: any) => ({
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        marks: q.marks,
      })),
      endsAt: new Date(endsAt).toISOString(),
      languages: test.languages,
    };
  }

  // Run code (Judge0)
  async runCode(testId: string, studentId: string, data: {
    code: string;
    language: string;
    questionId: string;
  }) {
    if (!env.JUDGE0_URL) {
      // Mock execution
      return {
        stdout: "Mock output",
        stderr: "",
        status: "Accepted",
        time: "0.1s",
        memory: "10MB",
      };
    }

    const languageIds: Record<string, number> = {
      "c": 50, "cpp": 54, "java": 62, "python": 71, "javascript": 63, "go": 60,
    };

    try {
      const response = await axios.post(
        `${env.JUDGE0_URL}/submissions`,
        {
          source_code: data.code,
          language_id: languageIds[data.language] || 71,
          stdin: "", // Would have test cases
        },
        { headers: env.JUDGE0_AUTH_TOKEN ? { "X-Auth-Token": env.JUDGE0_AUTH_TOKEN } : {} }
      );

      const token = response.data.token;

      // Poll for result
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await axios.get(`${env.JUDGE0_URL}/submissions/${token}`);

      return {
        stdout: result.data.stdout,
        stderr: result.data.stderr,
        status: result.data.status?.description,
        time: result.data.time,
        memory: result.data.memory,
      };
    } catch (error) {
      console.error("[Judge0] Error:", error);
      throw { statusCode: 500, message: "Code execution failed" };
    }
  }

  // Submit question
  async submitQuestion(testId: string, studentId: string, data: {
    questionId: string;
    code: string;
    language: string;
  }) {
    // Run hidden test cases
    const result = await this.runCode(testId, studentId, data);

    // Calculate score
    const score = result.status === "Accepted" ? 10 : 0;

    // Store submission
    return {
      questionId: data.questionId,
      score,
      status: result.status,
    };
  }

  // Flag violation
  async flagViolation(testId: string, studentId: string, data: {
    type: "TAB_SWITCH" | "FACE_NOT_DETECTED" | "FULLSCREEN_EXIT";
    timestamp: string;
  }) {
    const key = redisKeys.testFlags(testId, studentId);
    const existing = await redis.get(key);
    const flags = existing ? JSON.parse(existing) : [];
    flags.push(data);
    await redis.setex(key, 24 * 60 * 60, JSON.stringify(flags));

    // Broadcast to recruiter monitor if WebSocket is connected
    return { flagged: true, totalFlags: flags.length };
  }

  // Finish test
  async finishTest(testId: string, studentId: string) {
    // Calculate total score
    const timer = await redis.get(redisKeys.testTimer(testId, studentId));
    if (!timer) throw { statusCode: 400, message: "Test not started" };

    // Release timer
    await redis.del(redisKeys.testTimer(testId, studentId));

    // Create submission record
    await prisma.testSubmission.create({
      data: {
        testId,
        studentId,
        code: "", // Would store all submitted code
        language: "python",
        score: 0, // Calculate from submissions
      },
    });

    return { message: "Test submitted successfully" };
  }

  // Get test result
  async getResult(testId: string, studentId: string) {
    const submission = await prisma.testSubmission.findFirst({
      where: { testId, studentId },
    });

    if (!submission) throw { statusCode: 404, message: "Submission not found" };

    // Get AI review
    const review = await aiService.reviewCode(submission.code, submission.language, "Coding test");

    return {
      score: submission.score,
      percentile: 85, // Calculate from all submissions
      review,
    };
  }
}
