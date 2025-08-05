import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
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
  ChevronDownIcon
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

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI Wellness Coach',
      description: 'Get personalized health guidance powered by advanced AI that learns from your unique biology.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: HeartIcon,
      title: 'Real-time Health Tracking',
      description: 'Monitor your biometrics 24/7 with seamless wearable integration and instant insights.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: BeakerIcon,
      title: 'Smart Nutrition Analysis',
      description: 'Track food impact on glucose, optimize meals for your goals, and discover perfect recipes.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: CubeIcon,
      title: 'Personalized Supplements',
      description: 'AI-curated supplement stacks based on your health data, goals, and genetic profile.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Discover patterns in your health data with predictive insights and trend analysis.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy & Security',
      description: 'Bank-level encryption, HIPAA compliance, and complete control over your health data.',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Fitness Enthusiast',
      content: 'Biowell helped me optimize my training and nutrition. My energy levels have never been better!',
      rating: 5
    },
    {
      name: 'Ahmed K.',
      role: 'Busy Professional',
      content: 'The AI coach understands my schedule and gives me practical advice that actually works.',
      rating: 5
    },
    {
      name: 'Lisa R.',
      role: 'Health Conscious',
      content: 'Finally, a platform that makes sense of all my health data. The insights are incredible.',
      rating: 5
    }
  ];

  const stats = [
    { number: '50+', label: 'Health Metrics' },
    { number: '1000+', label: 'Supplement Database' },
    { number: '24/7', label: 'AI Monitoring' },
    { number: '5★', label: 'Evidence-Based' }
  ];

  // Show auth forms if requested
  if (showAuthForms) {
    return <AuthForms onBack={() => setShowAuthForms(false)} />;
  }

  return (
    <div className="min-h-screen bg-background" role="document">
      {/* Navigation */}
      <header role="banner">
        <nav 
          role="navigation" 
          aria-label="Main navigation"
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-12 w-auto"
              />
              <div className="flex items-center space-x-4">
                <button 
                aria-label="Sign in to your account"
                onClick={() => setShowAuthForms(true)}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Sign In
                </button>
                <button 
                aria-label="Get started with Biowell"
                onClick={() => setShowAuthForms(true)}
                className="btn-primary"
              >
                Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main role="main">
        <section 
          role="region" 
          aria-labelledby="hero-title"
          className="pt-32 pb-20 relative overflow-hidden"
        >
        {/* Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#48C6FF]/20 to-[#3BE6C5]/20 rounded-full blur-3xl" aria-hidden="true"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br from-[#2A7FFF]/20 to-[#0026CC]/20 rounded-full blur-3xl" aria-hidden="true"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#48C6FF]/10 to-[#3BE6C5]/10 rounded-full border border-[#48C6FF]/20"
                >
                  <SparklesIcon className="w-5 h-5 text-[#48C6FF]" />
                  <span className="text-sm font-semibold text-[#48C6FF]">AI-Powered Wellness Platform</span>
                </motion.div>

                <h1 id="hero-title" className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Your Personal
                  <span className="block text-gradient-brand">
                    Wellness Coach
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Transform your health with AI-powered insights, personalized recommendations, 
                  and real-time biometric tracking. Your journey to optimal wellness starts here.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAuthForms(true)}
                  aria-label="Get started with Biowell"
                  className="px-8 py-4 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </motion.button>
                
                <button 
                  aria-label="Watch product demo video"
                  className="px-8 py-4 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors flex items-center justify-center space-x-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Stats */}
              <div 
                className="grid grid-cols-4 gap-6 pt-8"
                role="region"
                aria-label="Platform statistics"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-[#48C6FF]">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
              role="img"
              aria-label="Dashboard preview showing health metrics"
            >
              <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-3xl p-8 border border-border shadow-2xl">
                {/* Mock Dashboard Preview */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center">
                      <HeartIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">Wellness Score</div>
                      <div className="text-sm text-muted-foreground">Real-time analysis</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Heart Rate', value: '68 bpm', color: 'bg-red-500' },
                      { label: 'Sleep Score', value: '94/100', color: 'bg-indigo-500' },
                      { label: 'Steps', value: '8,234', color: 'bg-blue-500' },
                      { label: 'Energy', value: '85%', color: 'bg-green-500' }
                    ].map((metric, index) => (
                      <div key={index} className="bg-muted/30 rounded-xl p-4">
                        <div className={`w-8 h-8 ${metric.color} rounded-lg mb-2`}></div>
                        <div className="text-sm font-medium text-foreground">{metric.value}</div>
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        </section>

      {/* Features Section */}
        <section 
          role="region" 
          aria-labelledby="features-title"
          className="py-20 bg-muted/30"
        >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-16"
          >
            <h2 id="features-title" className="text-3xl lg:text-5xl font-bold text-foreground">
              Everything You Need for
              <span className="block text-gradient-brand">Optimal Wellness</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Biowell combines cutting-edge AI, real-time health monitoring, and personalized 
              recommendations to help you achieve your wellness goals faster than ever.
            </p>
          </motion.div>

          <ul 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            role="list"
            aria-label="Platform features"
          >
            {features.map((feature, index) => (
              <li key={index} role="listitem">
                <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-xl hover:border-[#48C6FF]/30 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
        </section>

      {/* How It Works */}
        <section 
          role="region" 
          aria-labelledby="how-it-works-title"
          className="py-20"
        >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-16"
          >
            <h2 id="how-it-works-title" className="text-3xl lg:text-5xl font-bold text-foreground">
              How Biowell Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in minutes and begin your transformation journey
            </p>
          </motion.div>

          <div 
            className="max-w-4xl mx-auto space-y-4"
            role="list"
            aria-label="How Biowell works steps"
          >
            {[
              {
                title: 'Connect Your Devices',
                description: 'Link your wearables and health monitors for comprehensive data collection.',
                icon: ClockIcon
              },
              {
                title: 'Smart Coach Analyzes Your Data',
                description: 'Our advanced AI processes your biometrics to understand your unique patterns.',
                icon: SparklesIcon
              },
              {
                title: 'Get Personalized Insights',
                description: 'Receive tailored recommendations for nutrition, supplements, and lifestyle.',
                icon: CheckCircleIcon
              }
            ].map((step, index) => {
              const [isExpanded, setIsExpanded] = useState(false);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-lg transition-all duration-300"
                  role="listitem"
                >
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={isExpanded}
                    aria-controls={`step-content-${index}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDownIcon className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        id={`step-content-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-muted-foreground leading-relaxed pl-16">
                          {step.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
        </section>

      {/* Testimonials */}
        <section 
          role="region" 
          aria-labelledby="testimonials-title"
          className="py-20 bg-muted/30"
        >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-16"
          >
            <h2 id="testimonials-title" className="text-3xl lg:text-5xl font-bold text-foreground">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users are saying about their wellness transformation
            </p>
          </motion.div>

          <ul 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            role="list"
            aria-label="User testimonials"
          >
            {testimonials.map((testimonial, index) => (
              <li key={index} role="listitem">
                <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center space-y-4"
                role="article"
              >
                <div className="flex justify-center space-x-1" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
        </section>

      {/* CTA Section */}
        <section 
          role="region" 
          aria-labelledby="cta-title"
          className="py-20 relative overflow-hidden"
        >
        <div className="absolute inset-0 bg-gradient-to-br from-[#48C6FF]/10 via-[#2A7FFF]/10 to-[#0026CC]/10" aria-hidden="true"></div>
        
        {/* Pricing Section */}
        <div className="container mx-auto px-6 relative z-10 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-16"
          >
            <h2 id="pricing-title" className="text-3xl lg:text-5xl font-bold text-foreground">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include core health tracking.
            </p>
          </motion.div>

          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            role="region"
            aria-labelledby="pricing-title"
          >
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
              role="article"
              aria-labelledby="free-plan-title"
            >
              <div className="space-y-6">
                <div>
                  <h3 id="free-plan-title" className="text-2xl font-bold text-foreground mb-2">Free</h3>
                  <div className="text-4xl font-bold text-foreground mb-2">AED 0</div>
                  <div className="text-muted-foreground">Forever free</div>
                </div>
                
                <ul className="space-y-3 text-left" role="list" aria-label="Free plan features">
                  {[
                    'Basic health tracking',
                    'AI coach (5 messages/day)',
                    'Manual data entry',
                    'Basic insights',
                    'Community support'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3" role="listitem">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setShowAuthForms(true)}
                  aria-label="Get started with free plan"
                  className="w-full btn-secondary"
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center border-2 border-[#48C6FF] relative"
              role="article"
              aria-labelledby="premium-plan-title"
            >
              <div 
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white text-sm font-bold rounded-full"
                role="img"
                aria-label="Most popular plan"
              >
                Most Popular
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 id="premium-plan-title" className="text-2xl font-bold text-foreground mb-2">Premium</h3>
                  <div className="text-4xl font-bold text-foreground mb-2">AED 99</div>
                  <div className="text-muted-foreground">per month</div>
                </div>
                
                <ul className="space-y-3 text-left" role="list" aria-label="Premium plan features">
                  {[
                    'Everything in Free',
                    'Unlimited AI coach',
                    'Device integrations',
                    'Advanced analytics',
                    'Supplement recommendations',
                    'Priority support'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3" role="listitem">
                      <CheckCircleIcon className="w-5 h-5 text-[#48C6FF]" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setShowAuthForms(true)}
                  aria-label="Start 14-day free trial of premium plan"
                  className="w-full btn-primary"
                >
                  Start 14-Day Free Trial
                </button>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="card text-center"
              role="article"
              aria-labelledby="pro-plan-title"
            >
              <div className="space-y-6">
                <div>
                  <h3 id="pro-plan-title" className="text-2xl font-bold text-foreground mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-foreground mb-2">AED 199</div>
                  <div className="text-muted-foreground">per month</div>
                </div>
                
                <ul className="space-y-3 text-left" role="list" aria-label="Pro plan features">
                  {[
                    'Everything in Premium',
                    'Lab result analysis',
                    'Genetic insights',
                    'Custom protocols',
                    'Telehealth consultations',
                    'White-glove support'
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3" role="listitem">
                      <CheckCircleIcon className="w-5 h-5 text-purple-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setShowAuthForms(true)}
                  aria-label="Start pro plan trial"
                  className="w-full btn-secondary"
                >
                  Start Pro Trial
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div className="space-y-6">
              <h2 id="cta-title" className="text-3xl lg:text-5xl font-bold text-foreground">
                Ready to Transform
                <span className="block text-gradient-brand">Your Health?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who have already optimized their wellness with Biowell's 
                AI-powered platform. Start your free trial today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAuthForms(true)}
                aria-label="Get started with Biowell"
                className="px-8 py-4 bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
              
              <button 
                aria-label="Schedule a product demo"
                className="px-8 py-4 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors"
              >
                Schedule Demo
              </button>
            </div>

            <ul 
              className="flex items-center justify-center space-x-8 text-sm text-muted-foreground"
              role="list"
              aria-label="Trial benefits"
            >
              <li className="flex items-center space-x-2" role="listitem">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span>Free 14-day trial</span>
              </li>
              <li className="flex items-center space-x-2" role="listitem">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </li>
              <li className="flex items-center space-x-2" role="listitem">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </motion.div>
        </div>
        </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-8 w-auto"
              />
              <span className="text-muted-foreground">© 2025 Biowell. All rights reserved.</span>
            </div>
            
            <nav role="navigation" aria-label="Footer links" className="flex items-center space-x-6">
              <button 
                aria-label="View privacy policy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                aria-label="View terms of service"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </button>
              <button 
                aria-label="Contact support"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;