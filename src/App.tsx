import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from './components/ui/Toaster';
import { TooltipProvider } from './components/ui/Tooltip';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useProfile } from './hooks/useProfile';
import LandingPage from './components/landing/LandingPage';
import AuthForms from './components/auth/AuthForms';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Dashboard from './components/dashboard/Dashboard';
import { registerServiceWorker, offlineManager } from './lib/offline';
import { performanceMonitor } from './lib/performance';

const queryClient = new QueryClient();

// Initialize offline support and performance monitoring
if (typeof window !== 'undefined') {
  registerServiceWorker();
  offlineManager.init();
  performanceMonitor.startTime = Date.now();
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { profile } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#48C6FF] mx-auto"></div>
          <div className="text-lg font-semibold text-foreground">Loading Biowell...</div>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show onboarding for new users
  if (user && profile && !profile.onboarding_completed) {
    return <OnboardingFlow onComplete={() => window.location.reload()} />;
  }

  // Show dashboard for authenticated users
  return <Dashboard />;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppContent />
              <Toaster />
            </AuthProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;