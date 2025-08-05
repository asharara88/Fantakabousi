import React from 'react';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import LandingPage from './components/landing/LandingPage';
import AuthForms from './components/auth/AuthForms';
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

  // Show dashboard if user is authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Biowell!</h1>
          <p className="text-muted-foreground mb-6">Your wellness dashboard is loading...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-2">Health Metrics</h2>
              <p className="text-muted-foreground">Track your vital signs and health data</p>
            </div>
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-2">AI Coach</h2>
              <p className="text-muted-foreground">Get personalized health guidance</p>
            </div>
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-2">Nutrition</h2>
              <p className="text-muted-foreground">Log your meals and track nutrition</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return <LandingPage onShowAuth={() => {}} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;