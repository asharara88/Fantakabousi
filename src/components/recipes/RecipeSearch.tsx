import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { searchRecipes } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  BookmarkIcon,
  StarIcon,
  FireIcon,
  BeakerIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  healthTags: string[];
  fertilityScore: number;
  muscleScore: number;
  insulinScore: number;
  saved: boolean;
}

const RecipeSearch: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [maxCookTime, setMaxCookTime] = useState(45);
  const [savedRecipes, setSavedRecipes] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPersonalizedRecipes();
  }, [profile]);

  const loadPersonalizedRecipes = async () => {
    setLoading(true);
    try {
      // Get personalized search based on user profile
      const userGoals = profile?.primary_health_goals || [];
      const dietPreference = profile?.diet_preference || '';
      
      let searchTerm = 'healthy high protein';
      if (userGoals.includes('muscle_building')) searchTerm = 'high protein muscle building';
      if (userGoals.includes('weight_loss')) searchTerm = 'low calorie weight loss';
      if (userGoals.includes('heart_health')) searchTerm = 'heart healthy omega 3';
      if (userGoals.includes('insulin_optimization')) searchTerm = 'low carb keto';

      const data = await searchRecipes(searchTerm, {
        diet: dietPreference || undefined,
        number: 12,
        maxReadyTime: 45,
        minProtein: userGoals.includes('muscle_building') ? 25 : undefined
      });
      
      const processedRecipes = data.recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        summary: recipe.summary?.replace(/<[^>]*>/g, '') || '',
        nutrition: recipe.nutrition,
        healthTags: recipe.healthTags || [],
        fertilityScore: recipe.fertilityScore || 0,
        muscleScore: recipe.muscleScore || 0,
        insulinScore: recipe.insulinScore || 0,
        saved: false
      }));
      
      setRecipes(processedRecipes);
    } catch (error) {
      console.error('Error loading personalized recipes:', error);
      toast({
        title: "Recipe Loading Error",
        description: "Using sample recipes. Check your connection and try again.",
        variant: "destructive",
      });
      
      // Fallback to sample recipes
      setRecipes([
        {
          id: 1,
          title: 'High-Protein Salmon Bowl',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          readyInMinutes: 25,
          servings: 2,
          summary: 'Nutrient-dense salmon bowl packed with omega-3s and complete proteins.',
          nutrition: { calories: 420, protein: 35, carbs: 28, fat: 18 },
          healthTags: ['High Protein', 'Omega-3', 'Low Carb'],
          fertilityScore: 88,
          muscleScore: 92,
          insulinScore: 85,
          saved: false
        },
        {
          id: 2,
          title: 'Mediterranean Quinoa Salad',
          image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
          readyInMinutes: 15,
          servings: 4,
          summary: 'Fresh Mediterranean flavors with complete protein quinoa.',
          nutrition: { calories: 320, protein: 12, carbs: 45, fat: 14 },
          healthTags: ['Mediterranean', 'High Fiber', 'Plant-Based'],
          fertilityScore: 82,
          muscleScore: 65,
          insulinScore: 78,
          saved: false
        },
        {
          id: 3,
          title: 'Grass-Fed Beef Stir Fry',
          image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
          readyInMinutes: 20,
          servings: 3,
          summary: 'Lean grass-fed beef with colorful vegetables for optimal nutrition.',
          nutrition: { calories: 380, protein: 32, carbs: 18, fat: 22 },
          healthTags: ['High Protein', 'Low Carb', 'Iron Rich'],
          fertilityScore: 85,
          muscleScore: 95,
          insulinScore: 88,
          saved: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPersonalizedRecipes();
      return;
    }

    setLoading(true);
    try {
      const data = await searchRecipes(searchQuery, {
        diet: selectedDiet || undefined,
        number: 12,
        maxReadyTime: maxCookTime,
        minProtein: selectedGoal === 'muscle_building' ? 25 : undefined,
        maxCarbs: selectedGoal === 'insulin_optimization' ? 30 : undefined
      });
      
      const processedRecipes = data.recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        summary: recipe.summary?.replace(/<[^>]*>/g, '') || '',
        nutrition: recipe.nutrition,
        healthTags: recipe.healthTags || [],
        fertilityScore: recipe.fertilityScore || 0,
        muscleScore: recipe.muscleScore || 0,
        insulinScore: recipe.insulinScore || 0,
        saved: false
      }));
      
      setRecipes(processedRecipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "Failed to search recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = async (recipeId: number) => {
    try {
      if (savedRecipes.has(recipeId)) {
        setSavedRecipes(prev => {
          const newSet = new Set(prev);
          newSet.delete(recipeId);
          return newSet;
        });
        
        toast({
          title: "Recipe Removed",
          description: "Recipe removed from your saved collection.",
        });
      } else {
        setSavedRecipes(prev => new Set([...prev, recipeId]));
        
        // Save to database
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe && user?.id) {
          const { error } = await supabase
            .from('saved_recipes')
            .insert({
              user_id: user.id,
              recipe_id: recipeId,
              title: recipe.title,
              image: recipe.image,
              is_favorite: false
            });

          if (error) {
            console.error('Error saving recipe:', error);
          }
        }
        
        toast({
          title: "Recipe Saved! 🍽️",
          description: "Recipe added to your saved collection.",
        });
      }
    } catch (error) {
      console.error('Error toggling recipe save:', error);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getHealthScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (score >= 80) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    if (score >= 70) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Personalized Recipes</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Recipes optimized for your health goals
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <FunnelIcon className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for healthy recipes..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Diet Type
                  </label>
                  <select
                    value={selectedDiet}
                    onChange={(e) => setSelectedDiet(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Diets</option>
                    <option value="ketogenic">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="gluten-free">Gluten Free</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Health Goal
                  </label>
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Goals</option>
                    <option value="muscle_building">Muscle Building</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="heart_health">Heart Health</option>
                    <option value="insulin_optimization">Blood Sugar Control</option>
                    <option value="fertility">Fertility Support</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Max Cook Time: {maxCookTime} min
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    value={maxCookTime}
                    onChange={(e) => setMaxCookTime(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => {
                    setSelectedDiet('');
                    setSelectedGoal('');
                    setMaxCookTime(45);
                    setSearchQuery('');
                  }}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {['High Protein', 'Low Carb', 'Quick & Easy', 'Heart Healthy', 'Anti-Inflammatory'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag.toLowerCase());
                handleSearch();
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-slate-600 dark:text-slate-400">Finding perfect recipes for you...</p>
          </div>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => {
            const isSaved = savedRecipes.has(recipe.id);
            const avgHealthScore = Math.round((recipe.fertilityScore + recipe.muscleScore + recipe.insulinScore) / 3);
            
            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg';
                    }}
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => toggleSaveRecipe(recipe.id)}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                      {isSaved ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getHealthScoreBadge(avgHealthScore)}`}>
                      {avgHealthScore}% Health Score
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {recipe.healthTags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                      {recipe.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{recipe.nutrition.calories}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Cal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{recipe.nutrition.protein}g</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{recipe.nutrition.carbs}g</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{recipe.nutrition.fat}g</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Fat</div>
                    </div>
                  </div>

                  {/* Health Scores */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{recipe.muscleScore}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Muscle</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{recipe.insulinScore}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Insulin</div>
                    </div>
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{recipe.fertilityScore}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Fertility</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                    View Recipe & Instructions
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No recipes found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={loadPersonalizedRecipes}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Load Personalized Recommendations
          </button>
        </div>
      )}

      {/* Recipe Stats */}
      {recipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">{recipes.length}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Recipes Found</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {Math.round(recipes.reduce((sum, r) => sum + r.nutrition.calories, 0) / recipes.length)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg Calories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {Math.round(recipes.reduce((sum, r) => sum + r.nutrition.protein, 0) / recipes.length)}g
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg Protein</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{savedRecipes.size}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Saved Recipes</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RecipeSearch;