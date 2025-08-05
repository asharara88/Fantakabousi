import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Brain, 
  Target,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect Your Data',
      description: 'Seamlessly integrate with your wearables, health devices, and manual inputs to build your comprehensive health profile.',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-600',
      details: [
        'Apple Watch & Fitbit integration',
        'CGM and glucose monitors',
        'Manual health logging',
        'Lab result uploads'
      ]
    },
    {
      step: '02',
      title: 'AI Analysis',
      description: 'Our advanced algorithms analyze your unique patterns, circadian rhythms, and metabolic responses in real-time.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      details: [
        'Pattern recognition',
        'Predictive modeling',
        'Anomaly detection',
        'Trend forecasting'
      ]
    },
    {
      step: '03',
      title: 'Personalized Coaching',
      description: 'Receive tailored recommendations, optimal timing suggestions, and adaptive health protocols.',
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
      details: [
        'Custom protocols',
        'Timing optimization',
        'Progress tracking',
        'Goal achievement'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Three intelligent steps to transform your health with personalized AI coaching.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 dark:from-blue-800 dark:via-purple-800 dark:to-emerald-800 transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 lg:relative lg:top-0 lg:left-0 lg:transform-none lg:mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
                    <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">
                      {step.step}
                    </span>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <div className="space-y-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                          <span className="text-slate-600 dark:text-slate-400 font-medium">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;