---
name: startlocal
description: Scans the project for all subprojects and dev servers, checks port availability and conflicts, and launches all local dev servers (Backend, Frontend) with verified port allocation. Triggered when the user types /startlocal or asks to start local dev servers.
---

# Local Dev Server & Port Manager (/startlocal)

Use this skill whenever the user triggers `/startlocal`, asks to start local development servers, check available ports, or spin up the full-stack environment locally.

---

## Capabilities & Architecture

1. **Project & Service Discovery**: Scans repository folders (`Backend/`, `Frontend/`) for `package.json` configurations containing `"dev"` scripts.
2. **Port Detection & Conflict Auditing**:
   - Backend target: Reads `Backend/.env` for `PORT` (configured as **`5000`**, fallback `4000`).
   - Frontend target: Next.js default **`3000`**.
   - Tests availability of ports 5000 and 3000. If occupied, identifies conflicting PIDs (`node.exe`, etc.).
3. **Flexible Server Launching**:
   - **Interactive Terminal Windows (Recommended for Windows)**: Opens dedicated visible PowerShell consoles for Backend and Frontend with real-time hot-reloading and clear logs.
   - **Concurrent Streaming Runner**: Streams unified colored logs (`[Backend]`, `[Frontend]`) with automatic graceful shutdown on `Ctrl+C`.
   - **Background Jobs**: Runs silently in the background if requested.

---

## Execution Workflow

Follow this procedure when `/startlocal` is triggered:

### Step 1: Scan Subprojects and Port Availability
Run the port scanner script to audit the environment:

```powershell
node .agents/skills/startlocal/scripts/scan_and_check.mjs
```

- If ports `5000` and `3000` are **FREE**, proceed directly to Step 2.
- If any port is **IN USE**, check the reported PIDs. To automatically terminate stale processes and reclaim the ports, add `--kill-stale`:

```powershell
node .agents/skills/startlocal/scripts/scan_and_check.mjs --kill-stale
```

### Step 2: Launch Local Dev Servers

#### Option A: Dedicated Windows Consoles (Recommended for Developer Workflow)
Spawns separate interactive PowerShell terminals so the user can see live logs and hot-reload updates while developing:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/startlocal/scripts/start.ps1 -Interactive -KillStale
```

#### Option B: Unified Concurrent Terminal
Runs both servers concurrently in the active shell with prefixed output:

```powershell
node .agents/skills/startlocal/scripts/start.mjs --kill-stale
```

#### Option C: Background Jobs
Starts servers as background PowerShell jobs:

```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/startlocal/scripts/start.ps1 -Background -KillStale
```

### Step 3: Verify and Report Status
Check that both servers are responding:
1. **Frontend**: [http://localhost:3000](http://localhost:3000)
2. **Backend**: [http://localhost:5000](http://localhost:5000) (Health / API: [http://localhost:5000/api](http://localhost:5000/api))

Present a clean status table to the user:

| Service | Dev Command | Port | URL | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | `npm run dev` (`ts-node-dev`) | `5000` | [http://localhost:5000](http://localhost:5000) | `Listening` |
| **Frontend** | `npm run dev` (`next dev`) | `3000` | [http://localhost:3000](http://localhost:3000) | `Listening` |
