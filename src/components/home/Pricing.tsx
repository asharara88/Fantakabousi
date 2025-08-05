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
      name: 'Essential',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for getting started with health optimization',
      features: [
        'Basic health monitoring',
        'Weekly AI insights',
        '5 coach consultations/day',
        'Standard device integration',
        'Community support'
      ],
      cta: 'Start Free',
      popular: false,
      color: 'from-slate-600 to-slate-700',
      icon: Zap
    },
    {
      name: 'Professional',
      price: 'AED 149',
      period: '/month',
      description: 'Advanced health optimization for serious wellness enthusiasts',
      features: [
        'Unlimited AI coaching',
        'Advanced health analytics',
        'Predictive health insights',
        'Premium device integration',
        'Priority support',
        'Custom health protocols',
        'Lab result integration'
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
      color: 'from-blue-600 to-purple-600',
      icon: Crown
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      description: 'Complete health ecosystem for organizations and clinics',
      features: [
        'Everything in Professional',
        'Multi-user management',
        'Advanced biomarker analysis',
        'Custom health models',
        'Dedicated health advisor',
        'API access',
        'White-label options'
      ],
      cta: 'Contact Sales',
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
            Choose Your
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Health Plan
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Professional health optimization plans designed for different levels of engagement and expertise.
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
              className={`relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-500 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-blue-300 dark:border-blue-700 ring-2 ring-blue-200 dark:ring-blue-800 scale-105' 
                  : 'border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</div>
                    <div className="text-slate-500 dark:text-slate-400">{plan.period}</div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGetStarted}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
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