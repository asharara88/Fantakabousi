import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface NavigationBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  onNavigate?: (href: string) => void;
}

const NavigationBreadcrumbs: React.FC<NavigationBreadcrumbsProps> = ({ 
  items, 
  className = '', 
  onNavigate 
}) => {
  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2" role="list">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2"
            role="listitem"
          >
            {index > 0 && (
              <ChevronRightIcon 
                className="w-4 h-4 text-muted-foreground" 
                aria-hidden="true" 
              />
            )}
            
            {item.current ? (
              <span 
                className="flex items-center space-x-1 text-foreground font-medium"
                aria-current="page"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </span>
            ) : (
              <button
                onClick={() => item.href && onNavigate?.(item.href)}
                className="
                  flex items-center space-x-1 text-muted-foreground 
                  hover:text-foreground transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-blue-light/20 
                  rounded-md px-1 py-0.5
                "
                aria-label={`Navigate to ${item.label}`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
};

export default NavigationBreadcrumbs;