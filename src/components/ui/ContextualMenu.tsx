import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
  disabled?: boolean;
  destructive?: boolean;
  shortcut?: string;
}

interface ContextualMenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

const ContextualMenu: React.FC<ContextualMenuProps> = ({
  items,
  trigger,
  placement = 'bottom-right',
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (!item.disabled) {
      item.action();
      setIsOpen(false);
    }
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case 'bottom-left':
        return 'top-full left-0 mt-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      default:
        return 'top-full right-0 mt-2';
    }
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="
          p-2 hover:bg-muted rounded-lg transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-light/20
        "
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger || <EllipsisVerticalIcon className="w-5 h-5 text-muted-foreground" />}
      </button>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute ${getPlacementClasses()} z-50
              bg-card border border-border rounded-xl shadow-xl
              min-w-48 py-2
            `}
            role="menu"
            onKeyDown={handleKeyDown}
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full flex items-center justify-between px-4 py-2
                  text-left transition-colors
                  ${item.disabled 
                    ? 'text-muted-foreground cursor-not-allowed' 
                    : item.destructive
                      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                      : 'text-foreground hover:bg-muted'
                  }
                  focus:outline-none focus:bg-muted
                `}
                role="menuitem"
                tabIndex={item.disabled ? -1 : 0}
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <item.icon className="w-4 h-4" />
                  )}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextualMenu;