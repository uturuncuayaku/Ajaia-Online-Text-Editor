# Product Features, Accounts & Permissions — Ajaia Online Text Editor

This guide covers the user personas, sharing model, and supported file workflows in **Ajaia Online Text Editor**.

---

## 👥 Seeded Test Personas

The application includes 3 pre-configured team personas to test collaboration flows. Use the **User Switcher Drawer** in the top navigation banner to switch between them instantly without login friction:

| Persona | Email | Role | Default Workspaces |
|---|---|---|---|
| **Alice Johnson** | `alice@ajaia.com` | Team Lead | • **Owned**: "Welcome to Ajaia Docs", "Product Strategy & Guidelines"<br>• **Shared**: "Project Roadmap Q1" (Viewer), "Design System & UX Feedback" (Editor) |
| **Bob Smith** | `bob@ajaia.com` | Full Stack Engineer | • **Owned**: "Project Roadmap Q1"<br>• **Shared**: "Welcome to Ajaia Docs" (Editor), "Product Strategy & Guidelines" (Viewer), "Design System & UX Feedback" (Editor) |
| **Charlie Davis** | `charlie@ajaia.com` | Product Reviewer | • **Owned**: "Design System & UX Feedback"<br>• **Shared**: "Welcome to Ajaia Docs" (Viewer), "Project Roadmap Q1" (Viewer) |

---

## 🔐 Sharing Permissions Matrix

The sharing model provides strict, role-based document access controls:

| Capability | Document Owner | Shared Editor | Shared Viewer | Unshared User |
|---|:---:|:---:|:---:|:---:|
| **View document** | ✅ | ✅ | ✅ | ❌ (403 Forbidden) |
| **Edit rich text content** | ✅ | ✅ | ❌ (Read-only UI) | ❌ (403 Forbidden) |
| **Rename document title** | ✅ | ✅ | ❌ (Disabled) | ❌ (403 Forbidden) |
| **Delete document** | ✅ | ❌ (Owner Only) | ❌ (Owner Only) | ❌ (403 Forbidden) |
| **Manage collaborators & permissions** | ✅ | ❌ (Owner Only) | ❌ (Owner Only) | ❌ (403 Forbidden) |

### Permission Enforcement:
* **Viewer Restriction**: When viewing as a Viewer (e.g., Charlie on Alice's document), a yellow warning notice appears, the sticky formatting toolbar is disabled, and the editor is locked to read-only mode.
* **Backend Authorization**: The API routes (`PATCH /api/documents/[id]`, `DELETE /api/documents/[id]`, `POST /api/documents/[id]/share`) verify user permissions server-side before persisting changes.

---

## 📂 Supported File Imports

Use the **Import** button in the top navigation bar to initialize new editable documents from external files:

| File Format | Extension | Processing & Conversion |
|---|---|---|
| **Markdown** | `.md` | Automatically parsed into structured ProseMirror document nodes: headings (`#`, `##`, `###`), bulleted lists (`*`, `-`), numbered lists (`1.`), and blockquotes (`>`). |
| **Plain Text** | `.txt` | Split by linebreaks into editable rich-text paragraph blocks. |

* **Maximum File Size**: 5 MB.
* **Drag-and-Drop**: Supports direct drag-and-drop or file picker selection.

---

## ✍️ Rich Text Formatting Features

The editor is powered by **Tiptap (ProseMirror)** and supports:
* **Inline Styling**: Bold (`Ctrl+B`), Italic (`Ctrl+I`), Underline (`Ctrl+U`), Inline Code
* **Typography**: Heading 1 (`H1`), Heading 2 (`H2`), Heading 3 (`H3`)
* **Lists**: Bulleted unordered lists, Numbered ordered lists
* **Blocks**: Blockquotes (`>`), Paragraphs
* **History**: Undo (`Ctrl+Z`), Redo (`Ctrl+Y`)
* **Real-time Auto-save**: Debounced auto-save with live status indicators (*Saved* / *Saving...*).
* **Export**: One-click download as plain text.
