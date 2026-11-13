# Structured Build Plan — Ajaia Collaborative Document Editor

**Candidate:** Andres Felipe Trujillo  
**Total Time Budget:** 4 hours (hard stop at 6 hours max)

---

## Overview

| Time Window | Milestone | Core Deliverable |
|---|---|---|
| 00:00 – 00:30 | Scaffolding & DB Schema | Repo setup, Express/Next.js backend, Mongoose/Prisma schemas for User, Document, and Share. |
| 00:30 – 01:30 | Core CRUD & Rich Text Editor | Document list, create/rename endpoints, and integrated rich-text editing UI. |
| 01:30 – 02:15 | File Upload & Parsing | `.txt`/`.md` file upload handler that initializes a new document from file content. |
| 02:15 – 03:00 | Sharing & Access Control | User switcher, "Share Document" modal, and filtered "My Docs" vs. "Shared With Me" views. |
| 03:00 – 03:30 | Automated Test & Error Handling | At least 1 meaningful integration/unit test (e.g., testing document creation or sharing permission check). |
| 03:30 – 04:00 | Deployment & Documentation | Live deployment verification, README.md, Architecture note, AI workflow note, and video script preparation. |

---

## Phase 1: Scaffolding & DB Schema (00:00 – 00:30)

### Goals
- Initialize the project repository with a clean folder structure
- Set up the backend framework (Next.js API routes or Express.js)
- Define database schemas/models for core entities
- Confirm dev server runs and connects to the database

### Deliverables
- **Project structure** scaffolded (frontend + backend + shared config)
- **Database schemas** defined:
  - `User` — `id`, `name`, `email`, `createdAt`
  - `Document` — `id`, `title`, `content` (rich-text JSON or HTML), `ownerId`, `createdAt`, `updatedAt`
  - `Share` — `id`, `documentId`, `userId`, `permission` (viewer/editor), `createdAt`
- **Dev environment** running locally with hot reload
- **Seeded test users** (e.g., Alice, Bob, Charlie) for simulating multi-user flows

### Tech Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router) | Unified frontend + API routes; fast to scaffold; great DX |
| Database | SQLite via Prisma | Zero-config, no external service, portable, free for reviewers |
| ORM | Prisma | Type-safe, auto-migrations, excellent DX |
| Styling | Tailwind CSS | Rapid UI development, no custom CSS files to manage |

---

## Phase 2: Core CRUD & Rich Text Editor (00:30 – 01:30)

### Goals
- Build document list page showing all user's documents
- Implement create, rename, and delete document endpoints
- Integrate a rich-text editor with basic formatting support
- Auto-save or manual save of document content

### API Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/documents` | List documents for current user (owned + shared) |
| `POST` | `/api/documents` | Create a new document |
| `GET` | `/api/documents/:id` | Get a single document |
| `PATCH` | `/api/documents/:id` | Update title and/or content |
| `DELETE` | `/api/documents/:id` | Delete a document (owner only) |

### Rich Text Editor
- **Library:** Tiptap (ProseMirror-based) — lightweight, extensible, React-friendly
- **Supported Formatting:**
  - ✅ Bold, Italic, Underline
  - ✅ Headings (H1, H2, H3)
  - ✅ Bulleted list, Numbered list
  - ✅ Basic toolbar with formatting buttons
- **Content Storage:** JSON (Tiptap's native format) — preserves structure; easy to serialize/deserialize

### UI Components
- `DocumentList` — grid/list of documents with title, last modified, owner badge
- `DocumentEditor` — full-page editor view with toolbar + title input
- `Toolbar` — formatting buttons with active-state indicators

---

## Phase 3: File Upload & Parsing (01:30 – 02:15)

### Goals
- Allow users to upload `.txt` and `.md` files
- Parse uploaded file content and create a new document from it
- Show clear feedback on supported file types and upload status

### Implementation
| Feature | Detail |
|---|---|
| Supported types | `.txt`, `.md` |
| Upload flow | "Import File" button → file picker → parse → create new document |
| `.txt` handling | Wrap content in paragraph nodes |
| `.md` handling | Convert Markdown → Tiptap JSON (via `markdown-it` or similar) |
| Validation | File size limit (e.g., 5 MB), type check, error toasts |
| UX | Upload button on document list page; success redirects to new document editor |

### API
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/documents/upload` | Accept multipart file, parse, create document |

---

## Phase 4: Sharing & Access Control (02:15 – 03:00)

### Goals
- Implement a user switcher to simulate multi-user flows (no full auth)
- Build a "Share Document" modal to grant access to other users
- Display separate views: **My Documents** vs. **Shared With Me**
- Enforce basic permission checks on API routes

### User Simulation
- Dropdown user switcher in the app header
- Seeded users: Alice, Bob, Charlie
- Current user stored in cookie/localStorage — simple, no auth overhead

### Share Modal
- Select a user from a dropdown
- Choose permission level: `viewer` or `editor`
- Show current shares with ability to revoke

### Permission Logic
| Action | Owner | Editor | Viewer | No Access |
|---|---|---|---|---|
| View document | ✅ | ✅ | ✅ | ❌ |
| Edit content | ✅ | ✅ | ❌ | ❌ |
| Rename | ✅ | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ | ❌ |
| Share | ✅ | ❌ | ❌ | ❌ |

### API
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/documents/:id/share` | Share document with a user |
| `DELETE` | `/api/documents/:id/share/:userId` | Revoke access |
| `GET` | `/api/documents/:id/shares` | List current shares for a document |

---

## Phase 5: Automated Test & Error Handling (03:00 – 03:30)

### Goals
- Write at least 1 meaningful automated test
- Add input validation and error handling across API routes
- Add user-facing error states (toasts, error boundaries)

### Test Strategy
- **Framework:** Jest + Supertest (API integration test) or Vitest
- **Priority test cases:**
  1. ✅ **Document creation** — POST to `/api/documents` returns 201 with correct shape
  2. ✅ **Sharing permission check** — Non-owner cannot delete a shared document
  3. (Stretch) Upload creates a valid document from `.txt` file

### Error Handling Checklist
- [ ] API routes return proper HTTP status codes (400, 401, 403, 404, 500)
- [ ] Frontend shows toast notifications for errors
- [ ] File upload validates type and size before processing
- [ ] Share modal prevents sharing with yourself
- [ ] Graceful handling of missing/deleted documents

---

## Phase 6: Deployment & Documentation (03:30 – 04:00)

### Goals
- Deploy the application to a publicly accessible URL
- Write comprehensive README with setup instructions
- Write architecture note and AI workflow note
- Prepare video script outline

### Deployment Plan
| Option | Platform | Rationale |
|---|---|---|
| Primary | Vercel | Native Next.js support, free tier, instant deploys |
| Fallback | Railway | Supports SQLite, simple config |

### Documentation Deliverables

#### README.md
- Project overview
- Tech stack summary
- Local setup instructions (`git clone` → `npm install` → `npx prisma migrate` → `npm run dev`)
- Seeded user credentials
- Supported file types
- Known limitations

#### ARCHITECTURE.md
- System diagram (frontend → API routes → Prisma → SQLite)
- Key design decisions and tradeoffs
- What was prioritized and why
- What would come next with more time

#### AI-WORKFLOW.md
- Tools used (e.g., Antigravity/Gemini, GitHub Copilot)
- Where AI accelerated development
- What was modified or rejected from AI output
- Verification approach

#### SUBMISSION.md
- Checklist of all deliverables with links/paths
- Live URL
- Test account info
- Video link placeholder

---

## Scope Cuts & Tradeoffs

> These are intentional decisions to stay within the timebox.

| Cut | Rationale |
|---|---|
| No real authentication | Simulated user switcher keeps scope tight; demonstrates sharing logic without auth overhead |
| No real-time collaboration | WebSocket/CRDT implementation exceeds timebox; not required |
| No `.docx` support | Complex binary parsing; `.txt` and `.md` cover the requirement meaningfully |
| No version history | Would add significant schema + UI complexity |
| No comments/suggestions | Stretch goal only if core is solid |
| SQLite instead of Postgres | Zero-config, portable, sufficient for demo scale |

---

## If I Had 2–4 More Hours

1. **Real authentication** — NextAuth.js with email/password or OAuth
2. **Real-time cursors** — Show who else is viewing a document (Liveblocks or Yjs)
3. **Document version history** — Track edits with diff view
4. **Export to PDF/Markdown** — Download documents in alternative formats
5. **Role-based sharing** — More granular permissions (comment-only, suggest mode)
6. **Search** — Full-text search across document titles and content
