# Technology Stack & Design Architecture — Ajaia Online Text Editor

## 🎨 Design Philosophy Inspired by [ajaia.ai](https://ajaia.ai/)

The interface is modeled after the brand identity and visual aesthetic of **Ajaia LLC's** homepage:

### 1. Animated Swirl Motion Background
- **Visual Feel**: Fluid, high-performance canvas motion simulating deep neural networks, mathematical vector waves, and intelligent data flow.
- **Color Palette**:
  - Deep Void / Midnight Black: `#000000` & `#030712`
  - Royal Navy & Deep Indigo: `#001d6b` & `#1e1b4b`
  - Ajaia Sky Blue Highlight: `#97c2f8` (accent, active borders, glow)
  - Crisp Paper White: `#f1f7ff` for high-contrast, accessible typography
- **Implementation**: Pure hardware-accelerated HTML5 Canvas with smooth trigonometric field wave algorithms and ambient glowing orbs with `pointer-events: none` to ensure zero interference with text editing.

### 2. Ajaia Navigation Banner & Drawer System
- **Top Banner**: Preserves Ajaia's exact header hierarchy (height: `72px`, dark translucent background with `backdrop-filter: blur(12px)` and subtle `rgba(255, 255, 255, 0.12)` divider borders).
- **Slide-Out User Switcher Drawer**: Modeled directly after Ajaia's menu triggers. Clicking the User Switcher trigger opens a responsive side drawer with a darkened blurred scrim overlay, allowing frictionless switching between seeded team accounts (Alice, Bob, Charlie) without mock auth redirects.
- **Glassmorphic Document Workspace**: The rich-text editor and document grids float gracefully above the moving background with frosted glass cards (`bg-white/5` to `bg-white/10`, `backdrop-blur-md`, and thin illuminated borders).

---

## 🛠️ Full Stack Technology Architecture

```
┌────────────────────────────────────────────────────────┐
│               Browser / Client UI                      │
│  - Next.js 16 (App Router + React 19)                  │
│  - Tiptap Rich Text Engine (ProseMirror core)          │
│  - Animated Canvas Swirl Background (60 FPS)           │
│  - Tailwind CSS 4 & Glassmorphism Tokens               │
│  - Slide-out User Switcher Drawer                      │
│  - Lucide React Iconography                            │
└──────────────────────────┬─────────────────────────────┘
                           │ JSON REST API
┌──────────────────────────▼─────────────────────────────┐
│               Next.js Route Handlers                   │
│  - /api/documents (CRUD, permissions filter)           │
│  - /api/documents/[id] (View, Update, Delete)          │
│  - /api/documents/upload (.txt, .md file parsing)      │
│  - /api/documents/[id]/share (Viewer / Editor grant)   │
│  - /api/users (List seeded accounts)                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Prisma ORM Client
┌──────────────────────────▼─────────────────────────────┐
│                 Database Layer                         │
│  - Prisma 6 (Type-safe query builder & migrations)     │
│  - SQLite (Embedded, zero-config, portable)            │
│  - Schema: User, Document, Share                       │
└────────────────────────────────────────────────────────┘
```

---

## 📦 Core Libraries & Rationale

| Layer | Library / Tool | Version | Why Selected |
|---|---|---|---|
| **Framework** | Next.js | 16.4 | Modern App Router, built-in API routes, Turbopack for sub-second hot reload |
| **Language** | TypeScript | 5.x | Strict type safety across client state, API contracts, and database models |
| **Rich Text Editor** | Tiptap (ProseMirror) | 3.34 | Extensible document model; supports Bold, Italic, Underline, H1-H3, Lists; serializes cleanly to JSON |
| **Database & ORM** | Prisma + SQLite | 6.19 | Zero-config portable database; no external connection credentials required for evaluation |
| **Styling** | Tailwind CSS | 4.3 | Instant utility classes, custom animation utilities, responsive layout |
| **Icons** | Lucide React | 1.72 | Clean, consistent icons matching modern SaaS standards |
| **Notifications** | React Hot Toast | 2.6 | Lightweight, elegant toast feedback for saves, errors, and share events |
| **Markdown Parser** | Marked | 18.2 | Fast, standards-compliant parsing of `.md` uploads into editable document blocks |
| **Testing** | Vitest | 5.1 | Lightning fast test runner compatible with ESM and Next.js environments |
