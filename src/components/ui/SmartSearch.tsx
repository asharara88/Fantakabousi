import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  SparklesIcon,
  CommandLineIcon,
  HeartIcon,
  BeakerIcon,
  CubeIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  action: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
}

interface SmartSearchProps {
  onSearch?: (query: string) => void;
  onNavigate?: (path: string) => void;
  placeholder?: string;
  className?: string;
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearch,
  onNavigate,
  placeholder = "Search health data, supplements, recipes...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Smart search results based on query
  const searchResults: SearchResult[] = [
    {
      id: '1',
      title: 'Heart Rate Trends',
      description: 'View your cardiovascular health analytics',
      category: 'Health',
      action: () => onNavigate?.('health'),
      icon: HeartIcon
    },
    {
      id: '2',
      title: 'Vitamin D3 Supplement',
      description: 'High-potency vitamin D for immune support',
      category: 'Supplements',
      action: () => onNavigate?.('supplements'),
      icon: CubeIcon
    },
    {
      id: '3',
      title: 'High Protein Recipes',
      description: 'Muscle-building meal ideas and nutrition',
      category: 'Nutrition',
      action: () => onNavigate?.('nutrition'),
      icon: BeakerIcon
    },
    {
      id: '4',
      title: 'Ask AI Coach',
      description: 'Get personalized health recommendations',
      category: 'Coach',
      action: () => onNavigate?.('coach'),
      icon: ChatBubbleLeftRightIcon
    },
    {
      id: '5',
      title: 'Sleep Optimization',
      description: 'Improve your sleep quality and recovery',
      category: 'Sleep',
      action: () => onNavigate?.('sleep'),
      icon: SparklesIcon
    },
    {
      id: '6',
      title: 'Workout Programs',
      description: 'Strength and cardio training plans',
      category: 'Fitness',
      action: () => onNavigate?.('fitness'),
      icon: ChartBarIcon
    }
  ];

  // Filter results based on query
  useEffect(() => {
    if (query.length > 1) {
      const filtered = searchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setSelectedIndex(-1);
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
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          onSearch?.(query);
          setIsOpen(false);
        }
        break;
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

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
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
          className="
            w-full pl-10 pr-20 py-3 
            bg-card border border-border rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-light/20 
            focus:border-blue-light transition-all 
            text-foreground placeholder:text-muted-foreground
          "
          aria-label="Smart search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        
        {/* Actions */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setSelectedIndex(-1);
              }}
              className="p-1 hover:bg-muted rounded-md transition-colors"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-muted rounded-md">
            <CommandLineIcon className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">⌘K</span>
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
            className="
              absolute top-full left-0 right-0 mt-2 
              bg-card border border-border rounded-xl 
              shadow-xl z-50 max-h-96 overflow-y-auto
            "
            role="listbox"
            aria-label="Search results"
          >
            {query.length > 1 && results.length > 0 ? (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                  Search Results
                </div>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`
                      w-full flex items-center space-x-3 p-3 rounded-lg 
                      transition-colors text-left
                      ${index === selectedIndex 
                        ? 'bg-blue-light/10 text-blue-light' 
                        : 'hover:bg-muted'
                      }
                    `}
                    role="option"
                    aria-selected={index === selectedIndex}
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
            ) : query.length > 1 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div>No results found for "{query}"</div>
                <div className="text-xs mt-1">Try searching for health metrics, supplements, or recipes</div>
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
                
                <div className={`${recentSearches.length > 0 ? 'border-t border-border mt-2 pt-2' : ''}`}>
                  <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                    Quick Actions
                  </div>
                  {[
                    { label: 'Log Food', action: () => onNavigate?.('nutrition'), icon: BeakerIcon },
                    { label: 'Ask Smart Coach', action: () => onNavigate?.('coach'), icon: ChatBubbleLeftRightIcon },
                    { label: 'View Health Data', action: () => onNavigate?.('health'), icon: HeartIcon },
                    { label: 'Browse Supplements', action: () => onNavigate?.('supplements'), icon: CubeIcon }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <action.icon className="w-4 h-4 text-blue-light" />
                      <span className="text-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;