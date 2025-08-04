import React from 'react';
import { useEffect } from 'react';
import { errorHandler } from './lib/errorHandler';
import { cacheManager } from './lib/cacheManager';
import { performanceMonitor } from './lib/performanceMonitor';
import { memoryManager } from './lib/memoryManager';
import { BugFixManager } from './lib/bugFixes';
import { preloadCriticalResources } from './lib/bundleOptimizer';
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
  
  useEffect(() => {
    // Initialize all performance and error management systems
    try {
      // Apply bug fixes
      BugFixManager.applyAllFixes();
      
      // Preload critical resources
      preloadCriticalResources();
      
      // Initialize performance monitoring
      performanceMonitor.measureAsyncOperation('app_initialization', async () => {
        console.log('App initialization complete');
      });
      
      // Set up periodic cache cleanup
      const cleanupInterval = setInterval(() => {
        const cacheStats = cacheManager.getStats();
        const memoryStats = memoryManager.getMemoryStats();
        
        // Trigger cleanup if memory usage is high
        if (cacheStats.memoryUsage > 30 * 1024 * 1024 || 
            (memoryStats && memoryStats.usagePercentage > 75)) {
          console.log('Performing cache cleanup due to memory usage');
          memoryManager.forceCleanup();
        }
      }, 60 * 1000); // Every minute
      
      // Performance monitoring interval
      const perfInterval = setInterval(() => {
        const avgRenderTime = performanceMonitor.getAverageMetric('component_render', 60000);
        if (avgRenderTime > 100) { // 100ms average render time threshold
          console.warn(`High average render time: ${avgRenderTime.toFixed(2)}ms`);
        }
      }, 30 * 1000); // Every 30 seconds
      
      return () => {
        clearInterval(cleanupInterval);
        clearInterval(perfInterval);
      };
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error('App initialization failed'),
        { component: 'App', action: 'initialization' }
      );
    }
  }, []);

  // Monitor app-level performance
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      performanceMonitor.measureComponentRender('AppContent', () => endTime - startTime);
    };
  });

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
  useEffect(() => {
    // Global error handling setup
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorHandler.handleError(
        new Error(event.reason?.message || 'Unhandled promise rejection'),
        { component: 'App', action: 'unhandled_rejection' }
      );
    };

    const handleError = (event: ErrorEvent) => {
      errorHandler.handleError(
        new Error(event.message || 'Global error'),
        { 
          component: 'App', 
          action: 'global_error',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        }
      );
    };
  return (
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
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

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
export default App;