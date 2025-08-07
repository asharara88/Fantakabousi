import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Home, 
  Activity, 
  MessageCircle, 
  Utensils, 
  ShoppingBag, 
  User,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  Zap
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzU0MzgwMDY1LCJleHAiOjE3ODU5MTYwNjV9.W4lMMJpIbCmQrbsJFDKK-eRoSnvQ3UUdz4DhUF-jwOc"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1NDM4MDA4NywiZXhwIjoxNzg1OTE2MDg3fQ.GTBPM8tMs-jtvycD39wO6Bt32JHyEWB4a-tWle0jl8I";

  // Simplified navigation - mobile-first
  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Home', 
      icon: Home, 
      path: '/dashboard',
      description: 'Your health today',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'health', 
      label: 'My Health', 
      icon: Activity, 
      path: '/dashboard/health',
      description: 'Track your progress',
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'coach', 
      label: 'Ask Coach', 
      icon: MessageCircle, 
      path: '/dashboard/coach',
      description: 'Get health advice',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      id: 'nutrition', 
      label: 'Food', 
      icon: Utensils, 
      path: '/dashboard/nutrition',
      description: 'Log meals & recipes',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'supplements', 
      label: 'Shop', 
      icon: ShoppingBag, 
      path: '/dashboard/supplements',
      description: 'Health supplements',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  const firstName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Mobile Header - Always Visible */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="Biowell" 
              className="h-8 w-auto"
            />
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                Hi {firstName}! 👋
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                How are you feeling today?
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar - Simplified */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-6 pb-6 border-r border-slate-200/50 dark:border-slate-700/50">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center">
            <img 
              src={logoUrl} 
              alt="Biowell" 
              className="h-10 w-auto"
            />
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="space-y-2">
              <div className="text-xl font-bold">Welcome back!</div>
              <div className="text-blue-100">Ready to improve your health?</div>
            </div>
          </div>

          {/* Simple Navigation */}
          <nav className="flex flex-1 flex-col space-y-3">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group flex items-center space-x-4 rounded-2xl p-4 text-left font-medium transition-all duration-200 ${
                    active
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    active 
                      ? 'bg-white/20' 
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    <item.icon className={`w-6 h-6 ${active ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{item.label}</div>
                    <div className={`text-sm ${active ? 'text-white/80' : 'text-slate-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Quick Theme Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-2">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-2 rounded-lg transition-all ${
                theme === 'light' ? 'bg-white shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sun className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-2 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Moon className="w-4 h-4 mx-auto" />
            </button>
          </div>

          {/* Sign Out */}
          <button
            onClick={signOut}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
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
                  <img 
                    src={logoUrl} 
                    alt="Biowell" 
                    className="h-8 w-auto"
                  />
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 space-y-3">
                  {navigationItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-4 rounded-2xl p-4 text-left font-medium transition-all duration-200 ${
                          active
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <div>
                          <div className="text-lg font-semibold">{item.label}</div>
                          <div className={`text-sm ${active ? 'text-white/80' : 'text-slate-500'}`}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>

                <button
                  onClick={signOut}
                  className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
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
      <main className="lg:pl-72 pt-20">
        <div className="p-4 lg:p-6">
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

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <div className="flex items-center justify-around p-2">
          {navigationItems.slice(0, 4).map((item) => {
            const active = isActive(item.path);
            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 min-w-[60px] ${
                  active 
                    ? `bg-gradient-to-t ${item.color} text-white shadow-lg` 
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
          
          {/* Profile in bottom nav */}
          <motion.button
            onClick={() => navigate('/dashboard/profile')}
            className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 min-w-[60px] ${
              location.pathname === '/dashboard/profile'
                ? 'bg-gradient-to-t from-slate-500 to-slate-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </motion.button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;