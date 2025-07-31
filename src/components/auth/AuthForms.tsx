import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const AuthForms: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { actualTheme } = useTheme();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  // Use the exact Biowell logo URLs provided
  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzUzNzY4NjI5LCJleHAiOjE3ODUzMDQ2Mjl9.FeAiKuBqhcSos_4d6tToot-wDPXLuRKerv6n0PyLYXI" // White logo for dark background
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1Mzc2ODY2MCwiZXhwIjoxNzg1MzA0NjYwfQ.UW3n1NOb3F1is3zg_jGRYSDe7eoStJFpSmmFP_X9QiY"; // Dark logo for light background

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignIn) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          first_name: formData.fullName.split(' ')[0],
          last_name: formData.fullName.split(' ').slice(1).join(' '),
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const features = [
    { icon: SparklesIcon, text: 'AI-Powered Health Insights' },
    { icon: ShieldCheckIcon, text: 'HIPAA Compliant & Secure' },
    { icon: CheckCircleIcon, text: 'Personalized Recommendations' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'var(--gradient-biowell)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'var(--gradient-secondary)' }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 200 }}
                className="relative inline-block"
              >
                <img 
                  src={logoUrl}
                  alt="Biowell"
                  className="h-28 w-auto"
                  style={{ filter: 'none' }}
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full shadow-lg"
                />
              </motion.div>
              
              <div className="space-y-6">
                <h1 className="text-display-xl leading-tight" id="main-heading">
                  Transform Your Health
                  <br />
                  with AI Wellness
                </h1>
                <p className="text-body-lg leading-relaxed max-w-lg" style={{ color: 'var(--muted-foreground)' }} role="banner">
                  Get personalized AI insights and real-time health tracking. Build your optimal supplement stack with expert guidance.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                  className="flex items-center space-x-4"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'var(--gradient-biowell)' }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-body font-semibold" style={{ color: 'var(--foreground)' }}>
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                      }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-body font-semibold" style={{ color: 'var(--foreground)' }}>
                    Join 10,000+ users
                  </div>
                  <div className="text-caption">Already optimizing their health</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="card-glass p-8 lg:p-10 shadow-2xl">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, type: "spring", stiffness: 200 }}
                  className="relative inline-block"
                >
                  <img 
                    src={logoUrl}
                    alt="Biowell"
                    className="h-20 w-auto mx-auto object-contain"
                  />
                </motion.div>
                <h1 className="text-heading-lg mt-4" style={{ color: 'var(--foreground)' }}>
                  Welcome to Biowell
                </h1>
                <p className="text-body mt-2" style={{ color: 'var(--muted-foreground)' }}>
                  Your AI wellness journey starts here
                </p>
              </div>

              {/* Tab Switcher */}
              <motion.div 
                className="flex rounded-2xl p-1 mb-8"
                style={{ background: 'var(--muted)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  type="button"
                  className={`flex-1 py-4 px-6 rounded-xl text-body font-semibold transition-all duration-300 ${
                    isSignIn
                      ? 'text-white shadow-lg'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    background: isSignIn ? 'var(--gradient-biowell)' : 'transparent',
                    color: isSignIn ? 'white' : 'var(--foreground)'
                  }}
                  onClick={() => setIsSignIn(true)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`flex-1 py-4 px-6 rounded-xl text-body font-semibold transition-all duration-300 ${
                    !isSignIn
                      ? 'text-white shadow-lg'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    background: !isSignIn ? 'var(--gradient-biowell)' : 'transparent',
                    color: !isSignIn ? 'white' : 'var(--foreground)'
                  }}
                  onClick={() => setIsSignIn(false)}
                >
                  Create Account
                </button>
              </motion.div>

              {/* Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <AnimatePresence mode="wait">
                  {!isSignIn && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="block text-body font-semibold" style={{ color: 'var(--foreground)' }}>
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon 
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                          style={{ color: 'var(--muted-foreground)' }}
                        />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="input-premium pl-12 w-full"
                          placeholder="Enter your full name"
                          required={!isSignIn}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="block text-body font-semibold" style={{ color: 'var(--foreground)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-premium pl-12 w-full"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-body font-semibold" style={{ color: 'var(--foreground)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <LockClosedIcon 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-premium pl-12 pr-12 w-full"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="card-glass p-4 border border-red-500/20 bg-red-500/5"
                    >
                      <p className="text-red-500 text-body font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <LoadingSpinner size="sm" variant="dots" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span>{isSignIn ? 'Sign In to Biowell' : 'Start Your Journey'}</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </motion.div>
              </motion.form>

              {/* Footer */}
              <motion.div 
                className="mt-8 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-caption leading-relaxed">
                    By continuing, you agree to our{' '}
                    <a href="#" className="font-medium transition-colors" style={{ color: 'var(--primary)' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-medium transition-colors" style={{ color: 'var(--primary)' }}>
                      Privacy Policy
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-8 text-caption">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>256-bit Encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;