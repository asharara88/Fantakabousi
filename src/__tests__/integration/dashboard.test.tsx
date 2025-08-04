import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../../contexts/AuthContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import UnifiedHealthDashboard from '../../components/dashboard/UnifiedHealthDashboard';

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

vi.mock('../../hooks/useProfile', () => ({
  useProfile: () => ({
    profile: { 
      first_name: 'Test', 
      last_name: 'User',
      onboarding_completed: true 
    },
    loading: false,
    updateProfile: vi.fn()
  })
}));

vi.mock('../../hooks/useChatSessions', () => ({
  useChatSessions: () => ({
    sessions: [],
    currentSession: null,
    messages: [],
    loading: false,
    sendingMessage: false,
    createNewSession: vi.fn(),
    selectSession: vi.fn(),
    sendMessage: vi.fn()
  })
}));

const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: new Date().toISOString()
};

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

const renderDashboard = () => {
  return render(
    <ThemeProvider>
      <MockAuthProvider>
        <UnifiedHealthDashboard />
      </MockAuthProvider>
    </ThemeProvider>
  );
};

describe('UnifiedHealthDashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock user authentication
    vi.mocked(require('../../contexts/AuthContext').useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      signOut: vi.fn()
    });
  });

  it('renders dashboard with all main sections', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome back, Test/)).toBeInTheDocument();
      expect(screen.getByText('Health Metrics')).toBeInTheDocument();
      expect(screen.getByText('AI Health Insights')).toBeInTheDocument();
    });
  });

  it('handles navigation between sections', async () => {
    renderDashboard();
    
    await waitFor(() => {
      const coachButton = screen.getByLabelText(/Navigate to Coach/);
      fireEvent.click(coachButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Smart Coach')).toBeInTheDocument();
    });
  });

  it('displays health metrics correctly', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Heart Rate')).toBeInTheDocument();
      expect(screen.getByText('HRV')).toBeInTheDocument();
      expect(screen.getByText('Sleep Score')).toBeInTheDocument();
      expect(screen.getByText('Active Calories')).toBeInTheDocument();
    });
  });

  it('shows quick actions', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    });
  });

  it('handles mobile menu toggle', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderDashboard();
    
    const menuButton = screen.getByLabelText(/Open menu/);
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Close menu/)).toBeInTheDocument();
    });
  });

  it('displays user profile information', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Welcome back, Test')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
});