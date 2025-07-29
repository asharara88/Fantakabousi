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
      value: '92',
      unit: '/100',
      change: '+5%',
      trend: 'up',
      icon: MoonIcon,
      gradient: 'from-blue-500 to-blue-600',
      description: '8h 23m deep sleep',
      chart: [85, 88, 90, 87, 92, 89, 92],
      target: 90,
      details: {
        deepSleep: '2h 15m',
        remSleep: '1h 45m',
        efficiency: '94%',
        bedtime: '10:30 PM',
        wakeTime: '6:53 AM',
        restlessness: 'Low',
        weeklyAverage: '89',
        trend7d: '+3%',
        insights: [
          'Excellent sleep consistency this week',
          'Deep sleep increased by 15 minutes',
          'Consider maintaining current bedtime routine'
        ]
      }
    },
    {
      id: 'steps',
      name: 'Daily Steps',
      value: '12,847',
      unit: '',
      change: '+18%',
      trend: 'up',
      icon: BoltIcon,
      gradient: 'from-blue-600 to-blue-700',
      description: 'Goal: 10,000 steps',
      chart: [8500, 9200, 10100, 11200, 12000, 11800, 12847],
      target: 10000,
      details: {
        activeMinutes: '87 min',
        distance: '9.2 km',
        calories: '456 kcal',
        floors: '12 flights',
        peakHour: '6-7 PM',
        avgPace: '12:30/km',
        weeklyTotal: '78,234',
        trend7d: '+12%',
        insights: [
          'Exceeded daily goal by 28%',
          'Most active day this week',
          'Great evening activity spike'
        ]
      }
    },
    {
      id: 'heart_rate',
      name: 'Resting HR',
      value: '58',
      unit: 'bpm',
      change: '-3%',
      trend: 'down',
      icon: HeartIcon,
      gradient: 'from-blue-700 to-blue-800',
      description: 'Excellent recovery',
      chart: [62, 61, 60, 59, 58, 59, 58],
      target: 60,
      details: {
        maxHR: '185 bpm',
        avgHR: '72 bpm',
        hrv: '42 ms',
        zones: {
          zone1: '45 min',
          zone2: '23 min',
          zone3: '12 min',
          zone4: '5 min'
        },
        recovery: 'Excellent',
        weeklyAvg: '59 bpm',
        trend7d: '-2%',
        insights: [
          'Heart rate trending lower (good)',
          'Excellent cardiovascular fitness',
          'Recovery metrics optimal'
        ]
      }
    },
    {
      id: 'calories',
      name: 'Calories',
      value: '2,341',
      unit: 'kcal',
      change: '+12%',
      trend: 'up',
      icon: FireIcon,
      gradient: 'from-blue-800 to-blue-900',
      description: 'Active metabolism',
      chart: [2100, 2200, 2150, 2300, 2250, 2400, 2341],
      target: 2200,
      details: {
        bmr: '1,680 kcal',
        active: '661 kcal',
        exercise: '456 kcal',
        neat: '205 kcal',
        efficiency: 'High',
        metabolicAge: '25 years',
        weeklyAvg: '2,198 kcal',
        trend7d: '+8%',
        insights: [
          'Metabolism running efficiently',
          'Good balance of active vs rest calories',
          'Exercise contribution optimal'
        ]
      }
    },
    {
      id: 'weight',
      name: 'Weight',
      value: '72.3',
      unit: 'kg',
      change: '-0.2%',
      trend: 'down',
      icon: ScaleIcon,
      gradient: 'from-blue-500 to-blue-700',
      description: 'Trending down',
      chart: [73.1, 72.9, 72.8, 72.6, 72.5, 72.4, 72.3],
      target: 72,
      details: {
        bmi: '22.1',
        bodyFat: '12.5%',
        muscleMass: '58.2 kg',
        waterWeight: '62.1%',
        boneDensity: 'Normal',
        visceralFat: 'Low',
        weeklyChange: '-0.4 kg',
        trend7d: '-0.6%',
        insights: [
          'Healthy weight loss trend',
          'Muscle mass maintained',
          'Body composition improving'
        ]
      }
    },
    {
      id: 'workout',
      name: 'Workout',
      value: '45',
      unit: 'min',
      change: '+8%',
      trend: 'up',
      icon: ClockIcon,
      gradient: 'from-blue-600 to-blue-800',
      description: 'Strength training',
      chart: [35, 40, 38, 42, 45, 43, 45],
      target: 40,
      details: {
        type: 'Upper Body',
        intensity: 'High',
        sets: '12 sets',
        reps: '156 total',
        volume: '2,840 kg',
        restTime: '90s avg',
        weeklyTotal: '4h 15m',
        trend7d: '+15%',
        insights: [
          'Strength gains this week',
          'Good workout consistency',
          'Progressive overload achieved'
        ]
      }
    },
    {
      id: 'glucose',
      name: 'Glucose',
      value: '95',
      unit: 'mg/dL',
      change: '-2%',
      trend: 'down',
      icon: BeakerIcon,
      gradient: 'from-blue-700 to-blue-900',
      description: 'Optimal range',
      chart: [98, 97, 96, 95, 94, 95, 95],
      target: 95,
      details: {
        fasting: '89 mg/dL',
        postMeal: '118 mg/dL',
        avgDaily: '95 mg/dL',
        timeInRange: '94%',
        spikes: '2 events',
        stability: 'Excellent',
        weeklyAvg: '96 mg/dL',
        trend7d: '-1%',
        insights: [
          'Excellent glucose control',
          'Minimal post-meal spikes',
          'Metabolic health optimal'
        ]
      }
    },
    {
      id: 'strain',
      name: 'Strain',
      value: '14.2',
      unit: '/21',
      change: '+5%',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      gradient: 'from-blue-800 to-blue-500',
      description: 'Moderate intensity',
      chart: [12.1, 13.2, 12.8, 14.1, 13.9, 14.5, 14.2],
      target: 14,
      details: {
        cardiovascular: '12.8',
        muscular: '15.6',
        recovery: '8.2 hrs',
        efficiency: 'High',
        adaptation: 'Positive',
        overreaching: 'No',
        weeklyAvg: '13.4',
        trend7d: '+8%',
        insights: [
          'Optimal training load',
          'Good strain-recovery balance',
          'Adaptation occurring well'
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