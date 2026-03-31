import "dotenv/config";
import { z } from "zod";
const schema = z.object({
  NODE_ENV:     z.enum(["development", "production", "test"]).default("development"),
  PORT:         z.coerce.number().default(4000),
  LOG_LEVEL:    z.enum(["info", "debug", "warn", "error"]).default("info"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL:    z.string().default("redis://localhost:6379"),
  JWT_SECRET:   z.string().min(32),
  CLIENT_URL:   z.string().default("http://localhost:3000"),
  SUPER_ADMIN_EMAIL: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  CLAUDE_API_KEY: z.string().optional(),
  JUDGE0_URL: z.string().default("http://localhost:2358"),
  JUDGE0_AUTH_TOKEN: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_BUCKET: z.string().default("placement-portal-assets"),
  AWS_REGION: z.string().default("ap-south-1"),
  DAILY_API_KEY: z.string().optional(),
  MEILISEARCH_URL: z.string().optional(),
  MEILISEARCH_MASTER_KEY: z.string().optional(),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) { console.error("Bad env:", parsed.error.format()); process.exit(1); }
export const env = parsed.data;
