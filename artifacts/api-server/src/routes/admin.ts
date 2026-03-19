import { Router, type IRouter } from "express";
import { db, transactionsTable, usersTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

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

function formatTx(tx: any) {
  return {
    id: tx.id,
    userId: tx.userId,
    username: tx.username || "",
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

router.get("/users", requireAdmin, async (_req, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    res.json({ users: users.map(formatUser), total: users.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get users" });
  }
});

router.patch("/users/:id/balance", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { balance, notes } = req.body;
    if (balance === undefined || balance < 0) {
      res.status(400).json({ message: "Invalid balance" });
      return;
    }
    const [user] = await db
      .update(usersTable)
      .set({ balance: balance.toString(), updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(formatUser(user));
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to update balance" });
  }
});

router.patch("/users/:id/status", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!["active", "suspended"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }
    const [user] = await db
      .update(usersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(formatUser(user));
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to update status" });
  }
});

router.get("/transactions", requireAdmin, async (_req, res) => {
  try {
    const txs = await db
      .select({
        id: transactionsTable.id,
        userId: transactionsTable.userId,
        username: usersTable.username,
        type: transactionsTable.type,
        amount: transactionsTable.amount,
        status: transactionsTable.status,
        bankName: transactionsTable.bankName,
        bankAccount: transactionsTable.bankAccount,
        bankAccountName: transactionsTable.bankAccountName,
        paymentMethod: transactionsTable.paymentMethod,
        promoCode: transactionsTable.promoCode,
        notes: transactionsTable.notes,
        createdAt: transactionsTable.createdAt,
        updatedAt: transactionsTable.updatedAt,
      })
      .from(transactionsTable)
      .innerJoin(usersTable, eq(transactionsTable.userId, usersTable.id))
      .orderBy(desc(transactionsTable.createdAt));

    res.json({ transactions: txs.map(formatTx), total: txs.length });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get transactions" });
  }
});

router.patch("/transactions/:id/status", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const [tx] = await db
      .update(transactionsTable)
      .set({ status, notes, updatedAt: new Date() })
      .where(eq(transactionsTable.id, id))
      .returning();

    if (!tx) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    if (status === "approved") {
      const amount = parseFloat(tx.amount);
      if (tx.type === "deposit") {
        await db.execute(
          sql`UPDATE users SET balance = balance + ${amount}, updated_at = NOW() WHERE id = ${tx.userId}`
        );
      } else if (tx.type === "withdraw") {
        await db.execute(
          sql`UPDATE users SET balance = GREATEST(balance - ${amount}, 0), updated_at = NOW() WHERE id = ${tx.userId}`
        );
      }
    }

    const [user] = await db.select({ username: usersTable.username }).from(usersTable).where(eq(usersTable.id, tx.userId)).limit(1);

    res.json({
      id: tx.id,
      userId: tx.userId,
      username: user?.username || "",
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
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to update transaction" });
  }
});

export default router;
