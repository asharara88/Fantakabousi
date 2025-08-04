import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { 
  SparklesIcon,
  SunIcon,
  MoonIcon,
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
  HeartIcon,
  BeakerIcon,
  CubeIcon,
  FireIcon,
  CameraIcon,
  PlayIcon,
  PlusIcon,
  ArrowRightIcon,
  LightBulbIcon,
  EyeIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

interface WelcomeHeaderProps {
  onQuickAction?: (action: string) => void;
}

interface DailyWin {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  category: 'circadian' | 'movement' | 'hydration' | 'work' | 'nutrition' | 'supplements' | 'exercise';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  priority: 'high' | 'medium' | 'low';
  points: number;
  supplementShortcut?: {
    products: string[];
    category: string;
  };
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bedtimeCountdown, setBedtimeCountdown] = useState('');
  const [dailyWins, setDailyWins] = useState<DailyWin[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  
  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY";
  
  // Initialize daily wins based on current time
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const wins: DailyWin[] = [
      {
        id: 'light-exposure',
        title: 'Morning Light Exposure',
        description: 'Get 10-15 mins sunlight before caffeine',
        time: '07:00',
        completed: currentHour >= 7,
        category: 'circadian',
        icon: SunIcon,
        color: 'from-yellow-500 to-orange-600',
        priority: 'high',
        points: 25
      },
      {
        id: 'morning-walk',
        title: 'Morning Movement',
        description: '10-minute walk to activate metabolism',
        time: '07:30',
        completed: currentHour >= 8,
        category: 'movement',
        icon: BoltIcon,
        color: 'from-green-500 to-emerald-600',
        priority: 'high',
        points: 20
      },
      {
        id: 'hydration',
        title: 'Hydrate with Electrolytes',
        description: 'Get premium electrolyte supplements',
        time: '08:00',
        completed: currentHour >= 8,
        category: 'hydration',
        icon: BeakerIcon,
        color: 'from-blue-500 to-cyan-600',
        priority: 'high',
        points: 15,
        supplementShortcut: {
          products: ['LMNT', 'HUMANTRA'],
          category: 'electrolytes'
        }
      },
      {
        id: 'morning-supplements',
        title: 'Morning Stack',
        description: 'Take your morning supplements',
        time: '08:30',
        completed: currentHour >= 9,
        category: 'supplements',
        icon: CubeIcon,
        color: 'from-purple-500 to-indigo-600',
        priority: 'high',
        points: 20
      },
      {
        id: 'work-start',
        title: 'Deep Work Block',
        description: 'Start your most important work',
        time: '09:00',
        completed: currentHour >= 9,
        category: 'work',
        icon: BriefcaseIcon,
        color: 'from-indigo-500 to-purple-600',
        priority: 'medium',
        points: 15
      },
      {
        id: 'last-coffee',
        title: 'Last Coffee (1 PM)',
        description: 'Final caffeine for optimal sleep',
        time: '13:00',
        completed: currentHour >= 13,
        category: 'nutrition',
        icon: BeakerIcon,
        color: 'from-amber-500 to-orange-600',
        priority: 'high',
        points: 30
      },
      {
        id: 'lunch',
        title: 'Protein-Rich Lunch',
        description: 'High protein meal for sustained energy',
        time: '12:30',
        completed: currentHour >= 13,
        category: 'nutrition',
        icon: BeakerIcon,
        color: 'from-green-500 to-teal-600',
        priority: 'medium',
        points: 20
      },
      {
        id: 'workout',
        title: 'Training Session',
        description: 'Strength or cardio workout',
        time: '18:00',
        completed: currentHour >= 18,
        category: 'exercise',
        icon: FireIcon,
        color: 'from-red-500 to-pink-600',
        priority: 'medium',
        points: 25
      },
      {
        id: 'dinner',
        title: 'Light Dinner',
        description: 'Balanced meal 3 hours before bed',
        time: '19:30',
        completed: currentHour >= 20,
        category: 'nutrition',
        icon: HeartIcon,
        color: 'from-rose-500 to-pink-600',
        priority: 'medium',
        points: 15
      },
      {
        id: 'evening-supplements',
        title: 'Evening Stack',
        description: 'Magnesium + sleep optimization',
        time: '21:30',
        completed: currentHour >= 22,
        category: 'supplements',
        icon: MoonIcon,
        color: 'from-indigo-500 to-purple-600',
        priority: 'high',
        points: 20
      }
    ];
    
    setDailyWins(wins);
    setTotalPoints(wins.filter(w => w.completed).reduce((sum, w) => sum + w.points, 0));
  }, []);
  
  // Live time and bedtime countdown
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate bedtime countdown (11 PM)
      const bedtime = new Date();
      bedtime.setHours(23, 0, 0, 0);
      
      if (now > bedtime) {
        bedtime.setDate(bedtime.getDate() + 1);
      }
      
      const diff = bedtime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setBedtimeCountdown(`${hours}h ${minutes}m`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';
  const completedWins = dailyWins.filter(w => w.completed).length;
  const progressPercentage = (completedWins / dailyWins.length) * 100;

  const handleSupplementShortcut = (products: string[], category: string) => {
    onQuickAction?.('supplements');
    
    toast({
      title: `🛒 ${products.join(' or ')} Available`,
      description: `Premium ${category} supplements ready to order`,
      action: {
        label: "Shop Now",
        onClick: () => onQuickAction?.('supplements')
      }
    });
  };

  const toggleWin = (winId: string) => {
    const handleSupplementShortcut = (products: string[], category: string) => {
      onQuickAction?.('supplements');
      
      toast({
        title: `🛒 ${products.join(' or ')} Available`,
        description: `Premium ${category} supplements ready to order`,
        action: {
          label: "Shop Now",
          onClick: () => onQuickAction?.('supplements')
        }
      });
    };

    setDailyWins(prev => prev.map(win => {
      if (win.id === winId) {
        const newCompleted = !win.completed;
        
        if (newCompleted) {
          // Celebration for completing a win
          toast({
            title: `🎉 ${win.title} Complete!`,
            description: `+${win.points} points earned. Great job!`,
          });
          setTotalPoints(prev => prev + win.points);
        } else {
          setTotalPoints(prev => prev - win.points);
        }
        
        return { ...win, completed: newCompleted };
      }
      return win;
    }));
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  const getNextWin = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    return dailyWins.find(win => {
      const [winHour, winMinute] = win.time.split(':').map(Number);
      const winTimeInMinutes = winHour * 60 + winMinute;
      return !win.completed && winTimeInMinutes > currentTimeInMinutes;
    });
  };

  const nextWin = getNextWin();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'circadian': return SunIcon;
      case 'movement': return BoltIcon;
      case 'hydration': return BeakerIcon;
      case 'work': return BriefcaseIcon;
      case 'nutrition': return BeakerIcon;
      case 'supplements': return CubeIcon;
      case 'exercise': return FireIcon;
      default: return CheckCircleIcon;
    }
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="welcome-section-title">
      <h2 id="welcome-section-title" className="sr-only">Welcome Dashboard</h2>
      
      {/* Hero Section with Time & Greeting */}
      <section 
        role="banner" 
        aria-labelledby="hero-title"
        className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-20 border border-gray-200/20 dark:border-gray-700/20 shadow-lg"
      >
        {/* Floating orbs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#48C6FF]/10 to-[#3BE6C5]/10 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-[#2A7FFF]/10 to-[#0026CC]/10 rounded-full blur-2xl" aria-hidden="true"></div>
        
        <div className="relative z-10 p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left - Greeting & Time */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <motion.h1 
                  id="hero-title"
                  className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-inter"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {getTimeBasedGreeting()}, {firstName}
                </motion.h1>
                
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <time 
                    className="text-base font-medium text-gray-600 dark:text-gray-300 font-inter"
                    dateTime={currentTime.toISOString()}
                  >
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </time>
                  <time 
                    className="text-2xl font-bold text-gray-900 dark:text-white font-mono"
                    dateTime={currentTime.toISOString()}
                  >
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </motion.div>
              </div>
            </motion.div>

            {/* Center - Progress Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center"
              role="img"
              aria-labelledby="progress-label"
            >
              <div id="progress-label" className="sr-only">
                Daily progress: {completedWins} out of {dailyWins.length} goals completed, {Math.round(progressPercentage)}% complete
              </div>
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="rgb(229 231 235)" strokeWidth="2" fill="none" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{ strokeDasharray: `${(progressPercentage / 100) * 283} 283` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#48C6FF" />
                      <stop offset="50%" stopColor="#2A7FFF" />
                      <stop offset="100%" stopColor="#0026CC" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                      {completedWins}/{dailyWins.length}
                    </motion.div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                      Daily Wins
                    </div>
                    <div className="text-base font-bold text-[#48C6FF] mt-2">
                      {totalPoints} pts
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Bedtime Countdown & Next Win */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-6"
              role="complementary"
              aria-label="Time and upcoming goals"
            >
              {/* Bedtime Countdown */}
              <div 
                className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30 p-6 text-center"
                role="timer"
                aria-labelledby="bedtime-countdown-label"
              >
                <MoonIcon className="w-8 h-8 text-[#48C6FF] mx-auto mb-3" />
                <div id="bedtime-countdown-label" className="text-sm font-medium text-foreground/60 mb-2">Bedtime in</div>
                <time className="text-2xl font-bold text-[#48C6FF] font-mono">
                  {bedtimeCountdown}
                </time>
              </div>

              {/* Next Win */}
              {nextWin && (
                <div 
                  className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30 p-6"
                  role="region"
                  aria-labelledby="next-win-title"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${nextWin.color} rounded-lg flex items-center justify-center`}>
                      <nextWin.icon className="w-4 h-4 text-white" />
                    </div>
                    <div id="next-win-title" className="text-sm font-medium text-foreground/60">Next Win</div>
                  </div>
                  <div className="text-base font-semibold text-foreground mb-1">{nextWin.title}</div>
                  <div className="text-sm text-foreground/70 mb-3">{nextWin.description}</div>
                  <div className="flex items-center justify-between">
                    <time className="text-sm font-bold text-[#48C6FF]">{nextWin.time}</time>
                    <span className="text-sm font-bold text-[#3BE6C5]">+{nextWin.points} pts</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Daily Wins Grid */}
      <section role="region" aria-labelledby="daily-wins-title" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="w-6 h-6 text-[#48C6FF]" />
            <h2 id="daily-wins-title" className="text-2xl font-bold text-foreground">Today's Wins</h2>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[#3BE6C5]">{totalPoints} points</div>
            <div className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% complete</div>
          </div>
        </div>

        <ul 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          role="list"
          aria-label="Daily wellness goals"
        >
          {dailyWins.map((win, index) => (
            <li key={win.id} role="listitem">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleWin(win.id)}
              role="button"
              aria-pressed={win.completed}
              aria-labelledby={`win-${win.id}-title`}
              aria-describedby={`win-${win.id}-description`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleWin(win.id);
                }
              }}
              className={`card cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                win.completed 
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                  : 'hover:border-[#48C6FF]/30'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${win.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <win.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {win.completed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        role="img"
                        aria-label="Goal completed"
                      >
                        <CheckCircleSolidIcon className="w-6 h-6 text-green-500" />
                      </motion.div>
                    ) : (
                      <div 
                        className="w-6 h-6 border-2 border-border rounded-full hover:border-[#48C6FF] transition-colors"
                        role="img"
                        aria-label="Goal not completed"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 
                    id={`win-${win.id}-title`}
                    className={`font-bold text-foreground ${win.completed ? 'line-through opacity-75' : ''}`}
                  >
                    {win.title}
                  </h3>
                  <p 
                    id={`win-${win.id}-description`}
                    className={`text-sm ${win.completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
                  >
                    {win.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-muted-foreground" />
                    <time className="text-sm font-medium text-foreground">{win.time}</time>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#3BE6C5]">+{win.points}</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      win.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                      win.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-green-100 text-green-700 border border-green-200'
                    }`}>
                      {win.priority}
                    </span>
                  </div>
                </div>
              </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </section>

      {/* Quick Action Shortcuts */}
      <section role="region" aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="sr-only">Quick Actions</h2>
        <ul 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          role="list"
          aria-label="Quick action shortcuts"
        >
        {[
          { 
            id: 'coach', 
            title: 'Smart Coach', 
            icon: SparklesIcon, 
            color: 'from-purple-500 to-indigo-600',
            description: 'Get personalized advice'
          },
          { 
            id: 'food', 
            title: 'Log Food', 
            icon: CameraIcon, 
            color: 'from-green-500 to-emerald-600',
            description: 'Track your nutrition'
          },
          { 
            id: 'health', 
            title: 'View Analytics', 
            icon: HeartIcon, 
            color: 'from-red-500 to-pink-600',
            description: 'Check your metrics'
          },
          { 
            id: 'supplements', 
            title: 'Supplements', 
            icon: CubeIcon, 
            color: 'from-orange-500 to-red-600',
            description: 'Optimize your stack'
          }
        ].map((action, index) => (
          <li key={action.id} role="listitem">
            <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            onClick={() => onQuickAction?.(action.id)}
            aria-labelledby={`action-${action.id}-title`}
            aria-describedby={`action-${action.id}-description`}
            className="card hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
          >
            <div className="space-y-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 id={`action-${action.id}-title`} className="font-bold text-foreground">{action.title}</h3>
                <p id={`action-${action.id}-description`} className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </div>
            </motion.button>
          </li>
        ))}
        </ul>
      </section>

      {/* Achievement Celebration */}
      {completedWins === dailyWins.length && (
        <section 
          role="alert"
          aria-labelledby="achievement-title"
          aria-describedby="achievement-description"
        >
          <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-premium bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 text-center relative overflow-hidden"
        >
          {/* Celebration particles */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${25 + (i % 2) * 50}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10 space-y-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: 3 }}
              role="img"
              aria-label="Trophy celebration"
            >
              <TrophyIcon className="w-16 h-16 text-yellow-500 mx-auto" />
            </motion.div>
            <div>
              <h3 id="achievement-title" className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
                🎉 Perfect Day Achieved!
              </h3>
              <p id="achievement-description" className="text-green-600 dark:text-green-500 mb-4">
                All daily wins completed! You've earned {totalPoints} points and built incredible momentum.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-950/20 rounded-full">
                  <span className="text-sm font-bold text-yellow-700">🏆 Daily Champion</span>
                </div>
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-950/20 rounded-full">
                  <span className="text-sm font-bold text-blue-700">⚡ {totalPoints} XP Earned</span>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        </section>
      )}

      {/* Smart Notifications */}
      {nextWin && (
        <section 
          role="region" 
          aria-labelledby="upcoming-goal-title"
          aria-describedby="upcoming-goal-description"
        >
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <LightBulbIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 id="upcoming-goal-title" className="font-bold text-blue-700 dark:text-blue-300">
                ⏰ Upcoming: {nextWin.title}
              </h3>
              <p id="upcoming-goal-description" className="text-sm text-blue-600 dark:text-blue-400">
                {nextWin.description} • {nextWin.time} • +{nextWin.points} points
              </p>
            </div>
            <button
              onClick={() => toggleWin(nextWin.id)}
              aria-label={`Complete ${nextWin.title} now`}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Complete Now
            </button>
          </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default WelcomeHeader;