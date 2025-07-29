import React from 'react';
import { motion } from 'framer-motion';

interface TouchFeedbackProps {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  intensity = 'medium',
  className = '',
  onClick,
  disabled = false,
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'light':
        return 'haptic-light';
      case 'heavy':
        return 'haptic-heavy';
      default:
        return 'haptic-medium';
    }
  };

  return (
    <motion.div
      className={`${getIntensityClass()} ${className} ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
      whileTap={{ scale: intensity === 'light' ? 0.98 : intensity === 'heavy' ? 0.92 : 0.95 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default TouchFeedback;