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