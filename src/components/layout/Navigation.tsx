import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MobileCard } from '../ui/MobileOptimized';
import { 
  MoonIcon, 
  BoltIcon, 
  HeartIcon, 
  FireIcon,
  ScaleIcon,
  ClockIcon,
  BeakerIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const MetricsGrid: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const metrics = [
    {
      id: 'sleep',
      name: 'Sleep Score',
      value: '68',
      unit: '%',
      change: '-3%',
      trend: 'down',
      icon: MoonIcon,
      color: '#3b82f6',
      status: 'Low deep sleep',
      chart: [72, 69, 65, 71, 68, 66, 68],
      target: 85,
      details: {
        deepSleep: '45m',
        remSleep: '1h 20m',
        efficiency: '78%',
        bedtime: '11:45 PM',
        wakeTime: '6:30 AM',
        restlessness: 'High',
        weeklyAverage: '69',
        trend7d: '-5%',
        insights: [
          'Deep sleep significantly below optimal (45m vs 90m target)',
          'Late bedtime affecting sleep quality',
          'Consider sleep hygiene improvements for fertility'
        ]
      }
    },
    {
      id: 'steps',
      name: 'Daily Steps',
      value: '8,234',
      unit: '',
      change: '-12%',
      trend: 'down',
      icon: BoltIcon,
      color: '#06b6d4',
      status: 'Below target',
      chart: [9200, 8800, 7900, 8500, 8100, 8400, 8234],
      target: 10000,
      details: {
        activeMinutes: '52 min',
        distance: '6.1 km',
        calories: '312 kcal',
        floors: '8 flights',
        peakHour: '7-8 AM',
        avgPace: '13:45/km',
        weeklyTotal: '57,634',
        trend7d: '-8%',
        insights: [
          'Activity levels below target for muscle building',
          'Increase daily movement for insulin sensitivity',
          'Consider morning walks to boost metabolism'
        ]
      }
    },
    {
      id: 'heart_rate',
      name: 'Resting HR',
      value: '72',
      unit: 'bpm',
      change: '+2%',
      trend: 'up',
      icon: HeartIcon,
      color: '#ef4444',
      status: 'Elevated',
      chart: [70, 71, 73, 72, 74, 71, 72],
      target: 65,
      details: {
        maxHR: '182 bpm',
        avgHR: '78 bpm',
        hrv: '28 ms',
        zones: {
          zone1: '32 min',
          zone2: '18 min',
          zone3: '8 min',
          zone4: '3 min'
        },
        recovery: 'Poor',
        weeklyAvg: '72 bpm',
        trend7d: '+3%',
        insights: [
          'Elevated RHR may indicate stress or overtraining',
          'Low HRV suggests autonomic imbalance',
          'Focus on stress management and recovery'
        ]
      }
    },
    {
      id: 'calories',
      name: 'Calories',
      value: '2,890',
      unit: 'kcal',
      change: '+8%',
      trend: 'up',
      icon: FireIcon,
      gradient: 'from-blue-800 to-blue-900',
      description: 'Muscle building phase',
      chart: [2750, 2820, 2680, 2900, 2850, 2920, 2890],
      target: 2800,
      details: {
        bmr: '1,920 kcal',
        active: '520 kcal',
        exercise: '380 kcal',
        neat: '140 kcal',
        efficiency: 'High',
        metabolicAge: '42 years',
        weeklyAvg: '2,832 kcal',
        trend7d: '+5%',
        insights: [
          'Caloric surplus supporting muscle growth',
          'Monitor glucose response to higher intake',
          'Protein timing crucial for muscle synthesis'
        ]
      }
    },
    {
      id: 'weight',
      name: 'Weight',
      value: '90.2',
      unit: 'kg',
      change: '+0.3%',
      trend: 'up',
      icon: ScaleIcon,
      gradient: 'from-blue-500 to-blue-700',
      description: 'Lean muscle gain',
      chart: [89.8, 89.9, 90.1, 90.0, 90.3, 90.1, 90.2],
      target: 88,
      details: {
        bmi: '27.8',
        bodyFat: '18.2%',
        muscleMass: '68.4 kg',
        waterWeight: '58.3%',
        boneDensity: 'Normal',
        visceralFat: 'Moderate',
        weeklyChange: '+0.3 kg',
        trend7d: '+0.4%',
        insights: [
          'Weight gain from muscle building phase',
          'Body fat slightly elevated for fertility goals',
          'Focus on lean mass while reducing visceral fat'
        ]
      }
    },
    {
      id: 'workout',
      name: 'Workout',
      value: '75',
      unit: 'min',
      change: '+15%',
      trend: 'up',
      icon: ClockIcon,
      gradient: 'from-blue-600 to-blue-800',
      description: 'Heavy compound lifts',
      chart: [60, 65, 70, 68, 75, 72, 75],
      target: 60,
      details: {
        type: 'Compound Strength',
        intensity: 'High',
        sets: '18 sets',
        reps: '108 total',
        volume: '4,320 kg',
        restTime: '3m avg',
        weeklyTotal: '5h 30m',
        trend7d: '+12%',
        insights: [
          'Progressive overload supporting muscle growth',
          'Heavy compound movements boost testosterone',
          'Adequate rest between sets for strength gains'
        ]
      }
    },
    {
      id: 'glucose',
      name: 'Glucose',
      value: '142',
      unit: 'mg/dL',
      change: '+8%',
      trend: 'up',
      icon: BeakerIcon,
      color: '#10b981',
      status: 'High',
      chart: [138, 145, 140, 148, 142, 146, 142],
      target: 100,
      details: {
        fasting: '108 mg/dL',
        postMeal: '185 mg/dL',
        avgDaily: '142 mg/dL',
        timeInRange: '62%',
        spikes: '8 events',
        stability: 'Poor',
        weeklyAvg: '143 mg/dL',
        trend7d: '+6%',
        insights: [
          'Elevated glucose indicating insulin resistance',
          'Post-meal spikes affecting fertility hormones',
          'CGM data shows need for dietary intervention'
        ]
      }
    },
    {
      id: 'strain',
      name: 'Strain',
      value: '16.8',
      unit: '/21',
      change: '+12%',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      gradient: 'from-blue-800 to-blue-500',
      description: 'High training load',
      chart: [15.2, 16.1, 15.8, 16.5, 16.2, 17.1, 16.8],
      target: 15,
      details: {
        cardiovascular: '14.2',
        muscular: '18.4',
        recovery: '12.5 hrs',
        efficiency: 'Moderate',
        adaptation: 'Slow',
        overreaching: 'Risk',
        weeklyAvg: '16.2',
        trend7d: '+10%',
        insights: [
          'High training strain may impact recovery',
          'Extended recovery time affecting sleep',
          'Consider deload week for hormone optimization'
        ]
      }
    },
  ];

  const toggleCard = (metricId: string) => {
    setExpandedCard(expandedCard === metricId ? null : metricId);
  };

  const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end space-x-0.5 h-6 w-16">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <motion.div
              key={index}
              className="rounded-sm opacity-60 last:opacity-100"
              style={{ 
                width: '2px', 
                minWidth: '2px',
                backgroundColor: color,
                height: `${Math.max(height, 8)}%`
              }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 8)}%` }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="layout-grid grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const isExpanded = expandedCard === metric.id;
        
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`metric-card cursor-pointer ${isExpanded ? 'col-span-2' : ''}`}
            onClick={() => toggleCard(metric.id)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: metric.color }}
              >
                <metric.icon className="w-4 h-4 text-white" />
              </div>
              <div className={`status-badge ${
                metric.trend === 'up' ? 'status-warning' : 'status-success'
              }`}>
                {metric.change}
              </div>
            </div>
            
            {/* Value */}
            <div className="mb-2">
              <div className="flex items-baseline space-x-1">
                <span className="metric-value">{metric.value}</span>
                <span className="text-micro">{metric.unit}</span>
              </div>
            </div>
            
            {/* Label and Status */}
            <div className="flex items-center justify-between mb-3">
              <span className="metric-label">{metric.name}</span>
              <ChevronDownIcon 
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
              />
            </div>
            
            <div className="text-subtitle mb-3">{metric.status}</div>
            
            {/* Chart and Progress */}
            <div className="flex items-center justify-between">
              <MiniChart data={metric.chart} color={metric.color} />
              <div className="text-micro">vs {metric.target}</div>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-container mt-3">
              <div 
                className="progress-bar"
                style={{ 
                  backgroundColor: metric.color,
                  width: `${Math.min((parseInt(metric.value.replace(/,/g, '')) / metric.target) * 100, 100)}%`
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;