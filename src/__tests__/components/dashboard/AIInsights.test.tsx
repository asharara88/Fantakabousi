import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AIInsights from '../../../components/dashboard/AIInsights';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock toast hook
vi.mock('../../../hooks/useToast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockOnQuickAction = vi.fn();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('AIInsights Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders AI insights correctly', () => {
    renderWithProviders(<AIInsights onQuickAction={mockOnQuickAction} />);
    
    expect(screen.getByText('AI Health Insights')).toBeInTheDocument();
    expect(screen.getByText('Personalized recommendations from your data')).toBeInTheDocument();
  });

  it('displays insight cards', () => {
    renderWithProviders(<AIInsights onQuickAction={mockOnQuickAction} />);
    
    expect(screen.getByText('Perfect Recovery Window')).toBeInTheDocument();
    expect(screen.getByText('Supplement Timing')).toBeInTheDocument();
    expect(screen.getByText('Hydration Alert')).toBeInTheDocument();
    expect(screen.getByText('Sleep Pattern Analysis')).toBeInTheDocument();
  });

  it('shows confidence scores', () => {
    renderWithProviders(<AIInsights onQuickAction={mockOnQuickAction} />);
    
    expect(screen.getByText(/Smart Coach Confidence: \d+%/)).toBeInTheDocument();
  });

  it('handles action button clicks', async () => {
    renderWithProviders(<AIInsights onQuickAction={mockOnQuickAction} />);
    
    const coachButtons = screen.getAllByText('Smart Coach');
    fireEvent.click(coachButtons[0]);
    
    await waitFor(() => {
      expect(mockOnQuickAction).toHaveBeenCalledWith('coach');
    });
  });

  it('displays priority badges correctly', () => {
    renderWithProviders(<AIInsights onQuickAction={mockOnQuickAction} />);
    
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('shows last updated timestamp', () => {
    renderWithProviders(<AIInsights onQuickAction={mockOnQuickAction} />);
    
    expect(screen.getByText('Last updated: 2 minutes ago')).toBeInTheDocument();
  });
});