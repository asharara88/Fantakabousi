import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'premium' | 'minimal';
  hover?: boolean;
  gradient?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  gradient = false,
  padding = 'lg'
}) => {
  const variants = {
    default: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-20 border border-gray-200/20 dark:border-gray-700/20',
    glass: 'bg-white/10 dark:bg-slate-900/10 backdrop-blur-20 border border-white/20 dark:border-gray-700/20',
    elevated: 'bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-gray-700/50 shadow-lg',
    premium: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-20 border border-gray-200/30 dark:border-gray-700/30 shadow-xl',
    minimal: 'bg-transparent border-0'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -2, scale: 1.005 },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  return (
    <Component
      className={cn(
        'rounded-2xl relative overflow-hidden transition-all duration-300',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-lg hover:border-blue-light/30',
        gradient && 'bg-gradient-to-br from-white/20 to-white/5',
        className
      )}
      {...motionProps}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#48C6FF]/5 via-[#2A7FFF]/5 to-[#0026CC]/5 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default Card;