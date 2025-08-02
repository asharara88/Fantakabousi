import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Profile } from '../lib/supabase';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.error('Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
        // Create a mock profile for development
        const mockProfile = {
          id: user.id,
          email: user.email || '',
          first_name: 'Demo',
          last_name: 'User',
          avatar_url: null,
          is_admin: false,
          onboarding_completed: true,
          mobile: null,
          onboarding_completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(mockProfile);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      setProfile(data);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Network error: Unable to connect to Supabase. Using mock profile for development.');
        // Create a mock profile when network fails
        const mockProfile = {
          id: user.id,
          email: user.email || '',
          first_name: 'Demo',
          last_name: 'User',
          avatar_url: null,
          is_admin: false,
          onboarding_completed: true,
          mobile: null,
          onboarding_completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(mockProfile);
      } else {
        console.error('Error fetching profile:', error);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
};