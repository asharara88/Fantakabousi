import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { MobileContainer } from '../ui/MobileOptimized';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab = 'dashboard', onTabChange }) => {
  const { signOut } = useAuth();
  const { actualTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Use the exact Biowell logo URLs provided
  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI" // White logo for dark background
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY"; // Dark logo for light background

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      name: 'Dashboard', 
      id: 'dashboard',
      icon: HomeIcon, 
      href: '/', 
      badge: false
    },
    { 
      name: 'Coach', 
      id: 'coach',
      icon: ChatBubbleLeftRightIcon, 
      href: '/coach', 
      badge: true
    },
    { 
      name: 'Health', 
      id: 'health',
      icon: HeartIcon, 
      href: '/health', 
      badge: false
    },
    { 
      name: 'Stack', 
      id: 'shop',
      icon: ShoppingBagIcon, 
      href: '/supplements', 
      badge: false
    },
    { 
      name: 'Profile', 
      id: 'profile',
      icon: UserCircleIcon, 
      href: '/profile', 
      badge: false
    },
  ];

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full w-80 z-50">
        <div className="card-minimal w-full m-4 flex flex-col py-6 px-4 space-y-6">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-28 h-10 flex items-center">
              <img 
                src={logoUrl}
                alt="Biowell"
                className="h-16 w-auto object-contain max-w-full"
              />
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex flex-col space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`relative flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 w-full ${
                  activeTab === item.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                onClick={() => onTabChange?.(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
                
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-0.5 h-6 bg-primary rounded-full"
                  />
                )}
                
                {item.badge && (
                  <div className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </motion.button>
            ))}
          </div>

          {/* AI Status */}
          <div className="flex-1 flex items-end justify-center pb-6">
            <div className="relative w-full">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <SparklesIcon className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-foreground">Coach</div>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </div>
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col space-y-2">
            <button
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center space-x-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 w-full"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span className="font-medium text-sm">Settings</span>
            </button>
            
            <button
              whileHover={{ scale: 1.05, y: -2 }}
              onClick={signOut}
              className="flex items-center space-x-3 p-3 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-20' : 'bg-background/60 backdrop-blur-10'
      }`}>
        <div className="container-premium">
          <div className="flex items-center justify-between h-14 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-6">
                <img 
                  src={logoUrl}
                  alt="Biowell"
                  className="h-full w-auto object-contain max-w-full"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <BellIcon className="w-5 h-5" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-background/95 backdrop-blur-20 border-r border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 pt-16">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-24 h-8">
                    <img 
                      src={logoUrl}
                      alt="Biowell"
                      className="h-full w-auto object-contain max-w-full"
                    />
                  </div>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-300 ${
                        item.active
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="relative">
                        <item.icon className="w-5 h-5" />
                        {item.badge && (
                          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <span className="font-medium text-sm">{item.name}</span>
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-6 pt-4 border-t border-border space-y-2">
                  <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300">
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="font-medium text-sm">Settings</span>
                  </button>
                  
                  <button
                    onClick={signOut}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-20 border-t border-border safe-area-bottom">
        <div className="px-3 py-2">
          <div className="bg-card/95 backdrop-blur-20 rounded-xl p-1.5 border border-border/50">
            <div className="flex items-center justify-around w-full">
              {navItems.slice(0, 5).map((item, index) => (
                <button
                  key={item.name}
                  className={`touch-target flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 flex-1 min-w-0 haptic-medium ${
                    activeTab === item.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    onTabChange?.(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                    {item.badge && (
                      <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center leading-tight">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;