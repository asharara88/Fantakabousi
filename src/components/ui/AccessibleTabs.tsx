import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AccessibleTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
  tabs,
  defaultTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'default',
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [focusedTab, setFocusedTab] = useState(activeTab);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    setFocusedTab(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const enabledIndex = enabledTabs.findIndex(tab => tab.id === tabId);

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextEnabledIndex = (enabledIndex + 1) % enabledTabs.length;
        const nextTab = enabledTabs[nextEnabledIndex];
        setFocusedTab(nextTab.id);
        tabRefs.current[nextTab.id]?.focus();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevEnabledIndex = enabledIndex === 0 ? enabledTabs.length - 1 : enabledIndex - 1;
        const prevTab = enabledTabs[prevEnabledIndex];
        setFocusedTab(prevTab.id);
        tabRefs.current[prevTab.id]?.focus();
        break;

      case 'Home':
        e.preventDefault();
        const firstEnabledTab = enabledTabs[0];
        setFocusedTab(firstEnabledTab.id);
        tabRefs.current[firstEnabledTab.id]?.focus();
        break;

      case 'End':
        e.preventDefault();
        const lastEnabledTab = enabledTabs[enabledTabs.length - 1];
        setFocusedTab(lastEnabledTab.id);
        tabRefs.current[lastEnabledTab.id]?.focus();
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        handleTabClick(tabId);
        break;
    }
  };

  const getTabClasses = (tab: TabItem) => {
    const baseClasses = `
      relative px-4 py-3 font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantClasses = {
      default: `
        border-b-2 rounded-t-lg
        ${activeTab === tab.id
          ? 'border-primary text-primary bg-primary/5'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
        }
      `,
      pills: `
        rounded-xl
        ${activeTab === tab.id
          ? 'bg-primary text-white shadow-lg'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }
      `,
      underline: `
        border-b-2 pb-3
        ${activeTab === tab.id
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
        }
      `
    };

    return `${baseClasses} ${variantClasses[variant]}`;
  };

  const tabListId = `tablist-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`w-full ${className}`}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-orientation={orientation}
        className={`
          flex border-b border-border
          ${orientation === 'vertical' ? 'flex-col space-y-1' : 'space-x-1'}
          ${variant === 'pills' ? 'p-1 bg-muted rounded-xl border-0' : ''}
        `}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            disabled={tab.disabled}
            className={getTabClasses(tab)}
            onClick={() => handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
          >
            <div className="flex items-center space-x-2">
              {tab.icon && (
                <tab.icon className="w-4 h-4" />
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`
                  px-2 py-1 text-xs font-bold rounded-full
                  ${activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary'
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
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            className={`
              focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg
              ${activeTab === tab.id ? 'block' : 'hidden'}
            `}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {tab.content}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Tab ${tabs.findIndex(tab => tab.id === activeTab) + 1} of ${tabs.length}: ${
          tabs.find(tab => tab.id === activeTab)?.label
        } selected`}
      </div>
    </div>
  );
};

export default AccessibleTabs;