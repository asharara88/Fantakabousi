import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useSupplements } from '../../hooks/useSupplements';
import { supabase } from '../../lib/supabase';
import { 
  ShoppingBagIcon,
  HeartIcon,
  StarIcon,
  PlusIcon,
  CheckIcon,
  SparklesIcon,
  BeakerIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
  ShoppingBagIcon as ShoppingSolidIcon
} from '@heroicons/react/24/solid';

interface Supplement {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  benefits?: string[];
  dosage?: string;
  form_type?: string;
  category?: string;
  tier?: 'green' | 'yellow' | 'orange' | 'red';
  evidence_rating?: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  stock_quantity?: number;
  subscription_discount_percent?: number;
}

interface CartItem {
  supplement: Supplement;
  quantity: number;
}

interface SupplementShopEnhancedProps {
  onQuickAction?: (action: string) => void;
}

const SupplementShopEnhanced: React.FC<SupplementShopEnhancedProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { supplements, loading, error } = useSupplements();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'vitamins', 'minerals', 'herbs', 'probiotics', 'omega-3', 'protein'];
  const tiers = ['all', 'green', 'yellow', 'orange', 'red'];

  const filteredSupplements = supplements.filter(supplement => {
    const matchesSearch = supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || supplement.category === selectedCategory;
    const matchesTier = selectedTier === 'all' || supplement.tier === selectedTier;
    
    return matchesSearch && matchesCategory && matchesTier;
  });

  const addToCart = (supplement: Supplement) => {
    setCart(prev => {
      const existing = prev.find(item => item.supplement.id === supplement.id);
      if (existing) {
        return prev.map(item =>
          item.supplement.id === supplement.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { supplement, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${supplement.name} has been added to your cart`,
    });
  };

  const toggleFavorite = async (supplementId: string) => {
    if (!user) return;

    const newFavorites = new Set(favorites);
    if (favorites.has(supplementId)) {
      newFavorites.delete(supplementId);
    } else {
      newFavorites.add(supplementId);
    }
    setFavorites(newFavorites);

    toast({
      title: favorites.has(supplementId) ? "Removed from favorites" : "Added to favorites",
      description: "Your preferences have been updated",
    });
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'green': return 'from-green-500 to-emerald-600';
      case 'yellow': return 'from-yellow-500 to-orange-500';
      case 'orange': return 'from-orange-500 to-red-500';
      case 'red': return 'from-red-500 to-pink-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.supplement.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error loading supplements: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Premium Supplements</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Evidence-based supplements for optimal health
          </p>
        </div>
        
        {/* Cart Summary */}
        {cartItemCount > 0 && (
          <motion.div
            className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <ShoppingSolidIcon className="w-6 h-6" />
            <div>
              <p className="font-semibold">{cartItemCount} items</p>
              <p className="text-sm opacity-90">${cartTotal.toFixed(2)}</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Checkout
            </button>
          </motion.div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search supplements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <FunnelIcon className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Evidence Tier
                </label>
                <div className="flex flex-wrap gap-2">
                  {tiers.map(tier => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTier === tier
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supplements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSupplements.map((supplement, index) => (
          <motion.div
            key={supplement.id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700/20 shadow-xl hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
              {supplement.image_url ? (
                <img
                  src={supplement.image_url}
                  alt={supplement.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BeakerIcon className="w-16 h-16 text-slate-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {supplement.is_featured && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
                {supplement.is_bestseller && (
                  <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full">
                    Bestseller
                  </span>
                )}
                {supplement.tier && (
                  <span className={`px-2 py-1 bg-gradient-to-r ${getTierColor(supplement.tier)} text-white text-xs font-bold rounded-full`}>
                    {supplement.tier.toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(supplement.id)}
                className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full hover:scale-110 transition-all"
              >
                {favorites.has(supplement.id) ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
                  {supplement.name}
                </h3>
                {supplement.evidence_rating && (
                  <div className="flex items-center gap-1 ml-2">
                    <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {supplement.evidence_rating}
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                {supplement.description}
              </p>
              
              {/* Benefits */}
              {supplement.benefits && supplement.benefits.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {supplement.benefits.slice(0, 2).map((benefit, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                    {supplement.benefits.length > 2 && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full">
                        +{supplement.benefits.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${supplement.price}
                  </p>
                  {supplement.subscription_discount_percent && supplement.subscription_discount_percent > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Save {supplement.subscription_discount_percent}% with subscription
                    </p>
                  )}
                </div>
                
                <motion.button
                  onClick={() => addToCart(supplement)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusIcon className="w-4 h-4" />
                  Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSupplements.length === 0 && (
        <div className="text-center py-12">
          <BeakerIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No supplements found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Featured Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <motion.div
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedCategory('vitamins')}
        >
          <SparklesIcon className="w-8 h-8 mb-4" />
          <h3 className="text-xl font-bold mb-2">Essential Vitamins</h3>
          <p className="text-green-100">Daily nutrition support</p>
        </motion.div>
        
        <motion.div
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedCategory('omega-3')}
        >
          <HeartIcon className="w-8 h-8 mb-4" />
          <h3 className="text-xl font-bold mb-2">Heart Health</h3>
          <p className="text-blue-100">Cardiovascular support</p>
        </motion.div>
        
        <motion.div
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedCategory('probiotics')}
        >
          <ShieldCheckIcon className="w-8 h-8 mb-4" />
          <h3 className="text-xl font-bold mb-2">Gut Health</h3>
          <p className="text-purple-100">Digestive wellness</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SupplementShopEnhanced;