import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
  CameraIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface FoodAnalysis {
  nutrition: NutritionData;
  glycemicImpact: number;
  insights: {
    fertilityScore: number;
    muscleScore: number;
    insulinScore: number;
    recommendations: string[];
  };
}

const FoodLogger: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);

  const analyzeFood = async () => {
    if (!foodName.trim() || !user) return;

    setLoading(true);
    try {
      // Simulate nutrition analysis
      const mockAnalysis: FoodAnalysis = {
        nutrition: {
          calories: Math.floor(Math.random() * 400) + 100,
          protein: Math.floor(Math.random() * 30) + 5,
          carbohydrates: Math.floor(Math.random() * 50) + 10,
          fat: Math.floor(Math.random() * 20) + 2,
          fiber: Math.floor(Math.random() * 10) + 1,
          sugar: Math.floor(Math.random() * 15) + 2,
        },
        glycemicImpact: Math.floor(Math.random() * 20) + 5,
        insights: {
          fertilityScore: Math.floor(Math.random() * 40) + 60,
          muscleScore: Math.floor(Math.random() * 40) + 60,
          insulinScore: Math.floor(Math.random() * 40) + 60,
          recommendations: [
            'Good protein content for muscle building',
            'Moderate impact on blood sugar',
            'Contains beneficial nutrients'
          ]
        }
      };

      setAnalysis(mockAnalysis);

      // Save to database
      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          food_name: foodName,
          portion_size: quantity || '1 serving',
          meal_type: mealType,
          calories: mockAnalysis.nutrition.calories,
          protein: mockAnalysis.nutrition.protein,
          carbohydrates: mockAnalysis.nutrition.carbohydrates,
          fat: mockAnalysis.nutrition.fat,
          glucose_impact: mockAnalysis.glycemicImpact,
          meal_time: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Food Logged",
        description: `${foodName} has been added to your nutrition log.`,
      });

    } catch (error) {
      console.error('Error analyzing food:', error);
      toast({
        title: "Error",
        description: "Failed to analyze food. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Food Logger</h2>
        <p className="text-gray-600">Track what you eat and get nutrition insights</p>
      </div>

      {/* Input Form */}
      <div className="card-premium">
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">What did you eat?</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., grilled chicken breast"
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">How much?</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 150g, 1 cup"
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="input cursor-pointer"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeFood}
              disabled={!foodName.trim() || loading}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  <span>Log Food</span>
                </>
              )}
            </motion.button>
            
            <button className="btn-secondary flex items-center justify-center space-x-2">
              <CameraIcon className="w-4 h-4" />
              <span>Scan Food</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Nutrition Analysis: {foodName}
          </h3>

          {/* Nutrition Facts */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="text-center space-y-1">
              <div className="text-xl lg:text-2xl font-bold text-foreground">{analysis.nutrition.calories}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl lg:text-2xl font-bold text-foreground">{analysis.nutrition.protein}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl lg:text-2xl font-bold text-foreground">{analysis.nutrition.carbohydrates}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl lg:text-2xl font-bold text-foreground">{analysis.nutrition.fat}g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl lg:text-2xl font-bold text-foreground">{analysis.nutrition.fiber}g</div>
              <div className="text-xs text-muted-foreground">Fiber</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-xl lg:text-2xl font-bold text-foreground">{analysis.nutrition.sugar}g</div>
              <div className="text-xs text-muted-foreground">Sugar</div>
            </div>
          </div>

          {/* Health Scores */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center space-y-2 p-3 bg-muted/30 rounded-lg">
              <div className={`text-lg font-bold ${getScoreColor(analysis.insights.fertilityScore)}`}>
                {analysis.insights.fertilityScore}/100
              </div>
              <div className="text-xs text-muted-foreground">Health Score</div>
            </div>
            <div className="text-center space-y-2 p-3 bg-muted/30 rounded-lg">
              <div className={`text-lg font-bold ${getScoreColor(analysis.insights.muscleScore)}`}>
                {analysis.insights.muscleScore}/100
              </div>
              <div className="text-xs text-muted-foreground">Muscle Score</div>
            </div>
            <div className="text-center space-y-2 p-3 bg-muted/30 rounded-lg">
              <div className={`text-lg font-bold ${getScoreColor(analysis.insights.insulinScore)}`}>
                {analysis.insights.insulinScore}/100
              </div>
              <div className="text-xs text-muted-foreground">Blood Sugar</div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Recommendations</h4>
            {analysis.insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-[#48C6FF]/10 rounded-lg">
                <LightBulbIcon className="w-4 h-4 text-[#48C6FF] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Logs */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Recent Meals</h3>
          <button className="text-sm text-[#48C6FF] hover:text-[#2A7FFF] font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { food: 'Grilled Chicken Breast', time: '2 hours ago', calories: 185, type: 'lunch' },
            { food: 'Greek Yogurt with Berries', time: '4 hours ago', calories: 120, type: 'snack' },
            { food: 'Oatmeal with Banana', time: '6 hours ago', calories: 280, type: 'breakfast' },
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BeakerIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{log.food}</div>
                  <div className="text-sm text-muted-foreground">{log.time} • {log.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-foreground">{log.calories} cal</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodLogger;