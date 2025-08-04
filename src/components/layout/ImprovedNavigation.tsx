import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon,
  ChartBarIcon as ChartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon,
  UserCircleIcon as UserSolidIcon
} from '@heroicons/react/24/solid';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  description: string;
  children?: NavigationSubItem[];
  badge?: string | number;
}

interface NavigationSubItem {
  id: string;
  label: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ImprovedNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMobile?: boolean;
}

const ImprovedNavigation: React.FC<ImprovedNavigationProps> = ({
  activeTab,
  onTabChange,
  isMobile = false
}) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { actualTheme, theme, setTheme, autoSyncTime, setAutoSyncTime } = useTheme();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";

  // Improved navigation structure following UX best practices
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeSolidIcon,
      description: 'Dashboard overview & daily goals',
      children: [
        { id: 'overview', label: 'Overview', description: 'Daily summary and goals' },
        { id: 'insights', label: 'AI Insights', description: 'Personalized recommendations' },
        { id: 'quick-actions', label: 'Quick Actions', description: 'Fast access to common tasks' }
      ]
    },
    {
      id: 'coach',
      label: 'Coach',
      icon: ChatBubbleLeftRightIcon,
      activeIcon: ChatSolidIcon,
      description: 'AI wellness guidance',
      badge: 'New',
      children: [
        { id: 'chat', label: 'Chat Sessions', description: 'Talk with your AI coach' },
        { id: 'insights', label: 'Insights', description: 'Personalized health tips' },
        { id: 'goals', label: 'Goal Setting', description: 'Set and track wellness goals' }
      ]
    },
    {
      id: 'health',
      label: 'Health',
      icon: ChartBarIcon,
      activeIcon: ChartSolidIcon,
      description: 'Metrics, analytics & tracking',
      children: [
        { id: 'metrics', label: 'Live Metrics', description: 'Real-time health data' },
        { id: 'analytics', label: 'Trends & Analytics', description: 'Deep dive into your data' },
        { id: 'devices', label: 'Connected Devices', description: 'Manage wearables and monitors' },
        { id: 'nutrition', label: 'Nutrition Tracking', description: 'Food logging and recipes' },
        { id: 'fitness', label: 'Fitness Tracking', description: 'Workouts and training' },
        { id: 'sleep', label: 'Sleep Analysis', description: 'Sleep optimization tools' }
      ]
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: ShoppingBagIcon,
      activeIcon: ShoppingSolidIcon,
      description: 'Supplements & wellness products',
      children: [
        { id: 'browse', label: 'Browse Products', description: 'Explore supplement catalog' },
        { id: 'stack', label: 'My Stack', description: 'Your personalized supplements' },
        { id: 'subscription', label: 'Subscription', description: 'Manage deliveries and billing' },
        { id: 'orders', label: 'Order History', description: 'Past purchases and tracking' }
      ]
    },
    {
      id: 'profile',
      label: 'Account',
      icon: UserCircleIcon,
      activeIcon: UserSolidIcon,
      description: 'Profile, settings & preferences',
      children: [
        { id: 'profile', label: 'Personal Info', description: 'Update your profile details' },
        { id: 'health-profile', label: 'Health Profile', description: 'Medical history and goals' },
        { id: 'preferences', label: 'Preferences', description: 'App settings and notifications' },
        { id: 'privacy', label: 'Privacy & Security', description: 'Data and privacy controls' }
      ]
    }
  ];

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';

  const handleMenuToggle = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleNavigation = (itemId: string, subItemId?: string) => {
    const targetTab = subItemId ? `${itemId}-${subItemId}` : itemId;
    onTabChange(targetTab);
    setIsMenuOpen(false);
    setExpandedMenu(null);
  };

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
        aria-label="Switch to light theme"
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
        aria-label="Switch to automatic theme"
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
        aria-label="Switch to dark theme"
      >
        <MoonIcon className="w-4 h-4" />
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img 
                src={logoUrl}
                alt="Biowell"
                className="h-10 w-auto"
              />
            </motion.div>
          
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowNotifications(true)}
                className="touch-target relative rounded-xl hover:bg-muted transition-colors"
                aria-label="Open notifications"
              >
                <BellIcon className="w-6 h-6 text-muted-foreground" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-neon rounded-full animate-pulse"></div>
              </button>
            
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="touch-target rounded-xl hover:bg-muted transition-all duration-200"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Navigation - Simplified to 4 items */}
        <nav className="mobile-nav" role="navigation" aria-label="Primary navigation">
          <div className="flex items-center justify-around">
            {navigationItems.slice(0, 4).map((item) => {
              const Icon = activeTab === item.id ? item.activeIcon : item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-semibold mt-1 truncate">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-light rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
                onClick={() => setIsMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              
              <motion.aside 
                className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card z-50 shadow-2xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <img src={logoUrl} alt="Biowell" className="h-10 w-auto" />
                      <span className="text-heading-md text-foreground">Menu</span>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="touch-target rounded-xl hover:bg-muted transition-colors"
                      aria-label="Close menu"
                    >
                      <XMarkIcon className="w-6 h-6 text-muted-foreground" />
                    </button>
                  </div>

                  {/* User Profile */}
                  <div className="p-6 bg-muted/30 border-b border-border">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-light to-blue-medium rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">{firstName}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <div key={item.id}>
                          <button
                            onClick={() => item.children ? handleMenuToggle(item.id) : handleNavigation(item.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 ${
                              activeTab === item.id
                                ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                                : 'text-foreground hover:bg-muted'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'text-white' : 'text-muted-foreground'}`} />
                              <div>
                                <div className="font-semibold">{item.label}</div>
                                <div className={`text-sm ${activeTab === item.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            {item.children && (
                              <ChevronDownIcon 
                                className={`w-5 h-5 transition-transform ${
                                  expandedMenu === item.id ? 'rotate-180' : ''
                                } ${activeTab === item.id ? 'text-white' : 'text-muted-foreground'}`} 
                              />
                            )}
                          </button>

                          {/* Sub-menu */}
                          <AnimatePresence>
                            {item.children && expandedMenu === item.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-6 mt-2 space-y-1"
                              >
                                {item.children.map((subItem) => (
                                  <button
                                    key={subItem.id}
                                    onClick={() => handleNavigation(item.id, subItem.id)}
                                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-muted transition-colors"
                                  >
                                    <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <div className="font-medium text-foreground">{subItem.label}</div>
                                      <div className="text-sm text-muted-foreground">{subItem.description}</div>
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </nav>

                  {/* Bottom Actions */}
                  <div className="p-6 border-t border-border space-y-2">
                    <div className="mb-4">
                      <div className="text-sm font-medium text-foreground mb-2">Theme</div>
                      <ThemeToggle />
                    </div>
                    
                    <button 
                      onClick={() => setShowNotifications(true)}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                    >
                      <BellIcon className="w-5 h-5" />
                      <span>Notifications</span>
                      <span className="ml-auto w-2 h-2 bg-accent-neon rounded-full animate-pulse"></span>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigation('profile')}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                    >
                      <Cog6ToothIcon className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    
                    <button 
                      onClick={signOut}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Navigation
  return (
    <nav className="hidden lg:flex fixed inset-y-0 z-50 w-72 flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 shadow-xl border-r border-border">
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center gap-4 pt-6">
          <img src={logoUrl} alt="Biowell" className="h-12 w-auto" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-light to-blue-medium rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {firstName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate">
              Welcome back, {firstName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        {/* Theme Toggle */}
        <div className="px-4 py-3 bg-muted/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-light rounded-full"></div>
              <span className="text-sm font-medium text-foreground">Theme</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-y-2">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id || activeTab.startsWith(`${item.id}-`);
              const Icon = isActive ? item.activeIcon : item.icon;
              
              return (
                <div key={item.id}>
                  <button
                    onClick={() => item.children ? handleMenuToggle(item.id) : handleNavigation(item.id)}
                    className={`group flex gap-x-4 rounded-2xl p-4 text-base leading-6 font-semibold w-full transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                        : 'text-foreground hover:text-blue-light hover:bg-blue-light/10'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-expanded={item.children ? expandedMenu === item.id : undefined}
                  >
                    <Icon className={`h-7 w-7 shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-blue-light'}`} />
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-1 bg-accent-neon text-black text-xs font-bold rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.children && (
                          <ChevronDownIcon 
                            className={`w-5 h-5 transition-transform ${
                              expandedMenu === item.id ? 'rotate-180' : ''
                            } ${isActive ? 'text-white' : 'text-muted-foreground'}`} 
                          />
                        )}
                      </div>
                      <div className={`text-sm ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {item.description}
                      </div>
                    </div>
                  </button>

                  {/* Desktop Sub-menu */}
                  <AnimatePresence>
                    {item.children && expandedMenu === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 mt-2 space-y-1"
                      >
                        {item.children.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavigation(item.id, subItem.id)}
                            className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-muted transition-colors"
                          >
                            <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-foreground">{subItem.label}</div>
                              <div className="text-sm text-muted-foreground">{subItem.description}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-1 pt-6 border-t border-border">
          <button 
            onClick={() => setShowNotifications(true)}
            className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-foreground hover:text-blue-light hover:bg-blue-light/10 transition-all duration-200"
          >
            <BellIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-blue-light" />
            <span>Notifications</span>
            <span className="ml-auto w-2 h-2 bg-accent-neon rounded-full animate-pulse"></span>
          </button>
          
          <button 
            onClick={() => handleNavigation('profile')}
            className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-foreground hover:text-blue-light hover:bg-blue-light/10 transition-all duration-200"
          >
            <Cog6ToothIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-blue-light" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={signOut}
            className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-medium w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0 text-red-500 group-hover:text-red-700" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ImprovedNavigation;