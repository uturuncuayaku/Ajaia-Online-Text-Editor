import fs from "fs";
import path from "path";

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf8");

// Vercel Postgres provides POSTGRES_PRISMA_URL or POSTGRES_URL or DATABASE_URL
let databaseUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "";

// If databaseUrl is empty, fallback to local SQLite file
if (!databaseUrl) {
  databaseUrl = "file:./dev.db";
  process.env.DATABASE_URL = databaseUrl;
}

// Always ensure .env exists with DATABASE_URL so Prisma CLI never throws P1012
const envPath = path.join(process.cwd(), ".env");
fs.writeFileSync(envPath, `DATABASE_URL="${databaseUrl}"\n`, "utf8");
console.log(
  `🔑 Synchronized .env with DATABASE_URL=${
    databaseUrl.startsWith("postgres") ? "postgres://[secured]" : databaseUrl
  }`
);

if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
  console.log("⚡ Detected PostgreSQL DATABASE_URL. Configuring Prisma for PostgreSQL...");
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
} else {
  console.log("📁 Detected SQLite DATABASE_URL. Configuring Prisma for SQLite...");
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ prisma/schema.prisma updated successfully.");
