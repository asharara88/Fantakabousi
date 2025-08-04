import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './components/layout/NavigationProvider';
import AccessibilityProvider from './components/ui/AccessibilityProvider';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { Toaster } from './components/ui/Toaster';
import { useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import UnifiedHealthDashboard from './components/dashboard/UnifiedHealthDashboard';
import LandingPage from './components/landing/LandingPage';
import AuthForms from './components/auth/AuthForms';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import LoadingSpinner from './components/ui/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Show onboarding if user exists but hasn't completed onboarding
  if (user && profile && !profile.onboarding_completed) {
    return (
      <OnboardingFlow 
        onComplete={() => window.location.reload()} 
      />
    );
  }

  // Show dashboard if user is authenticated
  if (user) {
    return <UnifiedHealthDashboard />;
  }

  // Show landing page for unauthenticated users
  return <LandingPage onShowAuth={() => {}} />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <NavigationProvider>
              <AppContent />
              <Toaster />
            </NavigationProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;