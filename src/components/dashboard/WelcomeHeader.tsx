import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { 
  SparklesIcon,
  SunIcon,
  MoonIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4 mb-8"
    >
      <div className="flex items-center justify-center space-x-3">
        <greeting.icon className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-foreground">
          {greeting.text}, {firstName}!
        </h1>
        <SparklesIcon className="w-8 h-8 text-yellow-500" />
      </div>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Here's your personalized health overview and wellness insights for today.
      </p>
      
      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>All systems active</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Data synchronized</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeHeader;