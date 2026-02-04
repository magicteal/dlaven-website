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
const ALLOWED_ORIGINS = FRONTEND_ORIGIN.split(",").map((s: string) => s.trim());
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
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
