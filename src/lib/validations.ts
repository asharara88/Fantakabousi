import { z } from 'zod';

// User validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().optional(),
  mobile: z.string().optional(),
  age: z.number().min(13).max(120).optional(),
  height: z.number().min(50).max(300).optional(),
  weight: z.number().min(20).max(300).optional(),
  activity_level: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active']).optional(),
});

// Health metrics validation
export const healthMetricSchema = z.object({
  user_id: z.string().uuid(),
  metric_type: z.enum(['heart_rate', 'steps', 'glucose', 'sleep', 'energy', 'stress', 'hrv']),
  value: z.number().min(0),
  unit: z.string(),
  source: z.enum(['wearable', 'cgm', 'manual', 'calculated']),
  timestamp: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

// Food logging validation
export const foodLogSchema = z.object({
  user_id: z.string().uuid(),
  food_name: z.string().min(1, 'Food name is required'),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  portion_size: z.string().optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbohydrates: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  glucose_impact: z.number().optional(),
  notes: z.string().optional(),
});

// Chat message validation
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  userId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
});

// Nutrition analysis validation
export const nutritionAnalysisSchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  quantity: z.string().optional(),
  userId: z.string().uuid(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
});

// Text-to-speech validation
export const ttsSchema = z.object({
  text: z.string().min(1, 'Text is required').max(1000, 'Text too long'),
  voiceId: z.string().optional(),
  settings: z.object({
    stability: z.number().min(0).max(1).optional(),
    similarity_boost: z.number().min(0).max(1).optional(),
    style: z.number().min(0).max(1).optional(),
    use_speaker_boost: z.boolean().optional(),
  }).optional(),
});

// Recipe search validation
export const recipeSearchSchema = z.object({
  query: z.string().optional(),
  diet: z.string().optional(),
  intolerances: z.string().optional(),
  maxReadyTime: z.number().min(5).max(180).optional(),
  number: z.number().min(1).max(50).optional(),
  minProtein: z.number().min(0).optional(),
  maxCarbs: z.number().min(0).optional(),
});

// Device connection validation
export const deviceConnectionSchema = z.object({
  user_id: z.string().uuid(),
  device_type: z.enum(['wearable', 'cgm', 'scale']),
  provider: z.string(),
  device_id: z.string(),
  device_name: z.string().optional(),
  access_token: z.string(),
  refresh_token: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const validatePassword = (password: string): boolean => {
  return z.string().min(8).safeParse(password).success;
};

export const validateUUID = (id: string): boolean => {
  return z.string().uuid().safeParse(id).success;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateHealthMetricValue = (metricType: string, value: number): boolean => {
  const ranges = {
    heart_rate: { min: 30, max: 220 },
    steps: { min: 0, max: 100000 },
    glucose: { min: 40, max: 400 },
    sleep: { min: 0, max: 100 },
    energy: { min: 0, max: 100 },
    stress: { min: 0, max: 100 },
    hrv: { min: 10, max: 100 },
  };

  const range = ranges[metricType as keyof typeof ranges];
  return range ? value >= range.min && value <= range.max : true;
};