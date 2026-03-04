import { Switch, Route, useLocation } from 'wouter';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { isAuthenticated } from '@/lib/auth';
import { IntlContext } from '@/i18n/IntlContext';
import { messages, type SupportedLocale } from '@/i18n/messages';

// Pages
import Dashboard from './pages/Dashboard';
// import Accounts from './pages/Accounts';
import Transfers from './pages/Transfers';
import Settings from './pages/Settings';
import Login from './pages/Login';

function PrivateRoute({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const authed = isAuthenticated();

  if (!authed) {
    // Redirige a /login si no está autenticado
    setLocation('/login');
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />

      <Route path="/">
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Route>

      {/* <Route path="/accounts" component={Accounts} /> */}
      <Route path="/transfers">
        <PrivateRoute>
          <Transfers />
        </PrivateRoute>
      </Route>

      <Route path="/settings">
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  const [locale, setLocale] = useState<SupportedLocale>('es');

  return (
    <QueryClientProvider client={queryClient}>
      <IntlContext.Provider value={{ locale, setLocale }}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </IntlProvider>
      </IntlContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
