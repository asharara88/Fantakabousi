import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PasswordReset from './PasswordReset';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
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

interface AuthFormsProps {
  onBack?: () => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ onBack }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { actualTheme } = useTheme();

  const logoUrl = actualTheme === 'dark' 
    ? "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_Logo_Dark_Theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9Mb2dvX0RhcmtfVGhlbWUuc3ZnIiwiaWF0IjoxNzU0MzgwMDY1LCJleHAiOjE3ODU5MTYwNjV9.W4lMMJpIbCmQrbsJFDKK-eRoSnvQ3UUdz4DhUF-jwOc"
    : "https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/biowelllogos/Biowell_logo_light_theme.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZjcyOGVhMS1jMTdjLTQ2MTYtOWFlYS1mZmI3MmEyM2U5Y2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJiaW93ZWxsbG9nb3MvQmlvd2VsbF9sb2dvX2xpZ2h0X3RoZW1lLnN2ZyIsImlhdCI6MTc1NDM4MDA4NywiZXhwIjoxNzg1OTE2MDg3fQ.GTBPM8tMs-jtvycD39wO6Bt32JHyEWB4a-tWle0jl8I";

  if (showPasswordReset) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <img 
                src={logoUrl} 
                alt="Biowell" 
                className="h-21 mx-auto mb-4"
              />
            </div>
            <PasswordReset onBack={() => setShowPasswordReset(false)} />
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignIn) {
        await signIn(formData.email, formData.password);
      } else {
        const [firstName, lastName] = formData.first_name.includes(' ') 
          ? formData.first_name.split(' ', 2)
          : [formData.first_name, formData.last_name];
          
        await signUp(formData.email, formData.password, {
          first_name: firstName,
          last_name: lastName
        });
        
        toast({
          title: "Account Created!",
          description: "Welcome to Biowell. Please check your email to verify your account.",
        });
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const errorMessage = err.message || 'An error occurred during authentication';
      setError(errorMessage);
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={logoUrl} 
              alt="Biowell" 
              className="h-12 mx-auto mb-6"
            />
            {onBack && (
              <button
                onClick={onBack}
                className="mb-6 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                ← Back to Home
              </button>
            )}
            <h1 className="text-display-sm font-display text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
              Welcome to Biowell
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-light">
              {isSignIn ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>

          {/* Form Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                isSignIn
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                !isSignIn
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="input-professional w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 dark:text-slate-100"
                    required={!isSignIn}
                  />
                </div>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name (Optional)"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="input-professional w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 dark:text-slate-100"
                  />
                </div>
              </motion.div>
            )}

            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-professional w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-professional w-full pl-12 pr-12 py-4 rounded-xl text-slate-900 dark:text-slate-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-professional w-full py-4 rounded-xl text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  {isSignIn ? 'Sign In' : 'Create Account'}
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          {isSignIn && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <SparklesIcon className="h-4 w-4 text-emerald-600" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <UserIcon className="h-4 w-4 text-violet-600" />
                <span>Personalized</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForms;