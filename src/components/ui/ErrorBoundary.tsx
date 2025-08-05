import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      retryCount: 0
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    this.setState({ 
      error, 
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, send to error tracking service
      console.log('Would report error to tracking service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    // Clear any cached data that might be causing issues
    try {
      // Clear component-specific cache
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('biowell-cache-') || key.startsWith('biowell-goals-')
      );
      cacheKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('Failed to clear cache key:', key);
        }
      });

      // Clear session storage
      const sessionKeys = Object.keys(sessionStorage).filter(key => 
        key.startsWith('biowell-')
      );
      sessionKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn('Failed to clear session key:', key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache during retry:', error);
    }
    
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: this.state.retryCount + 1
    });
  };

  private handleReload = () => {
    try {
      // Clear all caches before reload
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name).catch(e => 
              console.warn('Failed to delete cache:', name, e)
            );
          });
        }).catch(e => console.warn('Failed to clear caches:', e));
      }
      
      // Clear localStorage cache items
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('biowell-')) {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.warn('Failed to clear localStorage key:', key);
          }
        }
      });

      // Clear sessionStorage
      try {
        sessionStorage.clear();
      } catch (e) {
        console.warn('Failed to clear sessionStorage:', e);
      }
    } catch (error) {
      console.error('Error during cleanup before reload:', error);
    }
    
    window.location.reload();
  };

  private handleResetApp = () => {
    try {
      // Clear all app data
      localStorage.clear();
      sessionStorage.clear();
      
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      // Reset to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error during app reset:', error);
      window.location.reload();
    }
  };

  private getErrorSeverity = (error: Error): 'low' | 'medium' | 'high' => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'medium';
    }
    if (message.includes('chunk') || message.includes('loading')) {
      return 'low';
    }
    if (message.includes('supabase') || message.includes('auth')) {
      return 'medium';
    }
    
    return 'high';
  };

  private getErrorSuggestion = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Check your internet connection and try again.';
    }
    if (message.includes('chunk') || message.includes('loading')) {
      return 'This appears to be a loading issue. Refreshing should help.';
    }
    if (message.includes('supabase')) {
      return 'Database connection issue. The app will work with limited functionality.';
    }
    
    return 'An unexpected error occurred. Please try refreshing the page.';
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const severity = this.state.error ? this.getErrorSeverity(this.state.error) : 'high';
      const suggestion = this.state.error ? this.getErrorSuggestion(this.state.error) : '';
      const canRetry = this.state.retryCount < 3;

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-8 max-w-lg w-full text-center space-y-6 shadow-2xl"
          >
            {/* Error Icon */}
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto ${
              severity === 'high' ? 'bg-red-500/10' : 
              severity === 'medium' ? 'bg-amber-500/10' : 'bg-blue-500/10'
            }`}>
              <ExclamationTriangleIcon className={`w-10 h-10 ${
                severity === 'high' ? 'text-red-500' : 
                severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
              }`} />
            </div>
            
            {/* Error Message */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {severity === 'high' ? 'Something went wrong' : 
                 severity === 'medium' ? 'Connection issue' : 'Loading problem'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {suggestion}
              </p>
              
              {this.state.retryCount > 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Retry attempt: {this.state.retryCount}/3
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              )}
              
              <button
                onClick={this.handleReload}
                className="w-full px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                Refresh Page
              </button>
              
              <button
                onClick={this.handleResetApp}
                className="w-full px-6 py-3 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Reset App</span>
              </button>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mt-6">
                <summary className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  Technical Details
                </summary>
                <div className="mt-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto whitespace-pre-wrap">
                    <strong>Error:</strong> {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        <br /><br />
                        <strong>Component Stack:</strong>
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </div>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;