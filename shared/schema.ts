import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// BIAN: Party Routing / Customer Offer
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  customerNumber: text("customer_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// BIAN: Current Account
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  accountNumber: text("account_number").notNull().unique(),
  accountType: text("account_type").notNull(), // 'Checking', 'Savings'
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0.00"),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("Active"),
  openedAt: timestamp("opened_at").defaultNow(),
});

// BIAN: Payment Execution
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull(),
  type: text("type").notNull(), // 'Deposit', 'Withdrawal', 'Transfer'
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  referenceId: text("reference_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true, openedAt: true, balance: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

// API Request Types
export type TransferRequest = {
  fromAccountId: number;
  toAccountNumber: string;
  amount: number;
  description?: string;
};
