import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from './components/ui/Toaster';
import { TooltipProvider } from './components/ui/Tooltip';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthForms from './components/auth/AuthForms';
import Dashboard from './components/dashboard/Dashboard';
import { registerServiceWorker, offlineManager } from './lib/offline';
import { performanceMonitor } from './lib/performance';

// Memory management
import { cacheManager } from './lib/performance';

const queryClient = new QueryClient();

// Initialize offline support and performance monitoring
if (typeof window !== 'undefined') {
  registerServiceWorker();
  offlineManager.init();
  performanceMonitor.startTime = Date.now();
  
  // Memory optimization
  cacheManager.optimize();
  
  // Set up periodic cache cleanup
  setInterval(() => {
    cacheManager.clearExpired();
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }, 300000); // Every 5 minutes
}

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <div className="text-lg font-semibold text-gray-700">Loading Biowell...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForms />;
  }

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