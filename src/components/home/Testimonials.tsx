import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Users, TrendingUp, Shield, CheckCircle } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
            Built for
            <span className="block bg-gradient-to-r from-[#48C6FF] via-[#2A7FFF] to-[#0026CC] bg-clip-text text-transparent">
              Health Professionals
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Designed with healthcare professionals and wellness enthusiasts in mind, providing the tools needed for comprehensive health optimization.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'HIPAA Compliant',
              description: 'Bank-level security with full healthcare compliance for professional use.',
              color: 'from-blue-500 to-cyan-600'
            },
            {
              icon: TrendingUp,
              title: 'Evidence-Based',
              description: 'All recommendations backed by peer-reviewed research and clinical studies.',
              color: 'from-emerald-500 to-teal-600'
            },
            {
              icon: Users,
              title: 'Professional Grade',
              description: 'Enterprise-level tools designed for healthcare providers and wellness coaches.',
              color: 'from-purple-500 to-indigo-600'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-500"
            >
              <div className="space-y-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: Shield, label: 'HIPAA Compliant' },
            { icon: CheckCircle, label: 'Evidence-Based' },
            { icon: TrendingUp, label: 'Real-Time Analysis' },
            { icon: Users, label: 'Professional Grade' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center space-y-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-400">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;