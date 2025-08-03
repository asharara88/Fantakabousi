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
      label: 'Smart Coach', 
      icon: ChatBubbleLeftRightIcon, 
      activeIcon: ChatSolidIcon,
      description: 'Get smart advice'
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
    <div className="flex items-center space-x-0.5 bg-background rounded-lg p-1 border border-border">
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('light');
        }}
        className={`p-2 rounded-md transition-all ${
          theme === 'light' && !autoSyncTime
            ? 'bg-blue-light text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light theme"
      >
        <SunIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          setAutoSyncTime(true);
          setTheme('auto');
        }}
        className={`p-2 rounded-md transition-all ${
          autoSyncTime
            ? 'bg-blue-light text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Auto theme (follows time)"
      >
        <ComputerDesktopIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('dark');
        }}
        className={`p-2 rounded-md transition-all ${
          theme === 'dark' && !autoSyncTime
            ? 'bg-blue-light text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark theme"
      >
        <MoonIcon className="w-4 h-4" />
      </button>
    </div>
  );
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className="hidden lg:flex fixed inset-y-0 z-50 w-72 flex-col"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 shadow-xl border-r border-border">
          {/* Logo - Banner */}
          <header role="banner" className="flex h-20 shrink-0 items-center gap-4 pt-6">
            <button 
              onClick={() => window.location.href = '/'}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Back to Home"
              aria-label="Biowell home page"
            >
              <img 
                src={logoUrl}
                alt="Biowell"
                className="h-12 w-auto"
              />
            </button>
          </header>

          {/* User Profile Section - Complementary */}
          <aside role="complementary" aria-label="User profile information">
            <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-[#48C6FF]/10 to-[#3BE6C5]/10 rounded-2xl border border-[#48C6FF]/20 shadow-sm">
              <div 
                className="w-14 h-14 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-2xl flex items-center justify-center shadow-lg"
                role="img"
                aria-label={`${firstName} profile avatar`}
              >
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
              <div 
                className="w-2 h-2 bg-[#3BE6C5] rounded-full animate-pulse"
                role="status"
                aria-label="Online status indicator"
              ></div>
            </div>
          </aside>

          {/* Quick Theme Toggle - Form */}
          <section role="region" aria-label="Theme settings">
            <div className="px-4 py-3 bg-muted/30 rounded-xl mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-light rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Theme</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </section>

          {/* Main Navigation Items */}
          <section role="region" aria-label="Main navigation menu" className="flex flex-1 flex-col">
            <ul role="menubar" className="flex flex-1 flex-col gap-y-2" aria-label="Navigation menu">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = isActive ? item.activeIcon : item.icon;
              
              return (
                <li key={item.id} role="none">
                  <motion.button
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-describedby={`nav-${item.id}-description`}
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
                    <div 
                      id={`nav-${item.id}-description`}
                      className={`text-sm ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}
                    >
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1 h-6 bg-white rounded-full shadow-sm"
                      aria-hidden="true"
                    />
                  )}
                </motion.button>
                </li>
              );
            })}
            </ul>
          </section>

          {/* Secondary Navigation */}
          <nav role="navigation" aria-label="Secondary navigation and account actions">
            <div className="space-y-1 pt-6 border-t border-border">
              <button 
              role="menuitem"
              onClick={() => setShowNotifications(true)}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-foreground hover:text-[#48C6FF] hover:bg-[#48C6FF]/10 transition-all duration-200"
              aria-label="Open notifications panel"
            >
              <BellIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-[#48C6FF]" />
              <span>Notifications</span>
              <span 
                className="ml-auto w-2 h-2 bg-[#3BE6C5] rounded-full animate-pulse"
                role="status"
                aria-label="New notifications available"
              ></span>
              </button>
              <button 
              role="menuitem"
              onClick={() => onTabChange('profile')}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-foreground hover:text-[#48C6FF] hover:bg-[#48C6FF]/10 transition-all duration-200"
            >
              <Cog6ToothIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-[#48C6FF]" />
              <span>Settings</span>
              </button>
              <button 
              role="menuitem"
              onClick={signOut}
              className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              aria-label="Sign out of your account"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0 text-red-500 group-hover:text-red-700" />
              <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
        
        {/* Notification Center - Complementary */}
        <aside role="complementary" aria-label="Notification center">
          <NotificationCenter 
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </aside>
      </div>
      </nav>
    </>
  );
};

export default Navigation;