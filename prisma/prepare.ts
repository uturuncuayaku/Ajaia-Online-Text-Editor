import fs from "fs";
import path from "path";

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf8");

const databaseUrl = process.env.DATABASE_URL || "";

if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
  console.log("⚡ Detected PostgreSQL DATABASE_URL. Configuring Prisma for PostgreSQL...");
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
} else {
  console.log("📁 Detected SQLite DATABASE_URL. Configuring Prisma for SQLite...");
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
}

fs.writeFileSync(schemaPath, schema, "utf8");
console.log("✅ prisma/schema.prisma updated successfully.");
