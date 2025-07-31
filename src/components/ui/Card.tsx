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
    default: 'bg-card text-card-foreground border border-border shadow-sm hover:shadow-md hover:border-[#48C6FF]/20',
    glass: 'bg-card/80 backdrop-blur-sm text-foreground border border-border/50 shadow-lg',
    elevated: 'bg-card text-card-foreground border border-border shadow-lg hover:shadow-xl hover:border-[#48C6FF]/30 transition-all duration-300',
    premium: 'bg-card text-foreground shadow-xl border border-border hover:shadow-2xl hover:border-[#48C6FF]/20',
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
        'rounded-2xl p-6 relative overflow-hidden font-inter',
        variants[variant],
        gradient && 'bg-gradient-to-br from-white/10 to-white/5',
        hover && 'cursor-pointer',
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