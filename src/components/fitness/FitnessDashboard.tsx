import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import WelcomeHeader from './WelcomeHeader';
import HealthMetrics from './HealthMetrics';
import AIInsights from './AIInsights';
import TodaysPlan from './TodaysPlan';
import QuickActions from './QuickActions';
import ActivityFeed from './ActivityFeed';
import ReadinessScore from './ReadinessScore';
import BiometricChart from './BiometricChart';
import SupplementStack from './SupplementStack';
import AICoachEnhanced from './AICoachEnhanced';
import HealthDashboard from './HealthDashboard';
import NutritionDashboard from '../nutrition/NutritionDashboard';
import FitnessDashboard from '../fitness/FitnessDashboard';
import ProfileSettingsEnhanced from './ProfileSettingsEnhanced';
import SupplementShopEnhanced from '../supplements/SupplementShopEnhanced';
import NotificationCenter from '../notifications/NotificationCenter';
import QuickActionMenu from '../ui/QuickActionMenu';
import SmartSearch from '../ui/SmartSearch';
import OfflineIndicator from '../ui/OfflineIndicator';
import SafeArea from '../ui/SafeArea';
import { 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  FireIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon,
  ChartBarIcon as ChartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon,
  UserCircleIcon as UserSolidIcon,
  BellIcon as BellSolidIcon
} from '@heroicons/react/24/solid';

const UnifiedHealthDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { actualTheme, theme, setTheme, autoSyncTime, setAutoSyncTime } = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";

  // Premium navigation structure following UX best practices
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeSolidIcon,
      description: 'Your wellness overview',
      gradient: 'from-blue-500 via-purple-500 to-pink-500'
    },
    {
      id: 'coach',
      label: 'AI Coach',
      icon: ChatBubbleLeftRightIcon,
      activeIcon: ChatSolidIcon,
      description: 'Personalized guidance',
      badge: 'AI',
      gradient: 'from-purple-500 via-indigo-500 to-blue-500'
    },
    {
      id: 'health',
      label: 'Health',
      icon: ChartBarIcon,
      activeIcon: ChartSolidIcon,
      description: 'Analytics & insights',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      children: [
        { id: 'metrics', label: 'Live Metrics', description: 'Real-time biometric data' },
        { id: 'analytics', label: 'Advanced Analytics', description: 'Deep health insights' },
        { id: 'devices', label: 'Connected Devices', description: 'Wearables & monitors' }
      ]
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: BeakerIcon,
      activeIcon: BeakerIcon,
      description: 'Food & recipes',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      children: [
        { id: 'logger', label: 'Food Logger', description: 'Track your meals' },
        { id: 'recipes', label: 'Recipe Search', description: 'Healthy meal ideas' }
      ]
    },
    {
      id: 'supplements',
      label: 'Shop',
      icon: ShoppingBagIcon,
      activeIcon: ShoppingSolidIcon,
      description: 'Premium supplements',
      gradient: 'from-orange-500 via-red-500 to-pink-500'
    },
    {
      id: 'fitness',
      label: 'Fitness',
      icon: BoltIcon,
      activeIcon: BoltIcon,
      description: 'Training & workouts',
      gradient: 'from-red-500 via-orange-500 to-yellow-500'
    }
  ];

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';

  const handleMenuToggle = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleNavigation = (itemId: string, subItemId?: string) => {
    const targetView = subItemId ? `${itemId}-${subItemId}` : itemId;
    setActiveView(targetView);
    setIsMobileMenuOpen(false);
    setExpandedMenu(null);
  };

  const handleQuickAction = (action: string) => {
    setActiveView(action);
  };

  const ThemeToggle = () => (
    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('light');
        }}
        className={`p-3 rounded-xl transition-all duration-300 ${
          theme === 'light' && !autoSyncTime
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-110'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title="Light theme"
        aria-label="Switch to light theme"
      >
        <SunIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          setAutoSyncTime(true);
          setTheme('auto');
        }}
        className={`p-3 rounded-xl transition-all duration-300 ${
          autoSyncTime
            ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg scale-110'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title="Auto theme"
        aria-label="Switch to automatic theme"
      >
        <ComputerDesktopIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          setAutoSyncTime(false);
          setTheme('dark');
        }}
        className={`p-3 rounded-xl transition-all duration-300 ${
          theme === 'dark' && !autoSyncTime
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-110'
            : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
        title="Dark theme"
        aria-label="Switch to dark theme"
      >
        <MoonIcon className="w-5 h-5" />
      </button>
    </div>
  );

  const handleSupplementShortcut = (products: string[], category: string) => {
    onQuickAction?.('supplements');
    
    toast({
      title: `🛒 ${products.join(' or ')} Available`,
      description: `Premium ${category} supplements for better performance`,
      action: {
        label: "Shop Now",
        onClick: () => onQuickAction?.('supplements')
      }
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case 'coach':
        return <AICoachEnhanced />;
      case 'health':
      case 'health-metrics':
      case 'health-analytics':
      case 'health-devices':
        return <HealthDashboard />;
      case 'nutrition':
      case 'nutrition-logger':
      case 'nutrition-recipes':
        return <NutritionDashboard onQuickAction={handleQuickAction} />;
      case 'supplements':
        return <SupplementShopEnhanced onQuickAction={handleQuickAction} />;
      case 'fitness':
        return <FitnessDashboard onQuickAction={handleQuickAction} />;
      case 'profile':
        return <ProfileSettingsEnhanced />;
      default:
        return (
          <div className="space-y-8">
            <WelcomeHeader onQuickAction={handleQuickAction} />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-8">
                <HealthMetrics />
                <AIInsights onQuickAction={handleQuickAction} />
              </div>
              
              {/* Right Column */}
              <div className="space-y-8">
                <ReadinessScore score={87} />
                <TodaysPlan />
                <ActivityFeed />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* Ultra-Premium Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Aurora */}
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary Aurora */}
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/25 to-cyan-600/25 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 0.9, 1.1],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-violet-600/20 rounded-full blur-2xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      </div>

      {/* Desktop Navigation - Ultra Premium */}
      <nav 
        className="hidden lg:flex fixed inset-y-0 z-50 w-80 flex-col"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl px-8 pb-6 shadow-2xl border-r border-white/20 dark:border-slate-700/20">
          {/* Logo Section */}
          <header role="banner" className="flex h-24 shrink-0 items-center gap-4 pt-8">
            <motion.button
              onClick={() => window.location.href = '/'}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              aria-label="Biowell home page"
            >
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-14 w-auto"
              />
            </motion.button>
          </header>

          {/* Premium User Profile Card */}
          <motion.div 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-6 shadow-2xl"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            role="region"
            aria-label="User profile information"
          >
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-gradient-shift" />
            
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    y: [-5, 5, -5],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                <span className="text-white font-bold text-xl">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-white truncate">
                  Welcome back, {firstName}
                </p>
                <p className="text-white/80 truncate text-sm">
                  {user?.email}
                </p>
              </div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg" />
            </div>
          </motion.div>

          {/* Premium Theme Toggle */}
          <div className="px-6 py-4 bg-white/10 dark:bg-slate-800/10 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Appearance</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Main Navigation with Premium Effects */}
          <div className="flex flex-1 flex-col">
            <nav role="navigation" aria-label="Primary navigation" className="flex flex-1 flex-col gap-y-3">
              {navigationItems.map((item) => {
                const isActive = activeView === item.id || activeView.startsWith(`${item.id}-`);
                const Icon = isActive ? item.activeIcon : item.icon;
                
                return (
                  <div key={item.id}>
                    <motion.button
                      onClick={() => item.children ? handleMenuToggle(item.id) : handleNavigation(item.id)}
                      className={`group relative w-full flex items-center gap-x-4 rounded-2xl p-4 text-left font-semibold transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-2xl scale-105`
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 hover:scale-102'
                      }`}
                      whileHover={{ x: isActive ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                      aria-current={isActive ? 'page' : undefined}
                      aria-expanded={item.children ? expandedMenu === item.id : undefined}
                    >
                      {/* Premium glow effect for active item */}
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-xl opacity-30 -z-10`} />
                      )}
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20 backdrop-blur-xl shadow-lg' 
                          : 'bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-white/30 dark:group-hover:bg-slate-700/30'
                      }`}>
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{item.label}</span>
                          {item.badge && (
                            <span className="px-3 py-1 bg-emerald-400 text-slate-900 text-xs font-bold rounded-full animate-pulse">
                              {item.badge}
                            </span>
                          )}
                          {item.children && (
                            <ChevronDownIcon 
                              className={`w-5 h-5 transition-transform duration-300 ${
                                expandedMenu === item.id ? 'rotate-180' : ''
                              }`} 
                            />
                          )}
                        </div>
                        <div className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </motion.button>

                    {/* Premium Sub-menu */}
                    <AnimatePresence>
                      {item.children && expandedMenu === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-8 mt-2 space-y-2"
                        >
                          {item.children.map((subItem) => (
                            <motion.button
                              key={subItem.id}
                              onClick={() => handleNavigation(item.id, subItem.id)}
                              className="w-full flex items-center space-x-3 p-3 rounded-xl text-left hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all duration-200"
                              whileHover={{ x: 4 }}
                            >
                              <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                              <div>
                                <div className="font-medium text-slate-700 dark:text-slate-300">{subItem.label}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{subItem.description}</div>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Premium Secondary Actions */}
          <nav role="navigation" aria-label="Secondary navigation" className="space-y-2 pt-6 border-t border-white/20 dark:border-slate-700/20">
            <motion.button 
              onClick={() => setShowNotifications(true)}
              className="group w-full flex items-center gap-x-3 rounded-xl p-3 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all duration-200"
              whileHover={{ x: 4 }}
              aria-label="Open notifications"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Notifications</span>
              <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </motion.button>
            
            <motion.button 
              onClick={() => handleNavigation('profile')}
              className="group w-full flex items-center gap-x-3 rounded-xl p-3 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all duration-200"
              whileHover={{ x: 4 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center">
                <Cog6ToothIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Settings</span>
            </motion.button>
            
            <motion.button 
              onClick={signOut}
              className="group w-full flex items-center gap-x-3 rounded-xl p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
              whileHover={{ x: 4 }}
              aria-label="Sign out of your account"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </nav>
        </div>
      </nav>

      {/* Mobile Header - Ultra Premium */}
      <header 
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl border-b border-white/20 dark:border-slate-700/20 shadow-xl"
        role="banner"
        aria-label="Mobile application header"
      >
        <SafeArea top>
          <div className="flex items-center justify-between p-6">
            <motion.button
              onClick={() => window.location.href = '/'}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              whileHover={{ scale: 1.05 }}
              aria-label="Biowell home page"
            >
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-10 w-auto"
              />
            </motion.button>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowSearch(true)}
                className="p-3 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-slate-700/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open search"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </motion.button>
              
              <motion.button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-slate-700/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open notifications"
              >
                <BellIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              </motion.button>
              
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-slate-700/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </motion.button>
            </div>
          </div>
        </SafeArea>
      </header>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            <motion.aside 
              className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl z-50 shadow-2xl border-l border-white/20 dark:border-slate-700/20"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <SafeArea top bottom right>
                <div className="flex flex-col h-full p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Menu</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
                      aria-label="Close menu"
                    >
                      <XMarkIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>

                  {/* Navigation Items */}
                  <nav role="navigation" aria-label="Mobile navigation" className="flex-1 space-y-3">
                    {navigationItems.map((item, index) => {
                      const isActive = activeView === item.id || activeView.startsWith(`${item.id}-`);
                      const Icon = isActive ? item.activeIcon : item.icon;
                      
                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => item.children ? handleMenuToggle(item.id) : handleNavigation(item.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl`
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isActive ? 'bg-white/20' : 'bg-slate-100/80 dark:bg-slate-800/80'
                            }`}>
                              <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                            </div>
                            <div>
                              <div className="font-semibold text-lg">{item.label}</div>
                              <div className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                {item.description}
                              </div>
                            </div>
                          </div>
                          {item.children && (
                            <ChevronDownIcon 
                              className={`w-5 h-5 transition-transform ${
                                expandedMenu === item.id ? 'rotate-180' : ''
                              }`} 
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </SafeArea>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Premium Mobile Bottom Navigation */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl border-t border-white/20 dark:border-slate-700/20 shadow-2xl"
        role="navigation"
        aria-label="Primary navigation"
      >
        <SafeArea bottom>
          <div className="flex items-center justify-around p-4">
            {[
              { id: 'dashboard', icon: HomeIcon, activeIcon: HomeSolidIcon, label: 'Home' },
              { id: 'health', icon: HeartIcon, activeIcon: HeartIcon, label: 'Health' },
              { id: 'coach', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolidIcon, label: 'Coach' },
              { id: 'supplements', icon: ShoppingBagIcon, activeIcon: ShoppingSolidIcon, label: 'Shop' }
            ].map((item) => {
              const Icon = activeView === item.id ? item.activeIcon : item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 relative ${
                    isActive ? 'bg-gradient-to-t from-blue-500 to-purple-600 text-white shadow-xl scale-110' : 'text-slate-600 dark:text-slate-400'
                  }`}
                  whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-semibold">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute -top-1 w-1 h-1 bg-emerald-400 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </SafeArea>
      </nav>

      {/* Main Content with Premium Spacing */}
      <main 
        className="lg:pl-80 pt-24 lg:pt-8 pb-24 lg:pb-8"
        role="main"
        id="main-content"
      >
        <div className="px-6 lg:px-12 max-w-7xl mx-auto">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>

      {/* Premium Floating Elements */}
      <QuickActionMenu onQuickAction={handleQuickAction} />
      <OfflineIndicator />
      
      {/* Premium Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
            onClick={() => setShowSearch(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Search dialog"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartSearch 
                onNavigate={(path) => {
                  handleNavigation(path);
                  setShowSearch(false);
                }}
                className="w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default UnifiedHealthDashboard;