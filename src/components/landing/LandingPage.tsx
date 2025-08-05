import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import AuthForms from '../auth/AuthForms';
import { 
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  CubeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  ChevronDownIcon,
  BoltIcon,
  TrendingUpIcon,
  CheckIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  EyeIcon,
  CommandLineIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  LockClosedIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface LandingPageProps {
  onShowAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowAuth }) => {
  const { actualTheme } = useTheme();
  const [showAuthForms, setShowAuthForms] = useState(false);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzU0MzgwMDY1LCJleHAiOjE3ODU5MTYwNjV9.W4lMMJpIbCmQrbsJFDKK-eRoSnvQ3UUdz4DhUF-jwOc"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1NDM4MDA4NywiZXhwIjoxNzg1OTE2MDg3fQ.GTBPM8tMs-jtvycD39wO6Bt32JHyEWB4a-tWle0jl8I";

  if (showAuthForms) {
    return <AuthForms onBack={() => setShowAuthForms(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-8 w-auto"
              />
              <div className="hidden md:block w-px h-6 bg-slate-300 dark:bg-slate-600" />
              <span className="hidden md:block text-sm font-medium text-slate-600 dark:text-slate-400">
                Intelligent Health Platform
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <button 
                onClick={() => setShowAuthForms(true)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowAuthForms(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full"
                >
                  <SparklesIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    Personalized Health Intelligence
                  </span>
                </motion.div>

                <h1 className="text-display-xl lg:text-display-2xl font-display text-slate-900 dark:text-slate-100 leading-none tracking-tight">
                  Your Personal
                  <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
                    Health Coach
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-2xl">
                  Advanced health monitoring and personalized coaching that adapts to your unique biology and lifestyle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAuthForms(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <RocketLaunchIcon className="w-5 h-5" />
                  <span>Start Health Analysis</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-4 gap-6 pt-8"
              >
                {[
                  { number: '99.7%', label: 'Accuracy', icon: EyeIcon },
                  { number: '<2s', label: 'Response', icon: BoltIcon },
                  { number: '24/7', label: 'Monitoring', icon: ClockIcon },
                  { number: 'HIPAA', label: 'Compliant', icon: ShieldCheckIcon }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 mx-auto mb-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{stat.number}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-professional-xl">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                          <ChartBarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">Health Overview</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-professional-pulse" />
                            <span>Live monitoring active</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">94</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Wellness Score</div>
                      </div>
                    </div>
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { 
                          label: 'Heart Rate', 
                          value: '68', 
                          unit: 'bpm',
                          trend: '+2%',
                          color: 'from-red-500 to-pink-600',
                          icon: HeartIcon
                        },
                        { 
                          label: 'Sleep Score', 
                          value: '94', 
                          unit: '/100',
                          trend: '+8%',
                          color: 'from-indigo-500 to-purple-600',
                          icon: CloudIcon
                        },
                        { 
                          label: 'Recovery', 
                          value: '87', 
                          unit: '/100',
                          trend: '+12%',
                          color: 'from-emerald-500 to-teal-600',
                          icon: BoltIcon
                        },
                        { 
                          label: 'Glucose', 
                          value: '94', 
                          unit: 'mg/dL',
                          trend: '-3%',
                          color: 'from-amber-500 to-orange-600',
                          icon: BeakerIcon
                        }
                      ].map((metric, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                          className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className={`w-8 h-8 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                                <metric.icon className="w-4 h-4 text-white" />
                              </div>
                              <div className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                metric.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {metric.trend}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {metric.value}
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-1">
                                  {metric.unit}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{metric.label}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* AI Insight */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <SparklesIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Smart Insight</h4>
                            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold rounded-full">
                              98% confidence
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Your recovery metrics indicate optimal training readiness. Consider scheduling your strength workout between 2-4 PM today.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-display-lg font-display text-slate-900 dark:text-slate-100 tracking-tight">
              Advanced Health
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Sophisticated health monitoring that understands your unique patterns and provides actionable insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: SparklesIcon,
                title: 'Intelligent Coaching',
                description: 'Personalized health guidance that learns from your data and adapts to your lifestyle.',
                color: 'from-violet-500 to-purple-600',
                features: ['Adaptive Learning', 'Predictive Insights', 'Personalized Plans']
              },
              {
                icon: HeartIcon,
                title: 'Advanced Monitoring',
                description: 'Comprehensive health tracking with real-time analysis and trend detection.',
                color: 'from-red-500 to-pink-600',
                features: ['Real-time Tracking', 'Trend Analysis', 'Anomaly Detection']
              },
              {
                icon: BeakerIcon,
                title: 'Precision Nutrition',
                description: 'Smart nutrition analysis with glucose impact tracking and metabolic insights.',
                color: 'from-emerald-500 to-teal-600',
                features: ['Glucose Tracking', 'Metabolic Analysis', 'Meal Optimization']
              },
              {
                icon: BoltIcon,
                title: 'Recovery Science',
                description: 'Heart rate variability analysis with personalized recovery recommendations.',
                color: 'from-amber-500 to-orange-600',
                features: ['HRV Analysis', 'Recovery Tracking', 'Training Readiness']
              },
              {
                icon: CubeIcon,
                title: 'Smart Supplements',
                description: 'Evidence-based supplement recommendations with personalized dosing protocols.',
                color: 'from-blue-500 to-cyan-600',
                features: ['Evidence-Based', 'Personalized Dosing', 'Safety Protocols']
              },
              {
                icon: ShieldCheckIcon,
                title: 'Enterprise Security',
                description: 'Bank-level encryption with HIPAA compliance and privacy-first architecture.',
                color: 'from-slate-500 to-slate-700',
                features: ['HIPAA Compliant', 'End-to-End Encryption', 'Privacy First']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-professional rounded-2xl p-8 group hover:shadow-professional-lg"
              >
                <div className="space-y-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-800/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-display-lg font-display text-slate-900 dark:text-slate-100 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Three simple steps to transform your health with intelligent coaching.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Connect Your Data',
                description: 'Seamlessly integrate with your wearables, health devices, and manual inputs to build your complete health profile.',
                icon: DevicePhoneMobileIcon,
                color: 'from-blue-500 to-cyan-600'
              },
              {
                step: '02',
                title: 'Intelligent Analysis',
                description: 'Our advanced algorithms analyze your unique patterns, sleep rhythms, and metabolic responses.',
                icon: CpuChipIcon,
                color: 'from-violet-500 to-purple-600'
              },
              {
                step: '03',
                title: 'Personalized Coaching',
                description: 'Receive tailored recommendations, optimal timing suggestions, and adaptive health protocols.',
                icon: LightBulbIcon,
                color: 'from-emerald-500 to-teal-600'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center gap-12 ${index % 2 === 1 ? 'flex-row-reverse' : ''} mb-16`}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl font-black text-slate-200 dark:text-slate-700">
                      {step.step}
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 h-64 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50">
                    <div className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-2xl opacity-20 animate-subtle-float`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-display-lg font-display text-slate-900 dark:text-slate-100 tracking-tight">
              Choose Your
              <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Health Plan
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Professional health optimization plans designed for different levels of engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Essential',
                price: 'Free',
                period: 'Forever',
                description: 'Core health tracking and insights',
                features: [
                  'Basic health monitoring',
                  'Weekly health reports',
                  '5 AI consultations/day',
                  'Standard device integration',
                  'Community support'
                ],
                cta: 'Start Free',
                popular: false,
                color: 'from-slate-600 to-slate-700'
              },
              {
                name: 'Professional',
                price: 'AED 149',
                period: '/month',
                description: 'Advanced health optimization',
                features: [
                  'Unlimited AI coaching',
                  'Advanced health analytics',
                  'Predictive health insights',
                  'Premium device integration',
                  'Priority support',
                  'Custom health protocols'
                ],
                cta: 'Start 14-Day Trial',
                popular: true,
                color: 'from-blue-600 to-violet-600'
              },
              {
                name: 'Enterprise',
                price: 'AED 299',
                period: '/month',
                description: 'Complete health ecosystem',
                features: [
                  'Everything in Professional',
                  'Lab result integration',
                  'Advanced biomarker analysis',
                  'Custom health models',
                  'Dedicated health advisor',
                  'Research collaboration'
                ],
                cta: 'Contact Sales',
                popular: false,
                color: 'from-emerald-600 to-teal-700'
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card-professional rounded-2xl p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mx-auto shadow-lg`}>
                      <CpuChipIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{plan.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{plan.description}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowAuthForms(true)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-violet-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="space-y-4">
              <h2 className="text-display-lg font-display text-white tracking-tight">
                Transform Your Health
                <span className="block">Starting Today</span>
              </h2>
              <p className="text-xl text-blue-100 font-light leading-relaxed">
                Join thousands who've optimized their health with intelligent coaching. Your personal health transformation starts now.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthForms(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                <span>GET STARTED</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthForms(true)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Sign In</span>
              </motion.button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-blue-100 pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-6 w-auto"
              />
              <span className="text-slate-600 dark:text-slate-400 text-sm">© 2025 Biowell Health Systems. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm transition-colors">
                Privacy Policy
              </button>
              <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm transition-colors">
                Terms of Service
              </button>
              <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm transition-colors">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;