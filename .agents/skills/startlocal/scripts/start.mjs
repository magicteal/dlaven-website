import { spawn } from "child_process";
import path from "path";
import http from "http";
import { scanProjectServers } from "./scan_and_check.mjs";

const ROOT_DIR = process.cwd();

function checkHealth(url, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, serviceName, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const ok = await checkHealth(url);
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function run() {
  const args = process.argv.slice(2);
  const killStale = args.includes("--kill-stale") || args.includes("-k");

  console.log("\n=======================================================");
  console.log("  🚀 Startlocal: Cross-Platform Dev Server Launcher");
  console.log("=======================================================\n");

  const services = await scanProjectServers(killStale);

  for (const s of services) {
    if (!s.isPortAvailable && !killStale) {
      console.error(`❌ Port ${s.configuredPort} for [${s.service}] is currently occupied.`);
      console.error(`Run with '--kill-stale' to automatically terminate conflicting processes.`);
      process.exit(1);
    }
  }

  const runningChildren = [];

  function shutdown() {
    console.log("\n🛑 Stopping all local dev servers...");
    for (const child of runningChildren) {
      try {
        if (process.platform === "win32") {
          spawn("taskkill", ["/pid", child.pid.toString(), "/f", "/t"]);
        } else {
          child.kill("SIGTERM");
        }
      } catch {}
    }
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  for (const s of services) {
    const prefix = `[${s.service}]`.padEnd(12);
    console.log(`🚀 Starting ${s.service} on port ${s.configuredPort}...`);

    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(npmCmd, ["run", "dev"], {
      cwd: s.fullPath,
      shell: true,
      env: { ...process.env, PORT: s.configuredPort.toString() }
    });

    runningChildren.push(child);

    child.stdout.on("data", (data) => {
      const lines = data.toString().trim().split("\n");
      for (const line of lines) {
        if (line.trim()) console.log(`${prefix} ${line.trim()}`);
      }
    });

    child.stderr.on("data", (data) => {
      const lines = data.toString().trim().split("\n");
      for (const line of lines) {
        if (line.trim()) console.error(`${prefix} ⚠️  ${line.trim()}`);
      }
    });

    child.on("error", (err) => {
      console.error(`${prefix} Error: ${err.message}`);
    });

    child.on("exit", (code) => {
      console.log(`${prefix} Exited with code ${code}`);
    });
  }

  console.log("\n=======================================================");
  console.log("  ✅ Local dev servers launched concurrently!");
  console.log("  🌐 Frontend: http://localhost:3000");
  console.log("  ⚙️  Backend:  http://localhost:5000");
  console.log("  Press Ctrl+C to stop all servers.");
  console.log("=======================================================\n");
}

run();
