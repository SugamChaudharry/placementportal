import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const g = globalThis as any;
export const prisma: PrismaClient = g.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
});
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
