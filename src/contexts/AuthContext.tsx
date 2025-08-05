import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { createUserProfile, getUserProfile } from '../lib/database';
import { errorHandler, AppError } from '../lib/errorHandler';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  completeOnboarding: (profileData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  completeOnboarding: async () => false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new AppError(
          error.message,
          'SIGNUP_ERROR',
          'medium',
          { component: 'Auth', action: 'signUp', email }
        );
      }

      // Create basic profile
      if (data.user) {
        try {
          await createUserProfile(data.user.id, {
            email,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            onboarding_completed: false
          });
        } catch (profileError) {
          console.error('Profile creation failed:', profileError);
          // Don't fail signup if profile creation fails
        }
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Signup failed'));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new AppError(
          error.message,
          'SIGNIN_ERROR',
          'medium',
          { component: 'Auth', action: 'signIn', email }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Signin failed'));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new AppError(
          error.message,
          'SIGNOUT_ERROR',
          'low',
          { component: 'Auth', action: 'signOut' }
        );
      }
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Signout failed'));
      throw error;
    }
  };

  const completeOnboarding = async (profileData: any) => {
    try {
      if (!user?.id) {
        throw new AppError('User not authenticated', 'AUTH_ERROR', 'high');
      }

      // Update profile with onboarding data
      await createUserProfile(user.id, {
        ...profileData,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Onboarding completion failed'));
      return false;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};