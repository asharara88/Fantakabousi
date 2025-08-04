import { toast } from '../hooks/useToast';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly context: ErrorContext;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    message: string,
    code: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.context = {
      ...context,
      timestamp: new Date().toISOString()
    };
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: AppError[] = [];
  private maxQueueSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        new AppError(
          event.reason?.message || 'Unhandled promise rejection',
          'UNHANDLED_PROMISE',
          'high',
          { 
            component: 'global',
            action: 'promise_rejection',
            metadata: { reason: event.reason }
          }
        )
      );
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(
        new AppError(
          event.message || 'JavaScript error',
          'JAVASCRIPT_ERROR',
          'high',
          {
            component: 'global',
            action: 'javascript_error',
            metadata: {
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            }
          }
        )
      );
    });
  }

  public handleError(error: Error | AppError, context?: ErrorContext): void {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(error.message, 'UNKNOWN_ERROR', 'medium', context);

    // Add to queue
    this.addToQueue(appError);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', {
        message: appError.message,
        code: appError.code,
        severity: appError.severity,
        context: appError.context,
        stack: appError.stack
      });
    }

    // Show user-friendly message based on severity
    this.showUserNotification(appError);

    // Report to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(appError);
    }
  }

  private addToQueue(error: AppError): void {
    this.errorQueue.push(error);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  private showUserNotification(error: AppError): void {
    const userMessages = {
      'NETWORK_ERROR': 'Connection issue. Please check your internet.',
      'AUTH_ERROR': 'Authentication failed. Please sign in again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'PERMISSION_ERROR': 'You don\'t have permission for this action.',
      'RATE_LIMIT_ERROR': 'Too many requests. Please wait a moment.',
      'SERVER_ERROR': 'Server issue. We\'re working to fix it.',
      'UNKNOWN_ERROR': 'Something went wrong. Please try again.'
    };

    const userMessage = userMessages[error.code as keyof typeof userMessages] || error.message;

    // Only show toast for medium+ severity errors
    if (error.severity !== 'low') {
      toast({
        title: error.severity === 'critical' ? 'Critical Error' : 'Error',
        description: userMessage,
        variant: 'destructive'
      });
    }
  }

  private async reportError(error: AppError): Promise<void> {
    try {
      // Report to external error tracking service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          code: error.code,
          severity: error.severity,
          context: error.context,
          stack: error.stack,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  public getRecentErrors(count = 10): AppError[] {
    return this.errorQueue.slice(-count);
  }

  public clearErrorQueue(): void {
    this.errorQueue = [];
  }
}

// Convenience functions
export const errorHandler = ErrorHandler.getInstance();

export const handleApiError = (error: any, context?: ErrorContext): void => {
  if (error?.response?.status === 401) {
    errorHandler.handleError(
      new AppError('Authentication required', 'AUTH_ERROR', 'high', context)
    );
  } else if (error?.response?.status === 403) {
    errorHandler.handleError(
      new AppError('Permission denied', 'PERMISSION_ERROR', 'medium', context)
    );
  } else if (error?.response?.status === 429) {
    errorHandler.handleError(
      new AppError('Rate limit exceeded', 'RATE_LIMIT_ERROR', 'medium', context)
    );
  } else if (error?.response?.status >= 500) {
    errorHandler.handleError(
      new AppError('Server error', 'SERVER_ERROR', 'high', context)
    );
  } else if (error?.code === 'NETWORK_ERROR') {
    errorHandler.handleError(
      new AppError('Network connection failed', 'NETWORK_ERROR', 'medium', context)
    );
  } else {
    errorHandler.handleError(
      new AppError(error?.message || 'Unknown error', 'UNKNOWN_ERROR', 'medium', context)
    );
  }
};

export const handleValidationError = (message: string, context?: ErrorContext): void => {
  errorHandler.handleError(
    new AppError(message, 'VALIDATION_ERROR', 'low', context)
  );
};