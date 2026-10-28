import { Client } from "ssh2";
import fs from "fs";
import path from "path";

function loadEnv(envPath) {
  const envVars = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [k, ...v] = trimmed.split("=");
        envVars[k.trim()] = v.join("=").trim();
      }
    }
  }
  return envVars;
}

const rootDir = process.cwd();
const env = loadEnv(path.join(rootDir, ".env.deploy"));

const host = env.VPS_HOST || "72.60.221.173";
const user = env.VPS_USER || "root";
const password = env.VPS_PASSWORD || "(qh'8GC/6+mXt8fJ";
const pat = env.GITHUB_PAT || "";
const ghUser = env.GITHUB_USER || "marshadkhn";
const ghRepo = env.GITHUB_REPO || "magicteal/dlaven-website";

const conn = new Client();

function run(cmd, timeoutMs = 900000) {
  return new Promise((resolve, reject) => {
    console.log(`\n=================== [ ${cmd} ] ===================`);
    conn.exec(cmd, { timeout: timeoutMs }, (err, stream) => {
      if (err) return reject(err);
      let stdout = "";
      let stderr = "";

      stream.on("close", (code, signal) => {
        resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
      });

      stream.on("data", (data) => {
        const s = data.toString();
        stdout += s;
        process.stdout.write(s);
      });

      stream.stderr.on("data", (data) => {
        const s = data.toString();
        stderr += s;
        process.stderr.write(s);
      });
    });
  });
}

async function main() {
  console.log(`Connecting to VPS (${host})...`);
  conn.on("ready", async () => {
    try {
      console.log("✅ SSH Connection established.");

      // 1. Update Git repository on VPS
      const authenticatedUrl = pat
        ? `https://${ghUser}:${pat}@github.com/${ghRepo}.git`
        : `https://github.com/${ghRepo}.git`;
      console.log("\n1. Updating git remote and pulling latest commit on VPS...");
      await run(`su - deploy -c 'cd /home/deploy/myapp && git remote set-url origin ${authenticatedUrl} && git fetch origin && git reset --hard origin/main'`);

      // 2. Build Backend
      console.log("\n2. Building Backend...");
      await run("su - deploy -c 'cd /home/deploy/myapp/Backend && npm install && npm run build'");
      console.log("\n2b. Ensuring Admin Account on VPS DB...");
      await run("su - deploy -c 'cd /home/deploy/myapp/Backend && npx ts-node src/makeAdmin.ts'");
      await run("su - deploy -c 'cd /home/deploy/myapp/Backend && npx ts-node src/makeAdminAtlas.ts'");

      // 3. Build Frontend
      console.log("\n3. Building Frontend...");
      await run("su - deploy -c 'cd /home/deploy/myapp/Frontend && npm install && npm run build'");

      // 4. Restart PM2 Services
      console.log("\n4. Restarting PM2 Services...");
      await run("su - deploy -c 'pm2 restart all'");

      // 5. Check PM2 Status
      console.log("\n5. Checking PM2 Status & Running Processes...");
      const statusRes = await run("su - deploy -c 'pm2 status'");

      conn.end();

      if (statusRes.stdout.includes("online")) {
        console.log("\n✅ VPS Deployment successfully completed and services are ONLINE!");
        process.exit(0);
      } else {
        console.log("\n⚠️ VPS Deployment finished, but check PM2 status output above for issues.");
        process.exit(1);
      }
    } catch (e) {
      console.error("\n❌ Deployment failed:", e.message);
      conn.end();
      process.exit(1);
    }
  });

  conn.on("error", (err) => {
    console.error("SSH connection error:", err.message);
    process.exit(1);
  });

  conn.connect({
    host,
    port: 22,
    username: user,
    password,
    readyTimeout: 30000
  });
}

main();
