import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  sub: string; // user id
  email: string;
  role?: "user" | "admin";
}

function getToken(req: Request): string | undefined {
  if (req.cookies?.token) return req.cookies.token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }
  return undefined;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret) as AuthPayload;
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as AuthPayload | undefined;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });
  return next();
}

// Optional auth: if a token exists in cookie or Authorization header, decode it and set req.user
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getToken(req);
    if (!token) return next();
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret) as AuthPayload;
    (req as any).user = payload;
  } catch {
    // ignore token errors for optional auth
  }
  return next();
}
