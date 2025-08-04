import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../lib/supabase';
import { 
  PlusIcon,
  ClockIcon,
  BeakerIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface FoodLogEntry {
  id: string;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories?: number;
  meal_time: string;
  notes?: string;
}

interface FoodLoggerProps {
  onQuickAction?: (action: string) => void;
}

const FoodLogger: React.FC<FoodLoggerProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [foodEntries, setFoodEntries] = useState<FoodLogEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    food_name: '',
    meal_type: 'breakfast' as const,
    calories: '',
    notes: ''
  });

  const handleAddFood = async () => {
    if (!user || !newEntry.food_name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a food name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          food_name: newEntry.food_name,
          meal_type: newEntry.meal_type,
          calories: newEntry.calories ? parseInt(newEntry.calories) : null,
          notes: newEntry.notes || null,
          meal_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setFoodEntries(prev => [data, ...prev]);
      setNewEntry({
        food_name: '',
        meal_type: 'breakfast',
        calories: '',
        notes: ''
      });

      toast({
        title: "Food logged successfully",
        description: `Added ${newEntry.food_name} to your ${newEntry.meal_type}`,
      });
    } catch (error) {
      console.error('Error logging food:', error);
      toast({
        title: "Error",
        description: "Failed to log food entry",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Food Logger</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Track your meals and nutrition</p>
        </div>
        <motion.button
          onClick={() => onQuickAction?.('nutrition-recipes')}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Find Recipes
        </motion.button>
      </div>

      {/* Add Food Form */}
      <motion.div
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Log New Food
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Food Name
            </label>
            <input
              type="text"
              value={newEntry.food_name}
              onChange={(e) => setNewEntry(prev => ({ ...prev, food_name: e.target.value }))}
              placeholder="e.g., Grilled Chicken Salad"
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Meal Type
            </label>
            <select
              value={newEntry.meal_type}
              onChange={(e) => setNewEntry(prev => ({ ...prev, meal_type: e.target.value as any }))}
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Calories (optional)
            </label>
            <input
              type="number"
              value={newEntry.calories}
              onChange={(e) => setNewEntry(prev => ({ ...prev, calories: e.target.value }))}
              placeholder="e.g., 350"
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes (optional)
            </label>
            <input
              type="text"
              value={newEntry.notes}
              onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g., Post-workout meal"
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <motion.button
          onClick={handleAddFood}
          disabled={isLoading || !newEntry.food_name.trim()}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Logging...' : 'Log Food'}
        </motion.button>
      </motion.div>

      {/* Recent Entries */}
      <motion.div
        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ClockIcon className="w-5 h-5" />
          Recent Entries
        </h2>
        
        {foodEntries.length === 0 ? (
          <div className="text-center py-12">
            <BeakerIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No food entries yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Start logging your meals to track your nutrition</p>
          </div>
        ) : (
          <div className="space-y-3">
            {foodEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{entry.food_name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                    {entry.meal_type} • {new Date(entry.meal_time).toLocaleTimeString()}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{entry.notes}</p>
                  )}
                </div>
                {entry.calories && (
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">{entry.calories}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">calories</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Today's Calories</p>
              <p className="text-3xl font-bold">
                {foodEntries.reduce((sum, entry) => sum + (entry.calories || 0), 0)}
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>
        
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Meals Logged</p>
              <p className="text-3xl font-bold">{foodEntries.length}</p>
            </div>
            <BeakerIcon className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>
        
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Last Meal</p>
              <p className="text-lg font-bold">
                {foodEntries.length > 0 
                  ? new Date(foodEntries[0].meal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'None'
                }
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodLogger;