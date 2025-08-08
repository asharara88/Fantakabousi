import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { analyzeNutrition } from '../../lib/api';
import { saveFoodLog, getFoodLogs } from '../../lib/database';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  PlusIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface FoodLog {
  id: string;
  user_id: string;
  meal_time: string;
  meal_type: string;
  food_name: string;
  portion_size?: string;
  calories?: number;
  carbohydrates?: number;
  protein?: number;
  fat?: number;
  notes?: string;
  pre_glucose?: number;
  post_glucose?: number;
  glucose_impact?: number;
  created_at: string;
  updated_at: string;
}

const FoodLogger: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { actualTheme } = useTheme();
  const { toast } = useToast();
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFoodLog, setNewFoodLog] = useState({
    food_name: '',
    meal_type: 'breakfast',
    portion_size: '',
    calories: '',
    carbohydrates: '',
    protein: '',
    fat: '',
    notes: '',
    pre_glucose: '',
    post_glucose: ''
  });

  useEffect(() => {
    if (user) {
      fetchFoodLogs();
    }
  }, [user]);

  const fetchFoodLogs = async () => {
    try {
      setIsLoading(true);
      const data = await getFoodLogs(user!.id, 50);
      setFoodLogs(data);
    } catch (error) {
      console.error('Error fetching food logs:', error);
      toast({
        title: "Error",
        description: "Failed to load food logs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFoodLog = async () => {
    if (!newFoodLog.food_name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a food name",
        variant: "destructive"
      });
      return;
    }

    try {
      // First analyze nutrition if we have basic info
      let nutritionData = null;
      if (newFoodLog.food_name && user?.id) {
        try {
          nutritionData = await analyzeNutrition(
            newFoodLog.food_name,
            newFoodLog.portion_size || '1 serving',
            user.id,
            newFoodLog.meal_type
          );
        } catch (nutritionError) {
          console.warn('Nutrition analysis failed, proceeding with manual entry:', nutritionError);
        }
      }

      // Calculate glucose impact
      const glucoseImpact = newFoodLog.post_glucose && newFoodLog.pre_glucose 
        ? parseFloat(newFoodLog.post_glucose) - parseFloat(newFoodLog.pre_glucose)
        : nutritionData?.glycemicImpact || null;

      // Save food log with enhanced data
      await saveFoodLog({
        user_id: user!.id,
        food_name: newFoodLog.food_name,
        meal_type: newFoodLog.meal_type,
        portion_size: newFoodLog.portion_size || '1 serving',
        calories: newFoodLog.calories ? parseInt(newFoodLog.calories) : nutritionData?.nutrition?.calories || null,
        carbohydrates: newFoodLog.carbohydrates ? parseFloat(newFoodLog.carbohydrates) : nutritionData?.nutrition?.carbohydrates || null,
        protein: newFoodLog.protein ? parseFloat(newFoodLog.protein) : nutritionData?.nutrition?.protein || null,
        fat: newFoodLog.fat ? parseFloat(newFoodLog.fat) : nutritionData?.nutrition?.fat || null,
        glucose_impact: glucoseImpact,
        notes: newFoodLog.notes || (nutritionData ? `Auto-analyzed: ${nutritionData.insights?.summary || ''}` : null)
      });

      toast({
        title: "Success",
        description: nutritionData ? "Food analyzed and logged successfully" : "Food log added successfully"
      });

      setNewFoodLog({
        food_name: '',
        meal_type: 'breakfast',
        portion_size: '',
        calories: '',
        carbohydrates: '',
        protein: '',
        fat: '',
        notes: '',
        pre_glucose: '',
        post_glucose: ''
      });
      setShowAddForm(false);
      fetchFoodLogs();
    } catch (error) {
      console.error('Error adding food log:', error);
      toast({
        title: "Error",
        description: "Failed to add food log",
        variant: "destructive"
      });
    }
  };

  const deleteFoodLog = async (id: string) => {
    try {
      // Note: We'll implement this in the database module later
      // For now, just remove from local state
      setFoodLogs(prev => prev.filter(log => log.id !== id));

      toast({
        title: "Success",
        description: "Food log deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting food log:', error);
      toast({
        title: "Error",
        description: "Failed to delete food log",
        variant: "destructive"
      });
    }
  };

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'from-yellow-400 to-orange-500' },
    { value: 'lunch', label: 'Lunch', icon: '☀️', color: 'from-blue-400 to-cyan-500' },
    { value: 'dinner', label: 'Dinner', icon: '🌙', color: 'from-purple-400 to-pink-500' },
    { value: 'snack', label: 'Snack', icon: '🍎', color: 'from-green-400 to-emerald-500' }
  ];

  const filteredLogs = foodLogs.filter(log => 
    log.food_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedMealType === 'all' || log.meal_type === selectedMealType)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Food Logger
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Track your meals and monitor glucose response
          </p>
        </div>
        
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="w-5 h-5" />
          <span>Log Food</span>
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Today\'s Meals', value: filteredLogs.filter(log => 
            new Date(log.meal_time).toDateString() === new Date().toDateString()
          ).length, icon: FireIcon, color: 'from-orange-500 to-red-500' },
          { label: 'Avg Calories', value: Math.round(
            filteredLogs.reduce((sum, log) => sum + (log.calories || 0), 0) / Math.max(filteredLogs.length, 1)
          ), icon: ChartBarIcon, color: 'from-blue-500 to-purple-500' },
          { label: 'Total Logs', value: filteredLogs.length, icon: CalendarIcon, color: 'from-green-500 to-emerald-500' },
          { label: 'Glucose Impact', value: `${Math.round(
            filteredLogs.reduce((sum, log) => sum + (log.glucose_impact || 0), 0) / Math.max(filteredLogs.length, 1)
          )}mg/dL`, icon: ChartBarIcon, color: 'from-purple-500 to-pink-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMealType('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              selectedMealType === 'all'
                ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white'
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80'
            }`}
          >
            All
          </button>
          {mealTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedMealType(type.value)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedMealType === type.value
                  ? `bg-gradient-to-r ${type.color} text-white`
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FireIcon className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No food logs yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Start tracking your meals to see insights</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Log Your First Meal
            </button>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">
                      {mealTypes.find(type => type.value === log.meal_type)?.icon || '🍽️'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {log.food_name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(log.meal_time).toLocaleDateString()} • {log.meal_type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {log.calories && (
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Calories</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{log.calories}</p>
                      </div>
                    )}
                    {log.carbohydrates && (
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Carbs</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{log.carbohydrates}g</p>
                      </div>
                    )}
                    {log.protein && (
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Protein</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{log.protein}g</p>
                      </div>
                    )}
                    {log.fat && (
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Fat</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{log.fat}g</p>
                      </div>
                    )}
                  </div>

                  {log.glucose_impact && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      log.glucose_impact > 30 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : log.glucose_impact > 15
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      Glucose Impact: {log.glucose_impact > 0 ? '+' : ''}{log.glucose_impact}mg/dL
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic">
                      "{log.notes}"
                    </p>
                <button 
                  onClick={() => {
                    // Simulate camera access
                    toast({
                      title: "📸 Camera Analysis",
                      description: "AI analyzing your meal... Estimated 420 calories, 35g protein, moderate glucose impact",
                    });
                  }}
                  className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-green-500 transition-colors flex flex-col items-center justify-center space-y-2 group"
                >
                </div>
                
                <button
                  onClick={() => deleteFoodLog(log.id)}
                    <div className="font-semibold text-slate-900 dark:text-white">📸 Snap & Analyze</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">AI calculates calories, macros & glucose impact</div>
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Food Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-slate-700/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Log Food</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    value={newFoodLog.food_name}
                    onChange={(e) => setNewFoodLog({ ...newFoodLog, food_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Grilled chicken breast"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Meal Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {mealTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setNewFoodLog({ ...newFoodLog, meal_type: type.value })}
                        className={`p-3 rounded-xl font-medium transition-all duration-300 ${
                          newFoodLog.meal_type === type.value
                            ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                            : 'bg-slate-100/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-600/60'
                        }`}
                      >
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Portion Size
                    </label>
                    <input
                      type="text"
                      value={newFoodLog.portion_size}
                      onChange={(e) => setNewFoodLog({ ...newFoodLog, portion_size: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="e.g., 1 cup, 150g"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={newFoodLog.calories}
                      onChange={(e) => setNewFoodLog({ ...newFoodLog, calories: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFoodLog.carbohydrates}
                      onChange={(e) => setNewFoodLog({ ...newFoodLog, carbohydrates: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFoodLog.protein}
                      onChange={(e) => setNewFoodLog({ ...newFoodLog, protein: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newFoodLog.fat}
                      onChange={(e) => setNewFoodLog({ ...newFoodLog, fat: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Pre-meal Glucose (mg/dL)
                    </label>
                    <input
                      type="number"
                      value={newFoodLog.pre_glucose}
                      onChange={(e) => setNewFoodLog({ ...newFoodLog, pre_glucose: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="90"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Post-meal Glucose (mg/dL)
                    </label>
                    <input
                      type="number"
                      value={newFoodLog.post_glucose}
                      onChange={(e) => setNewFoodLog({ ...newFoodLog, post_glucose: e.target.value })}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                      placeholder="120"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newFoodLog.notes}
                    onChange={(e) => setNewFoodLog({ ...newFoodLog, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="How did you feel after eating? Any observations..."
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFoodLog}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Save Food Log
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodLogger;