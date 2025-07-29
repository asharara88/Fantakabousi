import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-2 text-sm", className)}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2"
          >
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
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
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  // Handle navigation - you can integrate with your routing system
                  console.log(`Navigate to: ${item.href}`);
                }}
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

export default Breadcrumbs;