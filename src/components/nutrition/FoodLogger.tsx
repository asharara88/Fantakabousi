import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { analyzeFood } from '../../lib/api';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  CameraIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const FoodLogger: React.FC = () => {
  const { user } = useAuth();
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyzeFood = async () => {
    if (!foodName.trim() || !user) return;

    setLoading(true);
    try {
      const result = await analyzeFood(foodName, quantity || '1 serving', user.id);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing food:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return ExclamationTriangleIcon;
      case 'success': return CheckCircleIcon;
      default: return LightBulbIcon;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-500 bg-red-500/10';
      case 'success': return 'text-green-500 bg-green-500/10';
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <BeakerIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-heading-lg text-foreground">Food Logger</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-body font-semibold text-foreground">Food Item</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., grilled chicken breast"
                  className="input-premium pl-10 w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-body font-semibold text-foreground">Quantity</label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 150g, 1 cup"
                className="input-premium w-full"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyzeFood}
              disabled={!foodName.trim() || loading}
              className="btn-primary flex items-center space-x-2 flex-1"
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
            
            <button className="btn-secondary flex items-center space-x-2">
              <CameraIcon className="w-5 h-5" />
              <span>Scan</span>
            </button>
          </div>
        </div>
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-6"
        >
          <h3 className="text-body font-semibold text-foreground mb-4">
            Nutrition Analysis: {analysis.foodName}
          </h3>

          {/* Nutrition Facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-foreground">{analysis.nutrition.calories}</div>
              <div className="text-caption">Calories</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-foreground">{analysis.nutrition.protein}g</div>
              <div className="text-caption">Protein</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-foreground">{analysis.nutrition.carbohydrates}g</div>
              <div className="text-caption">Carbs</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-foreground">{analysis.nutrition.fat}g</div>
              <div className="text-caption">Fat</div>
            </div>
          </div>

          {/* Health Scores for Ahmed's Goals */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center space-y-2">
              <div className={`text-xl font-bold ${
                analysis.insights.fertilityScore > 70 ? 'text-green-500' : 
                analysis.insights.fertilityScore > 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {analysis.insights.fertilityScore}/100
              </div>
              <div className="text-caption">Fertility Score</div>
            </div>
            <div className="text-center space-y-2">
              <div className={`text-xl font-bold ${
                analysis.insights.muscleScore > 70 ? 'text-green-500' : 
                analysis.insights.muscleScore > 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {analysis.insights.muscleScore}/100
              </div>
              <div className="text-caption">Muscle Score</div>
            </div>
            <div className="text-center space-y-2">
              <div className={`text-xl font-bold ${
                analysis.insights.insulinScore > 70 ? 'text-green-500' : 
                analysis.insights.insulinScore > 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {analysis.insights.insulinScore}/100
              </div>
              <div className="text-caption">Insulin Score</div>
            </div>
          </div>

          {/* Glucose Impact */}
          <div className="card-premium p-4 bg-muted/30 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BeakerIcon className="w-5 h-5 text-primary" />
                <span className="text-body font-semibold">Glucose Impact</span>
              </div>
              <div className={`text-lg font-bold ${
                analysis.glycemicImpact < 5 ? 'text-green-500' :
                analysis.glycemicImpact < 15 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {analysis.glycemicImpact} GL
              </div>
            </div>
            <div className="text-caption mt-2">
              {analysis.glycemicImpact < 5 ? 'Low impact - great for insulin sensitivity' :
               analysis.glycemicImpact < 15 ? 'Moderate impact - monitor timing' :
               'High impact - may cause glucose spikes'}
            </div>
          </div>

          {/* AI Insights */}
          {analysis.insights.insights.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-body font-semibold text-foreground">AI Insights</h4>
              {analysis.insights.insights.map((insight: any, index: number) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div key={index} className={`p-3 rounded-lg ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 mt-0.5" />
                      <span className="text-body">{insight.message}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FoodLogger;