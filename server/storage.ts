import { type Customer, type Account, type Transaction, type InsertCustomer, type InsertAccount, type InsertTransaction } from "@shared/schema";


export interface IStorage {
  getCustomer(id: number): Promise<Customer | undefined>;
  getAccountsByCustomer(customerId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  getAccountByNumber(accountNumber: string): Promise<Account | undefined>;
  getTransactionsByAccount(accountId: number): Promise<Transaction[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  createAccount(account: InsertAccount): Promise<Account>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateAccountBalance(id: number, balance: string): Promise<Account>;
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer>;
  private accounts: Map<number, Account>;
  private transactions: Map<number, Transaction>;
  private currentId: number;

  constructor() {
    this.customers = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.currentId = 1;
    this.seed();
  }

  private seed() {
    const customer: Customer = {
      id: 1,
      customerNumber: "CUST-001",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 555-0100",
      createdAt: new Date()
    };
    this.customers.set(customer.id, customer);

    const account1: Account = {
      id: 1,
      customerId: 1,
      accountNumber: "ACCT-1001",
      accountType: "Checking",
      balance: "5250.00",
      currency: "USD",
      status: "Active",
      openedAt: new Date()
    };
    this.accounts.set(account1.id, account1);

    const account2: Account = {
      id: 2,
      customerId: 1,
      accountNumber: "ACCT-1002",
      accountType: "Savings",
      balance: "12000.00",
      currency: "USD",
      status: "Active",
      openedAt: new Date()
    };
    this.accounts.set(account2.id, account2);

    this.transactions.set(1, {
      id: 1,
      accountId: 1,
      type: "Deposit",
      amount: "5000.00",
      description: "Payroll Deposit",
      referenceId: "TRX-DEP-001",
      timestamp: new Date()
    });

    this.transactions.set(2, {
      id: 2,
      accountId: 1,
      type: "Deposit",
      amount: "250.00",
      description: "Refund",
      referenceId: "TRX-DEP-002",
      timestamp: new Date()
    });
    
    this.currentId = 3;
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getAccountsByCustomer(customerId: number): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(a => a.customerId === customerId);
  }

  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async getAccountByNumber(accountNumber: string): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find(a => a.accountNumber === accountNumber);
  }

  async getTransactionsByAccount(accountId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.accountId === accountId);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentId++;
    const customer: Customer = {
      ...insertCustomer,
      id,
      phone: insertCustomer.phone ?? null,
      createdAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.currentId++;
    const account: Account = {
      ...insertAccount,
      id,
      balance: "0.00",
      status: insertAccount.status ?? "Active",
      currency: insertAccount.currency ?? "USD",
      openedAt: new Date(),
    };
    this.accounts.set(id, account);
    return account;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      description: insertTransaction.description ?? null,
      referenceId: insertTransaction.referenceId ?? null,
      timestamp: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateAccountBalance(id: number, balance: string): Promise<Account> {
    const account = this.accounts.get(id);
    if (!account) throw new Error("Account not found");
    const updated = { ...account, balance };
    this.accounts.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
