import React from 'react';
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
  BeakerIcon
} from '@heroicons/react/24/outline';

interface WelcomeHeaderProps {
  onQuickAction?: (action: string) => void;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  
  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: SunIcon };
    if (hour < 17) return { text: 'Good Afternoon', icon: SunIcon };
    if (hour < 21) return { text: 'Good Evening', icon: CloudIcon };
    return { text: 'Good Night', icon: MoonIcon };
  };

  const greeting = getGreeting();
  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="card-premium bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Side - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4 lg:space-y-6 text-center lg:text-left"
          >
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start space-x-3"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <img 
                src={logoUrl}
                alt="Biowell"
                className="h-16 lg:h-20 w-auto"
              />
            </motion.div>
            
            {/* Main Greeting */}
            <div className="space-y-3">
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
                  <greeting.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <h1 className="text-2xl lg:text-4xl font-bold text-foreground font-inter">
                  {greeting.text}, {firstName}!
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-base lg:text-lg text-muted-foreground max-w-lg font-inter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Welcome to your wellness dashboard. Track your health, get personalized insights, and optimize your daily routine.
              </motion.p>
            </div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button 
                onClick={() => onQuickAction?.('start-day')}
                className="px-6 py-3 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white font-semibold rounded-xl hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] cursor-pointer"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Start Your Day</span>
              </button>
              
              <button 
                onClick={() => onQuickAction?.('health')}
                className="px-6 py-3 bg-card border border-border text-card-foreground font-semibold rounded-xl hover:bg-muted hover:border-[#48C6FF]/30 transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] cursor-pointer"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>View Health Data</span>
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
                <span className="text-sm font-medium text-[#3BE6C5]">All systems active</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-full border border-border shadow-sm">
                <BoltIcon className="w-4 h-4 text-[#48C6FF]" />
                <span className="text-sm font-medium text-[#48C6FF]">AI ready</span>
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
          { icon: HeartIcon, label: 'Heart Rate', value: '68 bpm', color: 'bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF]' },
          { icon: BeakerIcon, label: 'Glucose', value: '142 mg/dL', color: 'bg-[#3BE6C5]' },
          { icon: BoltIcon, label: 'Steps', value: '8,234', color: 'bg-gradient-to-br from-[#2A7FFF] to-[#0026CC]' },
          { label: 'Supplements', value: '6 items', icon: CubeIcon, color: 'bg-gradient-to-br from-[#0026CC] to-[#48C6FF]' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#48C6FF]/20 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
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
          <HealthInsights />
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