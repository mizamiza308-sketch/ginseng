import { Router, type IRouter } from "express";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import { hashPassword, createSession, requireAuth, getSessionUser } from "../lib/auth";

const router: IRouter = Router();

function formatUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    balance: parseFloat(user.balance || "0"),
    bankName: user.bankName,
    bankAccount: user.bankAccount,
    bankAccountName: user.bankAccountName,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt?.toISOString(),
  };
}

router.post("/register", async (req, res) => {
  try {
    const body = RegisterBody.parse(req.body);
    if (body.password !== body.confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.username, body.username)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const hashed = hashPassword(body.password);
    const [user] = await db.insert(usersTable).values({
      username: body.username,
      password: hashed,
      email: body.email,
      phone: body.phone,
      bankName: body.bankName,
      bankAccount: body.bankAccount,
      bankAccountName: body.bankAccountName,
      referralCode: body.referralCode,
    }).returning();
    const token = await createSession(user.id);
    res.cookie("session_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });
    res.status(201).json({ message: "Registration successful", user: formatUser(user) });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = LoginBody.parse(req.body);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, body.username)).limit(1);
    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }
    const hashed = hashPassword(body.password);
    if (user.password !== hashed) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }
    if (user.status === "suspended") {
      res.status(401).json({ message: "Your account has been suspended" });
      return;
    }
    const token = await createSession(user.id);
    res.cookie("session_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });
    res.json({ message: "Login successful", user: formatUser(user) });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Login failed" });
  }
});

router.post("/logout", async (req, res) => {
  const token = req.cookies?.session_token;
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.clearCookie("session_token");
  res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = (req as any).user;
  res.json(formatUser(user));
});

export default router;
