import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Zap, 
  Crown, 
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

interface PricingProps {
  onGetStarted: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onGetStarted }) => {
  const plans = [
    {
      name: 'Free',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for getting started',
      features: [
        'Track your health basics',
        'Ask your coach 5 times daily',
        'Log meals and see nutrition',
        'Basic progress tracking',
        'Email support'
      ],
      cta: 'Start Free',
      popular: false,
      color: 'from-slate-600 to-slate-700',
      icon: Zap
    },
    {
      name: 'Premium',
      price: 'AED 149',
      period: '/month',
      description: 'For people serious about their health',
      features: [
        'Unlimited coach conversations',
        'Advanced health insights',
        'Detailed progress tracking',
        'Connect any health device',
        'Priority support',
        'Personalized meal plans',
        'Supplement recommendations'
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
      color: 'from-blue-600 to-purple-600',
      icon: Crown
    },
    {
      name: 'Family',
      price: 'AED 249',
      period: '/month',
      description: 'For couples and families',
      features: [
        'Everything in Premium',
        'Up to 4 family members',
        'Family health dashboard',
        'Shared meal planning',
        'Family challenges',
        'Dedicated support',
        'Fertility tracking (UBERGENE)'
      ],
      cta: 'Start Family Plan',
      popular: false,
      color: 'from-emerald-600 to-teal-700',
      icon: Sparkles
    }
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Simple
            <span className="block bg-gradient-to-r from-[#48C6FF] via-[#2A7FFF] to-[#0026CC] bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that works for you. Start free, upgrade when you're ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative card-premium p-8 border transition-all duration-500 hover:shadow-2xl cursor-pointer group ${
                plan.popular 
                  ? 'border-blue-300 dark:border-blue-700 ring-2 ring-blue-200 dark:ring-blue-800 scale-105' 
                  : 'border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50'
              }`}
              whileHover={{ 
                scale: plan.popular ? 1.08 : 1.05, 
                y: -8,
                rotateY: 2
              }}
              whileTap={{ scale: 0.98 }}
            >
              {plan.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                </motion.div>
              )}
              
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-light transition-colors duration-300">{plan.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">{plan.price}</div>
                    <div className="text-slate-500 dark:text-slate-400">{plan.period}</div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 group-hover:scale-110 group-hover:text-neon-green transition-all duration-300" />
                      <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-xl ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-full">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              30-day money-back guarantee
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;