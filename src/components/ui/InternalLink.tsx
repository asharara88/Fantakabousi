import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
  nofollow?: boolean;
  prefetch?: boolean;
  analytics?: {
    event: string;
    category: string;
    label?: string;
  };
  onClick?: () => void;
}

const InternalLink: React.FC<InternalLinkProps> = ({
  href,
  children,
  className,
  variant = 'default',
  size = 'md',
  icon: Icon,
  external = false,
  nofollow = false,
  prefetch = true,
  analytics,
  onClick,
}) => {
  const variants = {
    default: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline',
    primary: 'text-primary font-semibold hover:text-primary/80',
    secondary: 'text-muted-foreground hover:text-foreground',
    ghost: 'text-foreground hover:text-primary',
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const handleClick = (e: React.MouseEvent) => {
    // Analytics tracking
    if (analytics && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', analytics.event, {
        event_category: analytics.category,
        event_label: analytics.label || href,
      });
    }

    // Custom onClick handler
    if (onClick) {
      onClick();
    }

    // For SPA navigation, prevent default and handle routing
    if (!external) {
      e.preventDefault();
      // Integrate with your routing system here
      console.log(`Navigate to: ${href}`);
    }
  };

  const linkProps = {
    href,
    onClick: handleClick,
    className: cn(
      'inline-flex items-center space-x-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md',
      variants[variant],
      sizes[size],
      className
    ),
    ...(external && {
      target: '_blank',
      rel: `noopener${nofollow ? ' nofollow' : ''}`,
    }),
    ...(prefetch && !external && {
      'data-prefetch': 'true',
    }),
  };

  return (
    <motion.a
      {...linkProps}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </motion.a>
  );
};

export default InternalLink;