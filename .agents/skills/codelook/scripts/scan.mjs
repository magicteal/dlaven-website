import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT_DIR = process.cwd();
const AGENTS_DIR = path.join(ROOT_DIR, ".agents");
const MEMORY_FILE = path.join(AGENTS_DIR, "PROJECT_MEMORY.md");

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".turbo",
  ".gemini",
  "coverage",
  ".cache",
  ".vscode",
  ".idea"
]);

const LOCK_FILES = new Set([
  "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"
]);

const BINARY_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".ico", ".webp", ".avif",
  ".mp4", ".webm", ".mov", ".m4v", ".avi",
  ".ttf", ".woff", ".woff2", ".eot", ".otf",
  ".zip", ".tar", ".gz", ".rar", ".7z",
  ".pdf", ".exe", ".dll", ".so", ".dylib", ".bin"
]);

const EXTENSION_MAP = {
  ".tsx": "TypeScript (React)",
  ".ts": "TypeScript",
  ".jsx": "JavaScript (React)",
  ".js": "JavaScript",
  ".mjs": "JavaScript (ESM)",
  ".cjs": "JavaScript (CommonJS)",
  ".json": "JSON",
  ".css": "CSS",
  ".scss": "SCSS",
  ".html": "HTML",
  ".md": "Markdown",
  ".py": "Python",
  ".ps1": "PowerShell",
  ".sh": "Shell",
  ".svg": "SVG (Vector)",
  ".yaml": "YAML",
  ".yml": "YAML",
  ".sql": "SQL",
  ".env": "Environment Config"
};

function runGit(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT_DIR, stdio: ["pipe", "pipe", "ignore"], encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function getGitMeta() {
  const branch = runGit("git rev-parse --abbrev-ref HEAD") || "unknown";
  const commit = runGit('git log -1 --pretty=format:"%h - %s (%ci)"') || "unknown";
  const statusOutput = runGit("git status --porcelain");
  const isDirty = Boolean(statusOutput && statusOutput.length > 0);
  return {
    branch,
    commit,
    status: isDirty ? "Dirty (uncommitted changes)" : "Clean"
  };
}

function scanFiles(dir, depth = 0, maxDepth = 4) {
  const fileList = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (depth < maxDepth) {
          fileList.push(...scanFiles(fullPath, depth + 1, maxDepth));
        }
      } else if (entry.isFile()) {
        fileList.push(fullPath);
      }
    }
  } catch (err) {
    // ignore access issues
  }
  return fileList;
}

function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content.split(/\r\n|\r|\n/).length;
  } catch {
    return 0;
  }
}

function buildTopology(dir, depth = 0, maxDepth = 2) {
  const relativeDir = path.relative(ROOT_DIR, dir);
  const dirName = depth === 0 ? path.basename(ROOT_DIR) : path.basename(dir);
  const indent = "│   ".repeat(depth);

  let output = depth === 0 ? `${dirName}/\n` : "";

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const visibleEntries = entries.filter(e => !IGNORED_DIRS.has(e.name));

    const dirs = visibleEntries.filter(e => e.isDirectory());
    const files = visibleEntries.filter(e => e.isFile());

    for (const d of dirs) {
      const fullSubDir = path.join(dir, d.name);
      let subItemCount = 0;
      try {
        subItemCount = fs.readdirSync(fullSubDir).filter(name => !IGNORED_DIRS.has(name)).length;
      } catch {}
      output += `${indent}├── ${d.name}/ (${subItemCount} items)\n`;
      if (depth < maxDepth) {
        output += buildTopology(fullSubDir, depth + 1, maxDepth);
      }
    }

    for (const f of files) {
      output += `${indent}├── ${f.name}\n`;
    }
  } catch {}

  return output;
}

function findPackageJsons(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findPackageJsons(fullPath));
      } else if (entry.name === "package.json") {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}

function scanEnvKeys(dir) {
  const envKeys = new Set();
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subKeys = scanEnvKeys(fullPath);
        for (const k of subKeys) envKeys.add(k);
      } else if (entry.name.startsWith(".env") && !entry.name.endsWith(".vault")) {
        try {
          const lines = fs.readFileSync(fullPath, "utf8").split(/\r\n|\r|\n/);
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIndex = trimmed.indexOf("=");
            if (eqIndex > 0) {
              envKeys.add(trimmed.slice(0, eqIndex).trim());
            }
          }
        } catch {}
      }
    }
  } catch {}
  return Array.from(envKeys);
}

function extractExistingPersistentNotes(memoryFilePath) {
  if (!fs.existsSync(memoryFilePath)) return null;
  const content = fs.readFileSync(memoryFilePath, "utf8");
  const marker = "## 🧠 Persistent Notes & Domain Knowledge";
  const markerIndex = content.indexOf(marker);
  if (markerIndex !== -1) {
    return content.slice(markerIndex).trim();
  }
  return null;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function generateMemory() {
  console.log("🔍 Scanning codebase topology and metadata...");
  const gitMeta = getGitMeta();
  const allFiles = scanFiles(ROOT_DIR, 0, 5);

  const langStats = {};
  let totalLines = 0;
  let codeFilesCount = 0;
  let binaryFilesCount = 0;

  for (const file of allFiles) {
    const fileName = path.basename(file);
    if (LOCK_FILES.has(fileName)) {
      continue;
    }
    const ext = path.extname(file).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) {
      binaryFilesCount += 1;
      continue;
    }

    codeFilesCount += 1;
    const lang = EXTENSION_MAP[ext] || (ext ? ext.slice(1).toUpperCase() : "Plain Text");
    const lines = countLines(file);
    totalLines += lines;

    if (!langStats[lang]) {
      langStats[lang] = { files: 0, lines: 0 };
    }
    langStats[lang].files += 1;
    langStats[lang].lines += lines;
  }

  const sortedLangs = Object.entries(langStats)
    .sort((a, b) => b[1].lines - a[1].lines);

  // Parse package.json files
  const packageFiles = findPackageJsons(ROOT_DIR);
  const packages = [];
  const allCommands = [];

  for (const pkgFile of packageFiles) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
      const relDir = path.relative(ROOT_DIR, path.dirname(pkgFile)) || "Root";
      packages.push({ dir: relDir, pkg });
      if (pkg.scripts) {
        for (const [cmd, script] of Object.entries(pkg.scripts)) {
          allCommands.push({ context: relDir, command: `npm run ${cmd}`, script });
        }
      }
    } catch {}
  }

  // Scan env keys
  const envKeys = scanEnvKeys(ROOT_DIR);

  // Preserve existing persistent notes
  const persistentNotes = extractExistingPersistentNotes(MEMORY_FILE);

  const projectName = path.basename(ROOT_DIR);
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  let doc = `# 🏛️ Project Memory: ${projectName}\n\n`;
  doc += `> **Generated by:** \`codelook\` skill\n`;
  doc += `> **Last Updated:** ${timestamp} (UTC)\n`;
  doc += `> **Repository Path:** \`${ROOT_DIR.replace(/\\/g, "/")}\`\n`;
  doc += `> **Git Branch:** \`${gitMeta.branch}\` | **Commit:** \`${gitMeta.commit}\`\n`;
  doc += `> **Status:** \`${gitMeta.status}\`\n\n`;
  doc += `---\n\n`;

  doc += `## 📌 Executive Summary\n`;
  doc += `- **Project Name:** \`${projectName}\`\n`;
  const primaryPackages = packages.map(p => `${p.dir} (${p.pkg.name || "unnamed"})`).join(", ");
  doc += `- **Subprojects & Packages:** ${primaryPackages || "Single workspace"}\n`;
  doc += `- **Scale:** ${codeFilesCount} source code/text files analyzed (${totalLines.toLocaleString()} lines of code) + ${binaryFilesCount} media/asset files\n`;
  doc += `- **Primary Stack:** ${sortedLangs.slice(0, 4).map(l => l[0]).join(", ") || "N/A"}\n\n`;
  doc += `---\n\n`;

  doc += `## 🛠️ Technology Stack & Toolchain\n\n`;
  doc += `### Core Languages Breakdown\n`;
  doc += `| Language | Files | Lines | % Code |\n`;
  doc += `| :--- | :--- | :--- | :--- |\n`;
  for (const [lang, stats] of sortedLangs) {
    const pct = totalLines > 0 ? ((stats.lines / totalLines) * 100).toFixed(1) : "0.0";
    doc += `| **${lang}** | ${stats.files} | ${stats.lines.toLocaleString()} | ${pct}% |\n`;
  }
  doc += `\n`;

  doc += `### Detected Frameworks & Libraries\n`;
  for (const p of packages) {
    const deps = Object.keys(p.pkg.dependencies || {});
    const devDeps = Object.keys(p.pkg.devDependencies || {});
    doc += `- **${p.dir}** (\`${p.pkg.name || "unnamed"}\`):\n`;
    if (deps.length > 0) {
      doc += `  - Dependencies (${deps.length}): \`${deps.slice(0, 10).join("`, `")}\`${deps.length > 10 ? ` + ${deps.length - 10} more` : ""}\n`;
    }
    if (devDeps.length > 0) {
      doc += `  - DevDependencies (${devDeps.length}): \`${devDeps.slice(0, 8).join("`, `")}\`${devDeps.length > 8 ? ` + ${devDeps.length - 8} more` : ""}\n`;
    }
  }
  doc += `\n---\n\n`;

  doc += `## 📂 Codebase Topology\n\n`;
  doc += `\`\`\`text\n`;
  doc += buildTopology(ROOT_DIR, 0, 2);
  doc += `\`\`\`\n\n`;
  doc += `---\n\n`;

  doc += `## ⚡ Available Commands & Workflows\n\n`;
  doc += `| Context | Command | Script Action |\n`;
  doc += `| :--- | :--- | :--- |\n`;
  for (const c of allCommands) {
    doc += `| **${c.context}** | \`${c.command}\` | \`${c.script.replace(/\|/g, "\\|")}\` |\n`;
  }
  doc += `\n---\n\n`;

  doc += `## 🔐 Detected Environment Keys\n`;
  if (envKeys.length > 0) {
    doc += `The following environment variable keys are declared in local configuration or templates:\n`;
    for (const key of envKeys.sort()) {
      doc += `- \`${key}\`\n`;
    }
  } else {
    doc += `_No environment variables detected._\n`;
  }
  doc += `\n---\n\n`;

  if (persistentNotes) {
    doc += `${persistentNotes}\n`;
  } else {
    doc += `## 🧠 Persistent Notes & Domain Knowledge\n`;
    doc += `> This section is preserved across subsequent \`codelook\` scans. Add project-specific architecture decisions, Gotchas, database schemas, and critical business rules below.\n\n`;
    doc += `### 🏛️ Architecture Overview\n`;
    doc += `Document major architectural patterns and system design choices here.\n\n`;
    doc += `### ⚠️ Known Gotchas & Constraints\n`;
    doc += `- Add known quirks or environment gotchas here.\n`;
  }

  if (!fs.existsSync(AGENTS_DIR)) {
    fs.mkdirSync(AGENTS_DIR, { recursive: true });
  }

  fs.writeFileSync(MEMORY_FILE, doc, "utf8");
  console.log(`✅ Project memory successfully saved to: ${path.relative(ROOT_DIR, MEMORY_FILE)}`);
  console.log(`📊 Analyzed ${allFiles.length} files, ${totalLines.toLocaleString()} lines across ${sortedLangs.length} languages.`);
  if (persistentNotes) {
    console.log(`🧠 Preserved existing Persistent Notes & Domain Knowledge section.`);
  }
}

generateMemory();
