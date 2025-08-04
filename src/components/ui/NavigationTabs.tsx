import React from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
}

interface NavigationTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'pills',
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const getTabClasses = (tab: TabItem) => {
    const baseClasses = `
      relative flex items-center justify-center gap-2 font-semibold 
      transition-all duration-200 cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-blue-light/20 
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeClasses[size]}
    `;

    const variantClasses = {
      default: `
        border-b-2 rounded-t-lg
        ${activeTab === tab.id
          ? 'border-blue-light text-blue-light bg-blue-light/5'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
        }
      `,
      pills: `
        rounded-xl
        ${activeTab === tab.id
          ? 'bg-gradient-to-r from-blue-light to-blue-medium text-white shadow-lg'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }
      `,
      underline: `
        border-b-2 pb-3
        ${activeTab === tab.id
          ? 'border-blue-light text-blue-light'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
        }
      `
    };

    return `${baseClasses} ${variantClasses[variant]}`;
  };

  return (
    <div className={`flex ${variant === 'pills' ? 'bg-muted rounded-xl p-1' : 'border-b border-border'} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={getTabClasses(tab)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          <div className="flex items-center space-x-2">
            {tab.icon && (
              <tab.icon className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            {tab.badge && (
              <span className={`
                px-2 py-1 text-xs font-bold rounded-full
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-light/10 text-blue-light'
                }
              `}>
                {tab.badge}
              </span>
            )}
          </div>

          {/* Active indicator for underline variant */}
          {variant === 'underline' && activeTab === tab.id && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-light"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabs;