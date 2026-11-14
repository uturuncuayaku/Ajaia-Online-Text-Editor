# Project Submission — Ajaia Online Text Editor

**Candidate:** Andres Felipe Trujillo (andtruj23@gmail.com)  
**Position:** AI-Native Full Stack Developer  
**Company:** Ajaia LLC

---

## 🔗 Key Links

| Deliverable | URL / Location |
|---|---|
| **GitHub Repository** | [https://github.com/uturuncuayaku/Ajaia-Online-Text-Editor](https://github.com/uturuncuayaku/Ajaia-Online-Text-Editor) |
| **Live Production App** | [https://ajaia-online-text-editor.vercel.app](https://ajaia-online-text-editor.vercel.app) |
| **Walkthrough Video** | [https://youtu.be/bwTCgkEQq78](https://youtu.be/bwTCgkEQq78) |
| **Local Port** | `http://localhost:3000` |

---

## 📦 What Is Included

1. **Source Code**: Full Next.js 16 + TypeScript + Prisma 6 + Tiptap codebase.
2. [**README.md**](README.md): Setup instructions, test accounts, supported file types, and permission matrix.
3. [**ARCHITECTURE.md**](ARCHITECTURE.md): Architecture note detailing system design, tradeoffs, and next steps.
4. [**AI_WORKFLOW.md**](AI_WORKFLOW.md): AI workflow note covering tools used, speedups, rejected output, and verification methods.
5. [**ERRORS_AND_TROUBLESHOOTING.md**](ERRORS_AND_TROUBLESHOOTING.md): Engineering log documenting breaking changes and resolutions.
6. [**DEPLOYMENT.md**](DEPLOYMENT.md): Deployment guide and complete scripts table.
7. [**TECH_STACK.md**](TECH_STACK.md): Full stack breakdown and design philosophy inspired by `ajaia.ai`.
8. [**VIDEO_URL.txt**](VIDEO_URL.txt): Plain text file with walkthrough video link, live URL, and seeded credentials.
9. [**WALKTHROUGH_SCRIPT.md**](WALKTHROUGH_SCRIPT.md): 3–5 minute video recording script.
10. **Cross-Platform Scripts**: `setup.sh` (Linux/macOS), `setup.ps1` (PowerShell), `setup.bat` (CMD), and `docker-compose.yml` (Docker).

---

## 👥 Seeded Test Personas

No passwords required. Use the **User Switcher Drawer** in the top navigation banner:

| Persona | Role | Default Permissions |
|---|---|---|
| **Alice Johnson** (`alice@ajaia.com`) | Team Lead | Owner of "Welcome to Ajaia Docs" |
| **Bob Smith** (`bob@ajaia.com`) | Engineer | Owner of "Project Roadmap Q1", Editor of Alice's doc |
| **Charlie Davis** (`charlie@ajaia.com`) | Reviewer | Viewer access only (read-only mode) |

---

## ⚡ Local Setup

### Linux:
```bash
chmod +x setup.sh && ./setup.sh --seed --dev
# or:
bash setup.sh --seed --dev
```

### macOS:
```bash
bash setup.sh --seed --dev
```

### Windows (PowerShell or CMD):
```powershell
# PowerShell:
.\setup.ps1

# CMD:
setup.bat
```

### Universal Docker (All Platforms):
```bash
docker compose up --build
```

### Universal npm (All Operating Systems):
```bash
npm install --legacy-peer-deps
npm run setup
npm run dev
```

Application will be live at `http://localhost:3000`.
