import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px] font-inter',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-[#48C6FF] to-[#2A7FFF] text-white hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#48C6FF]/20 shadow-md',
        secondary: 'bg-card border border-border text-card-foreground hover:bg-muted hover:border-[#48C6FF]/30 focus:ring-[#48C6FF]/20 shadow-sm',
        outline: 'border-2 border-[#48C6FF] text-[#48C6FF] hover:bg-[#48C6FF]/5 focus:ring-[#48C6FF]/20 bg-transparent',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground focus:ring-[#48C6FF]/20',
        destructive: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/20 shadow-md hover:shadow-lg',
        success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500/20 shadow-md hover:shadow-lg',
      },
      size: {
        sm: 'px-3 py-2 text-sm min-h-[36px]',
        md: 'px-4 py-3 text-base min-h-[44px]',
        lg: 'px-6 py-4 text-lg min-h-[52px]',
        xl: 'px-8 py-5 text-xl min-h-[60px]',
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
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  loading = false,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(buttonVariants({ variant, size }), 'touch-target apple-focus', className)}
      disabled={disabled || loading}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      type="button"
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;