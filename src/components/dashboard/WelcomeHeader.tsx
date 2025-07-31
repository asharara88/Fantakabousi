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
  BoltIcon
} from '@heroicons/react/24/outline';

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: SunIcon };
    if (hour < 17) return { text: 'Good Afternoon', icon: SunIcon };
    if (hour < 21) return { text: 'Good Evening', icon: CloudIcon };
    return { text: 'Good Night', icon: MoonIcon };
  };

  const greeting = getGreeting();
  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center space-y-6 py-12"
      >
        {/* Main Greeting */}
        <div className="space-y-4">
          <motion.div 
            className="flex items-center justify-center space-x-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <greeting.icon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {greeting.text}, {firstName}!
            </h1>
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <SparklesIcon className="w-10 h-10 text-yellow-500" />
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Here's your personalized health overview and AI-powered wellness insights for today.
          </motion.p>
        </div>
        
        {/* Status Indicators */}
        <motion.div 
          className="flex items-center justify-center space-x-8 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="font-medium text-green-700">All systems active</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-blue-200">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="font-medium text-blue-700">Data synchronized</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-purple-200">
            <BoltIcon className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-700">AI ready</span>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="flex items-center justify-center space-x-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { label: 'Health Score', value: '62/100', color: 'text-yellow-600' },
            { label: 'Days Active', value: '12', color: 'text-green-600' },
            { label: 'Insights', value: '4 new', color: 'text-blue-600' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeHeader;
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeHeader;