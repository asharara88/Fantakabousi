import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Supplement, supabase } from '../../lib/supabase';
import SupplementBrowser from '../supplements/SupplementBrowser';
import SupplementCart from '../supplements/SupplementCart';
import SupplementDetail from '../supplements/SupplementDetail';
import SupplementStack from '../supplements/SupplementStack';
import { ShoppingBagIcon, CubeIcon } from '@heroicons/react/24/outline';

const SupplementShop: React.FC = () => {
  const [activeView, setActiveView] = useState<'browse' | 'stack'>('browse');
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);

  const addToCart = (supplement: Supplement) => {
    setCartItems(prev => ({
      ...prev,
      [supplement.id]: (prev[supplement.id] || 0) + 1
    }));
  };

  const updateCartQuantity = (supplementId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => {
        const newCart = { ...prev };
        delete newCart[supplementId];
        return newCart;
      });
    } else {
      setCartItems(prev => ({
        ...prev,
        [supplementId]: quantity
      }));
    }
  };

  const removeFromCart = (supplementId: string) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      delete newCart[supplementId];
      return newCart;
    });
  };

  const cartCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
          <main className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-display">Welcome to Biowell</h1>
              <p className="text-caption max-w-xl mx-auto">
                Your AI-powered wellness platform
              </p>
            </div>
          </main>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex rounded-xl p-1 bg-muted">
            <button
              onClick={() => setActiveView('browse')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'browse'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setActiveView('stack')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeView === 'stack'
                  ? 'bg-primary text-white shadow-lg'
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
              onClick={() => setIsCartOpen(true)}
              className="btn-primary flex items-center space-x-2 relative"
            >
              <ShoppingBagIcon className="w-5 h-5" />
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
        {activeView === 'browse' ? (
          <SupplementBrowser 
            onAddToCart={addToCart}
            cartItems={cartItems}
          />
        ) : (
          <SupplementStack />
        )}
      </motion.div>

      {/* Cart Sidebar */}
      <SupplementCart
        items={[]} // Will be populated with actual cart items
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => console.log('Checkout')}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Supplement Detail Modal */}
      {selectedSupplement && (
        <SupplementDetail
          supplement={selectedSupplement}
          onAddToCart={addToCart}
          onClose={() => setSelectedSupplement(null)}
          isInCart={!!cartItems[selectedSupplement.id]}
        />
      )}
    </div>
  );
};

export default SupplementShop;