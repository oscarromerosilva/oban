import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // GET /api/customers/:id
  app.get(api.customers.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid customer ID" });
      }
      const customer = await storage.getCustomer(id);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/customers/:customerId/accounts
  app.get(api.accounts.listByCustomer.path, async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      if (isNaN(customerId)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }
      const customerAccounts = await storage.getAccountsByCustomer(customerId);
      res.json(customerAccounts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/accounts/:id
  app.get(api.accounts.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid account ID" });
      }
      const account = await storage.getAccount(id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/accounts/:accountId/transactions
  app.get(api.transactions.listByAccount.path, async (req, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      if (isNaN(accountId)) {
        return res.status(400).json({ message: "Invalid account ID" });
      }
      const accountTransactions = await storage.getTransactionsByAccount(accountId);
      res.json(accountTransactions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/transactions/transfer
  app.post(api.transactions.transfer.path, async (req, res) => {
    try {
      const input = api.transactions.transfer.input.parse(req.body);
      
      const fromAccount = await storage.getAccount(input.fromAccountId);
      if (!fromAccount) {
        return res.status(400).json({ message: "Source account not found" });
      }

      if (parseFloat(fromAccount.balance) < input.amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const toAccount = await storage.getAccountByNumber(input.toAccountNumber);
      if (!toAccount) {
        return res.status(400).json({ message: "Destination account not found" });
      }

      // Perform transfer
      const newFromBalance = (parseFloat(fromAccount.balance) - input.amount).toFixed(2);
      const newToBalance = (parseFloat(toAccount.balance) + input.amount).toFixed(2);

      await storage.updateAccountBalance(fromAccount.id, newFromBalance);
      await storage.updateAccountBalance(toAccount.id, newToBalance);

      const transaction = await storage.createTransaction({
        accountId: fromAccount.id,
        type: "Transfer",
        amount: input.amount.toString(),
        description: input.description || `Transfer to ${toAccount.accountNumber}`,
        referenceId: `TRX-${Date.now()}`
      });

      // Also create incoming transaction for destination account
      await storage.createTransaction({
        accountId: toAccount.id,
        type: "Deposit",
        amount: input.amount.toString(),
        description: `Transfer from ${fromAccount.accountNumber}`,
        referenceId: transaction.referenceId
      });

      res.json({ message: "Transfer successful", transactionId: transaction.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data function is now handled by MemStorage constructor
  // seedDatabase().catch(console.error);

  return httpServer;
}
