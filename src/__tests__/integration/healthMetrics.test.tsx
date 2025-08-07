import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HealthMetrics from '../../components/dashboard/HealthMetrics';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';

// Mock all external dependencies
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      }))
    }))
  }
}));

vi.mock('../../lib/api', () => ({
  getHealthMetrics: vi.fn(() => Promise.resolve([
    {
      id: '1',
      metric_type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      timestamp: new Date().toISOString(),
      source: 'wearable'
    }
  ])),
  generateRealisticHealthData: vi.fn(() => Promise.resolve(100))
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com'
};

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    actualTheme: 'light',
  }),
  ThemeProvider: ({ children }: any) => <div>{children}</div>,
}));

const renderHealthMetrics = () => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <HealthMetrics />
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('HealthMetrics Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders health metrics dashboard', async () => {
    renderHealthMetrics();
    
    await waitFor(() => {
      expect(screen.getByText('Health Metrics')).toBeInTheDocument();
      expect(screen.getByText('Real-time health monitoring and analysis')).toBeInTheDocument();
    });
  });

  it('displays metric cards with values', async () => {
    renderHealthMetrics();
    
    await waitFor(() => {
      expect(screen.getByText('Resting Heart Rate')).toBeInTheDocument();
      expect(screen.getByText('Heart Rate Variability')).toBeInTheDocument();
      expect(screen.getByText('Sleep Quality')).toBeInTheDocument();
    });
  });

  it('shows live monitoring indicator', async () => {
    renderHealthMetrics();
    
    await waitFor(() => {
      expect(screen.getByText('Live monitoring')).toBeInTheDocument();
    });
  });

  it('handles time range selection', async () => {
    renderHealthMetrics();
    
    const timeRangeSelect = screen.getByDisplayValue('Last 7 days');
    fireEvent.change(timeRangeSelect, { target: { value: '30d' } });
    
    expect(timeRangeSelect).toHaveValue('30d');
  });

  it('displays health insights panel', async () => {
    renderHealthMetrics();
    
    await waitFor(() => {
      expect(screen.getByText('Health Insights')).toBeInTheDocument();
      expect(screen.getByText('Personalized recommendations from your data')).toBeInTheDocument();
    });
  });

  it('shows overall health score', async () => {
    renderHealthMetrics();
    
    await waitFor(() => {
      expect(screen.getByText('Overall Health Score')).toBeInTheDocument();
      expect(screen.getByText('94')).toBeInTheDocument();
    });
  });

  it('handles metric card interactions', async () => {
    renderHealthMetrics();
    
    await waitFor(() => {
      const heartRateCard = screen.getByText('Resting Heart Rate').closest('div');
      if (heartRateCard) {
        fireEvent.click(heartRateCard);
        // Should expand with additional details
      }
    });
  });
});