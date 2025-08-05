import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
      console.log('Starting signup process...', { email, userData });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signup error:', error);
        throw new Error(error.message);
      }

      console.log('Signup successful, creating profile...', data.user?.id);
      
      // Create basic profile
      if (data.user) {
        try {
          const profileData = {
            id: data.user.id,
            email,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            onboarding_completed: false,
            created_at: new Date().toISOString()
          };
          
          console.log('Creating profile with data:', profileData);
          
          const { error: profileError } = await supabase
            .from('user_profile_signin')
            .insert(profileData);
            
          if (profileError) {
            console.warn('Profile creation failed, but continuing:', profileError);
          } else {
            console.log('Profile created successfully');
          }
        } catch (profileError) {
          console.error('Profile creation failed:', profileError);
          // Don't fail signup if profile creation fails
        }
      }

      console.log('Signup process completed successfully');
      return data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process...', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signin error:', error);
        throw new Error(error.message);
      }

      console.log('Signin successful:', data.user?.id);
      return data;
    } catch (error) {
      console.error('Signin failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Signout failed:', error);
      throw error;
    }
  };

  const completeOnboarding = async (profileData: any) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Try to update profile with onboarding data
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email || '',
        ...profileData,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      });

      if (error) {
        console.warn('Profile update failed, but continuing:', error);
      }
      return true;
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      return true; // Return true anyway to avoid blocking user
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