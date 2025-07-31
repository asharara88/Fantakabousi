import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
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
  BeakerIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  healthScore: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  saved: boolean;
}

const RecipeSearch: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [savedRecipes, setSavedRecipes] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadHealthyRecipes();
  }, []);

  const loadHealthyRecipes = async () => {
    setLoading(true);
    try {
      // Curated healthy recipes for wellness goals
      const mockRecipes: Recipe[] = [
        {
          id: 1,
          title: 'Grilled Salmon with Sweet Potato',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
          readyInMinutes: 25,
          servings: 2,
          summary: 'Simple, healthy meal with omega-3s and complex carbs.',
          healthScore: 95,
          nutrition: { calories: 420, protein: 35, carbs: 28, fat: 18 },
          tags: ['High Protein', 'Heart Healthy', 'Easy'],
          saved: false
        },
        {
          id: 2,
          title: 'Chicken and Veggie Stir Fry',
          image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
          readyInMinutes: 30,
          servings: 4,
          summary: 'Quick and easy chicken with fresh vegetables.',
          healthScore: 88,
          nutrition: { calories: 380, protein: 32, carbs: 22, fat: 16 },
          tags: ['High Protein', 'Quick', 'Family Friendly'],
          saved: false
        },
        {
          id: 3,
          title: 'Green Smoothie Bowl',
          image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
          readyInMinutes: 5,
          servings: 1,
          summary: 'Nutritious smoothie bowl with fruits and vegetables.',
          healthScore: 92,
          nutrition: { calories: 280, protein: 12, carbs: 18, fat: 20 },
          tags: ['Healthy', 'Quick', 'Breakfast'],
          saved: false
        },
        {
          id: 4,
          title: 'Lean Beef with Rice',
          image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
          readyInMinutes: 20,
          servings: 3,
          summary: 'Simple beef dish with brown rice and vegetables.',
          healthScore: 85,
          nutrition: { calories: 350, protein: 28, carbs: 15, fat: 22 },
          tags: ['High Protein', 'Filling', 'Balanced'],
          saved: false
        },
        {
          id: 5,
          title: 'Cauliflower Rice Bowl',
          image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
          readyInMinutes: 15,
          servings: 2,
          summary: 'Light and healthy rice alternative with vegetables.',
          healthScore: 90,
          nutrition: { calories: 320, protein: 18, carbs: 8, fat: 26 },
          tags: ['Low Carb', 'Light', 'Healthy'],
          saved: false
        },
        {
          id: 6,
          title: 'Baked Fish with Vegetables',
          image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
          readyInMinutes: 35,
          servings: 2,
          summary: 'Simple baked fish with fresh seasonal vegetables.',
          healthScore: 94,
          nutrition: { calories: 290, protein: 30, carbs: 12, fat: 14 },
          tags: ['Heart Healthy', 'Low Calorie', 'Simple'],
          saved: false
        }
      ];
      
      setRecipes(mockRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Filter existing recipes based on search
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setRecipes(filtered);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = async (recipeId: number) => {
    try {
      if (savedRecipes.has(recipeId)) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user?.id)
          .eq('recipe_id', recipeId);
        
        if (error) throw error;
        
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
        // Add to saved
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
          const { error } = await supabase
            .from('saved_recipes')
            .insert({
              user_id: user?.id,
              recipe_id: recipeId,
              title: recipe.title,
              image: recipe.image,
            });
          
          if (error) throw error;
          
          setSavedRecipes(prev => new Set([...prev, recipeId]));
          
          toast({
            title: "Recipe Saved",
            description: "Recipe added to your saved collection.",
          });
        }
      }
    } catch (error) {
      console.error('Error toggling recipe save:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-deep to-neon-green rounded-xl flex items-center justify-center shadow-lg">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Healthy Recipes</h2>
          <p className="text-muted-foreground">Find simple, nutritious meals you'll love</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for healthy recipes..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
            >
              <option value="">All Diets</option>
              <option value="ketogenic">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="low-carb">Low Carb</option>
              <option value="high-protein">High Protein</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-light to-blue-medium text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setSearchQuery('protein');
                handleSearch();
              }}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors text-sm"
            >
              Protein
            </button>
            <button
              onClick={() => {
                setSearchQuery('quick');
                handleSearch();
              }}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors text-sm"
            >
              Quick Meals
            </button>
            <button
              onClick={() => {
                setSearchQuery('healthy');
                handleSearch();
              }}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 hover:text-foreground transition-colors text-sm"
            >
              Healthy
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => {
            const isSaved = savedRecipes.has(recipe.id);
            
            return (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => toggleSaveRecipe(recipe.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                      {isSaved ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">
                      {recipe.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <UserGroupIcon className="w-4 h-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className={`flex items-center space-x-1 font-medium ${getHealthScoreColor(recipe.healthScore)}`}>
                        <BeakerIcon className="w-4 h-4" />
                        <span>{recipe.healthScore}% healthy</span>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{recipe.nutrition.calories}</div>
                      <div className="text-xs text-gray-600">Cal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{recipe.nutrition.protein}g</div>
                      <div className="text-xs text-gray-600">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{recipe.nutrition.carbs}g</div>
                      <div className="text-xs text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{recipe.nutrition.fat}g</div>
                      <div className="text-xs text-gray-600">Fat</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">(4.2)</span>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                      View Recipe
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <option value="">All Types</option>
            <option value="quick">Quick Meals</option>
            <option value="healthy">Healthy</option>
            <option value="protein">High Protein</option>
            <option value="light">Light Meals</option>
            Try searching for specific ingredients or dietary preferences
          </p>
          <button
            onClick={loadHealthyRecipes}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            Show Healthy Recipes
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;