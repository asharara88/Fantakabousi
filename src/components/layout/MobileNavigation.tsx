import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../hooks/useProfile';
import NotificationCenter from '../notifications/NotificationCenter';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolidIcon, 
  ChatBubbleLeftRightIcon as ChatSolidIcon, 
  HeartIcon as HeartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon,
  UserCircleIcon as UserSolidIcon
} from '@heroicons/react/24/solid';

interface MobileNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export function MobileNavigation({ 
  currentView, 
  onViewChange, 
  isMenuOpen, 
  onMenuToggle 
}: MobileNavigationProps) {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";

  const navigationItems = [
    { id: 'dashboard', label: 'Home', icon: HomeIcon, activeIcon: HomeSolidIcon },
    { id: 'health', label: 'Health', icon: HeartIcon, activeIcon: HeartSolidIcon },
    { id: 'coach', label: 'Coach', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolidIcon },
    { id: 'shop', label: 'Shop', icon: ShoppingBagIcon, activeIcon: ShoppingSolidIcon },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon, activeIcon: UserSolidIcon },
  ];

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      {/* Mobile Header - Always Visible */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img 
              src={logoUrl}
              alt="Biowell"
              className="h-17 w-auto"
            />
          </motion.div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <BellIcon className="w-6 h-6 text-muted-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            </button>
            
            <motion.button
              onClick={onMenuToggle}
              className="p-2 rounded-xl hover:bg-muted transition-all duration-200"
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-muted-foreground" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-muted-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
            onClick={onMenuToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden fixed top-0 right-0 h-full w-80 bg-card z-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <img 
                    src={logoUrl}
                    alt="Biowell"
                    className="h-14 w-auto"
                  />
                  <span className="text-lg font-bold text-foreground">Menu</span>
                </div>
                <button
                  onClick={onMenuToggle}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              {/* User Profile */}
              <div className="p-6 bg-gradient-to-r from-blue-light/10 to-neon-green/10 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-blue-light rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{firstName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-6">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = currentView === item.id ? item.activeIcon : item.icon;
                    const isActive = currentView === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          onViewChange(item.id);
                          onMenuToggle();
                        }}
                        className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-brand text-white shadow-lg' 
                            : 'text-foreground hover:bg-muted'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                        <span className="font-semibold">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              {/* Bottom Actions */}
              <div className="p-6 border-t border-border space-y-2">
                <button 
                  onClick={() => {
                    setShowNotifications(true);
                    onMenuToggle();
                  }}
                  className="group flex gap-x-4 rounded-2xl p-4 text-base leading-6 font-semibold w-full text-foreground hover:text-blue-light hover:bg-blue-light/10 transition-all duration-200"
                >
                  <BellIcon className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                  <span className="ml-auto w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                </button>
                <button className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-foreground hover:bg-muted hover:text-foreground transition-all duration-200">
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button 
                  onClick={signOut}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Bottom Navigation Bar - Always Visible */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const Icon = currentView === item.id ? item.activeIcon : item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`relative flex flex-col items-center justify-center px-3 py-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                  isActive 
                    ? 'text-blue-light bg-blue-light/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                style={{ minHeight: '60px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-blue-light' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-semibold mt-1 truncate ${isActive ? 'text-blue-light' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-light rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}