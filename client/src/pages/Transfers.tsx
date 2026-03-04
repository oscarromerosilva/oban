import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAccounts, useTransfer } from '@/hooks/use-banking';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntl, FormattedMessage } from 'react-intl';

export default function Transfers() {
  const intl = useIntl();
  const searchParams = new URLSearchParams(window.location.search);
  const defaultFrom = searchParams.get('from');

  const { data: accounts } = useAccounts();
  const transferMutation = useTransfer();

  const [fromAccountId, setFromAccountId] = useState(defaultFrom || '');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default account when accounts load if not set via URL
  useEffect(() => {
    if (accounts && accounts.length > 0 && !fromAccountId) {
      setFromAccountId(accounts[0].id.toString());
    }
  }, [accounts, fromAccountId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fromAccountId || !toAccountNumber || !amount) {
      setError(intl.formatMessage({ id: 'transfers.error.required' }));
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(intl.formatMessage({ id: 'transfers.error.amount' }));
      return;
    }

    // Check balance
    const selectedAccount = accounts?.find((a) => a.id.toString() === fromAccountId);
    if (selectedAccount && numAmount > parseFloat(selectedAccount.balance)) {
      setError(intl.formatMessage({ id: 'transfers.error.insufficient' }));
      return;
    }

    transferMutation.mutate(
      {
        fromAccountId: parseInt(fromAccountId),
        toAccountNumber,
        amount: numAmount,
        description: description || 'Transfer',
      },
      {
        onSuccess: () => {
          setSuccess(true);
          // Reset form except fromAccount
          setToAccountNumber('');
          setAmount('');
          setDescription('');

          // Auto hide success after 5s
          setTimeout(() => setSuccess(false), 5000);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          setError(
            err.message || intl.formatMessage({ id: 'transfers.error.generic' })
          );
        },
      }
    );
  };

  return (
    <Layout>
      <div className=" mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            <FormattedMessage id="transfers.title" />
          </h2>
          <p className="text-muted-foreground mt-1">
            <FormattedMessage id="transfers.subtitle" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">
                        <FormattedMessage id="transfers.success.title" />
                      </p>
                      <p className="text-xs mt-1 opacity-90">
                        <FormattedMessage id="transfers.success.description" />
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* From Account */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    <FormattedMessage id="transfers.fromAccount.label" />
                  </label>
                  <select
                    value={fromAccountId}
                    onChange={(e) => setFromAccountId(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                  >
                    <option value="" disabled>
                      {intl.formatMessage({ id: 'transfers.fromAccount.placeholder' })}
                    </option>
                    {accounts?.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountType} (•••• {acc.accountNumber.slice(-4)}) - Available: $
                        {parseFloat(acc.balance).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Account */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    <FormattedMessage id="transfers.toAccount.label" />
                  </label>
                  <input
                    type="text"
                    value={toAccountNumber}
                    onChange={(e) => setToAccountNumber(e.target.value)}
                    placeholder={intl.formatMessage({
                      id: 'transfers.toAccount.placeholder',
                    })}
                    className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    <FormattedMessage id="transfers.amount.label" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-lg">
                      {intl.formatMessage({ id: 'transfers.amount.currencySymbol' })}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={intl.formatMessage({
                        id: 'transfers.amount.placeholder',
                      })}
                      className="w-full pl-8 pr-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-display text-lg"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    <FormattedMessage id="transfers.note.label" />
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={intl.formatMessage({
                      id: 'transfers.note.placeholder',
                    })}
                    className="w-full px-4 py-3.5 rounded-xl bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={transferMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                >
                  {transferMutation.isPending ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <FormattedMessage id="transfers.submit.idle" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Side */}
          <div className="space-y-6">
            <div className="bg-card/50 rounded-2xl border border-border p-6 text-sm">
              <h4 className="font-display font-bold text-foreground mb-3">
                <FormattedMessage id="transfers.limits.title" />
              </h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex justify-between">
                  <span>
                    <FormattedMessage id="transfers.limits.daily" />
                  </span>{' '}
                  <span className="font-medium text-foreground">
                    <FormattedMessage id="transfers.limits.daily.value" />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>
                    <FormattedMessage id="transfers.limits.perTx" />
                  </span>{' '}
                  <span className="font-medium text-foreground">
                    <FormattedMessage id="transfers.limits.perTx.value" />
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>
                    <FormattedMessage id="transfers.limits.fee" />
                  </span>{' '}
                  <span className="font-medium text-emerald-500">
                    <FormattedMessage id="transfers.limits.fee.value" />
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
              <h4 className="font-display font-bold text-primary mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />{' '}
                <span>
                  <FormattedMessage id="transfers.security.title" />
                </span>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <FormattedMessage id="transfers.security.description" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
