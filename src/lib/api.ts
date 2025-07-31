import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// OpenAI Chat API
export const sendChatMessage = async (message: string, userId: string, sessionId?: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/openai-chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId,
        sessionId: sessionId || crypto.randomUUID()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

// ElevenLabs Text-to-Speech API
export const generateSpeech = async (text: string, voiceId?: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/elevenlabs-tts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voiceId: voiceId || 'EXAVITQu4vr4xnSDxMaL' // Default voice
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
};

// Spoonacular Recipe Search API
export const searchRecipes = async (params: {
  query?: string;
  diet?: string;
  intolerances?: string;
  maxReadyTime?: number;
  number?: number;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('query', params.query);
    if (params.diet) searchParams.set('diet', params.diet);
    if (params.intolerances) searchParams.set('intolerances', params.intolerances);
    if (params.maxReadyTime) searchParams.set('maxReadyTime', params.maxReadyTime.toString());
    if (params.number) searchParams.set('number', params.number.toString());

    const response = await fetch(`${SUPABASE_URL}/functions/v1/spoonacular-recipes?${searchParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

// Nutrition Analysis API
export const analyzeFood = async (foodName: string, quantity: string, userId: string) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/nutrition-analysis`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        foodName,
        quantity,
        userId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }
};

// Health Insights API
export const generateHealthInsights = async (userId: string) => {
  try {
    const { data: healthMetrics } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(50);

    const { data: foodLogs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', userId)
      .order('meal_time', { ascending: false })
      .limit(20);

    // Process data locally for insights
    const insights = processHealthData(healthMetrics || [], foodLogs || []);
    return insights;
  } catch (error) {
    console.error('Error generating health insights:', error);
    throw error;
  }
};

// Process health data for insights
const processHealthData = (healthMetrics: any[], foodLogs: any[]) => {
  const insights = [];

  // Glucose analysis for Ahmed's insulin resistance
  const glucoseMetrics = healthMetrics.filter(m => m.metric_type === 'glucose');
  if (glucoseMetrics.length > 0) {
    const avgGlucose = glucoseMetrics.reduce((sum, m) => sum + m.value, 0) / glucoseMetrics.length;
    if (avgGlucose > 140) {
      insights.push({
        type: 'warning',
        title: 'Elevated Glucose Levels',
        message: `Your average glucose is ${Math.round(avgGlucose)} mg/dL. Consider reducing refined carbs and implementing time-restricted eating.`,
        priority: 'high',
        category: 'metabolic'
      });
    }
  }

  // Sleep analysis for Ahmed's deep sleep issues
  const sleepMetrics = healthMetrics.filter(m => m.metric_type === 'sleep');
  if (sleepMetrics.length > 0) {
    const avgSleep = sleepMetrics.reduce((sum, m) => sum + m.value, 0) / sleepMetrics.length;
    if (avgSleep < 75) {
      insights.push({
        type: 'optimization',
        title: 'Sleep Quality Improvement',
        message: `Your sleep score is ${Math.round(avgSleep)}/100. Focus on sleep hygiene and consider magnesium supplementation for deeper sleep.`,
        priority: 'high',
        category: 'recovery'
      });
    }
  }

  // Food pattern analysis
  const recentMeals = foodLogs.slice(0, 10);
  const highGlycemicMeals = recentMeals.filter(meal => (meal.glucose_impact || 0) > 15);
  if (highGlycemicMeals.length > 3) {
    insights.push({
      type: 'warning',
      title: 'High Glycemic Food Pattern',
      message: `${highGlycemicMeals.length} recent meals had high glucose impact. Consider meal timing and composition adjustments.`,
      priority: 'medium',
      category: 'nutrition'
    });
  }

  return insights;
};

// Voice Chat API
export const processVoiceMessage = async (audioBlob: Blob, userId: string) => {
  try {
    // Convert speech to text (would need additional API like Whisper)
    // For now, return placeholder
    const text = "Voice processing not yet implemented";
    
    // Send to chat API
    const response = await sendChatMessage(text, userId);
    
    // Generate speech response
    const speechResponse = await generateSpeech(response.response);
    
    return {
      transcription: text,
      response: response.response,
      audioResponse: speechResponse.audioData
    };
  } catch (error) {
    console.error('Error processing voice message:', error);
    throw error;
  }
};

// Recipe Recommendations for Health Goals
export const getPersonalizedRecipes = async (userId: string) => {
  try {
    // Get user's dietary preferences and health goals
    const { data: profile } = await supabase
      .from('user_profile_signin')
      .select('*')
      .eq('id', userId)
      .single();

    // Search for recipes optimized for health goals
    const recipes = await searchRecipes({
      query: 'high protein low carb fertility muscle building',
      diet: profile?.diet_preference || '',
      intolerances: profile?.allergies?.join(',') || '',
      maxReadyTime: 45,
      number: 12
    });

    return recipes;
  } catch (error) {
    console.error('Error getting personalized recipes:', error);
    throw error;
  }
};

// Supplement Interaction Checker
export const checkSupplementInteractions = async (supplementIds: string[]) => {
  try {
    // This would integrate with a drug interaction API
    // For now, return basic compatibility info
    const interactions = supplementIds.map(id => ({
      supplementId: id,
      interactions: [],
      warnings: [],
      recommendations: []
    }));

    return { interactions, safe: true };
  } catch (error) {
    console.error('Error checking supplement interactions:', error);
    throw error;
  }
};