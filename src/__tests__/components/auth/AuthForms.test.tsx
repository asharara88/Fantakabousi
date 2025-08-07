import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthForms from '../../../components/auth/AuthForms';
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

// Mock auth context
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    user: null,
    loading: false,
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock theme context
vi.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    actualTheme: 'light',
  }),
  ThemeProvider: ({ children }: any) => <div>{children}</div>,
}));

// Mock toast
vi.mock('../../../hooks/useToast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const renderAuthForms = (props = {}) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <AuthForms {...props} />
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('AuthForms Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in form by default', () => {
    renderAuthForms();
    
    expect(screen.getByText('Welcome to Biowell')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('toggles between sign in and sign up', async () => {
    renderAuthForms();
    
    const signUpButton = screen.getByText('Sign Up');
    fireEvent.click(signUpButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    });
  });

  it('handles form submission for sign in', async () => {
    renderAuthForms();
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('handles form submission for sign up', async () => {
    renderAuthForms();
    
    // Switch to sign up
    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);
    
    await waitFor(() => {
      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByRole('button', { name: /create account/i });
      
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        expect.objectContaining({
          first_name: 'John'
        })
      );
    });
  });

  it('shows password visibility toggle', () => {
    renderAuthForms();
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('displays trust indicators', () => {
    renderAuthForms();
    
    expect(screen.getByText('Secure & Private')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered')).toBeInTheDocument();
    expect(screen.getByText('Evidence-Based')).toBeInTheDocument();
    expect(screen.getByText('Personalized')).toBeInTheDocument();
  });

  it('shows forgot password link for sign in', () => {
    renderAuthForms();
    
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
  });

  it('handles back button when provided', () => {
    const mockOnBack = vi.fn();
    renderAuthForms({ onBack: mockOnBack });
    
    const backButton = screen.getByText('← Back to Home');
    fireEvent.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });
});