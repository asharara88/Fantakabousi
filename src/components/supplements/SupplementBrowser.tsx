import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Supplement } from '../../lib/supabase';
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
  BeakerIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface SupplementBrowserProps {
  onAddToCart: (supplement: Supplement) => void;
  cartItems: { [key: string]: number };
}

const SupplementBrowser: React.FC<SupplementBrowserProps> = ({ onAddToCart, cartItems }) => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSupplements();
  }, [selectedCategory, sortBy]);

  const fetchSupplements = async () => {
    try {
      let query = supabase
        .from('supplements')
        .select('*')
        .eq('is_active', true);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      // Apply sorting
      switch (sortBy) {
        case 'featured':
          query = query.order('is_featured', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('evidence_rating', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      setSupplements(data || []);
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <LoadingSpinner size="xl" variant="premium" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="card-premium p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search supplements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-12 w-full"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <FunnelIcon className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-premium"
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
              className="input-premium"
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
        <div className="text-body text-muted-foreground">
          {filteredSupplements.length} supplements found
        </div>
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4 text-primary" />
          <span className="text-caption">AI-Curated Selection</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid-premium grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSupplements.map((supplement, index) => {
          const cartQuantity = cartItems[supplement.id] || 0;
          const isFavorite = favorites.has(supplement.id);
          
          return (
            <motion.div
              key={supplement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-premium p-6 group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Image and Badges */}
                <div className="relative">
                  <div className="w-full h-48 bg-muted/20 rounded-xl overflow-hidden">
                    <img
                      src={supplement.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'}
                      alt={supplement.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(supplement.id)}
                    className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                  >
                    <HeartIcon className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
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
                    <h3 className="text-body font-bold text-foreground line-clamp-2">
                      {supplement.name}
                    </h3>
                    <p className="text-caption line-clamp-2 mt-1">
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
                            : 'text-muted/30'
                        }`} 
                      />
                    ))}
                    <span className="text-caption ml-2">
                      ({supplement.evidence_rating || 4.0})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-heading-lg font-bold text-foreground">
                        {formatCurrency(supplement.price)}
                      </div>
                      {supplement.subscription_discount_percent > 0 && (
                        <div className="text-caption text-green-500">
                          {supplement.subscription_discount_percent}% off subscription
                        </div>
                      )}
                    </div>
                    
                    <div className="text-caption">
                      Stock: {supplement.stock_quantity} • {supplement.use_case || 'General wellness'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {cartQuantity > 0 ? (
                    <div className="status-indicator status-success w-full justify-center">
                      <CheckCircleIcon className="w-4 h-4" />
                      In Cart ({cartQuantity})
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddToCart(supplement)}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Add to Stack</span>
                    </motion.button>
                  )}
                  
                  <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                    <InformationCircleIcon className="w-5 h-5" />
                    <span>Learn More</span>
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
          <div className="w-20 h-20 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BeakerIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-heading-lg text-foreground mb-3">
            No supplements found
          </h3>
          <p className="text-body text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
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
    </div>
  );
};

export default SupplementBrowser;