import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
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

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: HomeIcon, 
      activeIcon: HomeSolidIcon,
      description: 'Your health overview'
    },
    { 
      id: 'coach', 
      label: 'AI Coach', 
      icon: ChatBubbleLeftRightIcon, 
      activeIcon: ChatSolidIcon,
      description: 'Personalized guidance'
    },
    { 
      id: 'health', 
      label: 'Health', 
      icon: HeartIcon, 
      activeIcon: HeartSolidIcon,
      description: 'Metrics & analytics'
    },
    { 
      id: 'shop', 
      label: 'Supplements', 
      icon: ShoppingBagIcon, 
      activeIcon: ShoppingSolidIcon,
      description: 'Your supplement stack'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: UserCircleIcon, 
      activeIcon: UserSolidIcon,
      description: 'Settings & preferences'
    },
  ];

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'User';
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed inset-y-0 z-50 w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-xl border-r border-gray-200">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center gap-4 pt-6">
            <img 
              src={logoUrl}
              alt="Biowell"
              className="h-12 w-auto"
            />
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 shadow-sm">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">
                Welcome back, {firstName}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {user?.email}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`h-7 w-7 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
                  <div className="flex-1 text-left">
                    <div>{item.label}</div>
                    <div className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1 h-6 bg-white rounded-full"
                    />
                  )}
                </motion.button>
                </li>
              );
            })}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="space-y-2 pt-6 border-t border-gray-200">
            <button className="group flex gap-x-4 rounded-2xl p-4 text-base leading-6 font-semibold w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
              <BellIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600" />
              <span>Notifications</span>
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="group flex gap-x-4 rounded-2xl p-4 text-base leading-6 font-semibold w-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
              <Cog6ToothIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-blue-600" />
              <span>Settings</span>
            </button>
            <button 
              onClick={signOut}
              className="group flex gap-x-4 rounded-2xl p-4 text-base leading-6 font-semibold w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0 text-red-500 group-hover:text-red-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;