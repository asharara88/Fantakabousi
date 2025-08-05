import { supabase } from './supabase';
import { errorHandler, AppError } from './errorHandler';
import { performanceMonitor } from './performanceMonitor';

// User Profile Operations
export const createUserProfile = async (userId: string, profileData: any) => {
  return performanceMonitor.measureAsyncOperation('createUserProfile', async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile_signin')
        .insert([{
          id: userId,
          ...profileData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to create profile: ${error.message}`,
          'DATABASE_ERROR',
          'high',
          { component: 'Database', action: 'createUserProfile', userId }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Profile creation failed'));
      throw error;
    }
  });
};

export const getUserProfile = async (userId: string) => {
  return performanceMonitor.measureAsyncOperation('getUserProfile', async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile_signin')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is OK
        throw new AppError(
          `Failed to fetch profile: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getUserProfile', userId }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Profile fetch failed'));
      throw error;
    }
  });
};

export const updateUserProfile = async (userId: string, updates: any) => {
  return performanceMonitor.measureAsyncOperation('updateUserProfile', async () => {
    try {
      const { data, error } = await supabase
        .from('user_profile_signin')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to update profile: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'updateUserProfile', userId }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Profile update failed'));
      throw error;
    }
  });
};

// Health Metrics Operations
export const saveHealthMetric = async (metricData: {
  user_id: string;
  metric_type: string;
  value: number;
  unit: string;
  source: string;
  timestamp?: string;
  metadata?: any;
}) => {
  return performanceMonitor.measureAsyncOperation('saveHealthMetric', async () => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .insert([{
          ...metricData,
          timestamp: metricData.timestamp || new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to save health metric: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'saveHealthMetric' }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Health metric save failed'));
      throw error;
    }
  });
};

export const getHealthMetrics = async (userId: string, metricType?: string, limit = 50) => {
  return performanceMonitor.measureAsyncOperation('getHealthMetrics', async () => {
    try {
      let query = supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      const { data, error } = await query.limit(limit);
      
      if (error) {
        throw new AppError(
          `Failed to fetch health metrics: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getHealthMetrics', userId }
        );
      }
      
      return data || [];
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Health metrics fetch failed'));
      throw error;
    }
  });
};

// Chat Session Operations
export const createChatSession = async (userId: string, title?: string) => {
  return performanceMonitor.measureAsyncOperation('createChatSession', async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: userId,
          title: title || 'New Chat',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to create chat session: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'createChatSession', userId }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Chat session creation failed'));
      throw error;
    }
  });
};

export const getChatSessions = async (userId: string) => {
  return performanceMonitor.measureAsyncOperation('getChatSessions', async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        throw new AppError(
          `Failed to fetch chat sessions: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getChatSessions', userId }
        );
      }

      return data || [];
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Chat sessions fetch failed'));
      throw error;
    }
  });
};

export const getChatHistory = async (sessionId: string) => {
  return performanceMonitor.measureAsyncOperation('getChatHistory', async () => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

      if (error) {
        throw new AppError(
          `Failed to fetch chat history: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getChatHistory', sessionId }
        );
      }

      return data || [];
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Chat history fetch failed'));
      throw error;
    }
  });
};

// Food Logging Operations
export const saveFoodLog = async (foodData: {
  user_id: string;
  food_name: string;
  meal_type: string;
  portion_size?: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  glucose_impact?: number;
  notes?: string;
}) => {
  return performanceMonitor.measureAsyncOperation('saveFoodLog', async () => {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert([{
          ...foodData,
          meal_time: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to save food log: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'saveFoodLog' }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Food log save failed'));
      throw error;
    }
  });
};

export const getFoodLogs = async (userId: string, limit = 50) => {
  return performanceMonitor.measureAsyncOperation('getFoodLogs', async () => {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .order('meal_time', { ascending: false })
        .limit(limit);

      if (error) {
        throw new AppError(
          `Failed to fetch food logs: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getFoodLogs', userId }
        );
      }

      return data || [];
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Food logs fetch failed'));
      throw error;
    }
  });
};

// Supplement Operations
export const getUserSupplements = async (userId: string) => {
  return performanceMonitor.measureAsyncOperation('getUserSupplements', async () => {
    try {
      const { data, error } = await supabase
        .from('user_supplements')
        .select(`
          *,
          supplement:supplements(*)
        `)
        .eq('user_id', userId)
        .eq('subscription_active', true);

      if (error) {
        throw new AppError(
          `Failed to fetch user supplements: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getUserSupplements', userId }
        );
      }

      return data || [];
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('User supplements fetch failed'));
      throw error;
    }
  });
};

export const addSupplementToStack = async (userId: string, supplementId: string) => {
  return performanceMonitor.measureAsyncOperation('addSupplementToStack', async () => {
    try {
      const { data, error } = await supabase
        .from('user_supplements')
        .insert([{
          user_id: userId,
          supplement_id: supplementId,
          subscription_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to add supplement: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'addSupplementToStack', userId, supplementId }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Add supplement failed'));
      throw error;
    }
  });
};

export const removeSupplementFromStack = async (userId: string, supplementId: string) => {
  return performanceMonitor.measureAsyncOperation('removeSupplementFromStack', async () => {
    try {
      const { error } = await supabase
        .from('user_supplements')
        .delete()
        .eq('user_id', userId)
        .eq('supplement_id', supplementId);

      if (error) {
        throw new AppError(
          `Failed to remove supplement: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'removeSupplementFromStack', userId, supplementId }
        );
      }

      return true;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Remove supplement failed'));
      throw error;
    }
  });
};

// Cart Operations
export const getCartItems = async (userId: string) => {
  return performanceMonitor.measureAsyncOperation('getCartItems', async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          supplement:supplements(*)
        `)
        .eq('user_id', userId);

      if (error) {
        throw new AppError(
          `Failed to fetch cart items: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getCartItems', userId }
        );
      }

      return data || [];
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Cart items fetch failed'));
      throw error;
    }
  });
};

export const addToCart = async (userId: string, supplementId: string, quantity = 1) => {
  return performanceMonitor.measureAsyncOperation('addToCart', async () => {
    try {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('supplement_id', supplementId)
        .single();

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: userId,
            supplement_id: supplementId,
            quantity,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Add to cart failed'));
      throw error;
    }
  });
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  return performanceMonitor.measureAsyncOperation('updateCartItemQuantity', async () => {
    try {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
        return null;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Cart update failed'));
      throw error;
    }
  });
};

// Device Connection Operations
export const saveDeviceConnection = async (connectionData: {
  user_id: string;
  device_type: string;
  provider: string;
  device_id: string;
  device_name: string;
  access_token: string;
  metadata?: any;
}) => {
  return performanceMonitor.measureAsyncOperation('saveDeviceConnection', async () => {
    try {
      const { data, error } = await supabase
        .from('device_connections')
        .insert([{
          ...connectionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new AppError(
          `Failed to save device connection: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'saveDeviceConnection' }
        );
      }

      return data;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Device connection save failed'));
      throw error;
    }
  });
};

export const getDeviceConnections = async (userId: string) => {
  return performanceMonitor.measureAsyncOperation('getDeviceConnections', async () => {
    try {
      const { data, error } = await supabase
        .from('device_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        throw new AppError(
          `Failed to fetch device connections: ${error.message}`,
          'DATABASE_ERROR',
          'medium',
          { component: 'Database', action: 'getDeviceConnections', userId }
        );
      }

      return data || [];
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Device connections fetch failed'));
      throw error;
    }
  });
};

// Batch Health Data Generation
export const generateRealisticHealthData = async (userId: string, deviceType: 'apple-watch' | 'freestyle-libre') => {
  return performanceMonitor.measureAsyncOperation('generateRealisticHealthData', async () => {
    const now = new Date();
    const dataPoints = [];

    if (deviceType === 'apple-watch') {
      // Generate Apple Watch data for the last 14 days
      for (let i = 0; i < 14; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Heart rate data (realistic patterns)
        for (let hour = 6; hour <= 23; hour++) {
          const timestamp = new Date(date);
          timestamp.setHours(hour, Math.random() * 60);
          
          let heartRate = 62; // Healthy baseline
          
          // Circadian rhythm patterns
          if (hour >= 6 && hour <= 8) heartRate += 8; // Morning rise
          if (hour >= 9 && hour <= 11) heartRate += 12; // Active morning
          if (hour >= 12 && hour <= 14) heartRate += 5; // Post-lunch
          if (hour >= 15 && hour <= 17) heartRate += 10; // Afternoon
          if (hour >= 18 && hour <= 20) heartRate += 25; // Workout time
          if (hour >= 21 && hour <= 23) heartRate -= 5; // Evening
          
          // Weekend patterns
          const isWeekend = [0, 6].includes(date.getDay());
          if (isWeekend && hour >= 8 && hour <= 10) heartRate -= 8;
          
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
              activity: hour >= 18 && hour <= 20 ? 'workout' : 'active'
            }
          });
        }
        
        // Daily aggregated metrics
        const isWeekend = [0, 6].includes(date.getDay());
        
        // Steps
        const baseSteps = isWeekend ? 6500 : 9200;
        const variation = (Math.random() - 0.5) * 3000;
        const workoutBonus = Math.random() > 0.7 ? 2500 : 0;
        
        dataPoints.push({
          user_id: userId,
          metric_type: 'steps',
          value: Math.max(4000, Math.round(baseSteps + variation + workoutBonus)),
          unit: 'steps',
          timestamp: date.toISOString(),
          source: 'wearable',
          metadata: { device: 'Apple Watch Series 9' }
        });
        
        // Sleep score
        let sleepScore = 78;
        if (isWeekend) sleepScore += 8;
        if (i < 3) sleepScore -= 5;
        sleepScore += (Math.random() - 0.5) * 15;
        
        dataPoints.push({
          user_id: userId,
          metric_type: 'sleep',
          value: Math.max(60, Math.min(95, Math.round(sleepScore))),
          unit: '/100',
          timestamp: date.toISOString(),
          source: 'wearable',
          metadata: { device: 'Apple Watch Series 9' }
        });
        
        // HRV
        let hrvValue = 42;
        if (sleepScore > 85) hrvValue += 8;
        if (isWeekend) hrvValue += 3;
        hrvValue += (Math.random() - 0.5) * 12;
        
        dataPoints.push({
          user_id: userId,
          metric_type: 'hrv',
          value: Math.max(25, Math.min(65, Math.round(hrvValue))),
          unit: 'ms',
          timestamp: date.toISOString(),
          source: 'wearable',
          metadata: { device: 'Apple Watch Series 9' }
        });
      }
    }

    if (deviceType === 'freestyle-libre') {
      // Generate CGM data for the last 7 days (every 15 minutes)
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        for (let hour = 0; hour < 24; hour++) {
          for (let minute = 0; minute < 60; minute += 15) {
            const timestamp = new Date(date);
            timestamp.setHours(hour, minute);
            
            let baseGlucose = 98; // Slightly elevated baseline
            
            // Dawn phenomenon
            if (hour >= 4 && hour <= 8) {
              baseGlucose += 15 + Math.sin((hour - 4) * Math.PI / 4) * 10;
            }
            
            // Meal responses
            const timeSinceBreakfast = (hour - 7) * 60 + minute;
            const timeSinceLunch = (hour - 12) * 60 + minute;
            const timeSinceDinner = (hour - 19) * 60 + minute;
            
            if (timeSinceBreakfast >= 0 && timeSinceBreakfast <= 180) {
              baseGlucose += 65 * Math.exp(-timeSinceBreakfast / 90);
            }
            
            if (timeSinceLunch >= 0 && timeSinceLunch <= 210) {
              baseGlucose += 75 * Math.exp(-timeSinceLunch / 100);
            }
            
            if (timeSinceDinner >= 0 && timeSinceDinner <= 240) {
              baseGlucose += 70 * Math.exp(-timeSinceDinner / 110);
            }
            
            // Exercise effect
            if (hour >= 17 && hour <= 19 && Math.random() > 0.6) {
              baseGlucose -= 20;
            }
            
            baseGlucose += (Math.random() - 0.5) * 12;
            
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
                trend: trend
              }
            });
          }
        }
      }
    }

    // Insert data in batches
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < dataPoints.length; i += batchSize) {
      const batch = dataPoints.slice(i, i + batchSize);
      try {
        const { error } = await supabase
          .from('health_metrics')
          .insert(batch);
        
        if (error) {
          console.error('Error inserting batch:', error);
        } else {
          totalInserted += batch.length;
        }
      } catch (error) {
        console.error('Batch insert failed:', error);
      }
    }

    return totalInserted;
  });
};