import { Router, type IRouter } from "express";
import { db, usersTable, transactionsTable } from "@workspace/db";
import { eq, sum, and } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const depositSum = await db
      .select({ total: sum(transactionsTable.amount) })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.userId, user.id), eq(transactionsTable.type, "deposit"), eq(transactionsTable.status, "approved")));
    const withdrawSum = await db
      .select({ total: sum(transactionsTable.amount) })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.userId, user.id), eq(transactionsTable.type, "withdraw"), eq(transactionsTable.status, "approved")));

    res.json({
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
      totalDeposit: parseFloat(depositSum[0]?.total || "0"),
      totalWithdraw: parseFloat(withdrawSum[0]?.total || "0"),
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get profile" });
  }
});

export default router;
