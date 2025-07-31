import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import NotificationCenter from '../notifications/NotificationCenter';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolidIcon, 
  ChatBubbleLeftRightIcon as ChatSolidIcon, 
  HeartIcon as HeartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon,
  UserCircleIcon as UserSolidIcon,
  BellIcon as BellSolidIcon
} from '@heroicons/react/24/solid';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { actualTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { theme, setTheme, autoSyncTime, setAutoSyncTime } = useTheme();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: HomeIcon, 
      activeIcon: HomeSolidIcon,
      description: 'Daily overview & goals'
    },
    { 
      id: 'coach', 
      label: 'AI Coach', 
      icon: ChatBubbleLeftRightIcon, 
      activeIcon: ChatSolidIcon,
      description: 'Get health advice'
    },
    { 
      id: 'health', 
      label: 'Analytics', 
      icon: HeartIcon, 
      activeIcon: HeartSolidIcon,
      description: 'Track your progress'
    },
    { 
      id: 'shop', 
      label: 'Supplements', 
      icon: ShoppingBagIcon, 
      activeIcon: ShoppingSolidIcon,
      description: 'Browse products'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: UserCircleIcon, 
      activeIcon: UserSolidIcon,
      description: 'Account settings'
    },
  ];

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';
  
  const ThemeToggle = () => (
    <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('light');
        }}
        className={`p-1.5 rounded transition-all ${
          theme === 'light' && !autoSyncTime
            ? 'bg-blue-light text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light theme"
      >
        <SunIcon className="w-3 h-3" />
      </button>
      <button
        onClick={() => setAutoSyncTime(!autoSyncTime)}
        className={`p-1.5 rounded transition-all ${
          autoSyncTime
            ? 'bg-blue-light text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Auto day/night"
      >
        <ComputerDesktopIcon className="w-3 h-3" />
      </button>
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('dark');
        }}
        className={`p-1.5 rounded transition-all ${
          theme === 'dark' && !autoSyncTime
            ? 'bg-blue-light text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark theme"
      >
        <MoonIcon className="w-3 h-3" />
      </button>
    </div>
  );
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed inset-y-0 z-50 w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 shadow-xl border-r border-border">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center gap-4 pt-6">
            <img 
              src={logoUrl}
              alt="Biowell"
              className="h-12 w-auto"
            />
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#48C6FF]/10 to-[#3BE6C5]/10 rounded-2xl border border-[#48C6FF]/20 shadow-sm">
            <div className="w-14 h-14 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-foreground truncate font-inter">
                Welcome back, {firstName}
              </p>
              <p className="text-sm text-muted-foreground truncate font-inter">
                {user?.email}
              </p>
            </div>
            <div className="w-2 h-2 bg-[#3BE6C5] rounded-full animate-pulse"></div>
          </div>
          {/* Navigation Items */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = isActive ? item.activeIcon : item.icon;
              
              return (
                <li key={item.id}>
                  <motion.button
                  onClick={() => onTabChange(item.id)}
                  className={`group flex gap-x-4 rounded-2xl p-4 text-base leading-6 font-semibold w-full transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white shadow-lg'
                      : 'text-foreground hover:text-[#48C6FF] hover:bg-[#48C6FF]/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`h-7 w-7 shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-[#48C6FF]'}`} />
                  <div className="flex-1 text-left">
                    <div className="font-inter">{item.label}</div>
                    <div className={`text-sm ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1 h-6 bg-white rounded-full shadow-sm"
                    />
                  )}
                </motion.button>
                </li>
              );
            })}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="space-y-1 pt-6 border-t border-border">
            {/* Quick Theme Toggle */}
            <div className="px-4 py-3 bg-muted/30 rounded-xl mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-light rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Theme</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
            
            <button 
              onClick={() => setShowNotifications(true)}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-foreground hover:text-[#48C6FF] hover:bg-[#48C6FF]/10 transition-all duration-200"
            >
              <BellIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-[#48C6FF]" />
              <span>Notifications</span>
              <span className="ml-auto w-2 h-2 bg-[#3BE6C5] rounded-full animate-pulse"></span>
            </button>
            <button 
              onClick={() => onTabChange('profile')}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-foreground hover:text-[#48C6FF] hover:bg-[#48C6FF]/10 transition-all duration-200"
            >
              <Cog6ToothIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-[#48C6FF]" />
              <span>Settings</span>
            </button>
            <button 
              onClick={signOut}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0 text-red-500 group-hover:text-red-700" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Notification Center */}
        <NotificationCenter 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </nav>
    </>
  );
};

export default Navigation;