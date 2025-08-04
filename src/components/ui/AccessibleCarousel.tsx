import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

interface CarouselItem {
  id: string;
  content: React.ReactNode;
  title?: string;
  description?: string;
}

interface AccessibleCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  ariaLabel?: string;
  className?: string;
}

const AccessibleCarousel: React.FC<AccessibleCarouselProps> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  ariaLabel = "Content carousel",
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Auto-play functionality with pause on interaction
  useEffect(() => {
    if (isPlaying && !isUserInteracting && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isUserInteracting, items.length, autoPlayInterval]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(items.length - 1);
        break;
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 3000);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % items.length);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Screen reader instructions */}
      <div className="sr-only">
        <p>
          Use arrow keys to navigate slides, spacebar to pause/play auto-advance,
          Home and End keys to jump to first or last slide.
        </p>
      </div>

      {/* Main carousel container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        role="region"
        aria-label={ariaLabel}
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsUserInteracting(true)}
        onMouseLeave={() => setIsUserInteracting(false)}
        onFocus={() => setIsUserInteracting(true)}
        onBlur={() => setIsUserInteracting(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
            role="tabpanel"
            aria-label={`Slide ${currentIndex + 1} of ${items.length}`}
          >
            {items[currentIndex]?.content}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous slide"
              type="button"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next slide"
              type="button"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Play/Pause button */}
        {autoPlay && (
          <button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            type="button"
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2" role="tablist">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted hover:bg-muted-foreground'
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Status indicator for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {items.length}
        {items[currentIndex]?.title && `: ${items[currentIndex].title}`}
        {isPlaying ? '. Auto-advance is on.' : '. Auto-advance is paused.'}
      </div>
    </div>
  );
};

export default AccessibleCarousel;