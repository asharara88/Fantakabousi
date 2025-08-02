import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';
import { supabase, Supplement } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { 
  PlusIcon, 
  ShoppingCartIcon,
  InformationCircleIcon,
  CheckIcon,
  SparklesIcon,
  StarIcon,
  CubeIcon,
  ClockIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SupplementStack: React.FC = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplements, setSelectedSupplements] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      setSupplements(data || []);
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSupplement = (id: string) => {
    setSelectedSupplements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectedTotal = supplements
    .filter(s => selectedSupplements.has(s.id))
    .reduce((sum, s) => sum + (s.price || 0), 0);

  const subscriptionDiscount = selectedTotal * 0.2;

  if (loading) {
    return (
      <div className="glass-card rounded-3xl p-12">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CubeIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-display text-gradient-brand">Your Daily Stack</h2>
            </div>
            <p className="text-white/70 text-lg">
              AI-curated supplements optimized for your biology
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-400 rounded-xl text-sm font-bold flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4" />
              <span>AI Curated</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {supplements.map((supplement, index) => {
            const isSelected = selectedSupplements.has(supplement.id);
            
            return (
              <motion.div
                key={supplement.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ y: -8 }}
                className={`glass-ultra rounded-2xl p-6 cursor-pointer transition-all duration-300 border ${
                  isSelected 
                    ? 'border-green-500/50 shadow-lg shadow-green-500/20' 
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => toggleSupplement(supplement.id)}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckIcon className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/90 to-white/70 border-2 border-white/30 flex items-center justify-center mx-auto shadow-lg">
                      <div className="text-center p-1">
                        <div className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">
                          {supplement.name}
                        </div>
                      </div>
                    </div>
                    {supplement.is_featured && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <StarIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-white">
                      {supplement.name}
                    </h3>
                    
                    <div className="flex items-center justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon 
                          key={i} 
                          className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-white/30'}`} 
                        />
                      ))}
                      <span className="text-xs text-white/60 ml-1">(4.8)</span>
                    </div>

                    <p className="text-white/60 text-sm line-clamp-2">
                      {supplement.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(supplement.price || 0)}
                      </div>
                      <div className="text-xs text-green-400">
                        {formatCurrency((supplement.price || 0) * 0.8)} with subscription
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300">
                        <InformationCircleIcon className="w-4 h-4" />
                      </button>
                      
                      <div className="text-xs text-white/50">
                        Stock: {supplement.stock_quantity}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedSupplements.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              className="glass-ultra rounded-2xl p-6 border border-green-400/30"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <ShoppingCartIcon className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-bold text-white">
                      Your Stack ({selectedSupplements.size} supplements)
                    </h3>
                  </div>
                  <p className="text-white/60">
                    Optimized for your health goals
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Monthly savings</div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(subscriptionDiscount)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">Subtotal</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(selectedTotal)}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">Subscription (20% off)</div>
                  <div className="text-xl font-bold text-green-400">
                    -{formatCurrency(subscriptionDiscount)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/60 text-sm">Monthly Total</div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(selectedTotal - subscriptionDiscount)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
                <button className="px-6 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                  Customize Stack
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedSupplements.size === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PlusIcon className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Build Your Perfect Stack
            </h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Select supplements that align with your health goals
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Get AI Recommendations</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SupplementStack;