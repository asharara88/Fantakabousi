// Application constants

export const APP_NAME = 'Biowell';
export const APP_DESCRIPTION = 'AI-powered digital wellness coach';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const API_ENDPOINTS = {
  OPENAI_CHAT: '/openai-chat',
  NUTRITION_ANALYSIS: '/nutrition-analysis',
  ELEVENLABS_TTS: '/elevenlabs-tts',
  SPOONACULAR_RECIPES: '/spoonacular-recipes',
} as const;

// Health Metrics
export const HEALTH_METRICS = {
  HEART_RATE: 'heart_rate',
  STEPS: 'steps',
  GLUCOSE: 'glucose',
  SLEEP: 'sleep',
  ENERGY: 'energy',
  STRESS: 'stress',
  HRV: 'hrv',
} as const;

export const METRIC_UNITS = {
  [HEALTH_METRICS.HEART_RATE]: 'bpm',
  [HEALTH_METRICS.STEPS]: 'steps',
  [HEALTH_METRICS.GLUCOSE]: 'mg/dL',
  [HEALTH_METRICS.SLEEP]: '/100',
  [HEALTH_METRICS.ENERGY]: '/100',
  [HEALTH_METRICS.STRESS]: '/100',
  [HEALTH_METRICS.HRV]: 'ms',
} as const;

// Data Sources
export const DATA_SOURCES = {
  WEARABLE: 'wearable',
  CGM: 'cgm',
  MANUAL: 'manual',
  CALCULATED: 'calculated',
} as const;

// Meal Types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
} as const;

// Supplement Tiers
export const SUPPLEMENT_TIERS = {
  GREEN: 'green',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  RED: 'red',
} as const;

// Activity Levels
export const ACTIVITY_LEVELS = {
  SEDENTARY: 'sedentary',
  LIGHTLY_ACTIVE: 'lightly-active',
  MODERATELY_ACTIVE: 'moderately-active',
  VERY_ACTIVE: 'very-active',
  EXTREMELY_ACTIVE: 'extremely-active',
} as const;

// Health Goals
export const HEALTH_GOALS = {
  WEIGHT_LOSS: 'weight_loss',
  MUSCLE_BUILDING: 'muscle_building',
  INSULIN_OPTIMIZATION: 'insulin_optimization',
  FERTILITY: 'fertility',
  HEART_HEALTH: 'heart_health',
  LONGEVITY: 'longevity',
  STRESS_REDUCTION: 'stress_reduction',
  SLEEP_IMPROVEMENT: 'sleep_improvement',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  HEALTH_METRICS: 'health_metrics',
  CHAT_SESSIONS: 'chat_sessions',
  SUPPLEMENTS: 'supplements',
  FOOD_LOGS: 'food_logs',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'biowell-theme',
  AUTO_SYNC_TIME: 'biowell-auto-sync-time',
  ACCESSIBILITY_SETTINGS: 'biowell-accessibility-settings',
  ONBOARDING_COMPLETED: 'biowell-onboarding-completed',
} as const;

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  CRITICAL_TIMING: 3000, // 3 seconds
  WARNING_TIMING: 1000,  // 1 second
  MAX_MEMORY_USAGE: 150 * 1024 * 1024, // 150MB
  MAX_BUNDLE_SIZE: 2 * 1024 * 1024,    // 2MB
} as const;

// Biowell Brand Colors
export const BRAND_COLORS = {
  BLUE_LIGHT: '#48C6FF',
  BLUE_MEDIUM: '#2A7FFF',
  BLUE_DEEP: '#0026CC',
  NEON_GREEN: '#3BE6C5',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  XS: 475,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Default Values
export const DEFAULTS = {
  PAGINATION_LIMIT: 50,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  DEBOUNCE_DELAY: 300,
  RETRY_ATTEMPTS: 3,
} as const;