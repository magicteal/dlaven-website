import express, { type Request, type Response } from "express";
import cors from "cors";
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
  process.env.FRONTEND_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000";

type AllowedOriginRule =
  | { kind: "exact"; origin: string }
  | { kind: "hostSuffix"; suffix: string; protocol?: "http" | "https" };

function parseAllowedOriginRules(raw: string): AllowedOriginRule[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
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
      return { kind: "exact", origin: entry };
    });
}

function isOriginAllowed(origin: string, rules: AllowedOriginRule[]): boolean {
  // Fast path: exact match
  for (const rule of rules) {
    if (rule.kind === "exact" && rule.origin === origin) return true;
  }
  // Wildcard host suffix match
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
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
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (isOriginAllowed(origin, ALLOWED_ORIGIN_RULES)) return callback(null, true);
      console.warn("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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
