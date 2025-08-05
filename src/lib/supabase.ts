import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Some features may not work.');
  // Create a mock client to prevent crashes
  export const supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null })
    }
  } as any;
} else {
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced Database Types
export type Profile = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  onboarding_completed?: boolean;
  mobile?: string;
  onboarding_completed_at?: string;
  created_at: string;
  updated_at?: string;
};

export type UserProfile = {
  user_id: string;
  created_at: string;
  name?: string;
  age?: number;
  gender?: string;
  primary_goal?: string;
  activity_level?: string;
  wearable?: string;
  diet?: string;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  metadata?: Record<string, any>;
  created_at: string;
};

export type Supplement = {
  id: string;
  name: string;
  description: string;
  benefits?: string[];
  dosage?: string;
  price: number;
  image_url?: string;
  is_active?: boolean;
  form_type?: string;
  form_image_url?: string;
  goal?: string;
  mechanism?: string;
  evidence_summary?: string;
  source_link?: string;
  nutritional_info?: string;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  tier?: string;
  subscription_discount_percent?: number;
  use_case?: string;
  evidence_rating?: number;
  category?: string;
  created_at: string;
  updated_at?: string;
};

export type MuscleReadiness = {
  id: string;
  user_id: string;
  muscle_group: string;
  readiness_score: number;
  status: 'red' | 'amber' | 'green';
  recommendations?: string[];
  created_at: string;
};

export type NutritionData = {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  meal_time: string;
  created_at: string;
};

export type WearableMetrics = {
  id: string;
  user_id: string;
  device_type: string;
  metric_type: 'heart_rate' | 'steps' | 'sleep' | 'hrv' | 'calories' | 'glucose';
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  supplement_ids: string[];
  status: 'active' | 'paused' | 'cancelled';
  billing_cycle: 'monthly' | 'quarterly' | 'yearly';
  next_billing_date: string;
  total_amount: number;
  discount_percent: number;
  created_at: string;
  updated_at: string;
};

export type HealthGoal = {
  id: string;
  user_id: string;
  goal_type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'recovery' | 'sleep' | 'stress' | 'fertility' | 'longevity';
  target_value?: number;
  current_value?: number;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
};

// API Response Types
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

// Utility Functions
export const getSupabaseErrorMessage = (error: any): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
};

export const formatSupabaseDate = (date: string): Date => {
  return new Date(date);
};

// Database Queries
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
};

export const getSupplements = async (filters?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}) => {
  let query = supabase
    .from('supplements')
    .select('*')
    .eq('is_active', true);

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.featured) {
    query = query.eq('is_featured', true);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getWearableMetrics = async (
  userId: string,
  metricType?: string,
  limit = 100
) => {
  let query = supabase
    .from('wearable_metrics')
    .select('*')
    .eq('user_id', userId);

  if (metricType) {
    query = query.eq('metric_type', metricType);
  }

  const { data, error } = await query
    .order('timestamp', { ascending: false })
    .limit(limit);

  return { data, error };
};

export const getChatHistory = async (userId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
};