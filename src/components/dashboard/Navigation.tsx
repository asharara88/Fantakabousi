import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import { navigationItems } from '../../lib/navigationConfig';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationCenter from '../notifications/NotificationCenter';
import SmartSearch from '../ui/SmartSearch';
import { 
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onNavigate }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzU0MzgwMDY1LCJleHAiOjE3ODU5MTYwNjV9.W4lMMJpIbCmQrbsJFDKK-eRoSnvQ3UUdz4DhUF-jwOc"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1NDM4MDA4NywiZXhwIjoxNzg1OTE2MDg3fQ.GTBPM8tMs-jtvycD39wO6Bt32JHyEWB4a-tWle0jl8I";

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';

  const handleMenuToggle = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleNavigation = (itemId: string, subItemId?: string) => {
    const targetView = subItemId ? `${itemId}-${subItemId}` : itemId;
    onNavigate(targetView);
    setExpandedMenu(null);
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  const handleNavigateFromSearch = (path: string) => {
    onNavigate(path);
    setShowSearch(false);
  };
  return (
    <>
      <nav 
        className="hidden lg:flex fixed inset-y-0 z-50 w-80 flex-col"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl px-8 pb-6 shadow-2xl border-r border-white/20 dark:border-slate-700/20">
          {/* Search Bar */}
          <div className="pt-8">
            <SmartSearch
              onSearch={handleSearch}
              onNavigate={handleNavigateFromSearch}
              placeholder="Search health data, supplements..."
              className="w-full"
            />
          </div>

        {/* Logo Section */}
          <header role="banner" className="flex h-16 shrink-0 items-center gap-4">
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
              className="h-12 w-auto"
            />
          </motion.button>
        </header>

        {/* User Profile Card */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-6 shadow-2xl"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
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

        {/* Theme Toggle */}
        <div className="px-6 py-4 bg-white/10 dark:bg-slate-800/10 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20">
          <ThemeToggle />
        </div>

        {/* Main Navigation */}
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
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20'
                    }`}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 backdrop-blur-xl shadow-lg' 
                        : 'bg-slate-100/80 dark:bg-slate-800/80'
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

                  {/* Sub-menu */}
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

        {/* Secondary Actions */}
        <nav role="navigation" aria-label="Secondary navigation" className="space-y-2 pt-6 border-t border-white/20 dark:border-slate-700/20">
          <motion.button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="group w-full flex items-center gap-x-3 rounded-xl p-3 text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all duration-200"
            whileHover={{ x: 4 }}
            aria-label="Toggle notifications"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BellIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Notifications</span>
            <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
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
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </nav>
        </div>
      </nav>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Search Modal for Desktop */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartSearch
                onSearch={handleSearch}
                onNavigate={(path) => {
                  onNavigate(path);
                  setShowSearch(false);
                }}
                placeholder="Search health data, supplements, recipes..."
                className="w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;