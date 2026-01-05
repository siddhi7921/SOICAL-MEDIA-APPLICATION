import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routes';
import LoadingScreen from './components/LoadingScreen';
import ProfileSetupModal from './components/ProfileSetupModal';

const router = createRouter({ routeTree });

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  // Show loading screen during initialization
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Show profile setup modal if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        {showProfileSetup ? (
          <ProfileSetupModal />
        ) : (
          <RouterProvider router={router} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
