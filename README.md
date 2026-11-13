# Ajaia Online Text Editor

A lightweight collaborative document editor inspired by **Google Docs** and styled after [Ajaia's AI Platform](https://ajaia.ai/).

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![Tiptap](https://img.shields.io/badge/Editor-Tiptap-black)

---

## ⚡ Quick Start

### One-command setup
```bash
git clone <repo-url>
cd Ajaia_Project
bash setup.sh --seed --dev
```
This single command installs dependencies, initializes and seeds the SQLite database, and starts the development server at **http://localhost:3000**.

### Manual setup
```bash
npm install --legacy-peer-deps
npm install-scripts approve @prisma/client prisma @prisma/engines esbuild
cp .env.example .env
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

---

## 👥 Seeded Test Accounts

Switch users anytime via the **User Switcher Drawer** in the top navigation banner:

| User | Email | Role | Default Data |
|---|---|---|---|
| **Alice Johnson** | alice@ajaia.com | Team Lead | Owns "Welcome to Ajaia Docs" |
| **Bob Smith** | bob@ajaia.com | Engineer | Owns "Project Roadmap Q1" (Shared with Alice & Charlie) |
| **Charlie Davis** | charlie@ajaia.com | Reviewer | Viewer access to team docs |

No passwords required. Switching users immediately refreshes document permissions and sharing states.

---

## 📂 Supported File Imports

Use the **Import** button in the header or document list to initialize editable documents:

| Format | Extension | Processing |
|---|---|---|
| Plain Text | `.txt` | Split into paragraphs and preserved as rich document text |
| Markdown | `.md` | Converted to structured Headings, Bold/Italic, and Bullet lists |

Maximum file size: **5 MB**.

---

## 🔐 Sharing Permissions Matrix

| Capability | Owner | Editor | Viewer |
|---|:---:|:---:|:---:|
| Read document | ✅ | ✅ | ✅ |
| Edit content | ✅ | ✅ | ❌ |
| Rename title | ✅ | ✅ | ❌ |
| Delete document | ✅ | ❌ | ❌ |
| Manage sharing & permissions | ✅ | ❌ | ❌ |

---

## 📖 Additional Documentation

- [**Technology Stack & Design Architecture**](TECH_STACK.md) — Visual design, canvas swirl motion, and system overview.
- [**Deployment & Scripts Guide**](DEPLOYMENT.md) — Available npm scripts, Docker, Vercel, and cloud deployment guides.
- [**Structured Build Plan**](PLAN.md) — Milestone breakdown, time windows, and scope rationale.
- [**Original Assignment Brief**](ASSIGNMENT.md) — Requirements and evaluation criteria.

---

## 📋 Prerequisites

- **Node.js**: v18.x or higher (`node -v`)
- **npm**: v8.x or higher (`npm -v`)
- **Git**: Installed for source control
