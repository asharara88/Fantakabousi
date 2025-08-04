import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  SparklesIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  action: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onNavigate,
  placeholder = "Search health data, supplements, recipes...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results - in real app, this would call an API
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Heart Rate Trends',
      description: 'View your heart rate analytics',
      category: 'Health',
      action: () => onNavigate?.('health-metrics'),
      icon: SparklesIcon
    },
    {
      id: '2',
      title: 'Vitamin D3',
      description: 'High-potency vitamin D supplement',
      category: 'Supplements',
      action: () => onNavigate?.('supplements'),
      icon: SparklesIcon
    },
    {
      id: '3',
      title: 'High Protein Recipes',
      description: 'Muscle-building meal ideas',
      category: 'Nutrition',
      action: () => onNavigate?.('nutrition'),
      icon: SparklesIcon
    }
  ];

  useEffect(() => {
    if (query.length > 2) {
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch?.(searchQuery);
    
    // Add to recent searches
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    result.action();
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Global search shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalSearch = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalSearch);
    return () => document.removeEventListener('keydown', handleGlobalSearch);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-light/20 focus:border-blue-light transition-all text-foreground"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        
        {/* Keyboard Shortcut Hint */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-muted rounded-md">
            <CommandLineIcon className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">K</span>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
            role="listbox"
            aria-label="Search results"
          >
            {query.length > 2 && results.length > 0 ? (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                  Search Results
                </div>
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    role="option"
                  >
                    {result.icon && (
                      <div className="w-8 h-8 bg-blue-light/10 rounded-lg flex items-center justify-center">
                        <result.icon className="w-4 h-4 text-blue-light" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{result.title}</div>
                      <div className="text-sm text-muted-foreground">{result.description}</div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                      {result.category}
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div>No results found for "{query}"</div>
              </div>
            ) : (
              <div className="p-2">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                      Recent Searches
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <ClockIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{search}</span>
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="border-t border-border mt-2 pt-2">
                  <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                    Quick Actions
                  </div>
                  {[
                    { label: 'Log Food', action: () => onNavigate?.('nutrition') },
                    { label: 'Ask Coach', action: () => onNavigate?.('coach') },
                    { label: 'View Health Data', action: () => onNavigate?.('health') },
                    { label: 'Browse Supplements', action: () => onNavigate?.('supplements') }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <SparklesIcon className="w-4 h-4 text-blue-light" />
                      <span className="text-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;