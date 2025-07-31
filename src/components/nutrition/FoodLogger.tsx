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
      // Simulate nutrition analysis (replace with real API call)
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
            'Moderate glycemic impact - consider timing',
            'Contains nutrients beneficial for fertility'
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
        title: "Food Logged Successfully",
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

  const getGlycemicColor = (impact: number) => {
    if (impact < 10) return 'text-green-600';
    if (impact < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-blue-light rounded-xl flex items-center justify-center shadow-lg">
          <BeakerIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Food Logger</h2>
          <p className="text-muted-foreground">Track nutrition and analyze health impact</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Food Item</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., grilled chicken breast"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Quantity</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 150g, 1 cup"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-light bg-background text-foreground"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeFood}
              disabled={!foodName.trim() || loading}
              className="flex-1 bg-gradient-to-r from-blue-light to-blue-medium text-white font-medium py-3 px-6 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <PlusIcon className="w-5 h-5" />
                  <span>Analyze & Log</span>
                </>
              )}
            </motion.button>
            
            <button className="px-6 py-3 border border-border text-muted-foreground font-medium rounded-xl hover:bg-muted/50 transition-colors flex items-center space-x-2">
              <CameraIcon className="w-5 h-5" />
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
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Nutrition Analysis: {foodName}
          </h3>

          {/* Nutrition Facts */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">{analysis.nutrition.calories}</div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">{analysis.nutrition.protein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">{analysis.nutrition.carbohydrates}g</div>
              <div className="text-sm text-gray-600">Carbs</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">{analysis.nutrition.fat}g</div>
              <div className="text-sm text-gray-600">Fat</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">{analysis.nutrition.fiber}g</div>
              <div className="text-sm text-gray-600">Fiber</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-gray-900">{analysis.nutrition.sugar}g</div>
              <div className="text-sm text-gray-600">Sugar</div>
            </div>
          </div>

          {/* Health Scores */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center space-y-2 p-4 bg-gray-50 rounded-xl">
              <div className={`text-xl font-bold ${getScoreColor(analysis.insights.fertilityScore)}`}>
                {analysis.insights.fertilityScore}/100
              </div>
              <div className="text-sm text-gray-600">Fertility Score</div>
            </div>
            <div className="text-center space-y-2 p-4 bg-gray-50 rounded-xl">
              <div className={`text-xl font-bold ${getScoreColor(analysis.insights.muscleScore)}`}>
                {analysis.insights.muscleScore}/100
              </div>
              <div className="text-sm text-gray-600">Muscle Score</div>
            </div>
            <div className="text-center space-y-2 p-4 bg-gray-50 rounded-xl">
              <div className={`text-xl font-bold ${getScoreColor(analysis.insights.insulinScore)}`}>
                {analysis.insights.insulinScore}/100
              </div>
              <div className="text-sm text-gray-600">Insulin Score</div>
            </div>
          </div>

          {/* Glycemic Impact */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BeakerIcon className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900">Glycemic Impact</span>
              </div>
              <div className={`text-lg font-bold ${getGlycemicColor(analysis.glycemicImpact)}`}>
                {analysis.glycemicImpact} GL
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {analysis.glycemicImpact < 10 ? 'Low impact - great for blood sugar control' :
               analysis.glycemicImpact < 20 ? 'Moderate impact - monitor timing' :
               'High impact - may cause glucose spikes'}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Recommendations</h4>
            {analysis.insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <LightBulbIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Logs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Food Logs</h3>
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { food: 'Grilled Chicken Breast', time: '2 hours ago', calories: 185, type: 'lunch' },
            { food: 'Greek Yogurt with Berries', time: '4 hours ago', calories: 120, type: 'snack' },
            { food: 'Oatmeal with Banana', time: '6 hours ago', calories: 280, type: 'breakfast' },
          ].map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <BeakerIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{log.food}</div>
                  <div className="text-sm text-gray-600">{log.time} • {log.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">{log.calories} cal</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodLogger;