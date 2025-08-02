import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import { 
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

interface PasswordResetProps {
  onBack: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircleIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h2>
          <p className="text-muted-foreground">
            We've sent password reset instructions to {email}
          </p>
        </div>
        <button onClick={onBack} className="btn-secondary">
          Back to Sign In
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-light to-blue-medium rounded-2xl flex items-center justify-center mx-auto">
          <KeyIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
          <p className="text-muted-foreground">
            Enter your email to receive reset instructions
          </p>
        </div>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div className="relative">
          <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-light/20 focus:border-blue-light transition-colors text-foreground"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <EnvelopeIcon className="w-4 h-4" />
              <span>Send Reset Email</span>
            </>
          )}
        </button>
      </form>

      <button
        onClick={onBack}
        className="w-full btn-ghost flex items-center justify-center space-x-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Sign In</span>
      </button>
    </motion.div>
  );
};

export default PasswordReset;