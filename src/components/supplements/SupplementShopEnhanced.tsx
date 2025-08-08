import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSupplements } from '../../hooks/useSupplements';
import { formatSupplementPrice } from '../../lib/supplementsData';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  ShoppingBag,
  Heart,
  Star,
  Search,
  Plus,
  Minus,
  Check,
  Sparkles,
  Shield,
  Truck,
  CreditCard,
  Filter,
  X
} from 'lucide-react';

interface SupplementShopEnhancedProps {
  onQuickAction?: (action: string) => void;
}

const SupplementShopEnhanced: React.FC<SupplementShopEnhancedProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { supplements, loading: supplementsLoading, addToStack, isInStack } = useSupplements();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartCount, setCartCount] = useState(0);
  const [showProtocolModal, setShowProtocolModal] = useState<string | null>(null);

  // Simplified categories with friendly names
  const categories = [
    { value: 'all', label: 'All Products', emoji: '🌟' },
    { value: 'energy', label: 'Energy & Focus', emoji: '⚡' },
    { value: 'sleep', label: 'Sleep & Recovery', emoji: '😴' },
    { value: 'immunity', label: 'Immune Support', emoji: '🛡️' },
    { value: 'heart', label: 'Heart Health', emoji: '❤️' },
    { value: 'muscle', label: 'Muscle & Fitness', emoji: '💪' }
  ];

  // Specific health protocols with exact supplements
  const healthProtocols = {
    'glucose-control': {
      title: 'Glucose Control Protocol',
      problem: 'Post-meal glucose spikes to 168mg/dL (target: <140mg/dL)',
      supplements: [
        { name: 'Berberine HCl', dosage: '500mg', timing: '15 minutes before meals', price: 89 },
        { name: 'Chromium Picolinate', dosage: '200mcg', timing: 'With breakfast', price: 45 },
        { name: 'Alpha Lipoic Acid', dosage: '300mg', timing: 'With largest meal', price: 67 }
      ],
      lifestyle: [
        '10-minute walk after each meal',
        'Limit meals to <30g net carbs',
        'Eat protein first, carbs last'
      ],
      totalCost: 201,
      expectedResults: 'Reduce post-meal spikes by 40-60mg/dL within 2 weeks'
    },
    'sleep-optimization': {
      title: 'Sleep Extension Protocol',
      problem: 'Averaging 6h 12m sleep (need 7.5+ hours for recovery)',
      supplements: [
        { name: 'Magnesium Glycinate', dosage: '400mg', timing: '1 hour before bed', price: 56 },
        { name: 'Melatonin', dosage: '1mg', timing: '30 minutes before bed', price: 34 },
        { name: 'L-Theanine', dosage: '200mg', timing: 'With dinner', price: 42 }
      ],
      lifestyle: [
        'Set bedtime to 10:30 PM (30 min earlier)',
        'No screens after 9:30 PM',
        'Room temperature 65-68°F'
      ],
      totalCost: 132,
      expectedResults: 'Increase sleep duration to 7.5+ hours within 1 week'
    },
    'hrv-recovery': {
      title: 'HRV Recovery Protocol',
      problem: 'HRV dropped from 35ms to 28ms (indicates stress/poor recovery)',
      supplements: [
        { name: 'Ashwagandha KSM-66', dosage: '600mg', timing: 'With dinner', price: 78 },
        { name: 'Magnesium Glycinate', dosage: '400mg', timing: 'Before bed', price: 56 },
        { name: 'Omega-3 EPA/DHA', dosage: '2g', timing: 'With breakfast', price: 89 }
      ],
      lifestyle: [
        '4-7-8 breathing protocol 2x daily',
        'Reduce training intensity 20% for 1 week',
        '10-minute morning meditation'
      ],
      totalCost: 223,
      expectedResults: 'Improve HRV to 35+ ms within 2-3 weeks'
    }
  };

  // Featured/popular supplements
  const featuredSupplements = supplements.filter(s => s.is_featured || s.is_bestseller).slice(0, 6);
  const allSupplements = supplements.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || s.category?.toLowerCase().includes(selectedCategory))
  );

  const handleAddToCart = async (supplement: any) => {
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToStack(supplement.id);
      setCartCount(prev => prev + 1);
      
      toast({
        title: "Added to your stack! 🎉",
        description: `${supplement.name} is now in your supplement stack`,
      });
    } catch (error) {
      toast({
        title: "Couldn't add to cart",
        description: "Please try again in a moment",
        variant: "destructive"
      });
    }
  };

  const openProtocol = (protocolId: string) => {
    setShowProtocolModal(protocolId);
  };

  if (supplementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Friendly Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
              Health Supplements
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find what your body needs to feel its best
            </p>
          </div>
        </div>
      </div>

      {/* Simple Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for supplements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Category Filters - Friendly Icons */}
        <div className="flex overflow-x-auto space-x-3 pb-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="text-lg">{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Health Protocol Shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50"
      >
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              🎯 Targeted Health Protocols
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Based on your health data, here are specific supplement protocols to address your concerns
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.entries(healthProtocols).map(([key, protocol]) => (
              <motion.button
                key={key}
                onClick={() => openProtocol(key)}
                className="p-4 bg-white/60 dark:bg-slate-800/60 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all text-left group border border-white/40 dark:border-slate-700/40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    {protocol.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {protocol.problem}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-600">
                      AED {protocol.totalCost}
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-full">
                      {protocol.supplements.length} supplements
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Featured Products - Big Cards */}
      {searchQuery === '' && selectedCategory === 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Popular supplements ⭐
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredSupplements.map((supplement, index) => (
              <motion.div
                key={supplement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Product Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                        {supplement.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                        {supplement.description}
                      </p>
                    </div>
                    
                    {supplement.is_bestseller && (
                      <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Benefits - Simple List */}
                  {supplement.benefits && supplement.benefits.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        What it helps with:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {supplement.benefits.slice(0, 3).map((benefit, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatSupplementPrice(supplement.price || '0')}
                      </div>
                      {supplement.dosage && (
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {supplement.dosage}
                        </div>
                      )}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddToCart(supplement)}
                      disabled={isInStack(supplement.id)}
                      className={`px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                        isInStack(supplement.id)
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {isInStack(supplement.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>In Stack</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add to Stack</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All Products - Simple Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSupplements.map((supplement, index) => (
          <motion.div
            key={supplement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              {/* Product Image Placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center">
                <div className="text-4xl">💊</div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
                  {supplement.name}
                </h3>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {supplement.description}
                </p>

                {/* Simple Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (supplement.evidence_rating || 4) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    ({supplement.evidence_rating || 4.0})
                  </span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatSupplementPrice(supplement.price || '0')}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(supplement)}
                  disabled={isInStack(supplement.id)}
                  className={`px-4 py-2 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                    isInStack(supplement.id)
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg'
                  }`}
                >
                  {isInStack(supplement.id) ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {allSupplements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No supplements found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try searching for something else or browse all categories
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <Shield className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-semibold text-slate-900 dark:text-white">Third-Party Tested</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">All products verified for purity</div>
          </div>
          <div className="space-y-2">
            <Truck className="w-8 h-8 text-blue-600 mx-auto" />
            <div className="font-semibold text-slate-900 dark:text-white">Free Shipping</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">On orders over AED 200</div>
          </div>
          <div className="space-y-2">
            <Heart className="w-8 h-8 text-red-600 mx-auto" />
            <div className="font-semibold text-slate-900 dark:text-white">Quality Guarantee</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Not satisfied? Full refund</div>
          </div>
        </div>
      </motion.div>

      {/* Protocol Modal */}
      <AnimatePresence>
        {showProtocolModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowProtocolModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-slate-700/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {showProtocolModal && healthProtocols[showProtocolModal as keyof typeof healthProtocols] && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {healthProtocols[showProtocolModal as keyof typeof healthProtocols].title}
                    </h2>
                    <button
                      onClick={() => setShowProtocolModal(null)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Your Current Issue:</h3>
                    <p className="text-amber-700 dark:text-amber-500">
                      {healthProtocols[showProtocolModal as keyof typeof healthProtocols].problem}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Supplement Protocol:</h3>
                    {healthProtocols[showProtocolModal as keyof typeof healthProtocols].supplements.map((supp, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{supp.name}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {supp.dosage} • {supp.timing}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">AED {supp.price}</div>
                          <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                            Add to Stack
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Lifestyle Changes:</h3>
                    {healthProtocols[showProtocolModal as keyof typeof healthProtocols].lifestyle.map((change, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span className="text-slate-700 dark:text-slate-300">{change}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2">Expected Results:</h3>
                    <p className="text-emerald-700 dark:text-emerald-500">
                      {healthProtocols[showProtocolModal as keyof typeof healthProtocols].expectedResults}
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowProtocolModal(null)}
                      className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Maybe Later
                    </button>
                    <button
                      onClick={() => {
                        toast({
                          title: "Protocol Started! 🎯",
                          description: `${healthProtocols[showProtocolModal as keyof typeof healthProtocols].title} added to your daily routine`,
                        });
                        setShowProtocolModal(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Start Protocol (AED {healthProtocols[showProtocolModal as keyof typeof healthProtocols].totalCost})
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupplementShopEnhanced;