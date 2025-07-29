import React from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolidIcon, 
  ChatBubbleLeftRightIcon as ChatSolidIcon, 
  HeartIcon as HeartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon,
  UserCircleIcon as UserSolidIcon
} from '@heroicons/react/24/solid';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: HomeIcon, 
      activeIcon: HomeSolidIcon,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'coach', 
      label: 'Coach', 
      icon: ChatBubbleLeftRightIcon, 
      activeIcon: ChatSolidIcon,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'health', 
      label: 'Health', 
      icon: HeartIcon, 
      activeIcon: HeartSolidIcon,
      color: 'from-rose-500 to-rose-600'
    },
    { 
      id: 'shop', 
      label: 'Shop', 
      icon: ShoppingBagIcon, 
      activeIcon: ShoppingSolidIcon,
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: UserCircleIcon, 
      activeIcon: UserSolidIcon,
      color: 'from-gray-500 to-gray-600'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom no-print">
      <div className="mobile-container pb-4">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-ultra rounded-2xl p-3 mx-4 shadow-2xl border border-white/20"
        >
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const Icon = isActive ? tab.activeIcon : tab.icon;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="touch-target flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 relative min-w-0 flex-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-10 rounded-xl`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <div className={`transition-all duration-300 relative z-10 ${
                    isActive 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}>
                    <Icon className="w-6 h-6 mx-auto" />
                  </div>
                  
                  <span className={`text-xs font-medium mt-1 transition-all duration-300 truncate max-w-full ${
                    isActive 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r ${tab.color} rounded-full`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileNavigation;