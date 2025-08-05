import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { 
  UserGroupIcon,
  HeartIcon,
  CalendarIcon,
  SparklesIcon,
  ChartBarIcon,
  BellIcon,
  ShareIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FireIcon,
  BeakerIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface FertilityData {
  id: string;
  user_id: string;
  cycle_day?: number;
  date: string;
  basal_temperature?: number;
  cervical_fluid?: string;
  ovulation_test_result?: string;
  cycle_phase?: string;
  notes?: string;
  shared_with_partner: boolean;
  created_at: string;
  updated_at: string;
}

interface PartnerConnection {
  id: string;
  user_id: string;
  partner_id: string;
  status: 'pending' | 'connected' | 'rejected';
  created_at: string;
}

const UbergeneIntegration: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fertilityData, setFertilityData] = useState<FertilityData[]>([]);
  const [partnerConnection, setPartnerConnection] = useState<PartnerConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCycleDay, setCurrentCycleDay] = useState(14);
  const [fertileWindow, setFertileWindow] = useState({ start: 12, end: 16 });

  useEffect(() => {
    if (user) {
      fetchFertilityData();
      fetchPartnerConnection();
    }
  }, [user]);

  const fetchFertilityData = async () => {
    try {
      const { data, error } = await supabase
        .from('fertility_tracking')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setFertilityData(data || []);
      
      // Calculate current cycle day and fertile window
      if (data && data.length > 0) {
        const latest = data[0];
        setCurrentCycleDay(latest.cycle_day || 14);
        
        // Estimate fertile window (typically days 12-16 of 28-day cycle)
        const ovulationDay = latest.cycle_day || 14;
        setFertileWindow({
          start: Math.max(1, ovulationDay - 2),
          end: Math.min(28, ovulationDay + 2)
        });
      }
    } catch (error) {
      console.error('Error fetching fertility data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_connections')
        .select('*')
        .or(`user_id.eq.${user?.id},partner_id.eq.${user?.id}`)
        .eq('status', 'connected')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPartnerConnection(data);
    } catch (error) {
      console.error('Error fetching partner connection:', error);
    }
  };

  const logFertilityData = async (data: Partial<FertilityData>) => {
    try {
      const { error } = await supabase
        .from('fertility_tracking')
        .insert([{
          user_id: user?.id,
          date: new Date().toISOString().split('T')[0],
          ...data
        }]);

      if (error) throw error;
      
      toast({
        title: "Data Logged",
        description: "Fertility data has been recorded and synced with your partner.",
      });
      
      fetchFertilityData();
    } catch (error) {
      console.error('Error logging fertility data:', error);
      toast({
        title: "Error",
        description: "Failed to log fertility data.",
        variant: "destructive",
      });
    }
  };

  const getCyclePhase = (cycleDay: number) => {
    if (cycleDay <= 5) return { phase: 'Menstrual', color: 'from-red-500 to-pink-600', description: 'Menstruation phase' };
    if (cycleDay <= 13) return { phase: 'Follicular', color: 'from-blue-500 to-cyan-600', description: 'Follicle development' };
    if (cycleDay <= 16) return { phase: 'Ovulatory', color: 'from-emerald-500 to-teal-600', description: 'Peak fertility window' };
    return { phase: 'Luteal', color: 'from-amber-500 to-orange-600', description: 'Post-ovulation phase' };
  };

  const currentPhase = getCyclePhase(currentCycleDay);
  const isInFertileWindow = currentCycleDay >= fertileWindow.start && currentCycleDay <= fertileWindow.end;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* UBERGENE Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-3xl p-8 border border-pink-200/60 dark:border-pink-800/60"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserGroupIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-pink-700 dark:text-pink-400">UBERGENE</h1>
              <p className="text-pink-600 dark:text-pink-500 text-lg">Couples Fertility Optimization</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-pink-600 dark:text-pink-500">
                  {partnerConnection ? 'Partner Connected' : 'Solo Tracking'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-pink-700 dark:text-pink-400">
              Day {currentCycleDay}
            </div>
            <div className="text-sm text-pink-600 dark:text-pink-500">Current Cycle</div>
          </div>
        </div>
      </motion.div>

      {/* Cycle Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Phase */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${currentPhase.color} rounded-xl flex items-center justify-center`}>
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {currentPhase.phase} Phase
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{currentPhase.description}</p>
              </div>
            </div>

            {/* Fertility Status */}
            <div className={`p-4 rounded-2xl border ${
              isInFertileWindow 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' 
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isInFertileWindow ? 'bg-emerald-500' : 'bg-slate-400'
                }`}>
                  {isInFertileWindow ? (
                    <SparklesIcon className="w-4 h-4 text-white" />
                  ) : (
                    <ClockIcon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    isInFertileWindow ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {isInFertileWindow ? 'High Fertility Window' : 'Low Fertility Period'}
                  </h4>
                  <p className={`text-sm ${
                    isInFertileWindow ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {isInFertileWindow 
                      ? `Peak conception window - Days ${fertileWindow.start}-${fertileWindow.end}`
                      : `Next fertile window in ${fertileWindow.start - currentCycleDay} days`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => logFertilityData({ 
                  cycle_day: currentCycleDay + 1,
                  cycle_phase: currentPhase.phase.toLowerCase(),
                  shared_with_partner: !!partnerConnection 
                })}
                className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-xl font-semibold hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
              >
                Log Today's Data
              </button>
              <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                View Calendar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Partner Sync */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShareIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Partner Sync</h3>
                <p className="text-slate-600 dark:text-slate-400">Coordinate with your partner</p>
              </div>
            </div>

            {partnerConnection ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">Partner Connected</h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500">Data syncing automatically</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">94%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Sync Score</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">2 min</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Last Sync</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
                  <div>
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400">No Partner Connected</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-500">Connect with your partner for synchronized tracking</p>
                  </div>
                </div>
                
                <button className="w-full p-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                  Invite Partner
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Fertility Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/60"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Fertility Insights</h3>
            <p className="text-slate-600 dark:text-slate-400">AI-powered reproductive health analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Conception Probability',
              value: isInFertileWindow ? '87%' : '12%',
              description: isInFertileWindow ? 'Peak fertility window active' : 'Low fertility period',
              icon: SparklesIcon,
              color: isInFertileWindow ? 'from-emerald-500 to-teal-600' : 'from-slate-400 to-slate-600',
              trend: isInFertileWindow ? '+45%' : '-23%'
            },
            {
              title: 'Cycle Prediction',
              value: '28 days',
              description: 'Predicted cycle length based on patterns',
              icon: CalendarIcon,
              color: 'from-blue-500 to-cyan-600',
              trend: 'Stable'
            },
            {
              title: 'Health Score',
              value: '92/100',
              description: 'Overall reproductive health rating',
              icon: HeartIcon,
              color: 'from-pink-500 to-rose-600',
              trend: '+8%'
            }
          ].map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-slate-50/60 dark:bg-slate-800/60 rounded-2xl p-6 border border-slate-200/40 dark:border-slate-700/40"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 bg-gradient-to-br ${insight.color} rounded-xl flex items-center justify-center`}>
                    <insight.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    insight.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                    insight.trend.startsWith('-') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {insight.trend}
                  </div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {insight.value}
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {insight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/60"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <BeakerIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Today's Tracking</h3>
            <p className="text-slate-600 dark:text-slate-400">Log your fertility indicators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basal Temperature */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Basal Body Temperature (°C)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                placeholder="36.5"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <BeakerIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Cervical Fluid */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Cervical Fluid
            </label>
            <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all">
              <option value="">Select type</option>
              <option value="dry">Dry</option>
              <option value="sticky">Sticky</option>
              <option value="creamy">Creamy</option>
              <option value="egg-white">Egg White (Fertile)</option>
            </select>
          </div>

          {/* Ovulation Test */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Ovulation Test
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Negative', 'Positive', 'Peak'].map((result) => (
                <button
                  key={result}
                  className={`p-2 rounded-lg font-medium transition-all ${
                    result === 'Positive' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {result}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Any symptoms, mood changes, or observations..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => logFertilityData({
              cycle_day: currentCycleDay,
              cycle_phase: currentPhase.phase.toLowerCase(),
              shared_with_partner: !!partnerConnection,
              notes: 'Daily tracking entry'
            })}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Save & Sync with Partner
          </button>
          
          {!partnerConnection && (
            <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Invite Partner
            </button>
          )}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 rounded-3xl p-8 border border-blue-200/60 dark:border-blue-800/60"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
            <LightBulbIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">UBERGENE Recommendations</h3>
            <p className="text-slate-600 dark:text-slate-400">Personalized fertility optimization</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Optimal Timing Window',
              description: isInFertileWindow 
                ? 'Peak fertility detected. Consider intimate time in the next 48 hours for highest conception probability.'
                : 'Currently in low fertility period. Focus on health optimization and cycle preparation.',
              priority: 'high',
              action: 'Set Reminder'
            },
            {
              title: 'Nutritional Support',
              description: 'Your folate and vitamin D levels are optimal. Continue current supplement protocol for reproductive health.',
              priority: 'medium',
              action: 'View Supplements'
            },
            {
              title: 'Stress Management',
              description: 'Elevated stress can impact fertility. Consider evening meditation or gentle yoga to optimize hormonal balance.',
              priority: 'medium',
              action: 'Start Protocol'
            }
          ].map((rec, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-200/40 dark:border-slate-700/40">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                rec.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{rec.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{rec.description}</p>
                <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm">
                  {rec.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UbergeneIntegration;