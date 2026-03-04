import { ArrowUpRight, ArrowDownLeft, MoreHorizontal, CreditCard } from "lucide-react";
import { type Account } from "@shared/schema";
import { Link } from "wouter";

interface AccountCardProps {
  account: Account;
  variant?: 'primary' | 'secondary' | 'default';
}

export default function AccountCard({ account, variant = 'default' }: AccountCardProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: account.currency,
  }).format(Number(account.balance));

  // Determine styles based on variant
  let containerClasses = "p-6 rounded-2xl relative overflow-hidden transition-all duration-300 group ";
  
  if (isPrimary) {
    containerClasses += "card-gradient-1 h-full min-h-[220px]";
  } else if (isSecondary) {
    containerClasses += "card-gradient-2 h-full min-h-[220px]";
  } else {
    containerClasses += "bg-card border border-border shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/30 h-full";
  }

  // Obfuscate account number for display
  const maskedNumber = `•••• ${account.accountNumber.slice(-4)}`;

  return (
    <div className={containerClasses}>
      {/* Decorative patterns for premium cards */}
      {(isPrimary || isSecondary) && (
        <>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full border-4 border-white/10 opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full border-4 border-white/10 opacity-50" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        </>
      )}

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className={`text-sm font-medium ${isPrimary || isSecondary ? 'text-white/70' : 'text-muted-foreground'}`}>
              {account.accountType}
            </p>
            <p className={`font-mono text-sm mt-1 ${isPrimary || isSecondary ? 'text-white/90' : 'text-foreground/80'}`}>
              {maskedNumber}
            </p>
          </div>
          {isPrimary || isSecondary ? (
            <CreditCard className="w-8 h-8 text-white/50" />
          ) : (
            <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-8">
          <p className={`text-sm mb-1 ${isPrimary || isSecondary ? 'text-white/70' : 'text-muted-foreground'}`}>
            Available Balance
          </p>
          <h3 className={`font-display font-bold text-3xl tracking-tight ${isPrimary || isSecondary ? 'text-white' : 'text-foreground'}`}>
            {formattedBalance}
          </h3>
        </div>

        <div className="flex gap-2 mt-6">
          <Link 
            href={`/transfers?from=${account.id}`} 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isPrimary || isSecondary 
                ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md' 
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Send
          </Link>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isPrimary || isSecondary 
                ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Receive
          </button>
        </div>
      </div>
    </div>
  );
}
