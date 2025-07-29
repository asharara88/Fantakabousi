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
      unit: '/100',
      change: '-3%',
      trend: 'down',
      icon: MoonIcon,
      gradient: 'from-blue-500 to-blue-600',
      description: '7h 12m, low deep sleep',
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
      gradient: 'from-blue-600 to-blue-700',
      description: 'Below target',
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
      gradient: 'from-blue-700 to-blue-800',
      description: 'Elevated, stress related',
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
      gradient: 'from-blue-700 to-blue-900',
      description: 'Insulin resistance',
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

  const MiniChart: React.FC<{ data: number[]; gradient: string; target?: number }> = ({ data, gradient, target }) => {
    const max = Math.max(...data, target || 0);
    const min = Math.min(...data, target || 0);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end space-x-0.5 lg:space-x-1 h-8 lg:h-12 w-16 lg:w-24">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isLast = index === data.length - 1;
          return (
            <motion.div
              key={index}
              className={`bg-gradient-to-t ${gradient} rounded-sm ${isLast ? 'opacity-100' : 'opacity-60'}`}
              style={{ width: '2px', minWidth: '2px' }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 8)}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 box-border px-2 lg:px-0">
      {metrics.map((metric, index) => {
        const isExpanded = expandedCard === metric.id;
        
        return (
        <motion.div
          key={metric.name}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.8 }}
          className={`card-premium w-full box-border p-3 lg:p-6 cursor-pointer transition-all duration-300 ${
            isExpanded ? 'col-span-2 lg:col-span-2' : ''
          }`}
          onClick={() => toggleCard(metric.id)}
          layout
        >
          <div className="flex items-center justify-between mb-3 lg:mb-4 w-full">
            <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-gradient-to-br ${metric.gradient} shadow-lg flex-shrink-0`}>
              <metric.icon className="w-4 h-4 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="text-right flex-shrink-0">
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                metric.trend === 'up' 
                  ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
                  : 'text-blue-400 bg-blue-500/20 border border-blue-500/30'
              }`}>
                {metric.change}
              </div>
            </div>
          </div>

          <div className="w-full space-y-2 lg:space-y-3 flex flex-col">
            <div className="flex items-baseline justify-start space-x-1 w-full">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                className="text-2xl lg:text-4xl font-bold text-white flex-shrink-0"
              >
                {metric.value}
              </motion.span>
              <span className="text-xs lg:text-base text-white/60 font-semibold flex-shrink-0">
                {metric.unit}
              </span>
            </div>
            
            <div className="flex items-center justify-between w-full">
              <div className="text-sm lg:text-base font-bold text-white/90 text-left leading-tight mobile-spacing-xs">
                {metric.name}
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDownIcon className="w-4 h-4 text-white/60" />
              </motion.div>
            </div>
            
            <div className="text-xs text-white/60 w-full line-clamp-2 text-left mobile-spacing-sm">
              {metric.description}
            </div>

            {/* Mini Chart */}
            <div className="flex items-center justify-between pt-2 lg:pt-3 border-t border-white/8 w-full">
              <MiniChart data={metric.chart} gradient={metric.gradient} target={metric.target} />
              <ChartBarIcon className="w-3 h-3 lg:w-4 lg:h-4 text-white/30 flex-shrink-0" />
            </div>
          </div>

          {/* Progress indicator for specific metrics */}
          {(metric.name === 'Sleep Score' || metric.name === 'Daily Steps') && (
            <div className="mt-3 lg:mt-4 w-full">
              <div className="w-full h-1 lg:h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${metric.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: metric.name === 'Sleep Score' 
                      ? `${parseInt(metric.value)}%` 
                      : `${Math.min((parseInt(metric.value.replace(',', '')) / 10000) * 100, 100)}%`
                  }}
                  transition={{ delay: 1 + index * 0.1, duration: 1.5 }}
                />
              </div>
            </div>
          )}

          {/* Target indicator */}
          <div className="mt-2 lg:mt-3 flex items-center justify-between text-xs w-full">
            <span className="text-white/50 text-xs flex-1 text-left truncate">Target: {metric.target}{metric.unit}</span>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${
              parseFloat(metric.value.replace(',', '')) >= metric.target 
                ? 'bg-green-400' 
                : 'bg-yellow-400'
            }`}></div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10 space-y-4"
              >
                {/* Detailed Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(metric.details).slice(0, 6).map(([key, value]) => {
                    if (key === 'insights' || key === 'zones') return null;
                    return (
                      <div key={key} className="space-y-1">
                        <div className="text-xs text-white/50 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {typeof value === 'string' ? value : `${value}`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Heart Rate Zones (if applicable) */}
                {metric.details.zones && (
                  <div className="space-y-2">
                    <div className="text-xs text-white/50">Heart Rate Zones</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(metric.details.zones).map(([zone, time]) => (
                        <div key={zone} className="flex justify-between text-xs">
                          <span className="text-white/60 capitalize">{zone}</span>
                          <span className="text-white font-semibold">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weekly Trend */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/60">7-day average</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">
                      {metric.details.weeklyAvg || metric.details.weeklyTotal}
                    </span>
                    <div className={`flex items-center space-x-1 text-xs ${
                      metric.details.trend7d?.startsWith('+') ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {metric.details.trend7d?.startsWith('+') ? (
                        <ArrowTrendingUpIcon className="w-3 h-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3 h-3" />
                      )}
                      <span>{metric.details.trend7d}</span>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="space-y-2">
                  <div className="text-xs text-white/50">AI Insights</div>
                  <div className="space-y-2">
                    {metric.details.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-white/80 leading-relaxed">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
        </motion.div>
        );
      })}
    </div>
  );
};

export default MetricsGrid;