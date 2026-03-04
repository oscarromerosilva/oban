import Layout from "@/components/Layout";
import { useAccounts } from "@/hooks/use-banking";
import AccountCard from "@/components/AccountCard";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function Accounts() {
  const { data: accounts, isLoading } = useAccounts();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Accounts</h2>
            <p className="text-muted-foreground mt-1">Manage your active bank accounts.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Open New Account
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-56 bg-card rounded-2xl border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts?.map((account, i) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <AccountCard 
                  account={account} 
                  variant={i === 0 ? 'primary' : i === 1 ? 'secondary' : 'default'} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
