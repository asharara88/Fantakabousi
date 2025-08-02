import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../lib/utils';
import { 
  CreditCardIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentProcessorProps {
  items: PaymentItem[];
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ items, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: ''
  });

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subscriptionDiscount = subtotal * 0.2;
  const tax = (subtotal - subscriptionDiscount) * 0.05; // 5% VAT
  const total = subtotal - subscriptionDiscount + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful payment
      const paymentId = `pay_${Date.now()}`;
      
      toast({
        title: "Payment Successful! 🎉",
        description: `Your order has been confirmed. Payment ID: ${paymentId}`,
      });
      
      onSuccess(paymentId);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please check your payment details and try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Payment Form */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Details</h2>
          <p className="text-muted-foreground">Complete your supplement subscription</p>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border-2 rounded-xl transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-light bg-blue-light/10'
                  : 'border-border hover:border-blue-light/50'
              }`}
            >
              <CreditCardIcon className="w-6 h-6 mx-auto mb-2 text-foreground" />
              <div className="text-sm font-medium">Credit Card</div>
            </button>
            <button
              onClick={() => setPaymentMethod('apple')}
              className={`p-4 border-2 rounded-xl transition-all ${
                paymentMethod === 'apple'
                  ? 'border-blue-light bg-blue-light/10'
                  : 'border-border hover:border-blue-light/50'
              }`}
            >
              <div className="text-2xl mb-2">🍎</div>
              <div className="text-sm font-medium">Apple Pay</div>
            </button>
          </div>
        </div>

        {/* Card Form */}
        {paymentMethod === 'card' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Card Number</label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  cardNumber: formatCardNumber(e.target.value) 
                }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Expiry Date</label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">CVV</label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Cardholder Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 bg-background text-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <LockClosedIcon className="w-4 h-4" />
                  <span>Pay {formatCurrency(total)}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-700 dark:text-green-300">Secure Payment</h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your payment is protected by 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <div className="card-premium">
          <h3 className="text-xl font-bold text-foreground mb-4">Order Summary</h3>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{item.name}</div>
                  <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold text-foreground">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span>Subscription Discount (20%)</span>
              <span>-{formatCurrency(subscriptionDiscount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (5%)</span>
              <span className="font-semibold text-foreground">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          {[
            { icon: CheckCircleIcon, text: '20% off with subscription', color: 'text-green-500' },
            { icon: CheckCircleIcon, text: 'Free shipping on all orders', color: 'text-blue-500' },
            { icon: CheckCircleIcon, text: '30-day money-back guarantee', color: 'text-purple-500' },
            { icon: CheckCircleIcon, text: 'Cancel anytime', color: 'text-orange-500' },
          ].map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
              <span className="text-sm text-muted-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;