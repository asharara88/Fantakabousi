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
  MoonIcon,
  BoltIcon,
  TrendingUpIcon,
  CheckIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  EyeIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

interface LandingPageProps {
  onShowAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowAuth }) => {
  const { actualTheme } = useTheme();
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzU0MzgwMDY1LCJleHAiOjE3ODU5MTYwNjV9.W4lMMJpIbCmQrbsJFDKK-eRoSnvQ3UUdz4DhUF-jwOc"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1NDM4MDA4NywiZXhwIjoxNzg1OTE2MDg3fQ.GTBPM8tMs-jtvycD39wO6Bt32JHyEWB4a-tWle0jl8I";

  // Show auth forms if requested
  if (showAuthForms) {
    return <AuthForms onBack={() => setShowAuthForms(false)} />;
  }

  return (
    <div className="min-h-screen bg-background neural-bg dashboard-neural">
      {/* Floating Neural Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute neural-node floating-element"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              width: `${8 + i * 2}px`,
              height: `${8 + i * 2}px`,
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}
        
        {[...Array(4)].map((_, i) => (
          <div
            key={`connection-${i}`}
            className="neural-connection"
            style={{
              left: `${25 + i * 20}%`,
              top: `${15 + i * 20}%`,
              width: `${100 + i * 50}px`,
              transform: `rotate(${i * 45}deg)`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-premium">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-10 w-auto"
              />
              <div className="hidden md:block w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <span className="hidden md:block text-sm font-medium text-muted-foreground">
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
                className="text-muted-foreground hover:text-foreground font-medium transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
              <button 
                onClick={() => setShowAuthForms(true)}
                className="btn-premium px-6 py-2.5 rounded-xl text-white font-semibold"
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center space-x-3 px-4 py-2 glass-morphism rounded-full"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gradient-neural">
                  Personalized Health Intelligence
                </span>
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-black text-premium leading-[0.9]">
                  <span className="block text-foreground">Your</span>
                  <span className="block text-gradient-neural">Smart</span>
                  <span className="block text-foreground">Wellness Coach</span>
                </h1>

                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl font-light">
                  Intelligent health guidance that learns your patterns, predicts your needs, and optimizes your wellness journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAuthForms(true)}
                  className="btn-premium px-8 py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center space-x-3 shadow-2xl"
                >
                  <RocketLaunchIcon className="w-6 h-6" />
                  <span>Start Health Analysis</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 glass-morphism rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 text-foreground hover:bg-white/10 transition-all duration-300"
                >
                  <PlayIcon className="w-6 h-6" />
                  <span>Watch Demo</span>
                </motion.button>
              </div>

              {/* Live Stats */}
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
                  { number: 'AI', label: 'Powered', icon: CpuChipIcon }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    className="text-center group"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 glass-morphism rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="text-2xl font-bold text-gradient-neural">{stat.number}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Neural Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="card-ultra rounded-3xl p-8 relative overflow-hidden">
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 holographic opacity-30" />
                  
                  <div className="relative z-10 space-y-8">
                    {/* Neural Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 morphing-blob rounded-2xl flex items-center justify-center shadow-2xl">
                          <CpuChipIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gradient-neural">Wellness Score</div>
                          <div className="text-sm text-muted-foreground flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span>Live AI Analysis</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-gradient-neural">94</div>
                        <div className="text-xs text-muted-foreground">Optimal</div>
                      </div>
                    </div>
                    
                    {/* Neural Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { 
                          label: 'Biometric Sync', 
                          value: '100%', 
                          trend: '+2.3%',
                          color: 'from-emerald-400 to-teal-500',
                          icon: HeartIcon,
                          neural: true
                        },
                        { 
                          label: 'Sleep Quality', 
                          value: '97', 
                          trend: '+8.1%',
                          color: 'from-indigo-400 to-purple-500',
                          icon: MoonIcon,
                          neural: true
                        },
                        { 
                          label: 'Recovery Score', 
                          value: '89', 
                          trend: '+15.2%',
                          color: 'from-blue-400 to-cyan-500',
                          icon: BoltIcon,
                          neural: true
                        },
                        { 
                          label: 'Nutrition Score', 
                          value: '92', 
                          trend: '-3.7%',
                          color: 'from-orange-400 to-red-500',
                          icon: BeakerIcon,
                          neural: true
                        }
                      ].map((metric, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                          className="metric-card-neural rounded-2xl p-4 group cursor-pointer"
                          whileHover={{ scale: 1.05, y: -4 }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                <metric.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className={`px-2 py-1 text-xs font-bold rounded-full ${
                                metric.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {metric.trend}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-2xl font-black text-gradient-neural">{metric.value}</div>
                              <div className="text-sm font-semibold text-muted-foreground">{metric.label}</div>
                            </div>
                            
                            {/* Neural activity indicator */}
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                {[...Array(8)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 bg-gradient-to-t ${metric.color} rounded-full opacity-60`}
                                    style={{ 
                                      height: `${Math.random() * 16 + 4}px`,
                                      animationDelay: `${i * 0.1}s`
                                    }}
                                  />
                                ))}
                              </div>
                              <div className="text-xs text-muted-foreground">Health Pattern</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* AI Insight Preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                      className="glass-morphism rounded-2xl p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                          <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-foreground">Smart Insight</h4>
                            <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                              98% CONFIDENCE
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            "Your sleep quality has improved 23% this week. This is an optimal time for challenging workouts."
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <span>• Comprehensive analysis</span>
                            <span>• Real-time insights</span>
                            <span>• Personalized guidance</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-8 -right-8 w-32 h-32 morphing-blob opacity-20" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 morphing-blob opacity-15" style={{ animationDelay: '4s' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Neural Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-20"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-morphism rounded-full">
              <LightBulbIcon className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-semibold text-gradient-neural">Smart Features</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-premium">
              <span className="block text-foreground">Beyond Traditional</span>
              <span className="block text-gradient-neural">Wellness Coaching</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Our intelligent platform analyzes your health data to deliver personalized insights that adapt to your unique lifestyle.
            </p>
          </motion.div>

          {/* Interactive Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: SparklesIcon,
                title: 'Smart Health Engine',
                description: 'AI that learns your unique health patterns and adapts recommendations in real-time.',
                color: 'from-purple-500 via-indigo-500 to-blue-500',
                features: ['Pattern Learning', 'Predictive Insights', 'Adaptive Coaching']
              },
              {
                icon: HeartIcon,
                title: 'Biometric Intelligence',
                description: 'Smart integration from multiple devices with intelligent health monitoring.',
                color: 'from-red-500 via-pink-500 to-rose-500',
                features: ['Multi-Device Sync', 'Health Monitoring', 'Trend Analysis']
              },
              {
                icon: BeakerIcon,
                title: 'Smart Nutrition',
                description: 'Intelligent nutrition analysis with glucose tracking and metabolic insights.',
                color: 'from-green-500 via-emerald-500 to-teal-500',
                features: ['Glucose Tracking', 'Metabolic Insights', 'Meal Timing']
              },
              {
                icon: BoltIcon,
                title: 'Recovery Optimization',
                description: 'Heart rate variability analysis with personalized recovery recommendations.',
                color: 'from-yellow-500 via-orange-500 to-red-500',
                features: ['HRV Analysis', 'Recovery Tracking', 'Rest Recommendations']
              },
              {
                icon: CubeIcon,
                title: 'Smart Supplementation',
                description: 'Evidence-based supplement recommendations with personalized dosing.',
                color: 'from-indigo-500 via-purple-500 to-pink-500',
                features: ['Evidence-Based', 'Personalized Dosing', 'Safety Checking']
              },
              {
                icon: ShieldCheckIcon,
                title: 'Privacy & Security',
                description: 'Bank-level security with encrypted data and privacy-first design.',
                color: 'from-slate-500 via-gray-500 to-zinc-500',
                features: ['Bank-Level Security', 'Private Processing', 'Encrypted Storage']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setActiveFeature(index)}
                className="card-ultra rounded-3xl p-8 cursor-pointer group"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="space-y-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-gradient-neural transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckIcon className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-muted-foreground">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Neural Process Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-black text-premium">
              <span className="block text-foreground">How Smart</span>
              <span className="block text-gradient-neural">Coaching Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Our intelligent platform analyzes your health data to provide personalized coaching and insights.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            {[
              {
                step: '01',
                title: 'Smart Data Collection',
                description: 'Seamlessly connects with your wearables, health devices, and manual inputs to build your complete health picture.',
                icon: HeartIcon,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'Intelligent Analysis',
                description: 'AI identifies your unique health patterns, sleep rhythms, and metabolic responses to create your personal health profile.',
                icon: SparklesIcon,
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Personalized Coaching',
                description: 'Delivers tailored recommendations, predicts optimal timing for activities, and adapts to your changing health needs.',
                icon: CheckCircleIcon,
                color: 'from-emerald-500 to-teal-500'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center gap-12 ${index % 2 === 1 ? 'flex-row-reverse' : ''} mb-20`}
              >
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-6xl font-black text-gradient-neural opacity-30">
                      {step.step}
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <div className="flex-1">
                  <div className="card-ultra rounded-3xl p-8 h-64 flex items-center justify-center">
                    <div className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-full opacity-20 morphing-blob`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Pricing */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-black text-premium">
              <span className="block text-foreground">Smart Wellness</span>
              <span className="block text-gradient-neural">Membership</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Choose your level of AI-powered health optimization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Wellness Starter',
                price: 'Free',
                period: 'Forever',
                description: 'Essential AI health insights',
                features: [
                  'Basic health insights',
                  'Core health tracking',
                  '5 AI consultations/day',
                  'Standard insights',
                  'Community support'
                ],
                cta: 'Start Free',
                popular: false,
                color: 'from-slate-500 to-gray-600'
              },
              {
                name: 'Wellness Pro',
                price: 'AED 149',
                period: '/month',
                description: 'Advanced AI optimization',
                features: [
                  'Advanced AI coaching',
                  'Unlimited AI consultations',
                  'Predictive health insights',
                  'Advanced device integration',
                  'Priority support',
                  'Custom health protocols'
                ],
                cta: 'Start 14-Day Trial',
                popular: true,
                color: 'from-blue-500 via-purple-500 to-pink-500'
              },
              {
                name: 'Wellness Elite',
                price: 'AED 299',
                period: '/month',
                description: 'Maximum AI capabilities',
                features: [
                  'Everything in Wellness Pro',
                  'Lab result integration',
                  'Lab result AI analysis',
                  'Custom health models',
                  'White-glove optimization',
                  'Direct researcher access'
                ],
                cta: 'Contact Sales',
                popular: false,
                color: 'from-purple-500 to-indigo-600'
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card-ultra rounded-3xl p-8 relative ${
                  plan.popular ? 'border-2 border-primary-400 scale-105' : ''
                }`}
                whileHover={{ y: -8, scale: plan.popular ? 1.05 : 1.02 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-sm font-bold rounded-full shadow-lg">
                    Most Advanced
                  </div>
                )}
                
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto shadow-2xl`}>
                      <CpuChipIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-4xl font-black text-gradient-neural">{plan.price}</div>
                      <div className="text-sm text-muted-foreground">{plan.period}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircleIcon className={`w-5 h-5 ${plan.popular ? 'text-primary-400' : 'text-emerald-500'}`} />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowAuthForms(true)}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      plan.popular 
                        ? 'btn-premium text-white shadow-2xl' 
                        : 'glass-morphism text-foreground hover:bg-white/10'
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

      {/* Neural CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-black text-premium">
                <span className="block text-foreground">Ready to Transform Your</span>
                <span className="block text-gradient-neural">Health Journey?</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Join thousands who've transformed their health with intelligent coaching. Your personal wellness coach is ready.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthForms(true)}
                className="btn-premium px-12 py-5 rounded-2xl text-white font-bold text-xl flex items-center justify-center space-x-3 shadow-2xl"
              >
                <RocketLaunchIcon className="w-6 h-6" />
                <span>Start Your Journey</span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 glass-morphism rounded-2xl font-bold text-xl text-foreground hover:bg-white/10 transition-all duration-300"
              >
                Book Free Consultation
              </motion.button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground pt-8">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-8 w-auto"
              />
              <span className="text-muted-foreground">© 2025 Biowell Health Systems. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Research
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;