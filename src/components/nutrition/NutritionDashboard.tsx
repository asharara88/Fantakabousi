import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FoodLogger from './FoodLogger';
import RecipeSearch from '../recipes/RecipeSearch';
import FoodLogsTable from './FoodLogsTable';
import { 
  BeakerIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface NutritionDashboardProps {
  onQuickAction?: (action: string) => void;
}

const NutritionDashboard: React.FC<NutritionDashboardProps> = ({ onQuickAction }) => {
  const [activeView, setActiveView] = useState('logger');

  const tabs = [
    { id: 'logger', label: 'Food Logger', icon: CameraIcon },
    { id: 'recipes', label: 'Find Recipes', icon: MagnifyingGlassIcon },
    { id: 'history', label: 'Food History', icon: ChartBarIcon },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'logger':
        return <FoodLogger />;
      case 'recipes':
        return <RecipeSearch />;
      case 'history':
        return <FoodLogsTable />;
      default:
        return <FoodLogger />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <BeakerIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nutrition & Recipes</h1>
            <p className="text-muted-foreground">Track your food and discover healthy recipes</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-muted rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeView === tab.id
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NutritionDashboard;