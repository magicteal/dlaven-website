import express, { type Request, type Response } from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./utils/db";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import productsRoutes from "./routes/products";
import categoriesRoutes from "./routes/categories";
import uploadsRoutes from "./routes/uploads";
import ordersRoutes from "./routes/orders";
import codesRoutes from "./routes/codes";
import cartRoutes from "./routes/cart";

dotenv.config();

const app = express();

// CORS (allow frontend origins; comma-separated list)
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000,https://dlaven-website.vercel.app";

type AllowedOriginRule =
  | { kind: "exact"; origin: string }
  | { kind: "hostSuffix"; suffix: string; protocol?: "http" | "https" };

function stripWrappingQuotes(value: string): string {
  const v = value.trim();
  if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1).trim();
  }
  return v;
}

function parseAllowedOriginRules(raw: string): AllowedOriginRule[] {
  // Support comma-separated, semicolon-separated, or newline-separated lists.
  // Also support JSON array format: ["https://a.com","https://b.com"].
  const entries: string[] = (() => {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const arr = JSON.parse(trimmed) as unknown;
        if (Array.isArray(arr)) return arr.map((x) => String(x));
      } catch {
        // fall through
      }
    }
    return trimmed.split(/[,;\n]/g);
  })();

  return entries
    .map((s) => stripWrappingQuotes(s))
    .filter(Boolean)
    .map((entryRaw) => {
      const entry = entryRaw.trim();
      // Wildcards supported:
      // - "*.vercel.app" (any protocol)
      // - "https://*.vercel.app" (protocol restricted)
      if (entry.includes("*")) {
        const protocolMatch = entry.match(/^(https?):\/\//i);
        const protocol = protocolMatch
          ? (protocolMatch[1].toLowerCase() as "http" | "https")
          : undefined;
        const withoutProtocol = entry.replace(/^(https?):\/\//i, "");
        const host = withoutProtocol.replace(/^\*\./, "");
        return { kind: "hostSuffix", suffix: host.toLowerCase(), protocol };
      }

      // Exact origin supported:
      // - "https://example.com" (with or without trailing slash)
      // Also allow hostname-only entries like "example.com" as a host rule.
      if (/^https?:\/\//i.test(entry)) {
        try {
          const url = new URL(entry);
          return { kind: "exact", origin: url.origin };
        } catch {
          // fall through to hostSuffix parsing
        }
      }

      const host = entry.replace(/^\./, "").toLowerCase();
      return { kind: "hostSuffix", suffix: host };
    });
}

function isOriginAllowed(origin: string, rules: AllowedOriginRule[]): boolean {
  // Normalize incoming origin (handles trailing slash / casing)
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  const normalizedOrigin = url.origin;

  // Exact match
  for (const rule of rules) {
    if (rule.kind === "exact" && rule.origin === normalizedOrigin) return true;
  }

  // Host suffix match (wildcards / hostname-only entries)
  const hostname = url.hostname.toLowerCase();
  const protocol = url.protocol.replace(":", "") as "http" | "https";
  for (const rule of rules) {
    if (rule.kind !== "hostSuffix") continue;
    if (rule.protocol && rule.protocol !== protocol) continue;
    if (hostname === rule.suffix || hostname.endsWith(`.${rule.suffix}`)) return true;
  }
  return false;
}

const ALLOWED_ORIGIN_RULES = parseAllowedOriginRules(FRONTEND_ORIGIN);
console.log("[cors] allowed origins config:", FRONTEND_ORIGIN);
console.log("[cors] allowed origin rules:", ALLOWED_ORIGIN_RULES);
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (isOriginAllowed(origin, ALLOWED_ORIGIN_RULES)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Preflight (use the SAME options as normal requests)
app.options("*", cors(corsOptions));

// Parsers
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/codes", codesRoutes);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "dlaven-backend" });
});

const PORT = Number(process.env.PORT || 4000);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
