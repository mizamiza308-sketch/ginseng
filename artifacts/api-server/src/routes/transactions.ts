import { Router, type IRouter } from "express";
import { db, transactionsTable, usersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

function formatTx(tx: any) {
  return {
    id: tx.id,
    userId: tx.userId,
    type: tx.type,
    amount: parseFloat(tx.amount || "0"),
    status: tx.status,
    bankName: tx.bankName,
    bankAccount: tx.bankAccount,
    bankAccountName: tx.bankAccountName,
    paymentMethod: tx.paymentMethod,
    promoCode: tx.promoCode,
    notes: tx.notes,
    createdAt: tx.createdAt?.toISOString(),
    updatedAt: tx.updatedAt?.toISOString(),
  };
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const type = req.query.type as string;
    const limit = parseInt(req.query.limit as string) || 50;

    let query = db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, user.id))
      .orderBy(desc(transactionsTable.createdAt))
      .limit(limit);

    if (type && type !== "all") {
      query = db
        .select()
        .from(transactionsTable)
        .where(and(eq(transactionsTable.userId, user.id), eq(transactionsTable.type, type as any)))
        .orderBy(desc(transactionsTable.createdAt))
        .limit(limit);
    }

    const transactions = await query;
    res.json({ transactions: transactions.map(formatTx), total: transactions.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get transactions" });
  }
});

router.post("/deposit", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { amount, paymentMethod, promoCode } = req.body;

    if (!amount || amount < 10000) {
      res.status(400).json({ message: "Minimal deposit adalah 10,000" });
      return;
    }

    const [tx] = await db.insert(transactionsTable).values({
      userId: user.id,
      type: "deposit",
      amount: amount.toString(),
      status: "pending",
      bankName: user.bankName,
      bankAccount: user.bankAccount,
      bankAccountName: user.bankAccountName,
      paymentMethod: paymentMethod || "BANK",
      promoCode: promoCode || null,
    }).returning();

    res.status(201).json(formatTx(tx));
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to create deposit" });
  }
});

router.post("/withdraw", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { amount } = req.body;

    if (!amount || amount < 50000) {
      res.status(400).json({ message: "Minimal withdraw adalah 50,000" });
      return;
    }

    const currentBalance = parseFloat(user.balance || "0");
    if (amount > currentBalance) {
      res.status(400).json({ message: "Saldo tidak mencukupi" });
      return;
    }

    const [tx] = await db.insert(transactionsTable).values({
      userId: user.id,
      type: "withdraw",
      amount: amount.toString(),
      status: "pending",
      bankName: user.bankName,
      bankAccount: user.bankAccount,
      bankAccountName: user.bankAccountName,
    }).returning();

    res.status(201).json(formatTx(tx));
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to create withdraw" });
  }
});

export default router;
