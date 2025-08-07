import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeNutrition } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  Utensils,
  Camera,
  Search,
  Plus,
  Clock,
  Zap,
  Heart,
  TrendingUp,
  Coffee,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

interface NutritionDashboardProps {
  onQuickAction?: (action: string) => void;
}

const NutritionDashboard: React.FC<NutritionDashboardProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('logger');
  const [foodInput, setFoodInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [recentMeals] = useState([
    { name: 'Greek Yogurt with Berries', time: '8:30 AM', calories: 180, mood: '😊' },
    { name: 'Grilled Chicken Salad', time: '1:15 PM', calories: 320, mood: '😋' },
    { name: 'Apple with Almond Butter', time: '3:45 PM', calories: 190, mood: '😌' }
  ]);

  const currentHour = new Date().getHours();
  
  const getMealSuggestion = () => {
    if (currentHour < 10) return { meal: 'breakfast', icon: Coffee, suggestion: 'Start your day right!' };
    if (currentHour < 14) return { meal: 'lunch', icon: Sun, suggestion: 'Fuel your afternoon!' };
    if (currentHour < 18) return { meal: 'snack', icon: Sunset, suggestion: 'Keep your energy up!' };
    return { meal: 'dinner', icon: Moon, suggestion: 'End your day well!' };
  };

  const mealSuggestion = getMealSuggestion();
  const MealIcon = mealSuggestion.icon;

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅', time: 'Morning fuel' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️', time: 'Midday energy' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙', time: 'Evening meal' },
    { value: 'snack', label: 'Snack', emoji: '🍎', time: 'Quick bite' }
  ];

  const handleLogFood = async () => {
    if (!foodInput.trim() || !user?.id) {
      toast({
        title: "What did you eat?",
        description: "Please tell me what food you'd like to log",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      const analysis = await analyzeNutrition(
        foodInput,
        '1 serving',
        user.id,
        selectedMeal || mealSuggestion.meal
      );

      toast({
        title: "Food logged! 🎉",
        description: `${analysis.foodName} has been added to your nutrition log`,
      });

      setFoodInput('');
      setSelectedMeal('');
    } catch (error: any) {
      toast({
        title: "Couldn't analyze that food",
        description: "Try being more specific, like 'grilled chicken breast' or 'banana'",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Friendly Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MealIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
              Food & Nutrition
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {mealSuggestion.suggestion}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Food Logger - Main Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/20 dark:border-slate-700/20 shadow-xl"
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              What did you eat?
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Just tell me and I'll track the nutrition for you
            </p>
          </div>

          {/* Meal Type Selection */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {mealTypes.map((meal) => (
              <button
                key={meal.value}
                onClick={() => setSelectedMeal(meal.value)}
                className={`p-4 rounded-xl font-medium transition-all duration-300 ${
                  selectedMeal === meal.value || (!selectedMeal && meal.value === mealSuggestion.meal)
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                    : 'bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <div className="text-2xl mb-1">{meal.emoji}</div>
                <div className="font-semibold">{meal.label}</div>
                <div className="text-xs opacity-80">{meal.time}</div>
              </button>
            ))}
          </div>

          {/* Food Input - Large and Friendly */}
          <div className="space-y-4">
            {/* Camera Food Logging */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Take a Photo</h3>
                <button className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-green-500 transition-colors flex flex-col items-center justify-center space-y-2 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-900 dark:text-white">Snap Your Meal</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">AI will analyze calories & nutrients</div>
                  </div>
                </button>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Or Type It</h3>
            <div className="relative">
              <input
                type="text"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogFood()}
                placeholder="e.g., grilled chicken with rice, banana, coffee..."
                className="w-full px-6 py-4 text-lg border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Utensils className="w-6 h-6 text-slate-400" />
              </div>
            </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogFood}
              disabled={!foodInput.trim() || analyzing}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3"
            >
              {analyzing ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Analyzing nutrition...</span>
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  <span>Log This Food</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Quick Add Buttons */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick add:</div>
            <div className="flex flex-wrap gap-2">
              {['Banana', 'Greek Yogurt', 'Chicken Breast', 'Avocado', 'Oatmeal', 'Salmon'].map((food) => (
                <button
                  key={food}
                  onClick={() => {
                    setFoodInput(food);
                    setTimeout(() => handleLogFood(), 100);
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  {food}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Meals - Simple List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            What you ate today
          </h3>
          <button className="text-green-600 hover:text-green-700 font-medium">
            See all meals
          </button>
        </div>

        <div className="space-y-4">
          {recentMeals.map((meal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-slate-50/60 dark:bg-slate-800/60 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              <div className="text-2xl">{meal.mood}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {meal.name}
                </h4>
                <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                  <span>{meal.time}</span>
                  <span>•</span>
                  <span>{meal.calories} calories</span>
                </div>
              </div>
              <div className="text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        {recentMeals.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🍽️</div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No meals logged yet
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              Start tracking your food to see insights about your nutrition
            </p>
          </div>
        )}
      </motion.div>

      {/* Simple Recipe Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
      >
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center mx-auto">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Need meal ideas?
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              I can suggest healthy recipes based on what you like
            </p>
          </div>
          <button
            onClick={() => setActiveView('recipes')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Find Healthy Recipes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NutritionDashboard;