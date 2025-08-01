import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import QuickActions from './QuickActions';
import TodaysGoals from './TodaysGoals';
import ReadinessScore from './ReadinessScore';
import ActivityFeed from './ActivityFeed';
import HealthInsights from './HealthInsights';
import { 
  SparklesIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  ChartBarIcon,
  BoltIcon,
  PlayIcon,
  HeartIcon,
  CubeIcon,
  BeakerIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

interface WelcomeHeaderProps {
  onQuickAction?: (action: string) => void;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bedtimeCountdown, setBedtimeCountdown] = useState('');
  
  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";
  
  // Live time and bedtime countdown
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate bedtime countdown (11 PM)
      const bedtime = new Date();
      bedtime.setHours(23, 0, 0, 0);
      
      if (now > bedtime) {
        bedtime.setDate(bedtime.getDate() + 1);
      }
      
      const diff = bedtime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setBedtimeCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'coach':
        onQuickAction?.('coach');
        break;
      case 'health':
        onQuickAction?.('health');
        break;
      case 'shop':
        onQuickAction?.('shop');
        break;
      case 'profile':
        onQuickAction?.('profile');
        break;
      default:
        onQuickAction?.(action);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl">
        {/* Floating orbs for 2026 aesthetic */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#48C6FF]/20 to-[#3BE6C5]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-[#2A7FFF]/20 to-[#0026CC]/20 rounded-full blur-2xl"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Side - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 space-y-6 text-center lg:text-left p-8"
          >
            {/* 2026 Pro Header */}
            <div className="space-y-4">
              {/* Main Greeting */}
              <motion.h1 
                className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-[#48C6FF] via-[#2A7FFF] to-[#0026CC] bg-clip-text text-transparent font-inter tracking-tight"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                Hi {firstName}
              </motion.h1>
              
              {/* Optimize Today */}
              <motion.div
                className="text-xl lg:text-2xl font-semibold text-foreground/80 font-inter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Optimize today
              </motion.div>
              
              {/* Date & Time Display */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-lg font-medium text-foreground/70 font-inter">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-2xl font-bold text-foreground font-mono tracking-wider">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </motion.div>
              
              {/* Bedtime Countdown */}
              <motion.div
                className="inline-flex items-center space-x-3 px-6 py-3 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <MoonIcon className="w-5 h-5 text-[#48C6FF]" />
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground/60 font-inter">Bedtime in</div>
                  <div className="text-lg font-bold text-[#48C6FF] font-mono tracking-wider">
                    {bedtimeCountdown}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button 
                onClick={() => onQuickAction?.('coach')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] cursor-pointer"
              >
                <SparklesIcon className="w-5 h-5" />
                <span>Smart Coach</span>
              </button>
              
              <button 
                onClick={() => onQuickAction?.('plan')}
                className="px-6 py-3 bg-card border border-border text-card-foreground font-semibold rounded-xl hover:bg-muted hover:border-[#48C6FF]/30 transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] cursor-pointer"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>Optimize Today</span>
              </button>
            </motion.div>
            
            {/* Status Indicators */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Wearable connected</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Health Score */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-48 h-48 lg:w-56 lg:h-56 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgb(var(--muted))"
                    strokeWidth="3"
                    fill="none"
                  />
                  
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: "203 283" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#48C6FF" />
                      <stop offset="50%" stopColor="#2A7FFF" />
                      <stop offset="100%" stopColor="#0026CC" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                      className="text-heading-3xl lg:text-5xl font-bold text-gradient-brand"
                    >
                      72
                    </motion.div>
                    <div className="status-indicator status-warning mt-2">
                      Good Progress
                    </div>
                    <div className="text-caption mt-1">
                      Wellness Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="mobile-grid-2 lg:grid-cols-4">
        {[
          { icon: HeartIcon, label: 'Heart Rate', value: '68 bpm', color: 'from-red-500 to-rose-600' },
          { icon: BeakerIcon, label: 'Glucose', value: '142 mg/dL', color: 'from-green-500 to-emerald-600' },
          { icon: BoltIcon, label: 'Steps', value: '8,234', color: 'from-blue-500 to-cyan-600' },
          { label: 'Supplements', value: '6 items', icon: CubeIcon, color: 'from-purple-500 to-indigo-600' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#48C6FF]/20 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <div className="text-lg lg:text-xl font-bold text-foreground font-inter">{metric.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{metric.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <QuickActions onActionClick={handleQuickAction} />
          <TodaysGoals />
          <HealthInsights onQuickAction={handleQuickAction} />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6 lg:space-y-8">
          <ReadinessScore score={72} />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;