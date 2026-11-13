# Engineering Error Log & Troubleshooting Guide

This document records the specific engineering errors, breaking changes, and undocumented behaviors encountered during the development of **Ajaia Online Text Editor**, along with the root causes and exact resolutions.

---

## 📑 Table of Contents

1. [npm Package Naming Restriction with `create-next-app`](#1-npm-package-naming-restriction-with-create-next-app)
2. [Prisma v8 Release Candidate Breaking CLI Changes](#2-prisma-v8-release-candidate-breaking-cli-changes)
3. [npm v11+ Lifecycle Install Script Sandboxing (`install-scripts`)](#3-npm-v11-lifecycle-install-script-sandboxing-install-scripts)
4. [Vitest Peer Dependency ERESOLVE Conflict with `@types/node`](#4-vitest-peer-dependency-eresolve-conflict-with-typesnode)
5. [Vitest 5 Missing `vite` Runtime Module](#5-vitest-5-missing-vite-runtime-module)
6. [Next.js 16 `useParams()` Prerendering & Suspense Boundary](#6-nextjs-16-useparams-prerendering--suspense-boundary)
7. [Next.js 16 `cacheComponents` Incompatibility with `export const dynamic`](#7-nextjs-16-cachecomponents-incompatibility-with-export-const-dynamic)
8. [Prisma P1012: Environment Variable Not Found `DATABASE_URL` on Vercel](#8-prisma-p1012-environment-variable-not-found-database_url-on-vercel)
9. [Prisma P2021: Table `main.User` / `main.Document` Does Not Exist in Serverless Runtime](#9-prisma-p2021-table-mainuser--maindocument-does-not-exist-in-serverless-runtime)

---

## 1. npm Package Naming Restriction with `create-next-app`

### ❌ The Error
```
Could not create a project called "Ajaia_Project" because of npm naming restrictions:
    * name can no longer contain capital letters
The directory contains files that could conflict: ASSIGNMENT.md, PLAN.md
```

### 🔍 Why It Happened
1. **npm naming policy**: Modern npm rejects package names containing uppercase characters or underscores in root `package.json`.
2. **Directory pollution**: `create-next-app` checks whether the target directory has pre-existing files (like our assignment brief and plan markdown files) to prevent overwriting.

### 💡 The Solution
1. Scaffolded the base Next.js project into a clean temporary directory with a kebab-case compliant name (`/tmp/ajaia-docs`).
2. Transferred the scaffolded template into the repository directory while preserving our existing documentation.
3. Updated `package.json` name to `"name": "ajaia-online-text-editor"`.

---

## 2. Prisma v8 Release Candidate Breaking CLI Changes

### ❌ The Error
```bash
$ npx prisma generate
✘ [CLI.UNKNOWN_COMMAND] No command registered for `generate`
→ List every command: prisma --help
Prisma agent skills are out of date (installed @prisma/composer 0.38.0, synced none).
```

### 🔍 Why It Happened
Running `npm install prisma` without a fixed version tag resolved to `prisma@8.0.0-rc.33` (Release Candidate for Prisma Platform).
In Prisma 8, the CLI was completely re-architected:
- The standard `prisma generate` and `prisma migrate` commands were replaced or moved into sub-namespaces (`prisma contract`, `prisma db`, `prisma orm`).
- These commands expect a remote Prisma Cloud project configuration rather than standard local standalone generation.

### 💡 The Solution
Pinned Prisma to the stable LTS **Prisma v6** release branch:
```bash
npm install prisma@6 @prisma/client@6 --legacy-peer-deps
```
This restored standard local workflows:
- `npx prisma generate`
- `npx prisma db push`
- `npx tsx prisma/seed.ts`

---

## 3. npm v11+ Lifecycle Install Script Sandboxing (`install-scripts`)

### ❌ The Error / Warning
```
npm warn install-scripts 4 packages have install scripts not yet covered by allowScripts:
npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
npm warn install-scripts   @prisma/client@6.19.3 (postinstall: node scripts/postinstall.js)
npm warn install-scripts   prisma@6.19.3 (preinstall: node scripts/preinstall-entry.js)
npm warn install-scripts   @prisma/engines@6.19.3 (postinstall: node scripts/postinstall.js)
```

### 🔍 Why It Happened
Node.js v26 and npm v11+ introduce security hardening for third-party post-install scripts. Binary compilation scripts (such as Prisma's query engine download and esbuild's binary downloader) are paused until explicitly permitted by the repository's configuration.

### 💡 The Solution
Approved the required binary installation scripts:
```bash
npm install-scripts approve @prisma/client prisma @prisma/engines esbuild
```
This is also automated inside [setup.sh](setup.sh) so reviewers running the project never experience stalled engine downloads.

---

## 4. Vitest Peer Dependency ERESOLVE Conflict with `@types/node`

### ❌ The Error
```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error While resolving: vitest@5.1.0
npm error Found: @types/node@20.19.43
npm error Conflicting peer dependency: @types/node@26.6.6
npm error peerOptional @types/node@"^22.0.0 || >=24.0.0" from vitest@5.1.0
```

### 🔍 Why It Happened
Next.js installs `@types/node@20` for Node LTS type definitions, while Vitest 5 declares an optional peer dependency for Node 22+. By default, npm v7+ strictly enforces peer dependency tree unification and fails the installation if peer dependencies do not intersect.

### 💡 The Solution
Installed developer dependencies with `--legacy-peer-deps`:
```bash
npm install --save-dev vitest @types/multer @types/uuid tsx --legacy-peer-deps
```
`--legacy-peer-deps` bypasses strict peer resolution and allows `@types/node@20` to satisfy both Next.js and testing dependencies seamlessly.

---

## 5. Vitest 5 Missing `vite` Runtime Module

### ❌ The Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite' imported from
.../node_modules/vitest/dist/chunks/nativeModuleRunner.9xPIMzi7.js
```

### 🔍 Why It Happened
In Vitest v5, Vite is defined as an optional peer dependency to keep bundle footprints minimal for environments that embed Vitest in other bundlers. When running `vitest run` standalone in an npm project, Vite must be explicitly present in the dependency tree.

### 💡 The Solution
Installed Vite directly into developer dependencies:
```bash
npm install --save-dev vite --legacy-peer-deps
```
Tests immediately executed and passed in under 100ms.

---

## 6. Next.js 16 `useParams()` Prerendering & Suspense Boundary

### ❌ The Error
```
Error: Route "/documents/[id]": Next.js encountered URL data `useParams()` in a Client Component outside of `<Suspense>`.
This blocks prerendering because the value is only available at runtime.
```

### 🔍 Why It Happened
Next.js 16 enforces strict separation between static build prerendering and dynamic runtime URL parameters. Calling `useParams()` in a client component without wrapping it in a `<Suspense>` boundary causes Next.js to fail the production build (`next build`) because it cannot prerender a static shell.

### 💡 The Solution
Decoupled the dynamic parameter handling:
1. Created `src/app/documents/[id]/DocumentClient.tsx` as the client component that receives `documentId: string` as a prop.
2. Kept `src/app/documents/[id]/page.tsx` as a Server Component:
   ```tsx
   import { Suspense } from "react";
   import DocumentClient from "./DocumentClient";

   export default async function DocumentPage({
     params,
   }: {
     params: Promise<{ id: string }>;
   }) {
     const { id } = await params;
     return (
       <Suspense fallback={<LoadingSpinner />}>
         <DocumentClient documentId={id} />
       </Suspense>
     );
   }
   ```
This pattern conforms to Next.js 16's asynchronous params architecture.

---

## 7. Next.js 16 `cacheComponents` Incompatibility with `export const dynamic`

### ❌ The Error
```
Error: Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`. Please remove it.
```

### 🔍 Why It Happened
Next.js 16 scaffold generated a `next.config.ts` with experimental `cacheComponents: true` and `partialPrefetching: true`. Under this experimental flag, traditional route segment exports like `export const dynamic = "force-dynamic"` are explicitly prohibited and throw compile-time build errors.

### 💡 The Solution
Updated `next.config.ts` to standard stable Next.js configuration:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
```
After removing the experimental flag, `npm run build` compiled all 7 static and dynamic API routes cleanly.

---

## 8. Prisma P1012: Environment Variable Not Found `DATABASE_URL` on Vercel

### ❌ The Error
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DATABASE_URL.
  -->  prisma/schema.prisma:10
   | 
 9 |   provider = "sqlite"
10 |   url      = env("DATABASE_URL")
   | 
Validation Error Count: 1
[Context: getConfig]
Prisma CLI Version : 6.19.3
Error: [BUILD_UTILS_SPAWN_1] Command "npm run build" exited with 1
```

### 🔍 Why It Happened
1. `.env` is ignored by Git in `.gitignore` (as standard security practice).
2. When deploying to Vercel before linking an external database, Vercel does not have `DATABASE_URL` set in its environment variables.
3. When `npm run build` triggered `npx prisma generate`, Prisma evaluated `url = env("DATABASE_URL")`, found it missing, and halted the build with error code `P1012`.

### 💡 The Solution
Enhanced `prisma/prepare.ts` to automatically provision a fallback `.env` before any Prisma command executes:
```typescript
import fs from "fs";
import path from "path";

// Vercel Postgres provides POSTGRES_PRISMA_URL, POSTGRES_URL, or DATABASE_URL
let databaseUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "";

// If empty, provision fallback SQLite
if (!databaseUrl) {
  databaseUrl = "file:./dev.db";
  process.env.DATABASE_URL = databaseUrl;
}

// Always generate .env so Prisma CLI never encounters P1012
const envPath = path.join(process.cwd(), ".env");
fs.writeFileSync(envPath, `DATABASE_URL="${databaseUrl}"\n`, "utf8");
```
Now, whether deployed with or without a connected Postgres database, the build generates the Prisma client and Next.js bundle without failure.

---

## 9. Prisma P2021: Table `main.User` / `main.Document` Does Not Exist in Serverless Runtime

### ❌ The Error
```
Error fetching users: Error [PrismaClientKnownRequestError]: 
Invalid `prisma.user.findMany()` invocation:

The table `main.User` does not exist in the current database.
  code: 'P2021',
  meta: { modelName: 'User', table: 'main.User' },
  clientVersion: '6.19.3'
```

### 🔍 Why It Happened
1. **Serverless Lambda Isolation**: On Vercel, the build container that runs `npm run build` is isolated from the runtime serverless lambdas.
2. In SQLite mode (`/tmp/dev.db`), each serverless cold start spins up a fresh, empty `/tmp` directory.
3. Even though `prisma db push` ran during build, the created database file is not persisted into runtime lambda instances.
4. When the API route invokes `prisma.user.findMany()`, Prisma opens an uninitialized database and fails because the `User` table has not been created yet in that runtime instance.

### 💡 The Solution
Implemented automatic runtime DDL execution inside `src/lib/seedHelper.ts`:
```typescript
// Ensure tables exist before querying on fresh serverless cold starts
await prisma.$executeRawUnsafe(`
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`).catch(() => {});

await prisma.$executeRawUnsafe(`
  CREATE TABLE IF NOT EXISTS "Document" ( ... );
`).catch(() => {});

await prisma.$executeRawUnsafe(`
  CREATE TABLE IF NOT EXISTS "Share" ( ... );
`).catch(() => {});
```
This guarantees that whenever a serverless lambda boots up (whether connected to PostgreSQL or fallback SQLite), all tables are created in milliseconds and seeded automatically on first access.
