---
trigger: always_on
description: Always record unexpected build, runtime, and dependency errors in ERRORS_AND_TROUBLESHOOTING.md
---

# Error Logging Rule

Whenever any build failure, unexpected runtime error, peer dependency resolution error, or undocumented library issue occurs and is resolved:
1. Append an entry to `ERRORS_AND_TROUBLESHOOTING.md` following the standard format (Error, Root Cause, Solution).
2. Keep the Table of Contents at the top of `ERRORS_AND_TROUBLESHOOTING.md` updated.
3. This ensures the user can learn from any undocumented or non-obvious issues encountered during development.
