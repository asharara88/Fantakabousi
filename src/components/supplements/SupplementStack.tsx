import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Supplement } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';
import { 
  CubeIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  SparklesIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface StackItem {
  supplement: Supplement;
  dosage: string;
  timing: string;
  priority: number;
  notes?: string;
}

const SupplementStack: React.FC = () => {
  const { user } = useAuth();
  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStack, setActiveStack] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStack();
  }, []);

  const fetchUserStack = async () => {
    try {
      const { data, error } = await supabase
        .from('user_supplements')
        .select(`
          *,
          supplement:supplements(*)
        `)
        .eq('user_id', user?.id)
        .eq('subscription_active', true);

      if (error) throw error;
      
      // Transform data to match StackItem interface
      const stackItems = (data || []).map(item => ({
        supplement: item.supplement,
        dosage: '1 capsule', // Default dosage
        timing: 'Morning', // Default timing
        priority: 1,
        notes: '',
      }));
      
      setStackItems(stackItems);
    } catch (error) {
      console.error('Error fetching user stack:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromStack = async (supplementId: string) => {
    try {
      const { error } = await supabase
        .from('user_supplements')
        .delete()
        .eq('user_id', user?.id)
        .eq('supplement_id', supplementId);

      if (error) throw error;
      setStackItems(prev => prev.filter(item => item.supplement.id !== supplementId));
    } catch (error) {
      console.error('Error removing from stack:', error);
    }
  };

  const updateStackItem = (supplementId: string, updates: Partial<StackItem>) => {
    setStackItems(prev => prev.map(item => 
      item.supplement.id === supplementId 
        ? { ...item, ...updates }
        : item
    ));
  };

  const getTimingIcon = (timing: string) => {
    switch (timing.toLowerCase()) {
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

  const totalMonthlyCost = stackItems.reduce((sum, item) => sum + item.supplement.price, 0);
  const subscriptionDiscount = totalMonthlyCost * 0.2;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" variant="premium" />
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
              <h1 className="text-heading-xl text-foreground">My Supplement Stack</h1>
              <p className="text-caption">Your personalized daily wellness routine</p>
            </div>
          </div>
        </div>
        
        {stackItems.length > 0 && (
          <div className="text-right space-y-1">
            <div className="text-heading-lg font-bold text-foreground">
              {formatCurrency(totalMonthlyCost - subscriptionDiscount)}
            </div>
            <div className="text-caption text-green-500">
              Monthly with subscription
            </div>
          </div>
        )}
      </div>

      {stackItems.length > 0 ? (
        <div className="space-y-6">
          {/* Stack Overview */}
          <div className="card-premium p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">{stackItems.length}</div>
                <div className="text-caption">Supplements</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalMonthlyCost)}
                </div>
                <div className="text-caption">Monthly Cost</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-500">
                  {formatCurrency(subscriptionDiscount)}
                </div>
                <div className="text-caption">Monthly Savings</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">4.8</div>
                <div className="text-caption">Avg. Evidence Rating</div>
              </div>
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="card-premium p-6">
            <h2 className="text-heading-lg text-foreground mb-6">Daily Schedule</h2>
            
            <div className="space-y-4">
              {['Morning', 'Afternoon', 'Evening', 'Night'].map((timeSlot) => {
                const timeItems = stackItems.filter(item => item.timing === timeSlot);
                
                return (
                  <div key={timeSlot} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getTimingIcon(timeSlot)}</div>
                      <h3 className="text-body font-semibold text-foreground">{timeSlot}</h3>
                      <div className="text-caption">
                        {timeItems.length} supplement{timeItems.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {timeItems.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-8">
                        {timeItems.map((item) => (
                          <motion.div
                            key={item.supplement.id}
                            layout
                            className="card-premium p-4"
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.supplement.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'}
                                alt={item.supplement.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              
                              <div className="flex-1 space-y-1">
                                <h4 className="text-body font-semibold text-foreground">
                                  {item.supplement.name}
                                </h4>
                                <div className="text-caption">
                                  {item.dosage} • {formatCurrency(item.supplement.price)}/month
                                </div>
                              </div>
                              
                              <button
                                onClick={() => removeFromStack(item.supplement.id)}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="ml-8 text-caption text-muted-foreground">
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
              className="btn-primary flex items-center justify-center space-x-2 flex-1"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Manage Subscription</span>
            </motion.button>
            
            <button className="btn-secondary flex items-center justify-center space-x-2 flex-1">
              <SparklesIcon className="w-5 h-5" />
             <span>Get Coach Optimization</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CubeIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-heading-lg text-foreground mb-4">
            Build Your Supplement Stack
          </h2>
          <p className="text-body text-muted-foreground mb-8 max-w-md mx-auto">
           Create a personalized supplement routine based on your health goals and Coach recommendations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <SparklesIcon className="w-5 h-5" />
           <span>Get Coach Recommendations</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SupplementStack;