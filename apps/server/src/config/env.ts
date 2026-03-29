import { z } from "zod";
const schema = z.object({
  NODE_ENV:     z.enum(["development", "production", "test"]).default("development"),
  PORT:         z.coerce.number().default(4000),
  LOG_LEVEL:    z.enum(["info", "debug", "warn", "error"]).default("info"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL:    z.string().default("redis://localhost:6379"),
  JWT_SECRET:   z.string().min(32),
  CLIENT_URL:   z.string().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().optional(),
  CLAUDE_API_KEY: z.string().optional(),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) { console.error("Bad env:", parsed.error.format()); process.exit(1); }
export const env = parsed.data;
