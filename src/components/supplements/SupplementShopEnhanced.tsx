import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSupplements } from '../../hooks/useSupplements';
import { formatSupplementPrice } from '../../lib/supplementsData';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  ShoppingBagIcon,
  HeartIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
  SparklesIcon,
  BeakerIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Supplement {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  benefits?: string[];
  dosage?: string;
  form_type?: string;
  category?: string;
  tier?: string;
  evidence_rating?: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  stock_quantity: number;
  is_available: boolean;
}

interface CartItem {
  id: string;
  supplement_id: string;
  quantity: number;
  supplement: Supplement;
}

interface SupplementShopEnhancedProps {
  onQuickAction?: (action: string) => void;
}

const SupplementShopEnhanced: React.FC<SupplementShopEnhancedProps> = ({ onQuickAction }) => {
  const { user } = useAuth();
  const { supplements, loading: supplementsLoading } = useSupplements();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          supplement:supplements(*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const addToCart = async (supplement: Supplement) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.supplement_id === supplement.id);
      
      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: user.id,
            supplement_id: supplement.id,
            quantity: 1
          }]);

        if (error) throw error;
      }

      toast({
        title: "Added to Cart",
        description: `${supplement.name} has been added to your cart`
      });

      fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;
      fetchCartItems();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive"
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      fetchCartItems();
      
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'vitamins', label: 'Vitamins' },
    { value: 'minerals', label: 'Minerals' },
    { value: 'herbs', label: 'Herbs & Botanicals' },
    { value: 'protein', label: 'Protein & Fitness' },
    { value: 'cognitive', label: 'Cognitive Health' },
    { value: 'immune', label: 'Immune Support' }
  ];

  const tiers = [
    { value: 'all', label: 'All Tiers', color: 'from-slate-400 to-slate-600' },
    { value: 'green', label: 'Green Tier', color: 'from-green-400 to-emerald-600' },
    { value: 'yellow', label: 'Yellow Tier', color: 'from-yellow-400 to-orange-500' },
    { value: 'orange', label: 'Orange Tier', color: 'from-orange-400 to-red-500' },
    { value: 'red', label: 'Red Tier', color: 'from-red-400 to-pink-600' }
  ];

  const filteredSupplements = supplements
    .filter(supplement => {
      const matchesSearch = supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           supplement.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || supplement.category === selectedCategory;
      const matchesTier = selectedTier === 'all' || supplement.tier === selectedTier;
      return matchesSearch && matchesCategory && matchesTier && supplement.is_available;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return (b.evidence_rating || 0) - (a.evidence_rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default: // featured
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
    });

  const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.supplement.price || '0') * item.quantity), 0);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (supplementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Premium Supplements
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Evidence-based supplements for optimal health
          </p>
        </div>
        
        <motion.button
          onClick={() => setShowCart(true)}
          className="relative flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBagIcon className="w-5 h-5" />
          <span>Cart ({cartItemCount})</span>
          {cartItemCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {cartItemCount}
            </div>
          )}
        </motion.button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search supplements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Tier Filter */}
      <div className="flex flex-wrap gap-3">
        {tiers.map((tier) => (
          <button
            key={tier.value}
            onClick={() => setSelectedTier(tier.value)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              selectedTier === tier.value
                ? `bg-gradient-to-r ${tier.color} text-white shadow-lg`
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/80'
            }`}
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* Supplements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSupplements.map((supplement, index) => (
          <motion.div
            key={supplement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Badges */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {supplement.is_featured && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
                {supplement.is_bestseller && (
                  <span className="px-2 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold rounded-full">
                    Bestseller
                  </span>
                )}
              </div>
              
              {supplement.tier && (
                <div className={`w-3 h-3 rounded-full ${
                  supplement.tier === 'green' ? 'bg-green-500' :
                  supplement.tier === 'yellow' ? 'bg-yellow-500' :
                  supplement.tier === 'orange' ? 'bg-orange-500' :
                  supplement.tier === 'red' ? 'bg-red-500' : 'bg-slate-500'
                }`} />
              )}
            </div>

            {/* Product Image */}
            <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {supplement.image_url ? (
                <img 
                  src={supplement.image_url} 
                  alt={supplement.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <BeakerIcon className="w-16 h-16 text-slate-400" />
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
                {supplement.name}
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                {supplement.description}
              </p>

              {/* Evidence Rating */}
              {supplement.evidence_rating && (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < supplement.evidence_rating! 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Evidence Rating
                  </span>
                </div>
              )}

              {/* Benefits */}
              {supplement.benefits && supplement.benefits.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {supplement.benefits.slice(0, 3).map((benefit, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              )}

              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatSupplementPrice(supplement.price || '0')}
                  </span>
                  {supplement.dosage && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {supplement.dosage}
                    </p>
                  )}
                </div>
                
                <motion.button
                  onClick={() => addToCart(supplement)}
                  disabled={isLoading || !supplement.is_available}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSupplements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BeakerIcon className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No supplements found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTier('all');
            }}
            className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-slate-700/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  ×
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center">
                        {item.supplement.image_url ? (
                          <img 
                            src={item.supplement.image_url} 
                            alt={item.supplement.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <BeakerIcon className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {item.supplement.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {formatSupplementPrice(item.supplement.price || '0')} each
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatSupplementPrice((parseFloat(item.supplement.price || '0')) * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="flex items-center justify-between text-xl font-bold text-slate-900 dark:text-white">
                      <span>Total:</span>
                      <span>{formatSupplementPrice(cartTotal)}</span>
                    </div>
                    
                    <button
                      onClick={() => {
                        toast({
                          title: "Checkout",
                          description: "Checkout functionality coming soon!"
                        });
                      }}
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Proceed to Checkout
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