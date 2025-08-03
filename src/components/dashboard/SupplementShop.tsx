import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSupplements } from '../../hooks/useSupplements';
import SupplementBrowser from '../supplements/SupplementBrowser';
import SupplementBrowser from '../supplements/SupplementBrowser';
import SupplementStack from '../supplements/SupplementStack';
import SupplementCart from '../supplements/SupplementCart';
import LoadingSpinner from '../ui/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';
import { 
  ShoppingBagIcon, 
  CubeIcon,
  ShoppingCartIcon,
  SparklesIcon
  onQuickAction?: (action: string) => void;
} from '@heroicons/react/24/outline';

interface SupplementShopProps {
  onQuickAction?: (action: string) => void;
}

const SupplementShop: React.FC<SupplementShopProps> = ({ onQuickAction }) => {
  const [activeView, setActiveView] = useState<'browse' | 'stack'>('browse');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  
  const { 
    supplements, 
    userSupplements, 
    loading, 
    addToStack, 
    removeFromStack,
    isInStack,
    getStackTotal 
  } = useSupplements();

  const handleAddToCart = (supplement: any) => {
    setCartItems(prev => ({
      ...prev,
      [supplement.id]: (prev[supplement.id] || 0) + 1
    }));
  };

  const handleUpdateQuantity = (supplementId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => {
        const newItems = { ...prev };
        delete newItems[supplementId];
        return newItems;
      });
    } else {
      setCartItems(prev => ({
        ...prev,
        [supplementId]: quantity
      }));
    }
  };

  const handleRemoveItem = (supplementId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      delete newItems[supplementId];
      return newItems;
    });
  };

  const handleCheckout = () => {
    // Implement checkout logic
    console.log('Proceeding to checkout...');
  };

  const cartCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  const cartItemsArray = Object.entries(cartItems).map(([supplementId, quantity]) => ({
    supplement: supplements.find(s => s.id === supplementId)!,
    quantity
  })).filter(item => item.supplement);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-medium to-blue-deep rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Supplement Shop</h1>
              <p className="text-muted-foreground">Browse and manage your supplement stack</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex rounded-xl p-1 bg-muted">
            <button
              onClick={() => setActiveView('browse')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'browse'
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setActiveView('stack')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'stack'
                  ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Stack
            </button>
          </div>
          
          {cartCount > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setCartOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-light to-blue-medium text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2 relative"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Cart ({cartCount})</span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green text-black rounded-full text-xs flex items-center justify-center font-bold">
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
        {activeView === 'browse' ? (
          <SupplementBrowser 
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        ) : (
          <SupplementStack onQuickAction={onQuickAction} />
        )}
      </motion.div>

      {/* Shopping Cart */}
      <SupplementCart
        items={cartItemsArray}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
};

export default SupplementShop;