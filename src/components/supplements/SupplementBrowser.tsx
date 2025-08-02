import React, { useState, useEffect } from 'react';
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
  InformationCircleIcon,
  CheckCircleIcon,
  SparklesIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface SupplementBrowserProps {
  onAddToCart: (supplement: any) => void;
  cartItems: { [key: string]: number };
}

const SupplementBrowser: React.FC<SupplementBrowserProps> = ({ onAddToCart, cartItems }) => {
  const { supplements, loading } = useSupplements();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (supplementId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(supplementId)) {
        newFavorites.delete(supplementId);
      } else {
        newFavorites.add(supplementId);
      }
      return newFavorites;
    });
  };

  const filteredSupplements = supplements.filter(supplement =>
    supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplement.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['all', ...Array.from(new Set(supplements.map(s => s.category).filter(Boolean)))];

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'green': return 'from-green-500 to-emerald-600';
      case 'yellow': return 'from-yellow-500 to-orange-600';
      case 'orange': return 'from-orange-500 to-red-600';
      case 'red': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search supplements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="name">Name A-Z</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          {filteredSupplements.length} supplements found
        </div>
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">AI-Curated Selection</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSupplements.map((supplement, index) => {
          const cartQuantity = cartItems[supplement.id] || 0;
          const isFavorite = favorites.has(supplement.id);
          
          return (
            <motion.div
              key={supplement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl flex items-center justify-center p-4">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-bold text-gray-900 leading-tight line-clamp-3">
                        {supplement.name}
                      </div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {supplement.category || 'Supplement'}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleFavorite(supplement.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                  >
                    <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                  
                  {supplement.is_featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}
                  
                  {supplement.tier && (
                    <div className={`absolute bottom-3 left-3 px-2 py-1 bg-gradient-to-r ${getTierColor(supplement.tier)} text-white text-xs font-bold rounded-full`}>
                      {supplement.tier.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-2">
                      {supplement.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {supplement.description}
                    </p>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(supplement.evidence_rating || 4) 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({supplement.evidence_rating || 4.0})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(supplement.price)}
                      </div>
                      {supplement.subscription_discount_percent > 0 && (
                        <div className="text-sm text-green-500">
                          {supplement.subscription_discount_percent}% off subscription
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Stock: {supplement.stock_quantity} • {supplement.use_case || 'General wellness'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {cartQuantity > 0 ? (
                    <div className="flex items-center justify-center space-x-2 w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>In Cart ({cartQuantity})</span>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddToCart(supplement)}
                      className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Add to Stack</span>
                    </motion.button>
                  )}
                  
                  <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    onClick={onAskCoach}
                    <InformationCircleIcon className="w-5 h-5" />
                    <span>Ask Smart Coach</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSupplements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BeakerIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            No supplements found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplementBrowser;