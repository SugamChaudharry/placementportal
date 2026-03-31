import Redis from "ioredis";
import { env } from "../../config/env";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Key prefixes for different use cases
export const redisKeys = {
  session: (userId: string) => `session:${userId}`,
  testTimer: (testId: string, studentId: string) => `test:${testId}:timer:${studentId}`,
  testFlags: (testId: string, studentId: string) => `test:${testId}:flags:${studentId}`,
  passwordReset: (token: string) => `password-reset:${token}`,
  aiCache: (key: string) => `ai:cache:${key}`,
  rateLimit: (ip: string) => `ratelimit:${ip}`,
  userBlock: (userId: string) => `user:block:${userId}`,
};

export async function getRedisHealth(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    await redis.ping();
    return { status: "healthy", latency: Date.now() - start };
  } catch {
    return { status: "unhealthy", latency: Date.now() - start };
  }
}
