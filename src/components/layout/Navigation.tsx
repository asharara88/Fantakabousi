import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeSolidIcon, 
  ChatBubbleLeftRightIcon as ChatSolidIcon, 
  HeartIcon as HeartSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon,
  UserCircleIcon as UserSolidIcon
} from '@heroicons/react/24/solid';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { actualTheme } = useTheme();

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: HomeIcon, 
      activeIcon: HomeSolidIcon 
    },
    { 
      id: 'coach', 
      label: 'AI Coach', 
      icon: ChatBubbleLeftRightIcon, 
      activeIcon: ChatSolidIcon 
    },
    { 
      id: 'health', 
      label: 'Health', 
      icon: HeartIcon, 
      activeIcon: HeartSolidIcon 
    },
    { 
      id: 'shop', 
      label: 'Supplements', 
      icon: ShoppingBagIcon, 
      activeIcon: ShoppingSolidIcon 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: UserCircleIcon, 
      activeIcon: UserSolidIcon 
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="nav-desktop lg:block hidden">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logoUrl}
              alt="Biowell"
              className="h-8 w-auto"
            />
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = isActive ? item.activeIcon : item.icon;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`nav-item w-full ${isActive ? 'active' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Settings */}
          <div className="pt-4 border-t border-border">
            <button className="nav-item w-full">
              <Cog6ToothIcon className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="nav-mobile lg:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = isActive ? item.activeIcon : item.icon;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-mobile-item ${isActive ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;