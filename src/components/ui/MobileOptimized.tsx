import React from 'react';
import { motion } from 'framer-motion';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileContainer: React.FC<MobileOptimizedProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`mobile-container w-full box-border ${className}`}>
      {children}
    </div>
  );
};

export const MobileSection: React.FC<MobileOptimizedProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <section className={`mobile-section w-full box-border ${className}`}>
      {children}
    </section>
  );
};

export const MobileCard: React.FC<MobileOptimizedProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-premium w-full box-border ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const MobileButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variant === 'primary' ? 'btn-mobile-primary w-full' : 'btn-mobile-secondary w-full'}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        flex items-center justify-center text-center box-border
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const MobileInput: React.FC<{
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
}> = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  required = false 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`input-mobile w-full box-border ${className}`}
    />
  );
};

export const MobileGrid: React.FC<{
  children: React.ReactNode;
  columns?: 1 | 2;
  className?: string;
}> = ({ 
  children, 
  columns = 2, 
  className = '' 
}) => {
  return (
    <div className={`${columns === 1 ? 'mobile-grid-1' : 'mobile-grid-2'} w-full box-border ${className}`}>
      {children}
    </div>
  );
};

export const MobileScrollContainer: React.FC<MobileOptimizedProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`mobile-scroll-container w-full box-border overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
};