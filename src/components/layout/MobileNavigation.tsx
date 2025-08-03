import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProfile } from '../../hooks/useProfile';
import NotificationCenter from '../notifications/NotificationCenter';
import SafeArea from '../ui/SafeArea';
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
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  BookOpenIcon
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
  const { actualTheme, theme, setTheme, autoSyncTime, setAutoSyncTime } = useTheme();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";

  const navigationItems = [
    { id: 'dashboard', label: 'Home', icon: HomeIcon, activeIcon: HomeSolidIcon },
    { id: 'health', label: 'Health', icon: HeartIcon, activeIcon: HeartSolidIcon },
    { id: 'recipes', label: 'Recipes', icon: BookOpenIcon, activeIcon: BookOpenIcon },
    { id: 'coach', label: 'Coach', icon: ChatBubbleLeftRightIcon, activeIcon: ChatSolidIcon },
    { id: 'shop', label: 'Shop', icon: ShoppingBagIcon, activeIcon: ShoppingSolidIcon }
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
      {/* Mobile Header - Banner */}
      <header 
        role="banner" 
        aria-label="Mobile application header"
        className="lg:hidden mobile-header"
      >
        <SafeArea top>
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                onClick={() => window.location.href = '/'}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                title="Back to Home"
                aria-label="Biowell home page"
              >
                <img 
                  src={logoUrl}
                  alt="Biowell"
                  className="h-10 w-auto"
                />
              </button>
            </motion.div>
          
            <div className="flex items-center space-x-2">
              <button 
              role="button"
              aria-label="Open notifications"
              onClick={() => setShowNotifications(true)}
              className="touch-target cursor-pointer relative rounded-xl hover:bg-muted transition-colors"
            >
              <BellIcon className="w-6 h-6 text-muted-foreground" />
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent-neon rounded-full animate-pulse"
                role="status"
                aria-label="New notifications available"
              ></div>
              </button>
            
              <motion.button
              role="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={onMenuToggle}
              className="touch-target cursor-pointer rounded-xl hover:bg-muted transition-all duration-200"
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
        </SafeArea>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            role="presentation"
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
          <aside 
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card z-50 shadow-2xl"
          >
            <SafeArea top bottom right>
              <motion.div
                className="flex flex-col h-full"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                {/* Header */}
                <header className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <h2 id="mobile-menu-title" className="sr-only">Mobile Navigation Menu</h2>
                    <button
                      onClick={() => {
                        window.location.href = '/';
                        onMenuToggle();
                      }}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      title="Back to Home"
                      aria-label="Biowell home page"
                    >
                      <img 
                        src={logoUrl}
                        alt="Biowell"
                        className="h-10 w-auto"
                      />
                    </button>
                    <span className="text-heading-md text-foreground">Menu</span>
                  </div>
                  <button
                  aria-label="Close menu"
                  onClick={onMenuToggle}
                  className="touch-target cursor-pointer rounded-xl hover:bg-muted transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-muted-foreground" />
                  </button>
                </header>

                {/* User Profile */}
                <section role="region" aria-label="User profile information">
                  <div className="p-6 bg-gradient-to-r from-[#48C6FF]/10 to-[#3BE6C5]/10 border-b border-border">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg"
                        role="img"
                        aria-label={`${firstName} profile avatar`}
                      >
                        <span className="text-white font-bold text-lg font-inter">
                          {firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground font-inter">{firstName}</p>
                        <p className="text-sm text-muted-foreground truncate font-inter">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Navigation */}
                <nav role="navigation" aria-label="Main navigation" className="flex-1 p-6">
                  <ul role="menubar" className="space-y-2" aria-label="Navigation menu">
                  {navigationItems.map((item, index) => {
                    const Icon = currentView === item.id ? item.activeIcon : item.icon;
                    const isActive = currentView === item.id;
                    
                    return (
                      <li key={item.id} role="none">
                        <motion.button
                        role="menuitem"
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={`Navigate to ${item.label}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          onViewChange(item.id);
                          onMenuToggle();
                        }}
                        className={`w-full flex items-center space-x-4 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer touch-target ${
                          isActive 
                            ? 'bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white shadow-lg' 
                            : 'text-foreground hover:bg-muted'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                        <span className="text-base font-semibold font-inter">{item.label}</span>
                        </motion.button>
                      </li>
                    );
                  })}
                  </ul>
                </nav>

                {/* Bottom Actions */}
                <nav role="navigation" aria-label="Account actions" className="p-6 border-t border-border space-y-2">
                  <button 
                  role="menuitem"
                  aria-label="Open notifications"
                  onClick={() => {
                    setShowNotifications(true);
                    onMenuToggle();
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-foreground hover:text-[#48C6FF] hover:bg-[#48C6FF]/10 transition-all duration-200 cursor-pointer"
                >
                  <BellIcon className="w-5 h-5" />
                  <span className="text-base font-medium font-inter">Notifications</span>
                  <span 
                    className="ml-auto w-2 h-2 bg-[#3BE6C5] rounded-full animate-pulse"
                    role="status"
                    aria-label="New notifications available"
                  ></span>
                  </button>
                  <button 
                  role="menuitem"
                  onClick={() => {
                    onViewChange('profile');
                    onMenuToggle();
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="text-base font-medium font-inter">Profile & Settings</span>
                  </button>
                  <button 
                  role="menuitem"
                  aria-label="Sign out of your account"
                  onClick={signOut}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="text-base font-medium font-inter">Sign Out</span>
                  </button>
                </nav>
              </motion.div>
            </SafeArea>
          </aside>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav 
        role="navigation" 
        aria-label="Primary navigation"
        className="lg:hidden mobile-nav"
      >
        <SafeArea bottom>
          <ul role="menubar" className="flex items-center justify-around" aria-label="Main navigation">
          {navigationItems.map((item) => {
            const Icon = currentView === item.id ? item.activeIcon : item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id} role="none">
                <motion.button
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
                onClick={() => onViewChange(item.id)}
                className={`mobile-nav-item cursor-pointer ${isActive ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-semibold mt-1 truncate">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-light rounded-full"
                    aria-hidden="true"
                  />
                )}
                </motion.button>
              </li>
            );
          })}
          </ul>
        </SafeArea>
      </nav>

      {/* Notification Center - Complementary */}
      <aside role="complementary" aria-label="Notification center">
        <NotificationCenter 
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </aside>
    </>
  );
}