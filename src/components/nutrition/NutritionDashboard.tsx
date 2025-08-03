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
        return <FoodLogger onQuickAction={onQuickAction} />;
      case 'recipes':
        return <RecipeSearch />;
      case 'history':
        return <FoodLogsTable />;
      default:
        return <FoodLogger onQuickAction={onQuickAction} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
            <BeakerIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Nutrition & Recipes</h1>
            <p className="text-gray-600 dark:text-gray-300">Track your food and discover healthy recipes</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              activeView === tab.id
                ? 'bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">{tab.label}</span>
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