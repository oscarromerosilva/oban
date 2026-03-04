import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Transaction } from "@shared/schema";

// MOCK CONSTANT: Since this is a demo, we assume we are logged in as customer ID 1
export const CURRENT_CUSTOMER_ID = 1;

export function useCustomer() {
  return useQuery({
    queryKey: [api.customers.get.path, CURRENT_CUSTOMER_ID],
    queryFn: async () => {
      const url = buildUrl(api.customers.get.path, { id: CURRENT_CUSTOMER_ID });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch customer");
      return api.customers.get.responses[200].parse(await res.json());
    },
  });
}

export function useAccounts() {
  return useQuery({
    queryKey: [api.accounts.listByCustomer.path, CURRENT_CUSTOMER_ID],
    queryFn: async () => {
      const url = buildUrl(api.accounts.listByCustomer.path, { customerId: CURRENT_CUSTOMER_ID });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch accounts");
      return api.accounts.listByCustomer.responses[200].parse(await res.json());
    },
  });
}

export function useAccount(accountId: number) {
  return useQuery({
    queryKey: [api.accounts.get.path, accountId],
    queryFn: async () => {
      const url = buildUrl(api.accounts.get.path, { id: accountId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch account");
      return api.accounts.get.responses[200].parse(await res.json());
    },
    enabled: !!accountId,
  });
}

const BASE_MOCK_TRANSACTIONS: Omit<Transaction, "id" | "accountId">[] = [
  {
    type: "Deposit",
    amount: "2500.00",
    description: "Mock payroll deposit",
    referenceId: "TRX-001",
    timestamp: new Date(),
  },
  {
    type: "Withdrawal",
    amount: "120.50",
    description: "Mock ATM withdrawal",
    referenceId: "TRX-002",
    timestamp: new Date(),
  },
  {
    type: "Transfer",
    amount: "300.00",
    description: "Mock transfer to savings",
    referenceId: "TRX-003",
    timestamp: new Date(),
  },
];

export function useTransactions(accountId?: number) {
  return useQuery({
    queryKey: [api.transactions.listByAccount.path, accountId],
    queryFn: async () => {
      if (!accountId) return [];
      // Mocked transactions for demo purposes (reuse base data for any account)
      return BASE_MOCK_TRANSACTIONS.map((tx, index) => ({
        id: index + 1,
        accountId,
        ...tx,
      })) as Transaction[];
    },
    enabled: !!accountId,
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      fromAccountId: number;
      toAccountNumber: string;
      amount: number;
      description?: string;
    }) => {
      const validated = api.transactions.transfer.input.parse(data);
      const res = await fetch(api.transactions.transfer.path, {
        method: api.transactions.transfer.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.transactions.transfer.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Transfer failed");
      }
      return api.transactions.transfer.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant caches to trigger UI updates
      queryClient.invalidateQueries({ queryKey: [api.accounts.listByCustomer.path] });
      queryClient.invalidateQueries({ queryKey: [api.accounts.get.path, variables.fromAccountId] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.listByAccount.path, variables.fromAccountId] });
    },
  });
}
