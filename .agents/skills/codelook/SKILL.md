---
name: codelook
description: Scans the entire codebase topology, analyzes tech stack, lines of code, packages, commands, and environment keys, and saves persistent project memory in .agents/PROJECT_MEMORY.md while preserving custom domain knowledge. Triggered when the user types /codelook or asks to scan codebase memory.
---

# Codebase Memory Scanner (/codelook)

Use this skill whenever the user triggers `/codelook`, asks to scan the codebase, refresh or generate workspace memory, or after major refactoring to update repository understanding.

## Overview

The `codelook` skill inspects the repository, generates a comprehensive analysis of the project's topology, languages, package manifests, and environment keys, and writes the structured memory into the dedicated workspace file at [`.agents/PROJECT_MEMORY.md`](file:///f:/Freelancing/Magicteal/dlaven-website/.agents/PROJECT_MEMORY.md).

> [!IMPORTANT]
> The scanner automatically preserves everything under the `## 🧠 Persistent Notes & Domain Knowledge` section in [`.agents/PROJECT_MEMORY.md`](file:///f:/Freelancing/Magicteal/dlaven-website/.agents/PROJECT_MEMORY.md). Custom architecture notes, database schemas, brand rules, and development gotchas are never lost during resyncs.

---

## Execution Workflow

Follow this procedure when `/codelook` is triggered:

### Step 1: Run Codebase Scanner Script
Execute the dedicated scanner helper script from the workspace root:

```powershell
node .agents/skills/codelook/scripts/scan.mjs
```

The script performs:
1. **Topology Mapping**: Recursively scans directory structures up to depth 3 while ignoring build artifacts (`node_modules`, `.git`, `.next`, `dist`, `coverage`).
2. **Language & Code Analysis**: Measures source code files and lines across TypeScript, JavaScript, Python, CSS, JSON, Markdown, etc. (filtering out binaries and lockfiles).
3. **Subproject & Manifest Extraction**: Extracts all package names, dependencies, and npm scripts from `Backend/package.json` and `Frontend/package.json`.
4. **Environment Key Discovery**: Scans `.env` and `.env.*` files to record configuration keys without leaking secret values.
5. **Git Metadata Tracking**: Records current Git branch, commit hash, commit message, and dirty/clean status.
6. **Persistent Knowledge Retention**: Extracts existing notes under `## 🧠 Persistent Notes & Domain Knowledge` and appends them to the generated memory.

### Step 2: Enrich Persistent Knowledge (If Applicable)
If recent codebase changes introduced new architectural patterns, API endpoints, or database models:
1. Open [`.agents/PROJECT_MEMORY.md`](file:///f:/Freelancing/Magicteal/dlaven-website/.agents/PROJECT_MEMORY.md).
2. Append or refine sections under `## 🧠 Persistent Notes & Domain Knowledge`, such as:
   - New routes in `Backend/src/routes/`
   - New database models in `Backend/src/models/`
   - New frontend components or pages in `Frontend/src/`
   - Special configuration notes or gotchas

### Step 3: Present Summary Report
Provide a clean, readable summary report in chat with:
- **Repository Status**: Branch, latest commit, dirty/clean status
- **Code Scale**: Total source files analyzed and total lines of code
- **Language Distribution**: Top languages by percentage of code
- **Subprojects Detected**: Backend and Frontend configurations & dev commands
- **Direct Link**: Clickable link to [`.agents/PROJECT_MEMORY.md`](file:///f:/Freelancing/Magicteal/dlaven-website/.agents/PROJECT_MEMORY.md)
