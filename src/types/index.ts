// Core application types

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Profile {
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

export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: 'heart_rate' | 'steps' | 'glucose' | 'sleep' | 'energy' | 'stress' | 'hrv';
  value: number;
  unit: string;
  timestamp: string;
  source: 'wearable' | 'cgm' | 'manual' | 'calculated';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id?: string;
  content: string;
  role: 'user' | 'assistant';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  last_message?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface Supplement {
  id: string;
  name: string;
  description: string;
  benefits?: string[];
  dosage?: string;
  price: number;
  image_url?: string;
  is_active?: boolean;
  form_type?: string;
  category?: string;
  tier?: 'green' | 'yellow' | 'orange' | 'red';
  evidence_rating?: number;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  created_at: string;
  updated_at?: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  meal_time: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  portion_size?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  glucose_impact?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  supplement_id: string;
  quantity: number;
  created_at: string;
  updated_at?: string;
  supplement?: Supplement;
}

export interface DeviceConnection {
  id: string;
  user_id: string;
  device_type: 'wearable' | 'cgm' | 'scale';
  provider: string;
  device_id: string;
  device_name?: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  metadata?: Record<string, any>;
  last_synced?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
  };
}

// Nutrition types
export interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface NutritionAnalysis {
  nutrition: NutritionData;
  glycemicImpact: number;
  insights: {
    fertilityScore: number;
    muscleScore: number;
    insulinScore: number;
    recommendations: string[];
  };
  foodName: string;
  image?: string;
  savedToLog: boolean;
  logId?: string;
}

// Recipe types
export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  nutrition: NutritionData;
  healthTags: string[];
  fertilityScore: number;
  muscleScore: number;
  insulinScore: number;
  instructions?: Array<{
    step: number;
    instruction: string;
  }>;
  ingredients?: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
}

// Theme types
export type Theme = 'light' | 'dark' | 'auto';

// Error types
export interface AppError {
  message: string;
  code: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  timestamp: string;
}