import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-3 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] font-inter relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#48C6FF]/20 shadow-md',
        secondary: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-20 border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white hover:bg-white/90 dark:hover:bg-slate-900/90 hover:border-[#48C6FF]/30 focus:ring-[#48C6FF]/20 shadow-sm',
        outline: 'border-2 border-[#48C6FF] text-[#48C6FF] hover:bg-[#48C6FF]/5 focus:ring-[#48C6FF]/20 bg-transparent backdrop-blur-20',
        ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white focus:ring-[#48C6FF]/20 backdrop-blur-20',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500/20 shadow-md hover:shadow-lg',
        success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500/20 shadow-md hover:shadow-lg',
        premium: 'bg-gradient-to-r from-[#48C6FF] via-[#2A7FFF] to-[#0026CC] text-white hover:opacity-95 hover:shadow-xl hover:-translate-y-1 focus:ring-[#48C6FF]/20 shadow-lg relative overflow-hidden',
      },
      size: {
        sm: 'px-4 py-2 text-sm min-h-[36px] gap-2',
        md: 'px-6 py-3 text-base min-h-[44px] gap-3',
        lg: 'px-8 py-4 text-lg min-h-[52px] gap-3',
        xl: 'px-10 py-5 text-xl min-h-[60px] gap-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  loading = false,
  children,
  className,
  disabled,
  icon: Icon,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      type="button"
      {...props}
    >
      {/* Premium variant shimmer effect */}
      {variant === 'premium' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
      )}
      
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      
      {Icon && !loading && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
};

export default Button;