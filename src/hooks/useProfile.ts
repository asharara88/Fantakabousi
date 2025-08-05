import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getUserProfile, updateUserProfile } from '../lib/database';
import { errorHandler } from '../lib/errorHandler';

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
      
      const profileData = await getUserProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error('Profile fetch failed'),
        { component: 'useProfile', action: 'fetchProfile', userId: user.id }
      );
      
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
        throw new AppError('User not authenticated', 'AUTH_ERROR', 'high');
      }
      
      const updatedProfile = await updateUserProfile(user.id, updates);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      errorHandler.handleError(
        error instanceof Error ? error : new Error('Profile update failed'),
        { component: 'useProfile', action: 'updateProfile', userId: user?.id }
      );
      return false;
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
};