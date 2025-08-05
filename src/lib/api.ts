import { supabase } from './supabase';
import { handleApiError, AppError } from './errorHandler';
import { apiCache } from './cacheManager';
import { performanceMonitor } from './performanceMonitor';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Chat API with proper error handling
export const sendChatMessage = async (message: string, userId: string, sessionId?: string) => {
  return performanceMonitor.measureAsyncOperation('sendChatMessage', async () => {
    const cacheKey = `chat-${userId}-${sessionId}-${message.slice(0, 50)}`;
    
    // Check cache first for identical recent messages
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 30000) { // 30 second cache
      return cached;
    }
    
    try {
      // Call OpenAI edge function
      const apiUrl = `${SUPABASE_URL}/functions/v1/openai-chat`;
      
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message,
          userId,
          sessionId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.error || `API error: ${response.status}`,
          'API_ERROR',
          'medium',
          { component: 'ChatAPI', statusCode: response.status }
        );
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new AppError('Invalid API response', 'INVALID_RESPONSE', 'medium');
      }

      const result = {
        response: data.response,
        timestamp: data.timestamp || new Date().toISOString(),
        session_id: data.session_id,
        confidence: data.confidence || 0.9
      };

      // Cache the result
      apiCache.set(cacheKey, result, 60000); // 1 minute cache
      
      return result;
    } catch (error) {
      handleApiError(error, {
        component: 'ChatAPI',
        action: 'sendMessage',
        userId,
        metadata: { sessionId, messageLength: message.length }
      });
      throw error;
    }
  });
};

// Text-to-Speech API
export const generateSpeech = async (text: string, voiceId?: string) => {
  return performanceMonitor.measureAsyncOperation('generateSpeech', async () => {
    const cacheKey = `tts-${text.slice(0, 100)}-${voiceId}`;
    
    // Check cache for identical text
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    try {
      const apiUrl = `${SUPABASE_URL}/functions/v1/elevenlabs-tts`;
      
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text,
          voiceId: voiceId || 'EXAVITQu4vr4xnSDxMaL'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.error || `TTS API error: ${response.status}`,
          'TTS_ERROR',
          'medium',
          { component: 'TTSAPI', statusCode: response.status }
        );
      }

      const data = await response.json();
      
      if (!data.audioData) {
        throw new AppError('Invalid TTS response', 'INVALID_TTS_RESPONSE', 'medium');
      }
      
      // Cache the audio data
      apiCache.set(cacheKey, data, 5 * 60 * 1000); // 5 minute cache
      
      return data;
    } catch (error) {
      handleApiError(error, {
        component: 'TTSAPI',
        action: 'generateSpeech',
        metadata: { textLength: text.length, voiceId }
      });
      throw error;
    }
  });
};

// Nutrition Analysis API
export const analyzeNutrition = async (foodName: string, quantity?: string, userId?: string, mealType?: string) => {
  return performanceMonitor.measureAsyncOperation('analyzeNutrition', async () => {
    const cacheKey = `nutrition-${foodName}-${quantity}`;
    
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    try {
      const apiUrl = `${SUPABASE_URL}/functions/v1/nutrition-analysis`;
      
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          foodName,
          quantity: quantity || '1 serving',
          userId: userId || 'anonymous',
          mealType: mealType || 'snack'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.error || `Nutrition API error: ${response.status}`,
          'NUTRITION_ERROR',
          'medium',
          { component: 'NutritionAPI', statusCode: response.status }
        );
      }

      const data = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, data, 10 * 60 * 1000); // 10 minute cache
      
      return data;
    } catch (error) {
      handleApiError(error, {
        component: 'NutritionAPI',
        action: 'analyzeNutrition',
        metadata: { foodName, quantity, userId }
      });
      throw error;
    }
  });
};

// Recipe Search API
export const searchRecipes = async (query: string, filters?: {
  diet?: string;
  intolerances?: string;
  maxReadyTime?: number;
  number?: number;
  minProtein?: number;
  maxCarbs?: number;
}) => {
  return performanceMonitor.measureAsyncOperation('searchRecipes', async () => {
    const cacheKey = `recipes-${query}-${JSON.stringify(filters)}`;
    
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    try {
      const apiUrl = new URL(`${SUPABASE_URL}/functions/v1/spoonacular-recipes`);
      apiUrl.searchParams.set('query', query);
      
      if (filters?.diet) apiUrl.searchParams.set('diet', filters.diet);
      if (filters?.intolerances) apiUrl.searchParams.set('intolerances', filters.intolerances);
      if (filters?.maxReadyTime) apiUrl.searchParams.set('maxReadyTime', filters.maxReadyTime.toString());
      if (filters?.number) apiUrl.searchParams.set('number', filters.number.toString());
      if (filters?.minProtein) apiUrl.searchParams.set('minProtein', filters.minProtein.toString());
      if (filters?.maxCarbs) apiUrl.searchParams.set('maxCarbs', filters.maxCarbs.toString());
      
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.error || `Recipe API error: ${response.status}`,
          'RECIPE_ERROR',
          'medium',
          { component: 'RecipeAPI', statusCode: response.status }
        );
      }

      const data = await response.json();
      
      // Cache the result
      apiCache.set(cacheKey, data, 15 * 60 * 1000); // 15 minute cache
      
      return data;
    } catch (error) {
      handleApiError(error, {
        component: 'RecipeAPI',
        action: 'searchRecipes',
        metadata: { query, filters }
      });
      throw error;
    }
  });
};

// Health Metrics API
export const getHealthMetrics = async (userId: string, metricType?: string) => {
  const cacheKey = `health-metrics-${userId}-${metricType || 'all'}`;
  
  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, returning mock data');
      return generateMockHealthMetrics(userId, metricType);
    }

    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query.limit(50);
    
    if (error) {
      throw new AppError(
        error.message,
        'DATABASE_ERROR',
        'medium',
        { component: 'HealthMetrics', action: 'fetch', userId }
      );
    }
    
    const result = data || [];
    
    // Cache the result
    apiCache.set(cacheKey, result, 2 * 60 * 1000); // 2 minute cache
    
    return result;
  } catch (error) {
    handleApiError(error, {
      component: 'HealthMetrics',
      action: 'fetch',
      userId,
      metadata: { metricType }
    });
    
    // Return mock data as fallback
    return generateMockHealthMetrics(userId, metricType);
  }
};

// Generate mock health metrics when Supabase is unavailable
const generateMockHealthMetrics = (userId: string, metricType?: string) => {
  const now = new Date();
  const mockData = [];
  
  const metricTypes = metricType ? [metricType] : ['heart_rate', 'steps', 'sleep', 'glucose', 'hrv'];
  
  for (const type of metricTypes) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      let value = 0;
      let unit = '';
      
      switch (type) {
        case 'heart_rate':
          value = 65 + Math.floor(Math.random() * 15);
          unit = 'bpm';
          break;
        case 'steps':
          value = 8000 + Math.floor(Math.random() * 4000);
          unit = 'steps';
          break;
        case 'sleep':
          value = 70 + Math.floor(Math.random() * 25);
          unit = '/100';
          break;
        case 'glucose':
          value = 90 + Math.floor(Math.random() * 40);
          unit = 'mg/dL';
          break;
        case 'hrv':
          value = 35 + Math.floor(Math.random() * 20);
          unit = 'ms';
          break;
      }
      
      mockData.push({
        id: `mock_${type}_${i}`,
        user_id: userId,
        metric_type: type,
        value,
        unit,
        timestamp: date.toISOString(),
        source: 'mock',
        metadata: { mock: true },
        created_at: date.toISOString()
      });
    }
  }
  
  return mockData;
};
// Food Logging API
export const logFood = async (foodData: {
  user_id: string;
  food_name: string;
  portion_size: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  glucose_impact?: number;
}) => {
  try {
    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        ...foodData,
        meal_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging food:', error);
    throw error;
  }
};

// Supplement Management API
export const getUserSupplements = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_supplements')
      .select(`
        *,
        supplement:supplements(*)
      `)
      .eq('user_id', userId)
      .eq('subscription_active', true);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user supplements:', error);
    throw error;
  }
};

export const addSupplementToStack = async (userId: string, supplementId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_supplements')
      .insert({
        user_id: userId,
        supplement_id: supplementId,
        subscription_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding supplement to stack:', error);
    throw error;
  }
};

export const removeSupplementFromStack = async (userId: string, supplementId: string) => {
  try {
    const { error } = await supabase
      .from('user_supplements')
      .delete()
      .eq('user_id', userId)
      .eq('supplement_id', supplementId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing supplement from stack:', error);
    throw error;
  }
};

// Profile Management API
export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Chat Sessions API
export const createChatSession = async (userId: string, title?: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title: title || 'New Chat',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

export const getChatSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    throw error;
  }
};

export const getChatHistory = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Generate realistic dummy health data
export const generateRealisticHealthData = async (userId: string, deviceType: 'apple-watch' | 'freestyle-libre') => {
  const now = new Date();
  const dataPoints = [];

  if (deviceType === 'apple-watch') {
    // Generate Apple Watch data for the last 14 days with realistic patterns
    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Heart rate data (every hour during wake time with realistic patterns)
      for (let hour = 6; hour <= 23; hour++) {
        const timestamp = new Date(date);
        timestamp.setHours(hour, Math.random() * 60);
        
        let heartRate = 62; // Healthy baseline for 28-year-old male
        
        // Circadian rhythm patterns
        if (hour >= 6 && hour <= 8) heartRate += 8; // Morning rise
        if (hour >= 9 && hour <= 11) heartRate += 12; // Active morning
        if (hour >= 12 && hour <= 14) heartRate += 5; // Post-lunch dip
        if (hour >= 15 && hour <= 17) heartRate += 10; // Afternoon activity
        if (hour >= 18 && hour <= 20) heartRate += 25; // Workout time
        if (hour >= 21 && hour <= 23) heartRate -= 5; // Evening wind down
        
        // Weekend vs weekday patterns
        const isWeekend = [0, 6].includes(date.getDay());
        if (isWeekend && hour >= 8 && hour <= 10) heartRate -= 8; // Sleeping in
        
        // Add natural variation
        heartRate += (Math.random() - 0.5) * 8;
        
        dataPoints.push({
          user_id: userId,
          metric_type: 'heart_rate',
          value: Math.max(55, Math.min(95, Math.round(heartRate))),
          unit: 'bpm',
          timestamp: timestamp.toISOString(),
          source: 'wearable',
          metadata: { 
            device: 'Apple Watch Series 9', 
            activity: hour >= 18 && hour <= 20 ? 'workout' : hour >= 21 ? 'recovery' : 'active',
            confidence: 0.95
          }
        });
      }
      
      // Daily steps with realistic patterns for active lifestyle
      const isWeekend = [0, 6].includes(date.getDay());
      const baseSteps = isWeekend ? 6500 : 9200; // Less on weekends
      const variation = (Math.random() - 0.5) * 3000;
      const workoutBonus = Math.random() > 0.7 ? 2500 : 0; // 30% chance of workout day
      
      dataPoints.push({
        user_id: userId,
        metric_type: 'steps',
        value: Math.max(4000, Math.round(baseSteps + variation + workoutBonus)),
        unit: 'steps',
        timestamp: date.toISOString(),
        source: 'wearable',
        metadata: { 
          device: 'Apple Watch Series 9',
          floors_climbed: Math.floor(Math.random() * 15) + 5,
          active_calories: Math.floor(Math.random() * 400) + 300
        }
      });
      
      // Sleep data with realistic patterns
      const sleepTimestamp = new Date(date);
      sleepTimestamp.setHours(8, 0); // Sleep data available in morning
      
      let sleepScore = 78; // Good baseline for healthy individual
      if (isWeekend) sleepScore += 8; // Better sleep on weekends
      if (i < 3) sleepScore -= 5; // Recent stress impact
      sleepScore += (Math.random() - 0.5) * 15; // Natural variation
      
      dataPoints.push({
        user_id: userId,
        metric_type: 'sleep',
        value: Math.max(60, Math.min(95, Math.round(sleepScore))),
        unit: '/100',
        timestamp: sleepTimestamp.toISOString(),
        source: 'wearable',
        metadata: { 
          device: 'Apple Watch Series 9',
          duration_hours: 7.2 + (Math.random() - 0.5) * 1.5,
          deep_sleep_minutes: 85 + Math.floor((Math.random() - 0.5) * 30),
          rem_sleep_minutes: 95 + Math.floor((Math.random() - 0.5) * 25),
          sleep_efficiency: 0.85 + (Math.random() - 0.5) * 0.1
        }
      });
      
      // HRV data (Heart Rate Variability)
      const hrvTimestamp = new Date(date);
      hrvTimestamp.setHours(7, 30); // Morning HRV reading
      
      let hrvValue = 42; // Good baseline for 28-year-old
      if (sleepScore > 85) hrvValue += 8; // Good sleep improves HRV
      if (isWeekend) hrvValue += 3; // Less stress on weekends
      hrvValue += (Math.random() - 0.5) * 12; // Natural variation
      
      dataPoints.push({
        user_id: userId,
        metric_type: 'hrv',
        value: Math.max(25, Math.min(65, Math.round(hrvValue))),
        unit: 'ms',
        timestamp: hrvTimestamp.toISOString(),
        source: 'wearable',
        metadata: {
          device: 'Apple Watch Series 9',
          measurement_type: 'rmssd',
          stress_level: hrvValue > 45 ? 'low' : hrvValue > 35 ? 'moderate' : 'high'
        }
      });
    }
  }

  if (deviceType === 'freestyle-libre') {
    // Generate CGM data for the last 7 days (every 15 minutes) with insulin resistance patterns
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timestamp = new Date(date);
          timestamp.setHours(hour, minute);
          
          // Realistic glucose patterns for someone with insulin resistance
          let baseGlucose = 98; // Slightly elevated baseline
          
          // Dawn phenomenon (4-8 AM)
          if (hour >= 4 && hour <= 8) {
            baseGlucose += 15 + Math.sin((hour - 4) * Math.PI / 4) * 10;
          }
          
          // Meal responses (insulin resistance = prolonged spikes)
          const timeSinceBreakfast = (hour - 7) * 60 + minute;
          const timeSinceLunch = (hour - 12) * 60 + minute;
          const timeSinceDinner = (hour - 19) * 60 + minute;
          
          // Breakfast spike (7 AM)
          if (timeSinceBreakfast >= 0 && timeSinceBreakfast <= 180) {
            const spikeIntensity = 65 * Math.exp(-timeSinceBreakfast / 90); // Slower decay due to IR
            baseGlucose += spikeIntensity;
          }
          
          // Lunch spike (12 PM)
          if (timeSinceLunch >= 0 && timeSinceLunch <= 210) {
            const spikeIntensity = 75 * Math.exp(-timeSinceLunch / 100); // Larger spike
            baseGlucose += spikeIntensity;
          }
          
          // Dinner spike (7 PM)
          if (timeSinceDinner >= 0 && timeSinceDinner <= 240) {
            const spikeIntensity = 70 * Math.exp(-timeSinceDinner / 110); // Evening spike
            baseGlucose += spikeIntensity;
          }
          
          // Exercise effect (if workout day)
          if (hour >= 17 && hour <= 19 && Math.random() > 0.6) {
            baseGlucose -= 20; // Exercise lowers glucose
          }
          
          // Add natural variation
          baseGlucose += (Math.random() - 0.5) * 12;
          
          // Determine trend
          let trend = 'stable';
          if (baseGlucose > 140) trend = 'rising';
          else if (baseGlucose < 85) trend = 'falling';
          
          dataPoints.push({
            user_id: userId,
            metric_type: 'glucose',
            value: Math.max(70, Math.min(280, Math.round(baseGlucose))),
            unit: 'mg/dL',
            timestamp: timestamp.toISOString(),
            source: 'cgm',
            metadata: { 
              device: 'FreeStyle Libre 3',
              trend: trend,
              sensor_age_days: Math.floor(i / 7) + 1,
              calibration_status: 'good'
            }
          });
        }
      }
    }
  }

  // Insert all data points in batches to avoid timeout
  const batchSize = 100;
  let totalInserted = 0;
  for (let i = 0; i < dataPoints.length; i += batchSize) {
    const batch = dataPoints.slice(i, i + batchSize);
    try {
      const { error } = await supabase
        .from('health_metrics')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting realistic data batch:', error);
        // Continue with next batch instead of throwing
      } else {
        totalInserted += batch.length;
      }
    } catch (error) {
      console.error('Batch insert failed:', error);
      // Continue processing
    }
  }

  return totalInserted;
};

// Generate comprehensive demo data for all metrics
export const generateComprehensiveHealthData = async (userId: string) => {
  // Ensure user exists in the users table first
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      // Create user record if it doesn't exist
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: 'demo@biowell.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (userError) {
        console.error('Error creating user record:', userError);
        return 0;
      }
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    return 0;
  }

  const now = new Date();
  const dataPoints = [];

  // Generate 30 days of comprehensive data
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const isWeekend = [0, 6].includes(date.getDay());
    
    // Daily aggregated metrics
    const dailyMetrics = [
      {
        metric_type: 'steps',
        value: Math.floor((isWeekend ? 7000 : 9500) + (Math.random() - 0.5) * 3000),
        unit: 'steps',
        source: 'wearable'
      },
      {
        metric_type: 'sleep',
        value: Math.floor(75 + (isWeekend ? 8 : 0) + (Math.random() - 0.5) * 20),
        unit: '/100',
        source: 'wearable'
      },
      {
        metric_type: 'energy',
        value: Math.floor(70 + (Math.random() - 0.5) * 30),
        unit: '/100',
        source: 'calculated'
      },
      {
        metric_type: 'stress',
        value: Math.floor(25 + (isWeekend ? -8 : 5) + (Math.random() - 0.5) * 20),
        unit: '/100',
        source: 'wearable'
      }
    ];
    
    dailyMetrics.forEach(metric => {
      dataPoints.push({
        user_id: userId,
        ...metric,
        timestamp: date.toISOString(),
        metadata: {
          device: 'Apple Watch Series 9',
          data_quality: 'high',
          day_type: isWeekend ? 'weekend' : 'weekday'
        }
      });
    });
  }

  // Insert comprehensive data
  const batchSize = 100;
  for (let i = 0; i < dataPoints.length; i += batchSize) {
    const batch = dataPoints.slice(i, i + batchSize);
    const { error } = await supabase
      .from('health_metrics')
      .insert(batch);
    
    if (error) {
      console.error('Error inserting comprehensive data:', error);
      throw error;
    }
  }

  return dataPoints.length;
};

// Legacy function for backward compatibility
export const generateDummyHealthData = async (userId: string, deviceType: 'apple-watch' | 'freestyle-libre') => {
  return generateRealisticHealthData(userId, deviceType);
};

// Enhanced mock data generators
export const generateMockHealthData = (userId: string) => {
  const now = new Date();
  const data = [];

  // Generate 60 days of varied health data
  for (let i = 0; i < 60; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const isWeekend = [0, 6].includes(date.getDay());
    
    // Heart rate with circadian patterns
    const baseHR = 65;
    const dailyVariation = Math.sin((i / 7) * Math.PI) * 5; // Weekly cycle
    const randomVariation = (Math.random() - 0.5) * 8;
    
    data.push({
      user_id: userId,
      metric_type: 'heart_rate',
      value: Math.round(baseHR + dailyVariation + randomVariation),
      unit: 'bpm',
      timestamp: date.toISOString(),
      source: 'wearable',
      metadata: { trend: 'improving' }
    });
    
    // Steps with lifestyle patterns
    const baseSteps = isWeekend ? 6800 : 9200;
    const seasonalVariation = Math.cos((i / 30) * Math.PI) * 1000; // Monthly cycle
    const randomSteps = (Math.random() - 0.5) * 2500;
    
    data.push({
      user_id: userId,
      metric_type: 'steps',
      value: Math.max(3000, Math.round(baseSteps + seasonalVariation + randomSteps)),
      unit: 'steps',
      timestamp: date.toISOString(),
      source: 'wearable',
      metadata: { goal_achievement: Math.random() > 0.3 }
    });
    
    // Sleep quality with patterns
    let sleepScore = 76;
    if (isWeekend) sleepScore += 6;
    if (i < 7) sleepScore += 4; // Recent improvement
    sleepScore += (Math.random() - 0.5) * 18;
    
    data.push({
      user_id: userId,
      metric_type: 'sleep',
      value: Math.max(45, Math.min(98, Math.round(sleepScore))),
      unit: '/100',
      timestamp: date.toISOString(),
      source: 'wearable',
      metadata: { 
        duration_hours: 7.1 + (Math.random() - 0.5) * 1.2,
        efficiency: 0.82 + (Math.random() - 0.5) * 0.15
      }
    });
    
    // Glucose with insulin resistance patterns
    let avgGlucose = 105; // Elevated baseline
    if (i < 14) avgGlucose -= 2; // Recent improvement
    avgGlucose += (Math.random() - 0.5) * 25;
    
    data.push({
      user_id: userId,
      metric_type: 'glucose',
      value: Math.max(80, Math.min(180, Math.round(avgGlucose))),
      unit: 'mg/dL',
      timestamp: date.toISOString(),
      source: 'cgm',
      metadata: { 
        time_in_range: 0.65 + (Math.random() - 0.5) * 0.2,
        variability: 'moderate'
      }
    });
    
    // HRV with recovery patterns
    let hrvValue = 38;
    if (sleepScore > 80) hrvValue += 6;
    if (isWeekend) hrvValue += 2;
    hrvValue += (Math.random() - 0.5) * 10;
    
    data.push({
      user_id: userId,
      metric_type: 'hrv',
      value: Math.max(20, Math.min(60, Math.round(hrvValue))),
      unit: 'ms',
      timestamp: date.toISOString(),
      source: 'wearable',
      metadata: { 
        recovery_status: hrvValue > 40 ? 'good' : 'moderate',
        measurement_quality: 'high'
      }
    });
  }

  return data;
};

// Batch insert function for large datasets
export const batchInsertHealthMetrics = async (dataPoints: any[]) => {
  const batchSize = 100;
  let insertedCount = 0;
  
  for (let i = 0; i < dataPoints.length; i += batchSize) {
    const batch = dataPoints.slice(i, i + batchSize);
    const { error } = await supabase
      .from('health_metrics')
      .insert(batch);
    
    if (error) {
      console.error('Error inserting health metrics batch:', error);
      throw error;
    }
    
    insertedCount += batch.length;
  }

  return insertedCount;
};

// Error handling utility
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.message?.includes('JWT')) {
    return 'Authentication expired. Please sign in again.';
  }
  
  if (error.message?.includes('Network')) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};