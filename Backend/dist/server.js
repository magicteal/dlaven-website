"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const orders_1 = __importDefault(require("./routes/orders"));
const codes_1 = __importDefault(require("./routes/codes"));
const cart_1 = __importDefault(require("./routes/cart"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS (allow frontend origins; comma-separated list)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000,https://dlaven-website.vercel.app";
function stripWrappingQuotes(value) {
    const v = value.trim();
    if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) {
        return v.slice(1, -1).trim();
    }
    return v;
}
function parseAllowedOriginRules(raw) {
    // Support comma-separated, semicolon-separated, or newline-separated lists.
    // Also support JSON array format: ["https://a.com","https://b.com"].
    const entries = (() => {
        const trimmed = raw.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
                const arr = JSON.parse(trimmed);
                if (Array.isArray(arr))
                    return arr.map((x) => String(x));
            }
            catch {
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
                ? protocolMatch[1].toLowerCase()
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
            }
            catch {
                // fall through to hostSuffix parsing
            }
        }
        const host = entry.replace(/^\./, "").toLowerCase();
        return { kind: "hostSuffix", suffix: host };
    });
}
function isOriginAllowed(origin, rules) {
    // Normalize incoming origin (handles trailing slash / casing)
    let url;
    try {
        url = new URL(origin);
    }
    catch {
        return false;
    }
    const normalizedOrigin = url.origin;
    // Exact match
    for (const rule of rules) {
        if (rule.kind === "exact" && rule.origin === normalizedOrigin)
            return true;
    }
    // Host suffix match (wildcards / hostname-only entries)
    const hostname = url.hostname.toLowerCase();
    const protocol = url.protocol.replace(":", "");
    for (const rule of rules) {
        if (rule.kind !== "hostSuffix")
            continue;
        if (rule.protocol && rule.protocol !== protocol)
            continue;
        if (hostname === rule.suffix || hostname.endsWith(`.${rule.suffix}`))
            return true;
    }
    return false;
}
const ALLOWED_ORIGIN_RULES = parseAllowedOriginRules(FRONTEND_ORIGIN);
console.log("[cors] allowed origins config:", FRONTEND_ORIGIN);
console.log("[cors] allowed origin rules:", ALLOWED_ORIGIN_RULES);
const corsOptions = {
    origin(origin, callback) {
        if (!origin)
            return callback(null, true);
        if (isOriginAllowed(origin, ALLOWED_ORIGIN_RULES))
            return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
// Preflight (use the SAME options as normal requests)
app.options("*", (0, cors_1.default)(corsOptions));
// Parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/products", products_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/uploads", uploads_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api/cart", cart_1.default);
app.use("/api/codes", codes_1.default);
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "dlaven-backend" });
});
const PORT = Number(process.env.PORT || 4000);
(0, db_1.connectDB)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
});
