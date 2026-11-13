# AI-Native Workflow Note — Ajaia Online Text Editor

**Candidate:** Andres Felipe Trujillo (andtruj23@gmail.com)  
**Role:** AI-Native Full Stack Developer Assignment

---

## 🤖 1. AI Tools Used

During this build, I used:
- **Google Antigravity / Advanced Agentic Assistant** (Claude Opus & Gemini 3.8 Flash engine) for end-to-end pair programming, architecture design, and automation.
- **Automated Workspace Rules & Skills**: Created custom skills (`.agents/skills/error-logger`) and rules (`.agents/rules/error-logging.md`) to systematically diagnose and log non-trivial errors into `ERRORS_AND_TROUBLESHOOTING.md`.

---

## ⚡ 2. Where AI Materially Accelerated Work

AI provided massive speedups in four critical areas:
1. **Rapid Scaffolding & Database Schema Design**: Generated the relational Prisma schema (`User`, `Document`, `Share`) with cascading deletes, seeding scripts, and TypeScript interfaces in minutes.
2. **Design System Replication from Ajaia.ai**: Curled and analyzed `ajaia.ai`'s live navigation CSS and color variables (`#001d6b`, `#97c2f8`, `#f1f7ff`), then built a 60 FPS trigonometric wave canvas background and slide-out menu drawer matching their visual brand.
3. **Structured File Parsing**: Developed the Markdown-to-Tiptap JSON parser converting `# H1`, `## H2`, bullet lists (`*`), ordered lists (`1.`), and blockquotes (`>`) into valid ProseMirror document nodes.
4. **Diagnostic Error Resolution**: Quickly identified and resolved breaking changes in Next.js 16 (`cacheComponents` and `useParams()` prerendering constraints) and Prisma 8 RC CLI changes.

---

## 🚫 3. What AI-Generated Output I Changed or Rejected

Practical AI usage requires strict engineering judgment:
- **Rejected Prisma v8 Release Candidate**: AI initially pulled `prisma@latest`, which was `8.0.0-rc.33`. Prisma 8 removed `prisma generate` and introduced mandatory cloud project structures. I rejected this and pinned the codebase to stable LTS **Prisma v6**, preserving clean, deterministic local workflows.
- **Rejected Heavy Auth Boilerplate**: Rejected complex JWT/NextAuth auth implementations in favor of a fast, intuitive simulated persona drawer. This saved over an hour of boilerplate while providing reviewers with a 5-second way to test multi-user sharing.
- **Removed Experimental Next.js 16 Caching Flags**: `create-next-app` generated `cacheComponents: true` and `partialPrefetching: true`, which prevented standard dynamic database routes from compiling. I stripped the experimental flags to ensure predictable SSR streaming.
- **Modified File Upload Scope**: Limited file parsing strictly to `.txt` and `.md` rather than attempting brittle `.docx` binary extraction, prioritizing high quality in core formats over shallow coverage.

---

## 🔍 4. How I Verified Correctness, UX, and Reliability

1. **Automated Unit Testing**: Implemented Vitest tests (`src/tests/documents.test.ts`) verifying permission matrices (Owner vs. Editor vs. Viewer deletion guards) and plain-text-to-Tiptap JSON AST generation.
2. **Production Build Verification**: Continuously ran `npm run build` to verify strict TypeScript compilation, App Router route validation, and zero compile warnings.
3. **Multi-User Permission Testing**: Interactively verified that switching to Charlie (Viewer) immediately locks the editor and disables the toolbar, while Alice (Owner) retains full sharing and delete authority.
4. **File Import Validation**: Tested importing `.txt` and `.md` files to ensure formatting is properly parsed into editable document blocks.
