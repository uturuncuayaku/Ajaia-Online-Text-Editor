# 3–5 Minute Walkthrough Video Script

Use this outline when recording your video on Loom or YouTube.

---

## ⏱️ Video Breakdown (3–5 Minutes Total)

### 0:00 – 0:45 | Introduction & Overview
* **Introduce yourself**: *"Hi, I'm Andres Felipe Trujillo. This is my submission for the Ajaia AI-Native Full Stack Developer assignment: the Ajaia Online Text Editor."*
* **Design inspiration**: *"I styled the application after Ajaia's official website (ajaia.ai) — featuring an animated 60 FPS flowing wave canvas background, deep obsidian and navy tones, and a glassmorphic top navigation bar with a slide-out persona drawer."*

### 0:45 – 1:45 | Document Creation & Rich Text Editing Flow
* **Show the home page**: Point out the "All Documents", "My Documents", and "Shared With Me" filter tabs.
* **Open a document**: Click on *"Welcome to Ajaia Docs"*.
* **Demonstrate formatting**:
  * Highlight text and toggle **Bold**, *Italic*, <u>Underline</u>.
  * Show Headings (H1, H2, H3) and Bulleted / Numbered lists.
  * Show the title input and note the real-time debounced **auto-save indicator** (*Saved / Saving...*).

### 1:45 – 2:30 | File Upload & Parsing
* **Return to home or click Import**:
* **Upload a sample `.md` or `.txt` file**:
  * Drag and drop a Markdown file into the modal.
  * Point out that the file parser converts `# Headings`, bullet lists, and paragraphs directly into editable ProseMirror document blocks.

### 2:30 – 3:30 | Multi-User Persona Switcher & Sharing Permissions
* **Open the User Switcher Drawer**: Click the persona menu in the top-right banner.
* **Demonstrate Alice (Owner)**:
  * Open the **Share** modal on Alice's document. Show existing collaborators (Bob as Editor, Charlie as Viewer).
  * Show how Alice can grant or revoke access.
* **Switch to Charlie (Viewer)**:
  * Select Charlie in the drawer.
  * Open the same document: show that a **Viewer Only** banner appears, and the formatting toolbar and editor automatically lock into read-only mode!

### 3:30 – 4:30 | Technical Architecture & AI-Native Workflow
* **Tech Stack**: Next.js 16 App Router, TypeScript, Prisma 6, Tiptap, Tailwind CSS 4, and an adaptive database layer supporting local SQLite and cloud PostgreSQL.
* **AI Workflow**:
  * Explain how AI accelerated schema design, file parsing algorithms, and styling.
  * Mention how you applied engineering judgment: rejecting Prisma 8 RC in favor of stable Prisma 6, replacing complex auth with a frictionless simulated persona drawer, and maintaining an automated `ERRORS_AND_TROUBLESHOOTING.md` log via a custom agent skill.

### 4:30 – 5:00 | Conclusion & Wrap-up
* Thank the Ajaia team for reviewing.
* Direct them to the live URL and GitHub repository.
