import { format } from 'date-fns';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Briefcase,
  Coffee,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { type Transaction } from '@shared/schema';

const BASE_MOCK_TRANSACTIONS: Omit<Transaction, 'id' | 'accountId'>[] = [
  {
    type: 'Deposit',
    amount: '2500.00',
    description: 'Mock payroll deposit',
    referenceId: 'TRX-001',
    timestamp: new Date(),
  },
  {
    type: 'Withdrawal',
    amount: '120.50',
    description: 'Mock ATM withdrawal',
    referenceId: 'TRX-002',
    timestamp: new Date(),
  },
  {
    type: 'Transfer',
    amount: '300.00',
    description: 'Mock transfer to savings',
    referenceId: 'TRX-003',
    timestamp: new Date(),
  },
];

export default function TransactionList() {
  if (!BASE_MOCK_TRANSACTIONS.length) {
    return (
      <div className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          No recent transactions
        </h3>
        <p className="text-muted-foreground mt-1">Your activity will appear here.</p>
      </div>
    );
  }

  // Helper to pick an icon based on description
  const getIcon = (type: string, desc?: string | null) => {
    const d = desc?.toLowerCase() || '';
    if (type === 'Transfer') return <ArrowUpRight className="w-5 h-5 text-blue-500" />;
    if (type === 'Deposit') return <ArrowDownLeft className="w-5 h-5 text-emerald-500" />;
    if (d.includes('coffee') || d.includes('starbucks'))
      return <Coffee className="w-5 h-5 text-amber-500" />;
    if (d.includes('grocery') || d.includes('market'))
      return <ShoppingBag className="w-5 h-5 text-purple-500" />;
    return <Briefcase className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="divide-y divide-border">
        {BASE_MOCK_TRANSACTIONS.map((tx, index) => {
          const isPositive = tx.type === 'Deposit';
          const amount = Number(tx.amount);

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 sm:px-6 hover:bg-secondary/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isPositive ? 'bg-emerald-500/10' : 'bg-secondary'
                  } group-hover:scale-110 transition-transform duration-300`}
                >
                  {getIcon(tx.type, tx.description)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{tx.description || tx.type}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tx.timestamp ? format(new Date(tx.timestamp), 'MMM dd, h:mm a') : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${isPositive ? 'text-emerald-500' : 'text-foreground'}`}
                >
                  {isPositive ? '+' : '-'}${Math.abs(amount).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ref: {tx.referenceId?.slice(0, 8) || 'N/A'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
