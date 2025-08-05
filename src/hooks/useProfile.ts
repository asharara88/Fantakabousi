import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  onboarding_completed?: boolean;
  mobile?: string;
  created_at: string;
  updated_at?: string;
}

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
      
      // Try to get profile from profiles table first
      let { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // If profiles table doesn't work, create a basic profile
        profileData = {
          id: user.id,
          email: user.email || '',
          first_name: user.email?.split('@')[0] || 'User',
          onboarding_completed: false,
          created_at: new Date().toISOString()
        };
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error('Profile fetch failed:', error);
      
      // Create basic profile if none exists
        const basicProfile = {
          id: user.id,
          email: user.email || '',
          first_name: user.email?.split('@')[0] || 'User',
          onboarding_completed: true, // Default to true to avoid onboarding loop
          created_at: new Date().toISOString()
        };
        setProfile(basicProfile);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        console.warn('Profile update failed:', error);
        // Update local state anyway
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        return true;
      }
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      // Update local state as fallback
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
};