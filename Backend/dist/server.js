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
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000,http://127.0.0.1:3000";
function parseAllowedOriginRules(raw) {
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
                ? protocolMatch[1].toLowerCase()
                : undefined;
            const withoutProtocol = entry.replace(/^(https?):\/\//i, "");
            const host = withoutProtocol.replace(/^\*\./, "");
            return { kind: "hostSuffix", suffix: host.toLowerCase(), protocol };
        }
        return { kind: "exact", origin: entry };
    });
}
function isOriginAllowed(origin, rules) {
    // Fast path: exact match
    for (const rule of rules) {
        if (rule.kind === "exact" && rule.origin === origin)
            return true;
    }
    // Wildcard host suffix match
    let url;
    try {
        url = new URL(origin);
    }
    catch {
        return false;
    }
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true); // non-browser or same-origin
        if (isOriginAllowed(origin, ALLOWED_ORIGIN_RULES))
            return callback(null, true);
        console.warn("CORS blocked origin:", origin);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
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
