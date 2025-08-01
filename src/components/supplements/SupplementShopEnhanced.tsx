import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupplements } from '../../hooks/useSupplements';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  StarIcon,
  ShoppingCartIcon,
  SparklesIcon,
  MoonIcon,
  BoltIcon,
  FireIcon,
  ShieldCheckIcon,
  BeakerIcon,
  CubeIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface SupplementShopEnhancedProps {
  onQuickAction?: (action: string) => void;
}

const SupplementShopEnhanced: React.FC<SupplementShopEnhancedProps> = ({ onQuickAction }) => {
  const { supplements, loading } = useSupplements();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Generate categories from real data
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(supplements.map(s => s.category).filter(Boolean)));
    return [
      { id: 'all', name: 'All', icon: CubeIcon, count: supplements.length },
      ...uniqueCategories.slice(0, 4).map(cat => ({
        id: cat.toLowerCase(),
        name: cat.length > 12 ? cat.substring(0, 12) + '...' : cat,
        icon: getCategoryIcon(cat),
        count: supplements.filter(s => s.category === cat).length
      }))
    ];
  }, [supplements]);

  const filteredSupplements = supplements.filter(supplement => {
    const matchesCategory = selectedCategory === 'all' || 
      supplement.category?.toLowerCase() === selectedCategory;
    const matchesSearch = supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplement.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function getCategoryIcon(category: string) {
    const cat = category.toLowerCase();
    if (cat.includes('vitamin') || cat.includes('mineral')) return BeakerIcon;
    if (cat.includes('protein') || cat.includes('amino')) return FireIcon;
    if (cat.includes('omega') || cat.includes('fatty')) return HeartIcon;
    if (cat.includes('probiotic') || cat.includes('digestive')) return ShieldCheckIcon;
    if (cat.includes('sleep') || cat.includes('recovery')) return MoonIcon;
    return CubeIcon;
  }

  const toggleCart = (supplementId: string) => {
    setCartItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(supplementId)) {
        newSet.delete(supplementId);
      } else {
        newSet.add(supplementId);
      }
      return newSet;
    });
  };

  const toggleFavorite = (supplementId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(supplementId)) {
        newSet.delete(supplementId);
      } else {
        newSet.add(supplementId);
      }
      return newSet;
    });
  };

  const getStockStatus = (quantity: number) => {
    if (quantity > 50) return { text: 'In Stock', color: 'text-green-600' };
    if (quantity > 10) return { text: 'Low Stock', color: 'text-yellow-600' };
    if (quantity > 0) return { text: 'Very Low', color: 'text-red-600' };
    return { text: 'Out of Stock', color: 'text-gray-500' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Supplement Shop</h1>
        <p className="text-gray-600">{supplements.length} products available</p>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search supplements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-xl border-2 transition-all duration-200 ${
              selectedCategory === category.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <category.icon className={`w-6 h-6 ${
                selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <div className="text-center">
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">{category.count}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-2">
        <span className="text-gray-600">{filteredSupplements.length} products</span>
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">AI-Curated</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSupplements.map((supplement, index) => {
          const isInCart = cartItems.has(supplement.id);
          const isFavorite = favorites.has(supplement.id);
          const stockStatus = getStockStatus(supplement.stock_quantity);
          
          return (
            <motion.div
              key={supplement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card cursor-pointer"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="relative">
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={supplement.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg'}
                      alt={supplement.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <button 
                    onClick={() => toggleFavorite(supplement.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="w-4 h-4 text-red-500" />
                    ) : (
                      <HeartIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {supplement.is_featured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 text-sm lg:text-base">
                      {supplement.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {supplement.description}
                    </p>
                  </div>
                  
                  {/* Rating & Stock */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon 
                          key={i} 
                          className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">(4.0)</span>
                    </div>
                    <div className={`text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg lg:text-xl font-bold text-gray-900">
                      {formatCurrency(supplement.price)}
                    </div>
                    {supplement.subscription_discount_percent > 0 && (
                      <div className="text-xs text-green-600">
                        {supplement.subscription_discount_percent}% off
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleCart(supplement.id)}
                  disabled={!supplement.is_available}
                  className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    !supplement.is_available
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isInCart
                      ? 'bg-green-100 text-green-700 border-2 border-green-200'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                  }`}
                >
                  {!supplement.is_available ? (
                    <>
                      <span>Out of Stock</span>
                    </>
                  ) : isInCart ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSupplements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BeakerIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No supplements found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or category filter
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Cart Summary */}
      {cartItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 bg-white rounded-xl p-4 shadow-2xl border border-gray-200 z-40"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Cart</h3>
              <span className="text-sm text-gray-600">{cartItems.size} items</span>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(Array.from(cartItems).reduce((sum, id) => {
                  const supplement = supplements.find(s => s.id === id);
                  return sum + (supplement?.price || 0);
                }, 0))}
              </div>
              <div className="text-xs text-green-600">
                Save 20% with subscription
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Checkout
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SupplementShopEnhanced;