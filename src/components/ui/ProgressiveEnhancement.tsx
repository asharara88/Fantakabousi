import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressiveEnhancementProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  enableAnimations?: boolean;
  enableAdvancedFeatures?: boolean;
  className?: string;
}

// Hook to detect user preferences and capabilities
export const useProgressiveEnhancement = () => {
  const [capabilities, setCapabilities] = useState({
    prefersReducedMotion: false,
    supportsIntersectionObserver: false,
    supportsWebGL: false,
    isHighPerformance: true,
    connectionSpeed: 'fast' as 'slow' | 'fast' | 'unknown',
    supportsHover: true,
    screenSize: 'desktop' as 'mobile' | 'tablet' | 'desktop',
  });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check for intersection observer support
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const supportsWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    
    // Estimate performance based on hardware concurrency and memory
    const isHighPerformance = navigator.hardwareConcurrency >= 4 && 
      (navigator as any).deviceMemory >= 4;
    
    // Check connection speed
    const connection = (navigator as any).connection;
    let connectionSpeed: 'slow' | 'fast' | 'unknown' = 'unknown';
    if (connection) {
      if (connection.effectiveType === '4g' || connection.downlink > 10) {
        connectionSpeed = 'fast';
      } else if (connection.effectiveType === '3g' || connection.downlink < 1.5) {
        connectionSpeed = 'slow';
      }
    }
    
    // Check for hover support
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    
    // Determine screen size
    const screenSize = window.innerWidth < 768 ? 'mobile' : 
                      window.innerWidth < 1024 ? 'tablet' : 'desktop';

    setCapabilities({
      prefersReducedMotion,
      supportsIntersectionObserver,
      supportsWebGL,
      isHighPerformance,
      connectionSpeed,
      supportsHover,
      screenSize,
    });
  }, []);

  return capabilities;
};

// Progressive enhancement wrapper component
const ProgressiveEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  children,
  fallback,
  enableAnimations = true,
  enableAdvancedFeatures = true,
  className = ""
}) => {
  const capabilities = useProgressiveEnhancement();
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    // Determine if we should enable enhancements
    const shouldEnhance = 
      capabilities.isHighPerformance &&
      capabilities.connectionSpeed !== 'slow' &&
      !capabilities.prefersReducedMotion;
    
    setIsEnhanced(shouldEnhance && enableAdvancedFeatures);
  }, [capabilities, enableAdvancedFeatures]);

  // Render appropriate version based on capabilities
  if (!isEnhanced && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  // Enhanced version with conditional features
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        // Pass capability flags to child components
        prefersReducedMotion: capabilities.prefersReducedMotion,
        supportsHover: capabilities.supportsHover,
        isHighPerformance: capabilities.isHighPerformance,
        enableAnimations: enableAnimations && !capabilities.prefersReducedMotion,
      });
    }
    return child;
  });

  return (
    <div className={className} data-enhanced={isEnhanced}>
      {enhancedChildren}
    </div>
  );
};

// Enhanced motion wrapper that respects user preferences
export const AccessibleMotion: React.FC<{
  children: React.ReactNode;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  prefersReducedMotion?: boolean;
  className?: string;
}> = ({
  children,
  initial,
  animate,
  exit,
  transition,
  prefersReducedMotion = false,
  className = ""
}) => {
  if (prefersReducedMotion) {
    // Return static version for users who prefer reduced motion
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Accessible image component with progressive loading
export const AccessibleImage: React.FC<{
  src: string;
  alt: string;
  lowQualitySrc?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}> = ({
  src,
  alt,
  lowQualitySrc,
  className = "",
  loading = 'lazy',
  sizes,
  onLoad,
  onError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const capabilities = useProgressiveEnhancement();

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Use low quality image for slow connections
  const imageSrc = capabilities.connectionSpeed === 'slow' && lowQualitySrc ? lowQualitySrc : src;

  if (imageError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default ProgressiveEnhancement;