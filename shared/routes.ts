import { z } from 'zod';
import { accounts, customers, transactions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  badRequest: z.object({
    message: z.string(),
  }),
};

export const api = {
  customers: {
    get: {
      method: 'GET' as const,
      path: '/api/customers/:id' as const,
      responses: {
        200: z.custom<typeof customers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  accounts: {
    listByCustomer: {
      method: 'GET' as const,
      path: '/api/customers/:customerId/accounts' as const,
      responses: {
        200: z.array(z.custom<typeof accounts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/accounts/:id' as const,
      responses: {
        200: z.custom<typeof accounts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  transactions: {
    listByAccount: {
      method: 'GET' as const,
      path: '/api/accounts/:accountId/transactions' as const,
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
    transfer: {
      method: 'POST' as const,
      path: '/api/transactions/transfer' as const,
      input: z.object({
        fromAccountId: z.coerce.number(),
        toAccountNumber: z.string(),
        amount: z.coerce.number().positive(),
        description: z.string().optional(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
          transactionId: z.number(),
        }),
        400: errorSchemas.badRequest,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
