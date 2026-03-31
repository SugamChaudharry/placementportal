import { prisma } from "../../shared/database/prisma";
import { redis } from "../../shared/database/redis";
import { AIService } from "../ai/ai.service";

const aiService = new AIService();

export class PracticeService {
  // Get problems with filters
  async getProblems(filters: {
    difficulty?: string;
    tags?: string[];
    company?: string;
    status?: string;
    search?: string;
  }, page: number = 1, limit: number = 20) {
    // Mock problem bank - in production would query a Problem model
    const problems = [
      { id: "1", title: "Two Sum", difficulty: "EASY", tags: ["array", "hashmap"], solved: true },
      { id: "2", title: "Longest Substring", difficulty: "MEDIUM", tags: ["string", "sliding-window"], solved: false },
      { id: "3", title: "Merge K Lists", difficulty: "HARD", tags: ["linked-list", "heap"], solved: false },
      { id: "4", title: "Valid Parentheses", difficulty: "EASY", tags: ["stack"], solved: true },
      { id: "5", title: "LRU Cache", difficulty: "MEDIUM", tags: ["design", "hashmap"], solved: false },
    ];

    let filtered = problems;
    if (filters.difficulty) {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty?.toUpperCase());
    }
    if (filters.tags?.length) {
      filtered = filtered.filter(p => filters.tags!.some(t => p.tags.includes(t)));
    }
    if (filters.status === "solved") {
      filtered = filtered.filter(p => p.solved);
    } else if (filters.status === "unsolved") {
      filtered = filtered.filter(p => !p.solved);
    }

    return {
      problems: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length,
      page,
      limit,
    };
  }

  // Get problem details
  async getProblem(problemId: string) {
    const problem = {
      id: problemId,
      title: "Two Sum",
      difficulty: "EASY",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      ],
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
      tags: ["array", "hashmap"],
      timeLimit: 2000,
      memoryLimit: 256,
    };
    return problem;
  }

  // Run practice code
  async runCode(problemId: string, data: {
    code: string;
    language: string;
  }) {
    // Similar to test run but without time limits
    return {
      stdout: "Output from practice run",
      stderr: "",
      status: "Success",
      testCases: {
        passed: 3,
        total: 5,
        results: [
          { input: "[2,7,11,15], 9", expected: "[0,1]", actual: "[0,1]", passed: true },
          { input: "[3,2,4], 6", expected: "[1,2]", actual: "[1,2]", passed: true },
        ],
      },
    };
  }

  // Submit solution
  async submitSolution(studentId: string, problemId: string, data: {
    code: string;
    language: string;
  }) {
    // Run all test cases
    const result = await this.runCode(problemId, data);

    // Update solve record
    const solved = result.testCases.passed === result.testCases.total;

    return {
      solved,
      xp: solved ? 100 : 0,
      testCases: result.testCases,
    };
  }

  // Get solution (gated - must solve first)
  async getSolution(studentId: string, problemId: string) {
    // Check if user has solved it
    const hasSolved = true; // Would check from database
    const attempts = 3;

    if (!hasSolved && attempts < 5) {
      throw { statusCode: 403, message: "Solve the problem first or attempt 5 times to view solution" };
    }

    const solution = await aiService.generateSolution("Two Sum problem", "python");
    return solution;
  }

  // Get hint
  async getHint(problemId: string, attemptCount: number) {
    const hint = await aiService.generateHint("Two Sum problem", attemptCount);
    return hint;
  }

  // Get leaderboard
  async getLeaderboard(period: string = "all", branch?: string) {
    // Mock leaderboard
    return [
      { rank: 1, name: "Arjun Kumar", college: "IIT Bombay", branch: "CSE", solved: 150, xp: 15000 },
      { rank: 2, name: "Priya Sharma", college: "IIT Delhi", branch: "CSE", solved: 145, xp: 14500 },
      { rank: 3, name: "Rahul Singh", college: "NIT Trichy", branch: "IT", solved: 140, xp: 14000 },
    ];
  }

  // Get student dashboard stats
  async getStudentStats(studentId: string) {
    return {
      currentStreak: 15,
      maxStreak: 45,
      totalSolved: 127,
      totalAttempted: 200,
      xp: 12700,
      level: 12,
      heatmap: [
        { date: "2024-01-01", count: 3 },
        { date: "2024-01-02", count: 5 },
        { date: "2024-01-03", count: 2 },
      ],
    };
  }
}
