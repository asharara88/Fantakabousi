import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSupplements } from '../../hooks/useSupplements';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';
import { 
  CubeIcon,
  TrashIcon,
  SparklesIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface SupplementStackProps {
  onQuickAction?: (action: string) => void;
}

const SupplementStack: React.FC<SupplementStackProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { 
    userSupplements, 
    loading, 
    removeFromStack,
    getStackTotal 
  } = useSupplements();

  const getTimingIcon = (timing: string) => {
    switch (timing?.toLowerCase()) {
      case 'morning':
        return '🌅';
      case 'afternoon':
        return '☀️';
      case 'evening':
        return '🌆';
      case 'night':
        return '🌙';
      default:
        return '⏰';
    }
  };

  const totalMonthlyCost = getStackTotal();
  const subscriptionDiscount = totalMonthlyCost * 0.2;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <CubeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Supplement Stack</h1>
              <p className="text-gray-600">Your personalized daily wellness routine</p>
            </div>
          </div>
        </div>
        
        {userSupplements.length > 0 && (
          <div className="text-right space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalMonthlyCost - subscriptionDiscount)}
            </div>
            <div className="text-sm text-green-500">
              Monthly with subscription
            </div>
          </div>
        )}
      </div>

      {userSupplements.length > 0 ? (
        <div className="space-y-6">
          {/* Stack Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-gray-900">{userSupplements.length}</div>
                <div className="text-sm text-gray-600">Supplements</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalMonthlyCost)}
                </div>
                <div className="text-sm text-gray-600">Monthly Cost</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-500">
                  {formatCurrency(subscriptionDiscount)}
                </div>
                <div className="text-sm text-gray-600">Monthly Savings</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-500">4.8</div>
                <div className="text-sm text-gray-600">Avg. Evidence Rating</div>
              </div>
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Schedule</h2>
            
            <div className="space-y-4">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map((timeSlot) => {
                const timeItems = userSupplements.filter(() => Math.random() > 0.5); // Mock timing
                
                return (
                  <div key={timeSlot} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getTimingIcon(timeSlot)}</div>
                      <h3 className="text-lg font-semibold text-gray-900">{timeSlot}</h3>
                      <div className="text-sm text-gray-600">
                        {timeItems.length} supplement{timeItems.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {timeItems.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-8">
                        {timeItems.map((item) => (
                          <motion.div
                            key={item.supplement_id}
                            layout
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg flex items-center justify-center">
                                <div className="text-xs font-bold text-green-700 text-center leading-tight">
                                  {item.supplement?.name?.split(' ').slice(0, 2).join(' ')}
                                </div>
                              </div>
                              
                              <div className="flex-1 space-y-1">
                                <h4 className="font-semibold text-gray-900">
                                  {item.supplement?.name}
                                </h4>
                                <div className="text-sm text-gray-600">
                                  1 capsule • {formatCurrency(item.supplement?.price || 0)}/month
                                </div>
                              </div>
                              
                              <button
                                onClick={() => removeFromStack(item.supplement_id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="ml-8 text-sm text-gray-500">
                        No supplements scheduled for {timeSlot.toLowerCase()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Manage Subscription</span>
            </motion.button>
            
            <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              onClick={() => {
                onQuickAction?.('coach');
                toast({
                  title: "AI Coach Ready",
                  description: "Ask your coach about supplement optimization.",
                });
              }}
              <SparklesIcon className="w-5 h-5" />
              <span>Get Smart Coach Optimization</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CubeIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Build Your Supplement Stack
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create a personalized supplement routine based on your health goals and Coach recommendations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
          >
            <SparklesIcon className="w-5 h-5" />
            <span>Get Smart Recommendations</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SupplementStack;