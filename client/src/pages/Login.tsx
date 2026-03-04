import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Landmark, Lock, User } from 'lucide-react';
import { isAuthenticated, setAccessToken } from '@/lib/auth';
import { useIntl, FormattedMessage } from 'react-intl';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const intl = useIntl();

  useEffect(() => {
    // Si ya está autenticado, manda directo al dashboard
    if (isAuthenticated()) {
      setLocation('/');
    }
  }, [setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Fake authentication delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setAccessToken('mock_access_token');
        toast({
          title: intl.formatMessage({ id: 'login.toast.success.title' }),
          description: intl.formatMessage({
            id: 'login.toast.success.description',
          }),
        });
        setLocation('/');
      } else {
        toast({
          title: intl.formatMessage({ id: 'login.toast.error.title' }),
          description: intl.formatMessage({
            id: 'login.toast.error.description',
          }),
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-none shadow-2xl bg-card/80 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-1 flex flex-col items-center pb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Landmark className="text-primary-foreground w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            <FormattedMessage id="login.title" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <FormattedMessage id="login.subtitle" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">
                <FormattedMessage id="login.username.label" />
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder={intl.formatMessage({
                    id: 'login.username.placeholder',
                  })}
                  className="pl-10 h-11"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                <FormattedMessage id="login.password.label" />
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={intl.formatMessage({
                    id: 'login.password.placeholder',
                  })}
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
              disabled={isLoading}
            >
              {isLoading ? (
                <FormattedMessage id="login.submit.loading" />
              ) : (
                <FormattedMessage id="login.submit.idle" />
              )}
            </Button>

            <div className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="login.hint.text" />{' '}
                <span className="font-mono font-bold text-red-500">
                  <FormattedMessage id="login.hint.credentials" />
                </span>{' '}
                <FormattedMessage id="login.hint.suffix" />
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
