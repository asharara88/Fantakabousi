import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { 
  MoonIcon,
  SunIcon,
  ClockIcon,
  ChartBarIcon,
  BeakerIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

interface SleepOptimizationProps {
  onQuickAction?: (action: string) => void;
}

const SleepOptimization: React.FC<SleepOptimizationProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('overview');
  const [bedtimeCountdown, setBedtimeCountdown] = useState('');
  const [sleepScore, setSleepScore] = useState(68);

  const tabs = [
    { id: 'overview', label: 'Sleep Overview', icon: ChartBarIcon },
    { id: 'optimization', label: 'Optimization', icon: SparklesIcon },
    { id: 'schedule', label: 'Sleep Schedule', icon: ClockIcon },
    { id: 'environment', label: 'Environment', icon: MoonIcon },
  ];

  const sleepMetrics = [
    { label: 'Sleep Score', value: sleepScore, unit: '/100', target: 85, color: 'from-indigo-500 to-purple-600' },
    { label: 'Duration', value: 7.2, unit: 'hours', target: 8, color: 'from-blue-500 to-cyan-600' },
    { label: 'Deep Sleep', value: 1.8, unit: 'hours', target: 2, color: 'from-purple-500 to-indigo-600' },
    { label: 'REM Sleep', value: 1.5, unit: 'hours', target: 1.5, color: 'from-pink-500 to-rose-600' }
  ];

  const handleSupplementShortcut = (products: string[], category: string) => {
    onQuickAction?.('supplements');
    
    toast({
      title: `🛒 ${products.join(' or ')} Available`,
      description: `Premium ${category} supplements for better sleep`,
      action: {
        label: "Shop Now",
        onClick: () => onQuickAction?.('supplements')
      }
    });
  };

  const sleepOptimizations = [
    {
      id: 'magnesium',
      title: 'Magnesium Supplementation',
      description: 'Take 400mg magnesium glycinate 30 minutes before bed for deeper sleep.',
      priority: 'high',
      impact: 'High',
      color: 'from-green-500 to-emerald-600',
      supplementShortcut: {
        products: ['Magnesium Glycinate', 'ZMA'],
        category: 'sleep'
      }
    },
    {
      id: 'blue-light',
      title: 'Blue Light Blocking',
      description: 'Use blue light blocking glasses 2 hours before bedtime.',
      priority: 'medium',
      impact: 'Medium',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'temperature',
      title: 'Room Temperature',
      description: 'Keep bedroom between 65-68°F (18-20°C) for optimal sleep.',
      priority: 'medium',
      impact: 'Medium',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'melatonin',
      title: 'Melatonin Timing',
      description: 'Take 0.5-1mg melatonin 90 minutes before desired sleep time.',
      priority: 'low',
      impact: 'Low',
      color: 'from-purple-500 to-indigo-600',
      supplementShortcut: {
        products: ['Melatonin', 'Sleep Stack'],
        category: 'sleep'
      }
    }
  ];

  const sleepSchedule = {
    bedtime: '22:30',
    wakeTime: '06:30',
    windDownStart: '21:00',
    lastCaffeine: '14:00',
    lastMeal: '19:30'
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const bedtime = new Date();
      const [hour, minute] = sleepSchedule.bedtime.split(':').map(Number);
      bedtime.setHours(hour, minute, 0, 0);
      
      if (now > bedtime) {
        bedtime.setDate(bedtime.getDate() + 1);
      }
      
      const diff = bedtime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setBedtimeCountdown(`${hours}h ${minutes}m`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSupplementShortcut = (products: string[], category: string) => {
    onQuickAction?.('supplements');
    
    toast({
      title: `🛒 ${products.join(' or ')} Available`,
      description: `Premium ${category} supplements for better sleep`,
      action: {
        label: "Shop Now",
        onClick: () => onQuickAction?.('supplements')
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Sleep Score Ring */}
      <div className="card-premium text-center">
        <div className="space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="rgb(var(--muted))" strokeWidth="3" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#sleepGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 283" }}
                animate={{ strokeDasharray: `${(sleepScore / 100) * 283} 283` }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">{sleepScore}</div>
                <div className="text-sm text-muted-foreground">Sleep Score</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Sleep Quality</h2>
            <p className="text-muted-foreground">
              {sleepScore >= 85 ? 'Excellent sleep quality!' : 
               sleepScore >= 70 ? 'Good sleep, room for improvement' : 
               'Sleep needs optimization'}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-indigo-600">{bedtimeCountdown}</div>
              <div className="text-sm text-muted-foreground">Until bedtime</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">7h 23m</div>
              <div className="text-sm text-muted-foreground">Last night</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleep Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sleepMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card text-center"
          >
            <div className="space-y-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center mx-auto`}>
                <MoonIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">
                  {metric.value}{metric.unit}
                </div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="text-xs text-muted-foreground">Target: {metric.target}{metric.unit}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sleepOptimizations.map((optimization, index) => (
          <motion.div
            key={optimization.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-premium"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${optimization.color} rounded-xl flex items-center justify-center`}>
                    <LightBulbIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{optimization.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(optimization.priority)}`}>
                        {optimization.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-muted-foreground">Impact: {optimization.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground">{optimization.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                {optimization.supplementShortcut ? (
                  <button
                    onClick={() => handleSupplementShortcut(optimization.supplementShortcut.products, optimization.supplementShortcut.category)}
                    className={`px-4 py-2 bg-gradient-to-r ${optimization.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all flex items-center space-x-2`}
                  >
                    <CubeIcon className="w-4 h-4" />
                    <span>Buy {optimization.supplementShortcut.products[0]}</span>
                  </button>
                ) : (
                  <button className={`px-4 py-2 bg-gradient-to-r ${optimization.color} text-white font-semibold rounded-lg hover:opacity-90 transition-all`}>
                    Apply Tip
                  </button>
                )}
                
                <button 
                  onClick={() => onQuickAction?.('coach')}
                  className="btn-ghost flex items-center space-x-2"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Ask Coach</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="card-premium">
        <h2 className="text-xl font-bold text-foreground mb-6">Optimal Sleep Schedule</h2>
        
        <div className="space-y-4">
          {[
            { time: sleepSchedule.lastCaffeine, label: 'Last Caffeine', icon: BeakerIcon, color: 'text-amber-600' },
            { time: sleepSchedule.lastMeal, label: 'Last Meal', icon: BeakerIcon, color: 'text-green-600' },
            { time: sleepSchedule.windDownStart, label: 'Wind Down Starts', icon: MoonIcon, color: 'text-indigo-600' },
            { time: sleepSchedule.bedtime, label: 'Bedtime', icon: MoonIcon, color: 'text-purple-600' },
            { time: sleepSchedule.wakeTime, label: 'Wake Time', icon: SunIcon, color: 'text-yellow-600' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <div className="text-lg font-bold text-foreground font-mono">{item.time}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sleep Supplements */}
      <div className="card-premium bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <MoonIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-2">
              Sleep Stack Optimization
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-400 mb-4">
              Your sleep score of {sleepScore}/100 suggests magnesium and melatonin could help improve deep sleep quality.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSupplementShortcut(['Magnesium Glycinate'], 'sleep')}
                className="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
              >
                <CubeIcon className="w-4 h-4" />
                <span>Shop Magnesium</span>
              </button>
              <button
                onClick={() => handleSupplementShortcut(['Melatonin'], 'sleep')}
                className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors flex items-center space-x-2"
              >
                <CubeIcon className="w-4 h-4" />
                <span>Shop Melatonin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <MoonIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sleep Optimization</h1>
            <p className="text-muted-foreground">Improve your sleep quality and recovery</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-indigo-600">{bedtimeCountdown}</div>
          <div className="text-sm text-muted-foreground">Until bedtime</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-muted rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeView === tab.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' && renderOverview()}
          {activeView === 'optimization' && renderOptimization()}
          {activeView === 'schedule' && renderSchedule()}
          {activeView === 'environment' && renderSchedule()}
        </motion.div>
      </AnimatePresence>

      {/* Sleep Insights */}
      <div className="card-premium bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <LightBulbIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">
              AI Sleep Insight
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
              Your sleep score has improved 12% this week! Your new bedtime routine is working. 
              Consider adding magnesium for even deeper sleep.
            </p>
            <button
              onClick={() => onQuickAction?.('coach')}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Get More Insights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepOptimization;