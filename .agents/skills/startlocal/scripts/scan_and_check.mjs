import fs from "fs";
import path from "path";
import net from "net";
import { execSync } from "child_process";

const ROOT_DIR = process.cwd();

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".turbo",
  ".gemini"
]);

function findSubprojects(dir) {
  const projects = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const pkgPath = path.join(fullPath, "package.json");
        if (fs.existsSync(pkgPath)) {
          try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
            if (pkg.scripts && pkg.scripts.dev) {
              projects.push({
                name: pkg.name || entry.name,
                dir: entry.name,
                fullPath,
                pkgPath,
                devScript: pkg.scripts.dev
              });
            }
          } catch {}
        }
      }
    }
  } catch {}
  return projects;
}

function detectConfiguredPort(project) {
  let detectedPort = null;
  const envFiles = [".env.local", ".env"];

  for (const envFile of envFiles) {
    const p = path.join(project.fullPath, envFile);
    if (fs.existsSync(p)) {
      try {
        const lines = fs.readFileSync(p, "utf8").split(/\r\n|\r|\n/);
        for (const line of lines) {
          const match = line.match(/^PORT\s*=\s*(\d+)/i);
          if (match) {
            detectedPort = parseInt(match[1], 10);
            break;
          }
        }
      } catch {}
      if (detectedPort) break;
    }
  }

  if (!detectedPort) {
    // Default conventions
    if (project.dir.toLowerCase().includes("backend") || project.name.includes("backend")) {
      detectedPort = 5000; // Project convention in Backend/.env
    } else if (project.dir.toLowerCase().includes("frontend") || project.name.includes("frontend") || project.name.includes("website")) {
      detectedPort = 3000; // Next.js default
    } else {
      detectedPort = 8080;
    }
  }

  return detectedPort;
}

function checkPortAvailability(port) {
  return new Promise((resolve) => {
    // 1. First probe if a service is actively accepting connections on localhost
    const probe = net.createConnection({ port, host: "127.0.0.1", timeout: 300 }, () => {
      probe.destroy();
      resolve({ available: false, error: "ACTIVE_SERVER" });
    });

    probe.on("error", () => {
      // 2. If no connection, test if we can bind and listen on 0.0.0.0 and 127.0.0.1
      const tester = net.createServer();
      tester.once("error", (err) => {
        resolve({ available: false, error: err.code || err.message });
      });

      tester.once("listening", () => {
        tester.close(() => {
          resolve({ available: true, error: null });
        });
      });

      tester.listen(port);
    });

    probe.on("timeout", () => {
      probe.destroy();
      resolve({ available: false, error: "TIMEOUT" });
    });
  });
}

function findProcessOnPort(port) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
      const lines = output.trim().split("\n");
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].endsWith(`:${port}`)) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== "0") pids.add(pid);
        }
      }
      return Array.from(pids);
    } else {
      const output = execSync(`lsof -i :${port} -t`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
      return output.trim().split("\n").filter(Boolean);
    }
  } catch {
    return [];
  }
}

function killPid(pid) {
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /F /PID ${pid}`, { stdio: ["ignore", "ignore", "ignore"] });
    } else {
      execSync(`kill -9 ${pid}`, { stdio: ["ignore", "ignore", "ignore"] });
    }
    return true;
  } catch {
    return false;
  }
}

async function findAvailablePortStartingFrom(startPort) {
  let p = startPort;
  while (p < startPort + 50) {
    const res = await checkPortAvailability(p);
    if (res.available) return p;
    p++;
  }
  return null;
}

export async function scanProjectServers(autoKillConflicting = false) {
  const projects = findSubprojects(ROOT_DIR);
  const results = [];

  for (const proj of projects) {
    const targetPort = detectConfiguredPort(proj);
    let portStatus = await checkPortAvailability(targetPort);
    let pids = [];

    if (!portStatus.available) {
      pids = findProcessOnPort(targetPort);
      if (autoKillConflicting && pids.length > 0) {
        console.log(`⚠️ Port ${targetPort} is in use by PID ${pids.join(", ")}. Killing stale process...`);
        for (const pid of pids) killPid(pid);
        // recheck
        await new Promise((r) => setTimeout(r, 800));
        portStatus = await checkPortAvailability(targetPort);
      }
    }

    let allocatedPort = targetPort;
    if (!portStatus.available) {
      allocatedPort = await findAvailablePortStartingFrom(targetPort + 1);
    }

    results.push({
      service: proj.dir,
      name: proj.name,
      fullPath: proj.fullPath,
      devScript: proj.devScript,
      command: `npm run dev`,
      configuredPort: targetPort,
      isPortAvailable: portStatus.available,
      conflictingPids: pids,
      allocatedPort
    });
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const shouldKill = args.includes("--kill-stale") || args.includes("-k");
  const asJson = args.includes("--json");

  const scan = await scanProjectServers(shouldKill);

  if (asJson) {
    console.log(JSON.stringify(scan, null, 2));
    return;
  }

  console.log("\n=======================================================");
  console.log("  🚀 Local Dev Server & Port Scanner (startlocal)");
  console.log("=======================================================\n");

  console.log(`Found ${scan.length} runnable service(s):\n`);

  for (const s of scan) {
    console.log(`📁 Service: [${s.service}] (${s.name})`);
    console.log(`   Dev Command:     ${s.command} (${s.devScript})`);
    console.log(`   Configured Port: ${s.configuredPort}`);

    if (s.isPortAvailable) {
      console.log(`   Port Status:     ✅ FREE & AVAILABLE`);
    } else {
      console.log(`   Port Status:     ❌ IN USE (PIDs: ${s.conflictingPids.join(", ") || "unknown"})`);
      console.log(`   Next Free Port:  👉 ${s.allocatedPort}`);
    }
    console.log(`   Local URL:       http://localhost:${s.isPortAvailable ? s.configuredPort : s.allocatedPort}`);
    console.log("-------------------------------------------------------");
  }

  const allAvailable = scan.every((s) => s.isPortAvailable);
  if (!allAvailable && !shouldKill) {
    console.log("\n💡 Tip: Run with '--kill-stale' to automatically free occupied ports.");
  }
}

if (process.argv[1] && process.argv[1].endsWith("scan_and_check.mjs")) {
  main();
}
