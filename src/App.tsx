import React from 'react';
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/Toaster';
import LazyWrapper from './components/ui/LazyWrapper';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy load components for better performance
const LandingPage = lazy(() => import('./components/landing/LandingPage'));
const AuthForms = lazy(() => import('./components/auth/AuthForms'));
const UnifiedHealthDashboard = lazy(() => import('./components/dashboard/UnifiedHealthDashboard'));
const OnboardingFlow = lazy(() => import('./components/onboarding/OnboardingFlow'));

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <LoadingSpinner size="xl" />
          <p className="text-muted-foreground">Loading Biowell...</p>
        </motion.div>
      </div>
    );
  }

  // Show onboarding if user exists but hasn't completed onboarding
  if (user && profile && !profile.onboarding_completed) {
    return (
      <LazyWrapper name="Onboarding">
        <OnboardingFlow onComplete={() => window.location.reload()} />
      </LazyWrapper>
    );
  }

  // Show main dashboard if user is authenticated and onboarded
  if (user) {
    return (
      <LazyWrapper name="Dashboard">
        <UnifiedHealthDashboard />
      </LazyWrapper>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <LazyWrapper name="Landing Page">
      <LandingPage onShowAuth={() => {}} />
    </LazyWrapper>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;