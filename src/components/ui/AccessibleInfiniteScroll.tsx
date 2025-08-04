import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import { ChevronDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface InfiniteScrollItem {
  id: string;
  content: React.ReactNode;
}

interface AccessibleInfiniteScrollProps {
  items: InfiniteScrollItem[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  error?: string;
  loadMoreThreshold?: number;
  pageSize?: number;
  ariaLabel?: string;
  className?: string;
  enableVirtualization?: boolean;
}

const AccessibleInfiniteScroll: React.FC<AccessibleInfiniteScrollProps> = ({
  items,
  loadMore,
  hasMore,
  loading,
  error,
  loadMoreThreshold = 200,
  pageSize = 10,
  ariaLabel = "Content list",
  className = "",
  enableVirtualization = false
}) => {
  const [manualLoadMode, setManualLoadMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [announceNewItems, setAnnounceNewItems] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const previousItemCount = useRef(items.length);

  // Intersection Observer for automatic loading
  const observerRef = useRef<IntersectionObserver>();

  // Manual load more function
  const handleManualLoadMore = useCallback(async () => {
    if (!loading && hasMore) {
      const previousCount = items.length;
      await loadMore();
      
      // Announce new items to screen readers
      const newItemsCount = items.length - previousCount;
      if (newItemsCount > 0) {
        setAnnounceNewItems(`${newItemsCount} new items loaded. Total: ${items.length} items.`);
        setTimeout(() => setAnnounceNewItems(''), 1000);
      }
    }
  }, [loadMore, loading, hasMore, items.length]);

  // Scroll to top function
  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Set up intersection observer for automatic loading
  useEffect(() => {
    if (!manualLoadMode && loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasMore && !loading) {
            handleManualLoadMore();
          }
        },
        {
          rootMargin: `${loadMoreThreshold}px`,
        }
      );

      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [manualLoadMode, hasMore, loading, handleManualLoadMore, loadMoreThreshold]);

  // Monitor scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setShowBackToTop(scrollTop > 500);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Announce when new items are loaded
  useEffect(() => {
    if (items.length > previousItemCount.current) {
      const newItemsCount = items.length - previousItemCount.current;
      setAnnounceNewItems(`${newItemsCount} new items loaded`);
      previousItemCount.current = items.length;
    }
  }, [items.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Home':
        e.preventDefault();
        scrollToTop();
        break;
      case 'End':
        e.preventDefault();
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-muted/30 rounded-xl">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-foreground">
            {items.length} items loaded
          </span>
          {hasMore && (
            <span className="text-sm text-muted-foreground">
              More available
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={manualLoadMode}
              onChange={(e) => setManualLoadMode(e.target.checked)}
              className="rounded border-border focus:ring-primary"
            />
            <span>Manual loading</span>
          </label>
          
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Scroll to top"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main content container */}
      <div
        ref={containerRef}
        className="max-h-96 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-xl"
        role="region"
        aria-label={ariaLabel}
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Items list */}
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
                tabIndex={0}
                role="article"
                aria-label={`Item ${index + 1} of ${items.length}`}
              >
                {item.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Loading indicator / Load more button */}
        <div className="mt-6 text-center">
          {loading && (
            <div className="flex items-center justify-center space-x-3 py-4">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-muted-foreground">Loading more items...</span>
            </div>
          )}

          {!loading && hasMore && (
            <button
              ref={loadMoreRef}
              onClick={manualLoadMode ? handleManualLoadMore : undefined}
              disabled={loading}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary/20
                ${manualLoadMode
                  ? 'bg-primary text-white hover:bg-primary/80 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-default'
                }
              `}
              aria-label={manualLoadMode ? "Load more items" : "Automatic loading enabled"}
            >
              {manualLoadMode ? (
                <div className="flex items-center space-x-2">
                  <ChevronDownIcon className="w-4 h-4" />
                  <span>Load More</span>
                </div>
              ) : (
                <span>Auto-loading...</span>
              )}
            </button>
          )}

          {!hasMore && items.length > 0 && (
            <div className="py-4 text-sm text-muted-foreground">
              All items loaded ({items.length} total)
            </div>
          )}

          {error && (
            <div className="py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700" role="alert">
                <p className="font-medium">Error loading content</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={handleManualLoadMore}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announceNewItems}
      </div>

      {/* Skip to end button for screen readers */}
      <button
        onClick={() => {
          if (containerRef.current) {
            containerRef.current.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded-lg"
      >
        Skip to end of list
      </button>
    </div>
  );
};

export default AccessibleInfiniteScroll;