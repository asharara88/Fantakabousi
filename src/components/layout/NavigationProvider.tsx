import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigationState {
  activeTab: string;
  previousTab: string;
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  isSearchOpen: boolean;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface NavigationContextType {
  state: NavigationState;
  setActiveTab: (tab: string) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>({
    activeTab: 'dashboard',
    previousTab: '',
    breadcrumbs: [],
    searchQuery: '',
    isSearchOpen: false,
  });

  const setActiveTab = (tab: string) => {
    setState(prev => ({
      ...prev,
      previousTab: prev.activeTab,
      activeTab: tab,
    }));
  };

  const addBreadcrumb = (item: BreadcrumbItem) => {
    setState(prev => ({
      ...prev,
      breadcrumbs: [...prev.breadcrumbs, item],
    }));
  };

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    setState(prev => ({
      ...prev,
      breadcrumbs: items,
    }));
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
    }));
  };

  const setSearchOpen = (open: boolean) => {
    setState(prev => ({
      ...prev,
      isSearchOpen: open,
    }));
  };

  const goBack = () => {
    if (state.previousTab) {
      setActiveTab(state.previousTab);
    }
  };

  const canGoBack = Boolean(state.previousTab);

  // Analytics tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: state.activeTab,
        page_location: window.location.href,
      });
    }
  }, [state.activeTab]);

  const value = {
    state,
    setActiveTab,
    addBreadcrumb,
    setBreadcrumbs,
    setSearchQuery,
    setSearchOpen,
    goBack,
    canGoBack,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};