# Architecture & System Design — Ajaia Online Text Editor

**Candidate:** Andres Felipe Trujillo (andtruj23@gmail.com)  
**Role:** AI-Native Full Stack Developer  
**Project:** Ajaia Online Text Editor

---

## 🏛️ High-Level System Architecture

```
┌────────────────────────────────────────────────────────┐
│               Browser / Client UI                      │
│  - Next.js 16 (App Router + React 19)                  │
│  - Tiptap Rich Text Engine (ProseMirror Core)          │
│  - 60 FPS Canvas Swirl Wave Animation (Ajaia.ai)       │
│  - Slide-out User Switcher Drawer (Persona Context)    │
│  - Glassmorphic Tailwind CSS 4 UI Tokens               │
└──────────────────────────┬─────────────────────────────┘
                           │ JSON REST Requests
┌──────────────────────────▼─────────────────────────────┐
│               Next.js Route Handlers                   │
│  - GET/POST  /api/documents                            │
│  - GET/PATCH/DELETE /api/documents/[id]                │
│  - POST     /api/documents/upload                      │
│  - POST/DEL  /api/documents/[id]/share                 │
│  - GET       /api/users                                │
└──────────────────────────┬─────────────────────────────┘
                           │ Prisma Client ORM
┌──────────────────────────▼─────────────────────────────┐
│                 Database Layer                         │
│  - Adaptive Provider: SQLite (Local) / Postgres (Vercel)│
│  - Models: User, Document, Share                       │
│  - Cascade Deletions & Unique Constraint Checking      │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Design Priorities & Tradeoffs

### 1. Unified Next.js Full Stack Monorepo vs. Separate Backend
* **Decision**: Next.js 16 App Router for both UI and API route handlers.
* **Why**: Avoids multi-repo orchestration, CORS configuration overhead, and disparate hosting bills. Gives reviewers a single repo to clone, install, and run with one command.

### 2. Adaptive Database Provider (SQLite + PostgreSQL)
* **Decision**: Local development runs zero-config embedded SQLite; cloud deployments (Vercel Postgres / Neon) automatically switch to PostgreSQL via `prisma/prepare.ts`.
* **Why**: Reviewers can test locally without installing database daemons, while production Vercel deployments persist documents permanently across serverless instances.

### 3. Tiptap / ProseMirror Document Model
* **Decision**: Tiptap 3 rich-text editor serialized to structured JSON instead of raw HTML.
* **Why**: JSON preserves semantic nodes (headings, lists, blockquotes) safely without XSS sanitization vulnerabilities common to raw `dangerouslySetInnerHTML`.

### 4. Simulated Multi-User Persona Switcher vs. Heavy Auth (JWT/OAuth)
* **Decision**: Slide-out drawer allowing instantaneous switching between Alice (Owner/Lead), Bob (Engineer), and Charlie (Viewer).
* **Why**: Fully functional OAuth or email verification consumes 1–2 hours of boilerplate without adding core product value. A simulated session lets reviewers test permission boundaries (owner vs. editor vs. viewer) in 5 seconds.

### 5. File Import Strategy (.txt and .md)
* **Decision**: Native server-side parsing of Markdown and Plain Text into Tiptap JSON blocks.
* **Why**: Uploaded files immediately become editable live drafts rather than passive static attachments.

---

## 🔐 Permission Model

| Operation | Document Owner | Shared Editor | Shared Viewer | Unshared User |
|---|:---:|:---:|:---:|:---:|
| Read document | ✅ | ✅ | ✅ | ❌ (403 Forbidden) |
| Edit content | ✅ | ✅ | ❌ (Read-only UI) | ❌ (403 Forbidden) |
| Rename title | ✅ | ✅ | ❌ (Disabled) | ❌ (403 Forbidden) |
| Delete document | ✅ | ❌ (403) | ❌ (403) | ❌ (403 Forbidden) |
| Share document | ✅ | ❌ (403) | ❌ (403) | ❌ (403 Forbidden) |

---

## 🔭 What I Would Build Next (Given 2–4 Additional Hours)

1. **Real-Time Collaboration via WebSockets / Yjs**: Integrate Yjs and Liveblocks or a lightweight WebSocket server for multi-cursor collaborative editing.
2. **Comment Threads & Mentions**: Inline document annotations allowing team members to highlight text and leave feedback.
3. **Version History & Rollbacks**: Snapshot document revisions on save with visual diff comparison.
4. **PDF / Markdown Export**: Client-side document export to PDF with print styles.
