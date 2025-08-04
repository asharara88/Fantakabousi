import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AccessibleDropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiSelect?: boolean;
  className?: string;
}

const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  options,
  value,
  placeholder = "Select an option",
  onSelect,
  label,
  error,
  disabled = false,
  searchable = false,
  multiSelect = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    multiSelect ? (Array.isArray(value) ? value : value ? [value] : []) : []
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        triggerRef.current?.focus();
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(filteredOptions.length - 1);
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    if (multiSelect) {
      const newSelection = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newSelection);
      onSelect(newSelection.join(','));
    } else {
      onSelect(optionValue);
      setIsOpen(false);
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  };

  const getDisplayValue = () => {
    if (multiSelect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        return options.find(opt => opt.value === selectedValues[0])?.label || placeholder;
      }
      return `${selectedValues.length} selected`;
    }
    
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption?.label || placeholder;
  };

  const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${dropdownId}-label`;
  const errorId = `${dropdownId}-error`;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          id={labelId}
          htmlFor={dropdownId}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}

      {/* Trigger button */}
      <button
        ref={triggerRef}
        id={dropdownId}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left
          border-2 rounded-xl transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20
          ${disabled 
            ? 'bg-muted text-muted-foreground cursor-not-allowed border-muted' 
            : error
              ? 'border-red-500 bg-background text-foreground hover:border-red-600'
              : isOpen
                ? 'border-primary bg-background text-foreground'
                : 'border-border bg-background text-foreground hover:border-muted-foreground'
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        <span className={value || selectedValues.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
          {getDisplayValue()}
        </span>
        <ChevronDownIcon 
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}
        />
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-hidden"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-3 border-b border-border">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  placeholder="Search options..."
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Search options"
                />
              </div>
            )}

            {/* Options list */}
            <ul
              ref={listRef}
              role="listbox"
              aria-multiselectable={multiSelect}
              className="py-2 overflow-y-auto max-h-48"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-3 text-sm text-muted-foreground text-center">
                  No options found
                </li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = multiSelect 
                    ? selectedValues.includes(option.value)
                    : value === option.value;
                  const isFocused = index === focusedIndex;

                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      className={`
                        px-4 py-3 cursor-pointer transition-colors duration-150
                        ${option.disabled 
                          ? 'text-muted-foreground cursor-not-allowed' 
                          : isFocused
                            ? 'bg-primary/10 text-primary'
                            : isSelected
                              ? 'bg-primary/5 text-primary'
                              : 'text-foreground hover:bg-muted'
                        }
                      `}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
                    >
                      <div className="flex items-center space-x-3">
                        {option.icon && (
                          <option.icon className="w-4 h-4 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">
                              {option.label}
                            </span>
                            {(isSelected || (multiSelect && selectedValues.includes(option.value))) && (
                              <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          {option.description && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isOpen && `Dropdown expanded. ${filteredOptions.length} options available.`}
        {!isOpen && value && `Selected: ${getDisplayValue()}`}
      </div>
    </div>
  );
};

export default AccessibleDropdown;