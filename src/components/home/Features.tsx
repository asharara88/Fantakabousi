import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Activity, 
  Zap, 
  Shield, 
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Target,
  BarChart3,
  Pill
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI Health Coach',
      description: 'Personalized guidance powered by advanced machine learning algorithms that understand your unique health patterns.',
      color: 'from-purple-500 to-indigo-600',
      features: ['24/7 Availability', 'Personalized Insights', 'Evidence-Based Advice']
    },
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Continuous health tracking with instant analysis and alerts for optimal health management.',
      color: 'from-blue-500 to-cyan-600',
      features: ['Live Data Sync', 'Instant Alerts', 'Trend Analysis']
    },
    {
      icon: Heart,
      title: 'Biometric Analysis',
      description: 'Advanced cardiovascular and metabolic monitoring with predictive health insights.',
      color: 'from-red-500 to-pink-600',
      features: ['HRV Analysis', 'Glucose Tracking', 'Sleep Optimization']
    },
    {
      icon: Pill,
      title: 'Smart Supplements',
      description: 'Evidence-based supplement recommendations with personalized dosing and timing protocols.',
      color: 'from-emerald-500 to-teal-600',
      features: ['Personalized Stacks', 'Timing Optimization', 'Safety Monitoring']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive health analytics with predictive modeling and trend forecasting.',
      color: 'from-amber-500 to-orange-600',
      features: ['Predictive Models', 'Health Forecasting', 'Risk Assessment']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption with HIPAA compliance and privacy-first architecture.',
      color: 'from-slate-500 to-slate-700',
      features: ['HIPAA Compliant', 'End-to-End Encryption', 'Zero-Trust Security']
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Advanced Health
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Intelligence Platform
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Sophisticated health monitoring and coaching that adapts to your unique biology and lifestyle patterns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative card-premium p-8 hover:shadow-2xl hover:border-blue-300/50 dark:hover:border-blue-700/50 cursor-pointer"
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                rotateY: 3,
                rotateX: 3
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-card-shimmer" />
              
              <div className="relative space-y-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-light transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {feature.features.map((feat, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-150 group-hover:bg-neon-green transition-all duration-300" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{feat}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;