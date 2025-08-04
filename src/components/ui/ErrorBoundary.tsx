import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { errorHandler, AppError } from '../../lib/errorHandler';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report to centralized error handler
    errorHandler.handleError(
      error instanceof AppError ? error : new AppError(
        error.message,
        'COMPONENT_ERROR',
        'high',
        {
          component: 'ErrorBoundary',
          action: 'component_crash',
          metadata: {
            componentStack: errorInfo.componentStack,
            errorBoundary: true
          }
        }
      )
    );
    
    this.setState({ error, errorInfo });
  }

  private handleRetry = () => {
    // Clear any cached data that might be causing issues
    if (typeof window !== 'undefined') {
      // Clear component-specific cache
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('biowell-cache-')
      );
      cacheKeys.forEach(key => localStorage.removeItem(key));
    }
    
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center space-y-6 shadow-lg"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
              <p className="text-gray-600">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                onMouseDown={() => {
                  // Clear all caches before reload
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => caches.delete(name));
                    });
                  }
                }}
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left">
                <summary className="text-sm text-gray-600 cursor-pointer">Error Details</summary>
                <pre className="text-xs text-red-500 mt-2 p-3 bg-red-50 rounded-lg overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
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