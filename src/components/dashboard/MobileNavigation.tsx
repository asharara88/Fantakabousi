import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { navigationItems } from '../../lib/navigationConfig';
import SafeArea from '../ui/SafeArea';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationCenter from '../notifications/NotificationCenter';
import SmartSearch from '../ui/SmartSearch';
import { 
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon
} from '@heroicons/react/24/solid';

interface MobileNavigationProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeView, onNavigate }) => {
  const { actualTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzU0MzgwMDY1LCJleHAiOjE3ODU5MTYwNjV9.W4lMMJpIbCmQrbsJFDKK-eRoSnvQ3UUdz4DhUF-jwOc"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1NDM4MDA4NywiZXhwIjoxNzg1OTE2MDg3fQ.GTBPM8tMs-jtvycD39wO6Bt32JHyEWB4a-tWle0jl8I";

  const handleSearch = (query: string) => {
    // Implement search functionality
    console.log('Searching for:', query);
    // You can add actual search logic here
  };

  const handleNavigateFromSearch = (path: string) => {
    onNavigate(path);
    setShowSearch(false);
  };
  return (
    <>
      {/* Mobile Header */}
      <header 
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl border-b border-white/20 dark:border-slate-700/20 shadow-xl"
        role="banner"
      >
        <SafeArea top>
          <div className="flex items-center justify-between p-6">
            <img 
              src={logoUrl} 
              alt="Biowell" 
              className="h-10 w-auto"
            />
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-3 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-slate-700/30"
                aria-label="Toggle search"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
              
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-slate-700/30"
                aria-label="Toggle notifications"
              >
                <BellIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              </button>
              
              <ThemeToggle variant="mobile" />
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-xl border border-white/30 dark:border-slate-700/30"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Bars3Icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </SafeArea>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 border-b border-white/20 dark:border-slate-700/20"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeArea top>
                <div className="pt-20">
                  <SmartSearch
                    onSearch={handleSearch}
                    onNavigate={handleNavigateFromSearch}
                    placeholder="Search health data, supplements, recipes..."
                    className="w-full"
                  />
                </div>
              </SafeArea>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Menu */}
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
            >
              <SafeArea top bottom right>
                <div className="flex flex-col h-full p-6">
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

                  <nav className="flex-1 space-y-3">
                    {navigationItems.map((item, index) => {
                      const isActive = activeView === item.id || activeView.startsWith(`${item.id}-`);
                      const Icon = isActive ? item.activeIcon : item.icon;
                      
                      return (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            onNavigate(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-4 p-4 rounded-2xl text-left transition-all duration-300 ${
                            isActive
                              ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl`
                              : 'text-slate-700 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-800/20'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
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

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      {/* Bottom Navigation */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/10 dark:bg-slate-900/10 backdrop-blur-3xl border-t border-white/20 dark:border-slate-700/20 shadow-2xl"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <SafeArea bottom>
          <div className="flex items-center justify-around p-4">
            {[
              { id: 'dashboard', icon: HomeIcon, activeIcon: HomeSolidIcon, label: 'Home' },
              { id: 'health', icon: HeartIcon, activeIcon: HeartIcon, label: 'Health' },
              { id: 'coach', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolidIcon, label: 'SmartCoach™' },
              { id: 'supplements', icon: ShoppingBagIcon, activeIcon: ShoppingSolidIcon, label: 'Supplements' }
            ].map((item) => {
              const Icon = activeView === item.id ? item.activeIcon : item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-t from-blue-500 to-purple-600 text-white shadow-xl' : 'text-slate-600 dark:text-slate-400'
                  }`}
                  whileHover={{ scale: isActive ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </SafeArea>
      </nav>
    </>
  );
};

export default MobileNavigation;