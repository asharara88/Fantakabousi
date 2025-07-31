import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Chat API with proper error handling
export const sendChatMessage = async (message: string, userId: string, sessionId?: string) => {
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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.response;

    // Save to chat history
    if (sessionId && userId) {
      await supabase.from('chat_history').insert([
        {
          user_id: userId,
          session_id: sessionId,
          message: message,
          response: aiResponse,
          role: 'user',
          timestamp: new Date().toISOString()
        },
        {
          user_id: userId,
          session_id: sessionId,
          message: aiResponse,
          response: aiResponse,
          role: 'assistant',
          timestamp: new Date().toISOString()
        }
      ]);
    }

    return {
      response: aiResponse,
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

// Text-to-Speech API
export const generateSpeech = async (text: string, voiceId?: string) => {
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
        voiceId: voiceId || 'EXAVITQu4vr4xnSDxMaL' // Default voice
      })
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech. Please try again.');
  }
};

// Health Metrics API
export const getHealthMetrics = async (userId: string, metricType?: string) => {
  try {
    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query.limit(50);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    throw error;
  }
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
export const generateDummyHealthData = async (userId: string, deviceType: 'apple-watch' | 'freestyle-libre') => {
  const now = new Date();
  const dataPoints = [];

  if (deviceType === 'apple-watch') {
    // Generate Apple Watch data for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Heart rate data (every 2 hours during wake time)
      for (let hour = 6; hour <= 23; hour += 2) {
        const timestamp = new Date(date);
        timestamp.setHours(hour, Math.random() * 60);
        
        let heartRate = 65; // Base resting HR
        if (hour >= 7 && hour <= 9) heartRate += 15; // Morning activity
        if (hour >= 17 && hour <= 19) heartRate += 20; // Evening workout
        heartRate += (Math.random() - 0.5) * 10; // Natural variation
        
        dataPoints.push({
          user_id: userId,
          metric_type: 'heart_rate',
          value: Math.max(50, Math.min(100, Math.round(heartRate))),
          unit: 'bpm',
          timestamp: timestamp.toISOString(),
          source: 'wearable',
          metadata: { device: 'Apple Watch', activity: hour >= 17 && hour <= 19 ? 'workout' : 'rest' }
        });
      }
      
      // Daily steps (realistic pattern)
      const baseSteps = 8000;
      const variation = (Math.random() - 0.5) * 4000;
      const weekendMultiplier = [0, 6].includes(date.getDay()) ? 0.7 : 1; // Less steps on weekends
      
      dataPoints.push({
        user_id: userId,
        metric_type: 'steps',
        value: Math.max(3000, Math.round((baseSteps + variation) * weekendMultiplier)),
        unit: 'steps',
        timestamp: date.toISOString(),
        source: 'wearable',
        metadata: { device: 'Apple Watch' }
      });
      
      // Sleep score (based on realistic sleep patterns)
      const sleepTimestamp = new Date(date);
      sleepTimestamp.setHours(7, 0); // Sleep data available in morning
      
      let sleepScore = 75; // Base score
      if ([0, 6].includes(date.getDay())) sleepScore += 10; // Better sleep on weekends
      sleepScore += (Math.random() - 0.5) * 20; // Natural variation
      
      dataPoints.push({
        user_id: userId,
        metric_type: 'sleep',
        value: Math.max(40, Math.min(100, Math.round(sleepScore))),
        unit: 'score',
        timestamp: sleepTimestamp.toISOString(),
        source: 'wearable',
        metadata: { 
          device: 'Apple Watch',
          duration: '7h 23m',
          deep_sleep: '1h 45m',
          rem_sleep: '1h 30m'
        }
      });
    }
  }

  if (deviceType === 'freestyle-libre') {
    // Generate CGM data for the last 3 days (every 15 minutes)
    for (let i = 0; i < 3; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timestamp = new Date(date);
          timestamp.setHours(hour, minute);
          
          // Realistic glucose patterns for someone with insulin resistance
          let baseGlucose = 95; // Slightly elevated baseline
          
          // Meal spikes
          if (hour >= 7 && hour <= 9) {
            // Breakfast spike
            const timeSinceMeal = (hour - 7) * 60 + minute;
            if (timeSinceMeal <= 120) {
              baseGlucose = 95 + (50 * Math.exp(-timeSinceMeal / 60)); // Spike and decay
            }
          } else if (hour >= 12 && hour <= 15) {
            // Lunch spike
            const timeSinceMeal = (hour - 12) * 60 + minute;
            if (timeSinceMeal <= 180) {
              baseGlucose = 95 + (60 * Math.exp(-timeSinceMeal / 80)); // Larger spike
            }
          } else if (hour >= 18 && hour <= 21) {
            // Dinner spike
            const timeSinceMeal = (hour - 18) * 60 + minute;
            if (timeSinceMeal <= 180) {
              baseGlucose = 95 + (55 * Math.exp(-timeSinceMeal / 75));
            }
          }
          
          // Dawn phenomenon (early morning rise)
          if (hour >= 4 && hour <= 7) {
            baseGlucose += 10;
          }
          
          // Add natural variation
          baseGlucose += (Math.random() - 0.5) * 15;
          
          dataPoints.push({
            user_id: userId,
            metric_type: 'glucose',
            value: Math.max(70, Math.min(250, Math.round(baseGlucose))),
            unit: 'mg/dL',
            timestamp: timestamp.toISOString(),
            source: 'cgm',
            metadata: { 
              device: 'FreeStyle Libre',
              trend: Math.random() > 0.5 ? 'stable' : Math.random() > 0.5 ? 'rising' : 'falling'
            }
          });
        }
      }
    }
  }

  // Insert all data points in batches to avoid timeout
  const batchSize = 100;
  for (let i = 0; i < dataPoints.length; i += batchSize) {
    const batch = dataPoints.slice(i, i + batchSize);
    const { error } = await supabase
      .from('health_metrics')
      .insert(batch);
    
    if (error) {
      console.error('Error inserting dummy data batch:', error);
      throw error;
    }
  }

  return dataPoints.length;
};

// Mock data generators for demo
export const generateMockHealthData = (userId: string) => {
  const metrics = ['heart_rate', 'steps', 'sleep', 'glucose', 'hrv'];
  const data = [];

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    metrics.forEach(metric => {
      let value = 0;
      let unit = '';

      switch (metric) {
        case 'heart_rate':
          value = 60 + Math.random() * 20;
          unit = 'bpm';
          break;
        case 'steps':
          value = 5000 + Math.random() * 8000;
          unit = 'steps';
          break;
        case 'sleep':
          value = 60 + Math.random() * 40;
          unit = 'score';
          break;
        case 'glucose':
          value = 80 + Math.random() * 60;
          unit = 'mg/dL';
          break;
        case 'hrv':
          value = 20 + Math.random() * 40;
          unit = 'ms';
          break;
      }

      data.push({
        user_id: userId,
        metric_type: metric,
        value: Math.round(value),
        unit,
        timestamp: date.toISOString(),
        source: 'demo',
      });
    });
  }

  return data;
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