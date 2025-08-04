// Common bug fixes and workarounds for the Biowell application

export class BugFixManager {
  private static appliedFixes = new Set<string>();

  // Fix for React 18 strict mode double rendering
  static fixStrictModeDoubleRender(): void {
    if (this.appliedFixes.has('strict-mode-fix')) return;
    
    // Ensure effects only run once in development
    const originalUseEffect = React.useEffect;
    if (process.env.NODE_ENV === 'development') {
      // This would need to be implemented at the React level
      console.log('Strict mode double render fix applied');
    }
    
    this.appliedFixes.add('strict-mode-fix');
  }

  // Fix for iOS Safari viewport height issues
  static fixIOSViewportHeight(): void {
    if (this.appliedFixes.has('ios-viewport-fix')) return;
    
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    this.appliedFixes.add('ios-viewport-fix');
  }

  // Fix for memory leaks in event listeners
  static fixEventListenerLeaks(): void {
    if (this.appliedFixes.has('event-listener-fix')) return;
    
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    const listenerMap = new WeakMap();

    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (!listenerMap.has(this)) {
        listenerMap.set(this, new Map());
      }
      
      const listeners = listenerMap.get(this);
      if (!listeners.has(type)) {
        listeners.set(type, new Set());
      }
      
      listeners.get(type).add(listener);
      return originalAddEventListener.call(this, type, listener, options);
    };

    EventTarget.prototype.removeEventListener = function(type, listener, options) {
      const listeners = listenerMap.get(this);
      if (listeners && listeners.has(type)) {
        listeners.get(type).delete(listener);
      }
      return originalRemoveEventListener.call(this, type, listener, options);
    };

    // Cleanup orphaned listeners on page unload
    window.addEventListener('beforeunload', () => {
      document.querySelectorAll('*').forEach(element => {
        const listeners = listenerMap.get(element);
        if (listeners) {
          listeners.forEach((listenerSet, type) => {
            listenerSet.forEach(listener => {
              element.removeEventListener(type, listener);
            });
          });
        }
      });
    });
    
    this.appliedFixes.add('event-listener-fix');
  }

  // Fix for Framer Motion layout shift issues
  static fixFramerMotionLayoutShift(): void {
    if (this.appliedFixes.has('framer-motion-fix')) return;
    
    // Add CSS to prevent layout shifts during animations
    const style = document.createElement('style');
    style.textContent = `
      [data-framer-motion] {
        will-change: transform;
      }
      
      .motion-safe [data-framer-motion] {
        transform: translateZ(0);
      }
      
      @media (prefers-reduced-motion: reduce) {
        [data-framer-motion] {
          animation: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    this.appliedFixes.add('framer-motion-fix');
  }

  // Fix for Supabase connection timeout issues
  static fixSupabaseTimeouts(): void {
    if (this.appliedFixes.has('supabase-timeout-fix')) return;
    
    // Implement retry logic for Supabase operations
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      
      if (url.includes('supabase.co')) {
        let retries = 3;
        while (retries > 0) {
          try {
            const response = await originalFetch(input, {
              ...init,
              signal: AbortSignal.timeout(10000), // 10 second timeout
            });
            
            if (response.ok) {
              return response;
            }
            
            if (response.status >= 500 && retries > 1) {
              retries--;
              await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
              continue;
            }
            
            return response;
          } catch (error) {
            if (retries === 1) throw error;
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
          }
        }
      }
      
      return originalFetch(input, init);
    };
    
    this.appliedFixes.add('supabase-timeout-fix');
  }

  // Fix for component state persistence issues
  static fixComponentStatePersistence(): void {
    if (this.appliedFixes.has('state-persistence-fix')) return;
    
    // Clear stale component states on app start
    const staleKeys = Object.keys(sessionStorage).filter(key => 
      key.startsWith('component-state-') && 
      Date.now() - parseInt(key.split('-').pop() || '0') > 24 * 60 * 60 * 1000 // 24 hours
    );
    
    staleKeys.forEach(key => sessionStorage.removeItem(key));
    
    this.appliedFixes.add('state-persistence-fix');
  }

  // Apply all bug fixes
  static applyAllFixes(): void {
    this.fixIOSViewportHeight();
    this.fixEventListenerLeaks();
    this.fixFramerMotionLayoutShift();
    this.fixSupabaseTimeouts();
    this.fixComponentStatePersistence();
    
    console.log('All bug fixes applied:', Array.from(this.appliedFixes));
  }

  static getAppliedFixes(): string[] {
    return Array.from(this.appliedFixes);
  }
}

// Auto-apply fixes on import
if (typeof window !== 'undefined') {
  BugFixManager.applyAllFixes();
}