import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  SparklesIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  ChartBarIcon,
  BoltIcon,
  ArrowRightIcon,
  PlayIcon,
  HeartIcon,
  BeakerIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  
  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: SunIcon, color: 'from-yellow-400 to-orange-500' };
    if (hour < 17) return { text: 'Good Afternoon', icon: SunIcon, color: 'from-orange-400 to-red-500' };
    if (hour < 21) return { text: 'Good Evening', icon: CloudIcon, color: 'from-purple-400 to-pink-500' };
    return { text: 'Good Night', icon: MoonIcon, color: 'from-indigo-400 to-purple-500' };
  };

  const greeting = getGreeting();
  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="relative overflow-hidden bg-card rounded-3xl border border-border shadow-lg">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-light/5 via-blue-medium/5 to-blue-deep/5"></div>
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-gradient-brand"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <div className="relative z-10 px-6 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            {/* Logo and Brand */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start space-x-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <img 
                src={logoUrl}
                alt="Biowell"
                className="h-28 lg:h-35 w-auto"
              />
            </motion.div>
            
            {/* Main Greeting */}
            <div className="space-y-4">
              <motion.div 
                className="flex items-center justify-center lg:justify-start space-x-3"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-blue-light rounded-2xl flex items-center justify-center shadow-lg`}>
                  <greeting.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold text-foreground">
                  {greeting.text}, {firstName}!
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your AI-powered wellness journey continues. Get personalized insights, track your health metrics, and optimize your supplement stack.
              </motion.p>
            </div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 rounded-2xl flex items-center justify-center space-x-3"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Start Your Day</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-8 py-4 rounded-2xl flex items-center justify-center space-x-3"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>View Analytics</span>
              </motion.button>
            </motion.div>
            
            {/* Status Indicators */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-full shadow-sm border border-border">
                <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse shadow-sm"></div>
                <span className="font-medium accent-neon">All systems active</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-full shadow-sm border border-border">
                <BoltIcon className="w-4 h-4 text-blue-light" />
                <span className="font-medium text-blue-light">AI ready</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Health Overview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Wellness Score Circle */}
            <div className="relative flex items-center justify-center">
              <div className="w-48 h-48 lg:w-64 lg:h-64 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-200"
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
                    animate={{ strokeDasharray: "175 283" }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
              Your AI-powered wellness journey continues with advanced biometric analysis, real-time health optimization, and personalized longevity protocols.
                      animate={{ scale: 1 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                      className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      62
                    </motion.div>
                    <div className="text-sm lg:text-base font-semibold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full mt-2">
                      Needs Attention
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Wellness Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
              <span>AI Health Scan</span>
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: HeartIcon, label: 'Heart Rate', value: '68 bpm', color: 'bg-gradient-blue-light' },
                { icon: BeakerIcon, label: 'Glucose', value: '142 mg/dL', color: 'bg-accent-neon' },
                { icon: BoltIcon, label: 'Steps', value: '8,234', color: 'bg-gradient-blue-medium' },
                { icon: CubeIcon, label: 'Stack', value: '6 items', color: 'bg-gradient-blue-deep' },
              ].map((metric, index) => (
              <span>Predictive Analytics</span>
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="bg-card rounded-2xl p-4 border border-border shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <metric.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{metric.value}</div>
              <span className="font-medium accent-neon">Neural networks active</span>
                    </div>
                  </div>
                </motion.div>
              <span className="font-medium text-blue-light">GPT-5 ready</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-full shadow-sm border border-border">
              <SparklesIcon className="w-4 h-4 text-neon-green" />
              <span className="font-medium text-neon-green">Quantum processing</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;