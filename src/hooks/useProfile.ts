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
  age?: number;
  gender?: string;
  height?: any;
  weight?: any;
  activity_level?: string;
  primary_health_goals?: string[];
  health_concerns?: string[];
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
      
      const { data: profileData, error } = await supabase
        .from('user_profile_signin')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error('Profile fetch failed:', error);
      
      // Create basic profile if none exists
      try {
        const basicProfile = {
          id: user.id,
          email: user.email || '',
          first_name: 'User',
          onboarding_completed: false,
          created_at: new Date().toISOString()
        };
        setProfile(basicProfile);
      } catch (fallbackError) {
        console.error('Failed to create fallback profile:', fallbackError);
      }
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
        .from('user_profile_signin')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
};