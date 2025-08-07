import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry for error monitoring
export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
        }),
      ],
      tracesSampleRate: 0.1,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Filter out non-critical errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
            return null; // Ignore this common browser quirk
          }
        }
        return event;
      },
      beforeSendTransaction(event) {
        // Sample transactions for performance monitoring
        return Math.random() < 0.1 ? event : null;
      },
    });
  }
};

// Enhanced error reporting for health data
export const reportHealthDataError = (error: Error, context: {
  userId?: string;
  component: string;
  action: string;
  healthMetric?: string;
}) => {
  Sentry.withScope((scope) => {
    scope.setTag('category', 'health_data');
    scope.setTag('component', context.component);
    scope.setTag('action', context.action);
    
    if (context.userId) {
      scope.setUser({ id: context.userId });
    }
    
    if (context.healthMetric) {
      scope.setContext('health_metric', { type: context.healthMetric });
    }
    
    scope.setLevel('error');
    Sentry.captureException(error);
  });
};

// Performance monitoring for critical health operations
export const monitorHealthOperation = <T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  return Sentry.startTransaction({
    name: operationName,
    op: 'health_operation',
  }).finish(operation);
};