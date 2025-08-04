import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HealthMetrics from '../../../components/dashboard/HealthMetrics';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock hooks
vi.mock('../../../hooks/useProfile', () => ({
  useProfile: () => ({
    profile: { first_name: 'Test', last_name: 'User' },
    loading: false,
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('HealthMetrics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders health metrics correctly', async () => {
    renderWithProviders(<HealthMetrics />);
    
    await waitFor(() => {
      expect(screen.getByText('Health Metrics')).toBeInTheDocument();
    });
  });

  it('displays metric cards', async () => {
    renderWithProviders(<HealthMetrics />);
    
    await waitFor(() => {
      expect(screen.getByText('Heart Rate')).toBeInTheDocument();
      expect(screen.getByText('HRV')).toBeInTheDocument();
      expect(screen.getByText('Sleep Score')).toBeInTheDocument();
      expect(screen.getByText('Active Calories')).toBeInTheDocument();
    });
  });

  it('shows metric values and units', async () => {
    renderWithProviders(<HealthMetrics />);
    
    await waitFor(() => {
      expect(screen.getByText('68')).toBeInTheDocument(); // Heart rate value
      expect(screen.getByText('bpm')).toBeInTheDocument(); // Heart rate unit
    });
  });

  it('displays trend indicators', async () => {
    renderWithProviders(<HealthMetrics />);
    
    await waitFor(() => {
      // Check for trend percentage indicators
      const trendElements = screen.getAllByText(/%$/);
      expect(trendElements.length).toBeGreaterThan(0);
    });
  });

  it('handles loading state gracefully', () => {
    renderWithProviders(<HealthMetrics />);
    
    // Component should render without crashing even during loading
    expect(screen.getByText('Health Metrics')).toBeInTheDocument();
  });
});