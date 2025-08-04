import React from 'react';
import { motion } from 'framer-motion';

interface TouchFeedbackProps {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  hapticType?: 'selection' | 'impact' | 'notification';
  'aria-label'?: string;
}

const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  intensity = 'medium',
  className = '',
  onClick,
  disabled = false,
  hapticType = 'impact',
  'aria-label': ariaLabel,
}) => {
  const handleClick = () => {
    if (disabled || !onClick) return;
    
    // Trigger haptic feedback on supported devices
    if ('vibrate' in navigator) {
      switch (intensity) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
        default:
          navigator.vibrate(25);
      }
    }
    
    onClick();
  };

  const getHapticClass = () => {
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
      className={`${getHapticClass()} touch-target ${className} ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      onClick={handleClick}
      whileTap={{ scale: intensity === 'light' ? 0.98 : intensity === 'heavy' ? 0.92 : 0.95 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      role="button"
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default TouchFeedback;