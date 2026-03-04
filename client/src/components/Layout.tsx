import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, ArrowRightLeft, Moon, Sun, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomer } from '@/hooks/use-banking';
import { useIsMobile } from '@/hooks/use-mobile';
import { clearAccessToken } from '@/lib/auth';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: 'Vista General', shortName: 'Inicio', path: '/', icon: LayoutDashboard },
  // { name: "Cuentas", shortName: "Cuentas", path: "/accounts", icon: CreditCard },
  { name: 'Transferencias', shortName: 'Enviar', path: '/transfers', icon: ArrowRightLeft },
];

function UserAvatar({
  customer,
  size = 'md',
  onClick,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customer: any;
  size?: 'sm' | 'md';
  onClick?: () => void;
}) {
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} rounded-full bg-gradient-to-tr from-primary/80 to-blue-500 flex items-center justify-center font-bold text-white ring-2 ring-primary/20 hover:ring-primary/40 transition-all shrink-0`}
    >
      {customer?.name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('') || 'U'}
    </button>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const { data: customer } = useCustomer();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  if (location === '/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    clearAccessToken();
    setLocation('/login');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const goToSettings = () => setLocation('/settings');

  const pageTitle =
    navItems.find((i) => i.path === location)?.name ||
    (location === '/settings' ? 'Ajustes' : 'Dashboard');

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* ── Mobile Header ── */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 glass-panel sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            oB
          </div>
          <span className="font-display font-bold text-lg">oBank</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <UserAvatar customer={customer} size="sm" onClick={goToSettings} />
        </div>
      </header>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border bg-card/50 backdrop-blur-xl p-6 relative z-10">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30">
            oB
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">oBank</span>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 relative group overflow-hidden ${
                  isActive
                    ? 'text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-primary z-0 rounded-xl shadow-lg shadow-primary/25"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 relative z-10 ${
                    isActive ? '' : 'group-hover:scale-110 transition-transform'
                  }`}
                />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile → Settings */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={goToSettings}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left ${
              location === '/settings'
                ? 'bg-primary/10 border-primary/30'
                : 'bg-secondary/50 border-border/50 hover:bg-secondary hover:border-border'
            }`}
          >
            <UserAvatar customer={customer} />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground leading-tight truncate">
                User
              </span>
              <span className="text-xs text-muted-foreground">Cliente Premium</span>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 z-10">
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div
          className={`flex-1 overflow-y-auto p-4 md:px-8 md:pb-8 z-10 ${isMobile ? 'pb-24' : ''}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="flex flex-col items-center gap-0.5 py-2 px-3 relative"
              >
                <div className="relative">
                  <item.icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.shortName}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
