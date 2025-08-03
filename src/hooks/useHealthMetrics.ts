import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from './useProfile';
import { getHealthMetrics, generateComprehensiveHealthData } from '../lib/api';

export interface HealthMetric {
  id: string;
  metric_type: string;
  value: number;
  unit: string;
  timestamp: string;
  source: string;
}

export const useHealthMetrics = (metricType?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile && !profile.isMock) {
      fetchMetrics();
    }
  }, [user, profile, metricType]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, ensure user has connected devices
      await ensureConnectedDevices();
      
      const data = await getHealthMetrics(user!.id, metricType);
      setMetrics(data);
      setHasData(data.length > 0);
      
      // If no data exists, generate comprehensive demo data
      if (data.length === 0) {
        console.log('No health data found, generating comprehensive demo data...');
        await generateComprehensiveHealthData(user!.id);
        // Refetch after generating data
        const newData = await getHealthMetrics(user!.id, metricType);
        setMetrics(newData);
        setHasData(newData.length > 0);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ensureConnectedDevices = async () => {
    try {
      // Check if devices are already connected
      const { data: existingDevices } = await supabase
        .from('device_connections')
        .select('*')
        .eq('user_id', user!.id);

      if (!existingDevices || existingDevices.length === 0) {
        // Add Apple Watch connection
        await supabase.from('device_connections').insert({
          user_id: user!.id,
          device_type: 'wearable',
          provider: 'apple',
          device_id: 'apple-watch-series-9',
          device_name: 'Apple Watch Series 9',
          access_token: 'connected_apple_watch',
          metadata: {
            model: 'Series 9',
            features: ['heart_rate', 'steps', 'sleep', 'hrv', 'workouts'],
            battery_level: 78,
            last_sync: new Date().toISOString()
          },
          is_active: true
        });

        // Add FreeStyle Libre CGM connection
        await supabase.from('device_connections').insert({
          user_id: user!.id,
          device_type: 'cgm',
          provider: 'abbott',
          device_id: 'freestyle-libre-3',
          device_name: 'FreeStyle Libre 3',
          access_token: 'connected_freestyle_libre',
          metadata: {
            model: 'FreeStyle Libre 3',
            features: ['glucose', 'trends', 'alerts'],
            sensor_age_days: 5,
            last_sync: new Date().toISOString()
          },
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error ensuring connected devices:', error);
    }
  };

  const getLatestMetric = (type: string) => {
    return metrics
      .filter(m => m.metric_type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getMetricTrend = (type: string, days = 7) => {
    const typeMetrics = metrics
      .filter(m => m.metric_type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, days);

    if (typeMetrics.length < 2) return 0;

    const latest = typeMetrics[0].value;
    const previous = typeMetrics[typeMetrics.length - 1].value;
    
    return ((latest - previous) / previous) * 100;
  };

  return {
    metrics,
    hasData,
    loading,
    error,
    refetch: fetchMetrics,
    getLatestMetric,
    getMetricTrend,
  };
};