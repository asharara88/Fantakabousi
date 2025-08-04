import { useState, useCallback } from 'react';
import { errorHandler, AppError, ErrorContext } from '../lib/errorHandler';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
}

export const useErrorBoundary = () => {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0
  });

  const resetError = useCallback(() => {
    setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  }, []);

  const captureError = useCallback((error: Error, errorInfo?: any, context?: ErrorContext) => {
    setState(prev => ({
      hasError: true,
      error,
      errorInfo,
      retryCount: prev.retryCount + 1
    }));

    // Report to error handler
    errorHandler.handleError(error, {
      ...context,
      component: 'ErrorBoundary',
      metadata: { errorInfo, retryCount: state.retryCount }
    });
  }, [state.retryCount]);

  const retry = useCallback(() => {
    if (state.retryCount < 3) {
      resetError();
    } else {
      // Too many retries, show permanent error
      errorHandler.handleError(
        new AppError(
          'Maximum retry attempts exceeded',
          'MAX_RETRIES_EXCEEDED',
          'critical',
          { component: 'ErrorBoundary' }
        )
      );
    }
  }, [state.retryCount, resetError]);

  return {
    ...state,
    resetError,
    captureError,
    retry,
    canRetry: state.retryCount < 3
  };
};