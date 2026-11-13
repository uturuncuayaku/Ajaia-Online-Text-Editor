# Deployment & Scripts Guide — Ajaia Online Text Editor

This guide details how to build, run, and deploy **Ajaia Online Text Editor**, along with the complete reference of available npm scripts.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local Next.js dev server with Turbopack (http://localhost:3000) |
| `npm run build` | Generate Prisma client and build Next.js application for production |
| `npm run start` | Run the compiled production Next.js server |
| `npm run setup` | Full initial setup: install dependencies, generate client, push schema, and seed test data |
| `npm run db:generate` | Regenerate Prisma Client types |
| `npm run db:push` | Synchronize SQLite schema with `prisma/schema.prisma` without migration files |
| `npm run db:migrate` | Create and apply a migration file (for schema development) |
| `npm run db:seed` | Seed test users (Alice, Bob, Charlie), sample documents, and permissions |
| `npm run db:reset` | Reset the database and re-run seeds (`--force`) |
| `npm run db:studio` | Launch visual browser GUI for exploring SQLite database records |
| `npm run test` | Run automated test suite using Vitest |
| `npm run test:watch` | Run Vitest in continuous watch mode |
| `npm run lint` | Execute ESLint code checks |

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel provides native Next.js hosting with zero configuration for frontend and API routes.

#### Steps:
1. Install Vercel CLI (or connect via GitHub repository in [vercel.com](https://vercel.com)):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Build Settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (runs `npx prisma generate && next build`)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`
3. Environment Variables:
   - `DATABASE_URL`: For ephemeral SQLite testing, `"file:./dev.db"` works. For persistent multi-region deployments, provide a connection string to a hosted database (such as Turso libSQL, Supabase Postgres, or Neon).

---

### Option 2: Railway or Render (Container / Persistent Disk)

Railway and Render allow mounting a persistent disk for SQLite so your database persists across deployments.

#### Railway CLI:
```bash
# Install Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```

#### Environment Configuration:
```env
DATABASE_URL="file:/app/prisma/data.db"
NODE_ENV="production"
PORT=3000
```

---

### Option 3: Docker Container

A multi-stage Docker build can run anywhere (AWS ECS, Google Cloud Run, DigitalOcean, local server):

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy schema and generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Build app
COPY . .
RUN npm run build

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]
```

Build and run locally with Docker:
```bash
docker build -t ajaia-online-text-editor .
docker run -p 3000:3000 -v $(pwd)/prisma:/app/prisma ajaia-online-text-editor
```

---

## 🔍 Pre-Flight Verification Checklist

Before shipping to reviewers or production:
- [ ] Run `npm run test` to verify unit and integration tests pass.
- [ ] Run `npm run build` locally to confirm TypeScript types and routes compile cleanly.
- [ ] Run `npm run db:seed` to ensure demo accounts (Alice, Bob, Charlie) and sample docs exist.
- [ ] Verify file upload works for `.txt` and `.md` files under 5 MB.
- [ ] Confirm the User Switcher drawer can transition between users without full page reloads.
