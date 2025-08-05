import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { useTheme } from '../../contexts/ThemeProvider';
import { 
  LayoutDashboard, 
  Activity, 
  Brain, 
  Utensils, 
  Pill, 
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Search,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      description: 'Health summary'
    },
    { 
      id: 'health', 
      label: 'Health Metrics', 
      icon: Activity, 
      path: '/dashboard/health',
      description: 'Biometric data'
    },
    { 
      id: 'coach', 
      label: 'AI Coach', 
      icon: Brain, 
      path: '/dashboard/coach',
      description: 'Personal guidance'
    },
    { 
      id: 'nutrition', 
      label: 'Nutrition', 
      icon: Utensils, 
      path: '/dashboard/nutrition',
      description: 'Food & recipes'
    },
    { 
      id: 'supplements', 
      label: 'Supplements', 
      icon: Pill, 
      path: '/dashboard/supplements',
      description: 'Smart stacks'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      path: '/dashboard/profile',
      description: 'Settings & preferences'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Biowell</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-slate-600 dark:text-slate-400">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-600 dark:text-slate-400">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 pb-6 border-r border-slate-200/50 dark:border-slate-700/50">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">Biowell</span>
          </div>

          {/* User Profile */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white truncate">
                  Welcome back
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 truncate">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col space-y-2">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group flex items-center space-x-3 rounded-xl px-4 py-3 text-left font-medium transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    active 
                      ? 'bg-white/20' 
                      : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                    <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{item.label}</div>
                    <div className={`text-sm ${active ? 'text-white/80' : 'text-slate-500 dark:text-slate-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(['light', 'dark', 'system'] as const).map((t) => {
              const Icon = themeIcons[t];
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 p-2 rounded-lg transition-all duration-200 ${
                    theme === t
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto" />
                </button>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">B</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">Biowell</span>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-slate-600 dark:text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {navigationItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-left font-medium transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <div>
                          <div>{item.label}</div>
                          <div className={`text-xs ${active ? 'text-white/80' : 'text-slate-500'}`}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <button
                  onClick={signOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-80 pt-20 lg:pt-0">
        <div className="p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;