import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Home, Compass, Film, User, MessageCircle, PlusSquare, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function Layout() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();

  const isAuthenticated = !!identity;
  const currentPath = routerState.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { icon: Home, label: 'Feed', path: '/feed' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Film, label: 'Shorts', path: '/shorts' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate({ to: '/' })}>
            <img src="/assets/generated/logo.dim_200x200.png" alt="Logo" className="h-10 w-10 rounded-full" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Siddhiworld
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated && navItems.map((item) => (
              <Button
                key={item.path}
                variant={currentPath === item.path ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate({ to: item.path })}
                className="gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/upload' })}
                className="gap-2"
              >
                <PlusSquare className="h-4 w-4" />
                Upload
              </Button>
            )}
          </nav>

          <Button
            onClick={handleAuth}
            disabled={loginStatus === 'logging-in'}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
            className="gap-2"
          >
            {loginStatus === 'logging-in' ? (
              'Logging in...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
                  currentPath === item.path ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => navigate({ to: '/upload' })}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-muted-foreground transition-colors"
            >
              <PlusSquare className="h-6 w-6" />
              <span className="text-xs">Upload</span>
            </button>
          </div>
        </nav>
      )}

      {/* Footer */}
      <footer className="border-t py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025. Built with love using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
