import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Supplement, supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';
import { 
  ShoppingBagIcon, 
  CubeIcon,
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

const SupplementShop: React.FC = () => {
  const [activeView, setActiveView] = useState<'browse' | 'stack'>('browse');
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('is_active', true)
        .limit(12);

      if (error) throw error;
      setSupplements(data || []);
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (supplement: Supplement) => {
    setCartItems(prev => ({
      ...prev,
      [supplement.id]: (prev[supplement.id] || 0) + 1
    }));
  };

  const filteredSupplements = supplements.filter(supplement =>
    supplement.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);

  const renderBrowseView = () => (
    <div className="space-y-6">
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
              <option value="all">All Categories</option>
              <option value="vitamins">Vitamins</option>
              <option value="minerals">Minerals</option>
              <option value="herbs">Herbs</option>
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
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSupplements.map((supplement, index) => {
            const cartQuantity = cartItems[supplement.id] || 0;
            
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
                    <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={supplement.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'}
                        alt={supplement.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    </button>
                    
                    {supplement.is_featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                        Featured
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
                            i < 4 ? 'text-yellow-400' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                    </div>
                    
                    {/* Price */}
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(supplement.price)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Stock: {supplement.stock_quantity}
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
                        onClick={() => addToCart(supplement)}
                        className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </motion.button>
                    )}
                    
                    <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <InformationCircleIcon className="w-5 h-5" />
                      <span>Learn More</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredSupplements.length === 0 && (
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

  const renderStackView = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <CubeIcon className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Build Your Supplement Stack
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Create a personalized supplement routine based on your health goals.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
      >
        <SparklesIcon className="w-5 h-5" />
        <span>Get Recommendations</span>
      </motion.button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Supplement Shop</h1>
              <p className="text-gray-600">Browse and manage your supplement stack</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex rounded-xl p-1 bg-gray-100">
            <button
              onClick={() => setActiveView('browse')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'browse'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setActiveView('stack')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'stack'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Stack
            </button>
          </div>
          
          {cartCount > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center space-x-2 relative"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Cart ({cartCount})</span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                {cartCount}
              </div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'browse' ? renderBrowseView() : renderStackView()}
      </motion.div>
    </div>
  );
};

export default SupplementShop;