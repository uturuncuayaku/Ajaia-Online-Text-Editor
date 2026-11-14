# Ajaia Online Text Editor

[![Live App](https://img.shields.io/badge/Live_Deployment-Vercel-success?style=flat&logo=vercel)](https://ajaia-online-text-editor.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Tiptap](https://img.shields.io/badge/Editor-Tiptap-black)](https://tiptap.dev)

A lightweight collaborative document editor inspired by **Google Docs** and styled after [Ajaia's AI Platform](https://ajaia.ai/).

---

## 📋 Prerequisites

Install the following dependencies if you do not have them on your machine:

* [**Node.js** (v18.x or higher)](https://nodejs.org/en/download)
* [**npm** (v8.x or higher)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) — *bundled with Node.js*
* [**Git**](https://git-scm.com/downloads)

---

## ⚡ Quick Start (Local Setup)

### Option 1: One-Command Automated Setup (Recommended)

```bash
git clone https://github.com/uturuncuayaku/Ajaia-Online-Text-Editor.git
cd Ajaia-Online-Text-Editor
bash setup.sh --seed --dev
```

This single command installs all dependencies, initializes the SQLite database, seeds sample test personas, and launches the development server.

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### Option 2: Manual Setup

```bash
# 1. Clone repository
git clone https://github.com/uturuncuayaku/Ajaia-Online-Text-Editor.git
cd Ajaia-Online-Text-Editor

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Approve Prisma engine binaries (npm v11+)
npm install-scripts approve @prisma/client prisma @prisma/engines esbuild

# 4. Create environment file
cp .env.example .env

# 5. Generate Prisma Client and sync SQLite database
npx prisma generate
npx prisma db push

# 6. Seed initial test personas and documents
npx tsx prisma/seed.ts

# 7. Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📖 Documentation Index

For in-depth details on each area of the application, refer to the dedicated documents:

* [**Product Features & Permissions**](USAGE.md) — Test personas (Alice, Bob, Charlie), sharing permission matrix, and file import workflows.
* [**Deployment & Scripts Guide**](DEPLOYMENT.md) — Available npm scripts, Vercel cloud setup, and Docker container instructions.
* [**System Architecture & Design**](ARCHITECTURE.md) — Architecture diagram, technical tradeoffs, and future roadmap.
* [**Design Philosophy & Tech Stack**](TECH_STACK.md) — Aesthetic details inspired by [ajaia.ai](https://ajaia.ai/) and technical layer breakdown.
* [**Engineering Error Log**](ERRORS_AND_TROUBLESHOOTING.md) — Record of technical challenges, breaking changes, and resolutions.
* [**AI-Native Workflow Note**](AI_WORKFLOW.md) — AI tools used, development speedups, rejected output, and verification methods.
* [**Submission Summary**](SUBMISSION.md) — Checklist of all submission materials and live links.
