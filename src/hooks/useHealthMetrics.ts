import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear metrics data when component unmounts
      setMetrics([]);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [user, metricType]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
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