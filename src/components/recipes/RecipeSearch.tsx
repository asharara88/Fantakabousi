import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { searchRecipes, getPersonalizedRecipes } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  BookmarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const RecipeSearch: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');

  useEffect(() => {
    loadPersonalizedRecipes();
  }, []);

  const loadPersonalizedRecipes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await getPersonalizedRecipes(user.id);
      setRecipes(result.recipes || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const result = await searchRecipes({
        query: searchQuery,
        diet: selectedDiet,
        maxReadyTime: 45,
        number: 12
      });
      setRecipes(result.recipes || []);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="card-premium p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-heading-lg text-foreground">Recipe Search</h2>
            <p className="text-caption">Optimized for fertility, muscle building & insulin sensitivity</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for healthy recipes..."
                className="input-premium pl-10 w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="input-premium"
            >
              <option value="">All Diets</option>
              <option value="ketogenic">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="low carb">Low Carb</option>
              <option value="high protein">High Protein</option>
            </select>
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setSearchQuery('high protein low carb fertility muscle building');
                handleSearch();
              }}
              className="btn-secondary flex items-center space-x-2"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Health Recommendations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" variant="premium" />
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-0 overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  {recipe.healthTags?.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="absolute top-3 left-3 p-2 bg-black/70 rounded-lg hover:bg-black/80 transition-colors">
                  <BookmarkIcon className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-body font-bold text-foreground line-clamp-2 mb-2">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-caption">
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

                {/* Health Scores for Ahmed's Goals */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center space-y-1">
                    <div className={`text-lg font-bold ${getScoreColor(recipe.fertilityScore || 50)}`}>
                      {recipe.fertilityScore || 50}
                    </div>
                    <div className="text-xs text-muted-foreground">Fertility</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className={`text-lg font-bold ${getScoreColor(recipe.muscleScore || 50)}`}>
                      {recipe.muscleScore || 50}
                    </div>
                    <div className="text-xs text-muted-foreground">Muscle</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon 
                          key={i} 
                          className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-muted/30'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Nutrition Highlights */}
                {recipe.nutrition && (
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">
                        {Math.round(recipe.nutrition.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0)}g
                      </div>
                      <div className="text-xs text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">
                        {Math.round(recipe.nutrition.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0)}g
                      </div>
                      <div className="text-xs text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">
                        {Math.round(recipe.nutrition.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Cal</div>
                    </div>
                  </div>
                )}

                <button className="btn-primary w-full">
                  View Recipe
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-body font-semibold text-foreground mb-2">
            No recipes found
          </h3>
          <p className="text-caption mb-6">
            Try searching for specific ingredients or dietary preferences
          </p>
          <button
            onClick={loadPersonalizedRecipes}
            className="btn-primary"
          >
            Load Personalized Recommendations
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;