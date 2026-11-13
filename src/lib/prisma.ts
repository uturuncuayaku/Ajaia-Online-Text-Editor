import { PrismaClient } from "@prisma/client";

// Normalize environment variables for Vercel Postgres / Neon / SQLite
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    "file:./dev.db";
}

// In Vercel serverless functions, relative SQLite files are read-only.
// If using local SQLite file in serverless, point to writable /tmp/dev.db
if (
  process.env.VERCEL &&
  process.env.DATABASE_URL.startsWith("file:") &&
  !process.env.DATABASE_URL.includes("/tmp/")
) {
  process.env.DATABASE_URL = "file:/tmp/dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
