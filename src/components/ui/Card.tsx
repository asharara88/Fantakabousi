import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'premium';
  hover?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  gradient = false
}) => {
  const variants = {
    default: 'bg-card text-card-foreground border border-border shadow-sm',
    glass: 'glass-card text-foreground',
    elevated: 'bg-card text-card-foreground border border-border shadow-lg hover:shadow-xl transition-shadow duration-300',
    premium: 'glass-ultra text-foreground shadow-2xl',
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { y: -2, scale: 1.01 },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  return (
    <Component
      className={cn(
        'rounded-2xl p-6 relative overflow-hidden',
        variants[variant],
        gradient && 'bg-gradient-to-br from-white/10 to-white/5',
        hover && 'cursor-pointer',
        className
      )}
      {...motionProps}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default Card;