import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { 
  SparklesIcon,
  HeartIcon,
  BoltIcon,
  BeakerIcon,
  CubeIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface WelcomeHeaderProps {
  onQuickAction?: (action: string) => void;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingIcon = () => {
    if (currentHour < 12) return SunIcon;
    if (currentHour < 17) return SunIcon;
    return MoonIcon;
  };

  const GreetingIcon = getGreetingIcon();

  const quickActions = [
    {
      id: 'coach',
      title: 'Ask Smart Coach',
      description: 'Get personalized health advice',
      icon: SparklesIcon,
      color: 'from-purple-500 to-indigo-600',
      action: () => onQuickAction?.('coach')
    },
    {
      id: 'health',
      title: 'View Analytics',
      description: 'Check your health trends',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-600',
      action: () => onQuickAction?.('health')
    },
    {
      id: 'nutrition',
      title: 'Log Food',
      description: 'Track your nutrition',
      icon: BeakerIcon,
      color: 'from-green-500 to-emerald-600',
      action: () => onQuickAction?.('nutrition')
    },
    {
      id: 'supplements',
      title: 'Browse Shop',
      description: 'Explore supplements',
      icon: CubeIcon,
      color: 'from-orange-500 to-red-600',
      action: () => onQuickAction?.('supplements')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <GreetingIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
            {getGreeting()}, {firstName}!
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Ready to optimize your wellness today? Your health journey continues with personalized insights.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={action.action}
            className="p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-left group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="space-y-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeHeader;