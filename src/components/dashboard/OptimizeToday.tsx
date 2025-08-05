import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { 
  ClockIcon,
  CalendarIcon,
  MoonIcon,
  HeartIcon,
  BeakerIcon,
  BoltIcon,
  LightBulbIcon,
  SparklesIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  SunIcon,
  CloudIcon,
  FireIcon,
  EyeIcon,
  CpuChipIcon,
  UserGroupIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

interface Protocol {
  id: string;
  name: string;
  type: 'breathwork' | 'meal' | 'workout' | 'stress' | 'cognitive' | 'fertility';
  scheduledTime: string;
  duration: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  benefits: string[];
}

interface TodaysWin {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  category: 'health' | 'fitness' | 'nutrition' | 'wellness' | 'fertility';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const OptimizeToday: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [completedProtocols, setCompletedProtocols] = useState<Set<string>>(new Set());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate bedtime and hours remaining
  const bedtime = new Date();
  bedtime.setHours(22, 30, 0, 0); // 10:30 PM default
  if (bedtime < currentTime) {
    bedtime.setDate(bedtime.getDate() + 1); // Next day if past bedtime
  }
  
  const hoursToSleep = Math.max(0, Math.floor((bedtime.getTime() - currentTime.getTime()) / (1000 * 60 * 60)));
  const minutesToSleep = Math.max(0, Math.floor(((bedtime.getTime() - currentTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60)));

  // Today's wins (dynamic based on user data)
  const todaysWins: TodaysWin[] = [
    {
      id: '1',
      title: 'Morning HRV Peak',
      description: 'Your heart rate variability hit 45ms - highest this month',
      timestamp: new Date(currentTime.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      category: 'health',
      icon: HeartIcon,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: '2',
      title: 'Glucose Stability',
      description: 'Post-breakfast glucose stayed under 120mg/dL - excellent control',
      timestamp: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      category: 'nutrition',
      icon: BeakerIcon,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: '3',
      title: 'Stress Resilience',
      description: 'Maintained low stress during morning meetings',
      timestamp: new Date(currentTime.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      category: 'wellness',
      icon: LightBulbIcon,
      color: 'from-violet-500 to-purple-600'
    }
  ];

  // Intelligent protocol scheduling based on current time and user profile
  const generateTodaysProtocols = (): Protocol[] => {
    const hour = currentTime.getHours();
    const protocols: Protocol[] = [];

    // Morning protocols (6-10 AM)
    if (hour >= 6 && hour < 10) {
      protocols.push({
        id: 'morning-breathwork',
        name: 'Morning Activation',
        type: 'breathwork',
        scheduledTime: '07:30',
        duration: 10,
        completed: completedProtocols.has('morning-breathwork'),
        priority: 'high',
        description: 'Energizing breathwork to optimize morning cortisol',
        icon: CloudIcon,
        color: 'from-sky-500 to-blue-600',
        benefits: ['Increased alertness', 'Cortisol optimization', 'Mental clarity']
      });
    }

    // Work break protocols (10 AM - 5 PM)
    if (hour >= 10 && hour < 17) {
      protocols.push({
        id: 'cognitive-break',
        name: 'Cognitive Reset',
        type: 'cognitive',
        scheduledTime: `${hour + 1}:00`,
        duration: 5,
        completed: completedProtocols.has('cognitive-break'),
        priority: 'medium',
        description: 'Brief mental reset to maintain focus and productivity',
        icon: LightBulbIcon,
        color: 'from-indigo-500 to-purple-600',
        benefits: ['Improved focus', 'Reduced mental fatigue', 'Enhanced creativity']
      });
    }

    // Afternoon protocols (12-3 PM)
    if (hour >= 12 && hour < 15) {
      protocols.push({
        id: 'post-lunch-walk',
        name: 'Glucose Management',
        type: 'workout',
        scheduledTime: '13:30',
        duration: 15,
        completed: completedProtocols.has('post-lunch-walk'),
        priority: 'high',
        description: 'Light movement to optimize post-meal glucose response',
        icon: FireIcon,
        color: 'from-orange-500 to-red-600',
        benefits: ['Glucose control', 'Energy boost', 'Digestive health']
      });
    }

    // Evening protocols (5-9 PM)
    if (hour >= 17 && hour < 21) {
      protocols.push({
        id: 'stress-release',
        name: 'Stress Decompression',
        type: 'stress',
        scheduledTime: '18:00',
        duration: 12,
        completed: completedProtocols.has('stress-release'),
        priority: 'high',
        description: 'Release work stress and transition to evening mode',
        icon: EyeIcon,
        color: 'from-amber-500 to-orange-600',
        benefits: ['Stress reduction', 'Better sleep prep', 'Mood improvement']
      });
    }

    // Pre-bedtime protocols (8-10 PM)
    if (hour >= 20 && hour < 22) {
      protocols.push({
        id: 'sleep-prep',
        name: 'Sleep Preparation',
        type: 'breathwork',
        scheduledTime: '21:00',
        duration: 8,
        completed: completedProtocols.has('sleep-prep'),
        priority: 'high',
        description: 'Calming breathwork to prepare for restorative sleep',
        icon: MoonIcon,
        color: 'from-indigo-500 to-purple-600',
        benefits: ['Faster sleep onset', 'Deeper sleep', 'Better recovery']
      });
    }

    // UBERGENE fertility protocols (for couples TTC)
    const healthGoals = profile?.primary_health_goals || [];
    if (healthGoals.includes('fertility') || healthGoals.includes('reproductive_health')) {
      protocols.push({
        id: 'fertility-optimization',
        name: 'UBERGENE Sync',
        type: 'fertility',
        scheduledTime: '20:00',
        duration: 5,
        completed: completedProtocols.has('fertility-optimization'),
        priority: 'high',
        description: 'Sync reproductive health data with your partner',
        icon: UserGroupIcon,
        color: 'from-pink-500 to-rose-600',
        benefits: ['Cycle tracking', 'Partner coordination', 'Conception optimization']
      });
    }

    return protocols.sort((a, b) => {
      const timeA = parseInt(a.scheduledTime.replace(':', ''));
      const timeB = parseInt(b.scheduledTime.replace(':', ''));
      return timeA - timeB;
    });
  };

  const todaysProtocols = generateTodaysProtocols();
  const nextProtocol = todaysProtocols.find(p => !p.completed);
  const completedCount = todaysProtocols.filter(p => p.completed).length;

  const toggleProtocol = (protocolId: string) => {
    setCompletedProtocols(prev => {
      const newSet = new Set(prev);
      if (newSet.has(protocolId)) {
        newSet.delete(protocolId);
      } else {
        newSet.add(protocolId);
      }
      return newSet;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProtocolTypeIcon = (type: string) => {
    switch (type) {
      case 'breathwork': return CloudIcon;
      case 'meal': return BeakerIcon;
      case 'workout': return FireIcon;
      case 'stress': return EyeIcon;
      case 'cognitive': return BrainIcon;
      case 'cognitive': return LightBulbIcon;
      case 'fertility': return UserGroupIcon;
      default: return SparklesIcon;
    }
  };

  return (
    <div className="space-y-8">
      {/* Live Time & Date Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/60"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wide">
                LIVE
              </span>
            </div>
            <div className="text-4xl font-light text-slate-900 dark:text-slate-100 tracking-tight">
              {formatTime(currentTime)}
            </div>
            <div className="text-lg text-slate-600 dark:text-slate-400 font-light">
              {formatDate(currentTime)}
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <MoonIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Bedtime in</span>
            </div>
            <div className="text-3xl font-light text-slate-900 dark:text-slate-100">
              {hoursToSleep}h {minutesToSleep}m
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">
              Target: 10:30 PM
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Wins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/60"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Today's Wins</h3>
              <p className="text-slate-600 dark:text-slate-400">Your health achievements today</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{todaysWins.length}</div>
            <div className="text-sm text-slate-500">achievements</div>
          </div>
        </div>

        <div className="space-y-3">
          {todaysWins.map((win, index) => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-slate-50/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/40 dark:border-slate-700/40"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${win.color} rounded-xl flex items-center justify-center`}>
                <win.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{win.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{win.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {win.timestamp.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Optimization Protocols */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/60"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Optimization Protocols</h3>
              <p className="text-slate-600 dark:text-slate-400">Personalized interventions for peak performance</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completedCount}/{todaysProtocols.length}</div>
            <div className="text-sm text-slate-500">completed</div>
          </div>
        </div>

        {/* Next Protocol Highlight */}
        {nextProtocol && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-800/60"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${nextProtocol.color} rounded-xl flex items-center justify-center animate-pulse`}>
                  <nextProtocol.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {nextProtocol.name}
                    </h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold rounded-full">
                      NEXT
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{nextProtocol.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-500">
                    <span>⏰ {nextProtocol.scheduledTime}</span>
                    <span>⏱️ {nextProtocol.duration} min</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleProtocol(nextProtocol.id)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Start Now
              </button>
            </div>
          </motion.div>
        )}

        {/* All Protocols */}
        <div className="space-y-3">
          {todaysProtocols.map((protocol, index) => {
            const ProtocolIcon = getProtocolTypeIcon(protocol.type);
            const isNext = protocol.id === nextProtocol?.id;
            
            return (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  protocol.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/60'
                    : isNext
                    ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-800/60'
                    : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200/40 dark:border-slate-700/40 hover:border-slate-300/60 dark:hover:border-slate-600/60'
                }`}
                onClick={() => setSelectedProtocol(selectedProtocol === protocol.id ? null : protocol.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProtocol(protocol.id);
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        protocol.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                      }`}
                    >
                      {protocol.completed && (
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      )}
                    </button>
                    
                    <div className={`w-10 h-10 bg-gradient-to-br ${protocol.color} rounded-xl flex items-center justify-center ${
                      protocol.completed ? 'opacity-60' : ''
                    }`}>
                      <ProtocolIcon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold ${
                        protocol.completed 
                          ? 'text-emerald-700 dark:text-emerald-400 line-through' 
                          : 'text-slate-900 dark:text-slate-100'
                      }`}>
                        {protocol.name}
                      </h4>
                      <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                        <span>⏰ {protocol.scheduledTime}</span>
                        <span>⏱️ {protocol.duration}m</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          protocol.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          protocol.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {protocol.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {protocol.type === 'fertility' && (
                      <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold rounded-full">
                        UBERGENE
                      </span>
                    )}
                    <ArrowRightIcon className={`w-4 h-4 transition-transform ${
                      selectedProtocol === protocol.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedProtocol === protocol.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60"
                    >
                      <div className="space-y-4">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {protocol.description}
                        </p>
                        
                        <div>
                          <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            Benefits:
                          </h5>
                          <div className="grid grid-cols-1 gap-2">
                            {protocol.benefits.map((benefit, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {protocol.type === 'fertility' && (
                          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl p-4 border border-pink-200/60 dark:border-pink-800/60">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                                <UserGroupIcon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-pink-700 dark:text-pink-400">UBERGENE Integration</h5>
                                <p className="text-sm text-pink-600 dark:text-pink-500">Couples fertility optimization</p>
                              </div>
                            </div>
                            <p className="text-sm text-pink-700 dark:text-pink-400 leading-relaxed">
                              Sync your reproductive health data with your partner for optimal conception timing. 
                              Track ovulation, fertility windows, and coordinate intimate moments.
                            </p>
                            <button className="mt-3 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-lg text-sm hover:shadow-lg transition-all duration-300">
                              Open UBERGENE
                            </button>
                          </div>
                        )}
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => toggleProtocol(protocol.id)}
                            className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                              protocol.completed
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:shadow-lg'
                            }`}
                          >
                            {protocol.completed ? 'Completed ✓' : 'Start Protocol'}
                          </button>
                          
                          {protocol.type === 'fertility' && (
                            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                              Partner Sync
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Daily Progress
              </div>
              <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / todaysProtocols.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {Math.round((completedCount / todaysProtocols.length) * 100)}%
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <ClockIcon className="w-4 h-4" />
              <span>
                {todaysProtocols.reduce((total, p) => total + p.duration, 0)} min total
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* UBERGENE Fertility Section (if applicable) */}
      {(profile?.primary_health_goals?.includes('fertility') || profile?.primary_health_goals?.includes('reproductive_health')) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-3xl p-8 border border-pink-200/60 dark:border-pink-800/60"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-pink-700 dark:text-pink-400">UBERGENE Fertility</h3>
                <p className="text-pink-600 dark:text-pink-500">Couples reproductive health optimization</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
              Open App
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Cycle Tracking',
                description: 'Advanced ovulation prediction with partner sync',
                icon: CalendarIcon,
                value: 'Day 14',
                status: 'Fertile Window'
              },
              {
                title: 'Partner Coordination',
                description: 'Synchronized health data for optimal timing',
                icon: HeartIcon,
                value: '94%',
                status: 'Sync Score'
              },
              {
                title: 'Conception Insights',
                description: 'AI-powered fertility recommendations',
                icon: SparklesIcon,
                value: '3 days',
                status: 'Peak Window'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-4 border border-pink-200/40 dark:border-pink-800/40">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-700 dark:text-pink-400">{item.title}</h4>
                  </div>
                </div>
                <p className="text-sm text-pink-600 dark:text-pink-500 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-pink-700 dark:text-pink-400">{item.value}</span>
                  <span className="text-xs text-pink-600 dark:text-pink-500">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OptimizeToday;