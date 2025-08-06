// Enterprise-grade utility functions

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Advanced data formatting for enterprise dashboards
export const formatMetric = (value: number, type: 'currency' | 'percentage' | 'number' | 'bytes' | 'duration') => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    
    case 'percentage':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 100);
    
    case 'bytes':
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let size = value;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(1)} ${units[unitIndex]}`;
    
    case 'duration':
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = value % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    
    case 'number':
    default:
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
  }
};

// Enterprise-grade date formatting
export const formatEnterpriseDate = (date: Date | string, format: 'short' | 'medium' | 'long' | 'relative' = 'medium') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    
    case 'relative':
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
      
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    
    case 'medium':
    default:
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
};

// Enterprise color palette generator
export const generateColorPalette = (baseColor: string, steps = 9) => {
  // This would integrate with a color palette library in production
  const colors = [];
  for (let i = 0; i < steps; i++) {
    const lightness = 95 - (i * 10);
    colors.push(`hsl(${baseColor}, 100%, ${lightness}%)`);
  }
  return colors;
};

// Advanced validation utilities
export const validateBusinessEmail = (email: string): boolean => {
  const businessDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return !businessDomains.includes(domain);
};

export const validateStrongPassword = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters required');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');
  
  return {
    isValid: score >= 4,
    score,
    feedback
  };
};

// Enterprise data export utilities
export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any, filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Enterprise search and filtering
export const fuzzySearch = (items: any[], query: string, keys: string[]) => {
  if (!query) return items;
  
  const searchTerms = query.toLowerCase().split(' ');
  
  return items.filter(item => {
    return searchTerms.every(term => {
      return keys.some(key => {
        const value = getNestedValue(item, key);
        return String(value).toLowerCase().includes(term);
      });
    });
  });
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Enterprise analytics tracking
export const trackEnterpriseEvent = (eventName: string, properties: Record<string, any> = {}) => {
  // In production, this would integrate with enterprise analytics
  if (process.env.NODE_ENV === 'development') {
    console.log('Enterprise Event:', eventName, properties);
  }
  
  // Example integration points:
  // - Google Analytics 4
  // - Adobe Analytics
  // - Mixpanel
  // - Amplitude
  // - Custom enterprise analytics
};

// Enterprise error reporting
export const reportEnterpriseError = (error: Error, context: Record<string, any> = {}) => {
  // In production, integrate with enterprise error tracking
  if (process.env.NODE_ENV === 'development') {
    console.error('Enterprise Error:', error, context);
  }
  
  // Example integration points:
  // - Sentry
  // - Bugsnag
  // - Rollbar
  // - Custom enterprise logging
};

// Enterprise performance monitoring
export const measureEnterprisePerformance = <T>(
  operationName: string,
  operation: () => T | Promise<T>
): T | Promise<T> => {
  const startTime = performance.now();
  
  const result = operation();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const endTime = performance.now();
      trackEnterpriseEvent('performance_metric', {
        operation: operationName,
        duration: endTime - startTime,
        timestamp: new Date().toISOString()
      });
    });
  } else {
    const endTime = performance.now();
    trackEnterpriseEvent('performance_metric', {
      operation: operationName,
      duration: endTime - startTime,
      timestamp: new Date().toISOString()
    });
    return result;
  }
};