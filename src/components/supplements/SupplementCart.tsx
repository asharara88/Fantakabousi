import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Supplement } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { 
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  SparklesIcon,
  CreditCardIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface CartItem {
  supplement: Supplement;
  quantity: number;
}

interface SupplementCartProps {
  items: CartItem[];
  onUpdateQuantity: (supplementId: string, quantity: number) => void;
  onRemoveItem: (supplementId: string) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const SupplementCart: React.FC<SupplementCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isOpen,
  onClose,
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.supplement.price * item.quantity), 0);
  const subscriptionDiscount = subtotal * 0.2; // 20% subscription discount
  const shipping = subtotal > 200 ? 0 : 25; // Free shipping over AED 200
  const total = subtotal - subscriptionDiscount + shipping;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <ShoppingCartIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-heading-lg text-foreground">Your Stack</h2>
                    <p className="text-caption">{totalItems} items</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items */}
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.supplement.id}
                      layout
                      className="card-premium p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.supplement.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'}
                          alt={item.supplement.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <h3 className="text-body font-semibold text-foreground line-clamp-2">
                            {item.supplement.name}
                          </h3>
                          <div className="text-caption">
                            {formatCurrency(item.supplement.price)} each
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => onUpdateQuantity(item.supplement.id, item.quantity - 1)}
                                className="w-8 h-8 bg-muted hover:bg-muted/80 rounded-lg flex items-center justify-center"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="text-body font-bold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.supplement.id, item.quantity + 1)}
                                className="w-8 h-8 bg-primary hover:bg-primary/80 rounded-lg flex items-center justify-center"
                              >
                                <PlusIcon className="w-4 h-4 text-white" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => onRemoveItem(item.supplement.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ShoppingCartIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-body font-semibold text-foreground mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-caption">
                    Add supplements to build your personalized stack
                  </p>
                </div>
              )}

              {/* Cart Summary */}
              {items.length > 0 && (
                <div className="space-y-6">
                  <div className="card-premium p-6 space-y-4">
                    <h3 className="text-body font-semibold text-foreground">Order Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-caption">Subtotal</span>
                        <span className="text-body font-semibold">{formatCurrency(subtotal)}</span>
                      </div>
                      
                      <div className="flex justify-between text-green-500">
                        <span className="text-caption">Subscription Discount (20%)</span>
                        <span className="text-body font-semibold">-{formatCurrency(subscriptionDiscount)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-caption">Shipping</span>
                        <span className="text-body font-semibold">
                          {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                        </span>
                      </div>
                      
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between">
                          <span className="text-body font-bold text-foreground">Total</span>
                          <span className="text-heading-lg font-bold text-foreground">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {[
                      { icon: SparklesIcon, text: '20% off with subscription', color: 'text-green-500' },
                      { icon: TruckIcon, text: 'Free shipping over AED 200', color: 'text-blue-500' },
                      { icon: ShieldCheckIcon, text: '30-day money-back guarantee', color: 'text-purple-500' },
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                        <span className="text-caption">{benefit.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCheckout}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <CreditCardIcon className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </motion.button>
                </div>
              )}
            </div>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupplementCart;