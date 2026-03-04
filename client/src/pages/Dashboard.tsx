import { useCustomer, useAccounts, useTransactions } from '@/hooks/use-banking';
import Layout from '@/components/Layout';
import AccountCard from '@/components/AccountCard';
import TransactionList from '@/components/TransactionList';
import { Activity, TrendingUp, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Account } from '@shared/schema';
import { FormattedMessage } from 'react-intl';

const mockAccounts: Account[] = [
  {
    id: 1,
    customerId: 1,
    accountNumber: '1234567890123456',
    accountType: 'Checking',
    balance: '2500.50',
    currency: 'USD',
    status: 'Active',
    openedAt: new Date(),
  },
  {
    id: 2,
    customerId: 1,
    accountNumber: '9876543210987654',
    accountType: 'Savings',
    balance: '12000.00',
    currency: 'USD',
    status: 'Active',
    openedAt: new Date(),
  },
];

export default function Dashboard() {
  const { isLoading: loadingCustomer } = useCustomer();
  const { data: accounts, isLoading: loadingAccounts } = useAccounts();

  const primaryAccount = accounts?.[0];
  const { isLoading: loadingTx } = useTransactions(primaryAccount?.id);

  const displayAccounts = (accounts && accounts.length > 0 ? accounts : mockAccounts).slice(0, 3);

  if (loadingCustomer || loadingAccounts) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <p className="text-muted-foreground">
              <FormattedMessage id="dashboard.greeting" />
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1">
              <FormattedMessage id="dashboard.greeting.user" />
            </h2>
          </div>
          <div className="bg-card px-6 py-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <FormattedMessage id="dashboard.portfolio.label" />
              </p>
              <p className="font-display text-2xl font-bold text-foreground">
                <FormattedMessage id="dashboard.portfolio.value" />
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              labelId: 'dashboard.income.label',
              valueId: 'dashboard.income.value',
              icon: TrendingUp,
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
            },
            {
              labelId: 'dashboard.spending.label',
              valueId: 'dashboard.spending.value',
              icon: Activity,
              color: 'text-blue-500',
              bg: 'bg-blue-500/10',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center md:flex-row flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id={stat.labelId} />
                </p>
              </div>
              <p className={`font-semibold text-xl md:text-lg ${stat.color}`}>
                <FormattedMessage id={stat.valueId} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Accounts Overview */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-xl font-bold text-foreground">
              <FormattedMessage id="dashboard.accounts.title" />
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAccounts.map((account, i) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <AccountCard
                  account={account}
                  variant={i === 0 ? 'primary' : i === 1 ? 'secondary' : 'default'}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-xl font-bold text-foreground">
              <FormattedMessage id="dashboard.activity.title" />
            </h3>
          </div>

          {loadingTx ? (
            <div className="bg-card h-48 rounded-2xl border border-border animate-pulse" />
          ) : (
            <TransactionList />
          )}
        </section>
      </div>
    </Layout>
  );
}
