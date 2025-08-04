import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      className={cn(
        'glass rounded-2xl shadow-lg border border-white/20',
        gradient && 'bg-gradient-to-br from-white/30 to-white/10',
        hover && 'hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;