import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Overview from '../../../components/dashboard/Overview';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: any) => <div>{children}</div>,
  };
});

// Mock auth context
vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    loading: false,
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock theme context
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    actualTheme: 'light',
  }),
  ThemeProvider: ({ children }: any) => <div>{children}</div>,
}));

const renderOverview = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Overview />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Overview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome message', () => {
    renderOverview();
    expect(screen.getByText(/Good morning!/)).toBeInTheDocument();
  });

  it('displays health metrics', () => {
    renderOverview();
    
    expect(screen.getByText('Resting Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('Heart Rate Variability')).toBeInTheDocument();
    expect(screen.getByText('Sleep Quality')).toBeInTheDocument();
    expect(screen.getByText('Energy Level')).toBeInTheDocument();
  });

  it('shows metric values and units', () => {
    renderOverview();
    
    expect(screen.getByText('68')).toBeInTheDocument();
    expect(screen.getByText('bpm')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('ms')).toBeInTheDocument();
  });

  it('displays AI insights section', () => {
    renderOverview();
    
    expect(screen.getByText('AI Health Insights')).toBeInTheDocument();
    expect(screen.getByText('Personalized recommendations from your data')).toBeInTheDocument();
  });

  it('shows quick action buttons', () => {
    renderOverview();
    
    expect(screen.getByText('Log Food')).toBeInTheDocument();
    expect(screen.getByText('Ask Coach')).toBeInTheDocument();
    expect(screen.getByText('View Analytics')).toBeInTheDocument();
    expect(screen.getByText('Browse Supplements')).toBeInTheDocument();
  });

  it('handles navigation clicks', async () => {
    renderOverview();
    
    const logFoodButton = screen.getByText('Log Food');
    fireEvent.click(logFoodButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/nutrition');
    });
  });

  it('displays trend indicators', () => {
    renderOverview();
    
    // Check for percentage trend indicators
    expect(screen.getByText('3%')).toBeInTheDocument(); // Heart rate trend
    expect(screen.getByText('8%')).toBeInTheDocument(); // HRV trend
  });

  it('shows confidence scores in insights', () => {
    renderOverview();
    
    expect(screen.getByText('96%')).toBeInTheDocument(); // Confidence score
    expect(screen.getByText('94%')).toBeInTheDocument(); // Another confidence score
  });
});