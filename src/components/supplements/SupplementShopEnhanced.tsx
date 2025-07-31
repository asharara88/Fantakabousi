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
  CubeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SupplementShopEnhanced: React.FC = () => {
  const { supplements, loading } = useSupplements();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());

  // Generate categories from real data
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(supplements.map(s => s.category).filter(Boolean)));
    return [
      { id: 'all', name: 'All Products', icon: CubeIcon, count: supplements.length },
      ...uniqueCategories.map(cat => ({
        id: cat.toLowerCase(),
        name: cat,
        icon: getCategoryIcon(cat),
        count: supplements.filter(s => s.category === cat).length
      }))
    ];
  }, [supplements]);

  const filteredSupplements = supplements.filter(supplement => {
    const matchesCategory = selectedCategory === 'all' || supplement.category === selectedCategory;
    const matchesSearch = supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplement.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getStockStatus = (quantity: number) => {
    if (quantity > 50) return { text: 'In Stock', color: 'text-green-600' };
    if (quantity > 10) return { text: 'Low Stock', color: 'text-yellow-600' };
    if (quantity > 0) return { text: 'Very Low', color: 'text-red-600' };
    return { text: 'Out of Stock', color: 'text-gray-500' };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Supplement Shop</h1>
        <p className="text-xl text-gray-600">Real supplements database with {supplements.length} products</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search supplements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-3">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filter by category</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedCategory === category.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <category.icon className={`w-8 h-8 ${
                selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <div className="text-center">
                <div className="font-semibold text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">{category.count} products</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSupplements.map((supplement, index) => {
          const isInCart = cartItems.has(supplement.id);
          const stockStatus = getStockStatus(supplement.stock_quantity);
          
          return (
            <motion.div
              key={supplement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="relative">
                  <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={supplement.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'}
                      alt={supplement.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {supplement.is_featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                  
                  {supplement.is_bestseller && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      BESTSELLER
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {supplement.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {supplement.description}
                    </p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < 4 // Default 4-star rating
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                      <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                    </div>
                    <div className={`text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div className="space-y-1">
                    {supplement.key_benefits.split(',').slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{benefit.trim()}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(supplement.price)} {supplement.currency}
                    </div>
                    {supplement.compare_at_price > supplement.price && (
                    <div className="text-sm text-green-600">
                        Save {formatCurrency(supplement.compare_at_price - supplement.price)}
                    </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
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
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>
                    {!supplement.is_available ? 'Out of Stock' :
                     isInCart ? 'Added to Stack' : 'Add to Stack'}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cartItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 bg-white rounded-xl p-6 shadow-2xl border border-gray-200 z-40"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Your Stack</h3>
              <span className="text-sm text-gray-600">{cartItems.size} items</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(Array.from(cartItems).reduce((sum, id) => {
                    const supplement = supplements.find(s => s.id === id);
                    return sum + (supplement?.price || 0);
                  }, 0))}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Subscription Discount (20%)</span>
                <span className="font-semibold">
                  -{formatCurrency(Array.from(cartItems).reduce((sum, id) => {
                    const supplement = supplements.find(s => s.id === id);
                    return sum + (supplement?.price || 0);
                  }, 0) * 0.2)}
                </span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SupplementShopEnhanced;