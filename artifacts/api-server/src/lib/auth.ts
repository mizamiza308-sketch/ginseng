import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomBytes, createHash } from "crypto";
import type { Request, Response, NextFunction } from "express";

export function hashPassword(password: string): string {
  const salt = process.env.SECRET_SALT || "casino_secret_2024";
  return createHash("sha256").update(password + salt).digest("hex");
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({ userId, token, expiresAt });
  return token;
}

export async function getSessionUser(token: string) {
  const session = await db
    .select({ session: sessionsTable, user: usersTable })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.token, token))
    .limit(1);

  if (!session.length) return null;
  const { session: s, user } = session[0];
  if (s.expiresAt < new Date()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
    return null;
  }
  return user;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session_token;
  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = await getSessionUser(token);
  if (!user) {
    res.status(401).json({ message: "Session expired or invalid" });
    return;
  }
  (req as any).user = user;
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.session_token;
  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = await getSessionUser(token);
  if (!user) {
    res.status(401).json({ message: "Session expired or invalid" });
    return;
  }
  if (user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  (req as any).user = user;
  next();
}
