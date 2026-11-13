---
name: error-logger
description: >-
  Records build, dependency, runtime, configuration, and framework errors into ERRORS_AND_TROUBLESHOOTING.md.
  Use this skill whenever an error occurs during execution, testing, building, or package management so that the root cause, undocumented behavior, and resolution are documented for learning.
---

# Error Logging Skill

Use this workflow whenever any non-trivial error or build failure is encountered during development.

## Purpose
Ensure all unexpected errors, breaking changes, missing dependencies, or undocumented library behaviors are permanently logged in `ERRORS_AND_TROUBLESHOOTING.md` for team learning and transparent evaluation.

## Standard Entry Format

When appending to `ERRORS_AND_TROUBLESHOOTING.md`, adhere to this structure:

```markdown
## [Number]. [Clear, Descriptive Title of the Issue]

### ❌ The Error
\`\`\`
[Exact terminal output, stack trace, or compiler error snippet]
\`\`\`

### 🔍 Why It Happened
[Explain the underlying root cause: e.g., breaking API change in new major version, peer dependency conflict, missing peer runtime, framework prerendering constraint, or sandboxing behavior.]

### 💡 The Solution
[Provide the exact shell command, code modification, or configuration change used to resolve the issue permanently.]
```

## Procedure

1. **Detect & Isolate**: Note the exact command or action that caused the error and capture the primary error message.
2. **Diagnose**: Determine whether the issue was caused by:
   - Framework changes (e.g., Next.js App Router rules)
   - ORM / CLI updates (e.g., Prisma CLI changes)
   - Dependency / peer dependency tree mismatch
   - OS or Node.js runtime sandboxing (e.g., npm install-scripts)
3. **Resolve**: Apply the verified, documented fix.
4. **Append**: Open `ERRORS_AND_TROUBLESHOOTING.md`:
   - Add a new numbered section at the bottom.
   - Add the corresponding link to the Table of Contents at the top.
5. **Commit**: Stage and commit the updated `ERRORS_AND_TROUBLESHOOTING.md` if working on a VCS checkpoint.
