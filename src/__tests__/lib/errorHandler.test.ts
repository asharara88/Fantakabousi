import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandler, AppError } from '../../lib/errorHandler';

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    errorHandler = ErrorHandler.getInstance();
    errorHandler.clearErrorQueue();
  });

  describe('AppError', () => {
    it('creates error with correct properties', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 'high', {
        component: 'TestComponent'
      });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.severity).toBe('high');
      expect(error.context.component).toBe('TestComponent');
      expect(error.context.timestamp).toBeDefined();
    });

    it('defaults to medium severity', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      expect(error.severity).toBe('medium');
    });
  });

  describe('ErrorHandler', () => {
    it('handles AppError correctly', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 'high');
      errorHandler.handleError(error);

      const recentErrors = errorHandler.getRecentErrors(1);
      expect(recentErrors).toHaveLength(1);
      expect(recentErrors[0].message).toBe('Test error');
    });

    it('converts regular Error to AppError', () => {
      const error = new Error('Regular error');
      errorHandler.handleError(error);

      const recentErrors = errorHandler.getRecentErrors(1);
      expect(recentErrors).toHaveLength(1);
      expect(recentErrors[0].code).toBe('UNKNOWN_ERROR');
    });

    it('maintains error queue size limit', () => {
      // Add more errors than the limit
      for (let i = 0; i < 150; i++) {
        errorHandler.handleError(new AppError(`Error ${i}`, 'TEST_ERROR'));
      }

      const recentErrors = errorHandler.getRecentErrors(200);
      expect(recentErrors.length).toBeLessThanOrEqual(100); // Max queue size
    });

    it('clears error queue', () => {
      errorHandler.handleError(new AppError('Test error', 'TEST_ERROR'));
      expect(errorHandler.getRecentErrors()).toHaveLength(1);

      errorHandler.clearErrorQueue();
      expect(errorHandler.getRecentErrors()).toHaveLength(0);
    });
  });
});