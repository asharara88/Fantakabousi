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
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
              Wellness
              <span className="block bg-gradient-to-r from-[#48C6FF] via-[#2A7FFF] to-[#0026CC] bg-clip-text text-transparent">
                For Everyone
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Personal wellness tracking and insights for your health journey.
            </p>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="text-left space-y-2">
                <h3 className="font-semibold text-amber-800 dark:text-amber-400">Important Disclaimer</h3>
                <p className="text-amber-700 dark:text-amber-500 leading-relaxed">
                  Biowell is a wellness tracking platform for informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Always consult with qualified healthcare professionals before making any health-related decisions. Do not use this app as a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;