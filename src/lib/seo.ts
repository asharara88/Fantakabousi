// SEO and Internal Linking Utilities

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  breadcrumbs: BreadcrumbItem[];
  relatedPages: RelatedPage[];
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
}

export interface RelatedPage {
  title: string;
  description: string;
  href: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  keywords: string[];
}

// Internal linking strategy configuration
export const internalLinkingConfig = {
  // Key pages that should receive more internal links
  priorityPages: [
    '/dashboard',
    '/coach',
    '/health',
    '/supplements',
    '/profile',
  ],
  
  // Anchor text variations for key pages
  anchorTextVariations: {
    '/dashboard': [
      'health dashboard',
      'wellness overview',
      'biometric summary',
      'daily metrics',
      'health insights',
    ],
    '/coach': [
      'wellness coach',
      'personalized guidance',
      'health coaching',
      'Coach recommendations',
      'smart health advice',
    ],
    '/health': [
      'health analytics',
      'biometric tracking',
      'health trends',
      'wellness metrics',
      'health monitoring',
    ],
    '/supplements': [
      'supplement stack',
      'personalized supplements',
      'wellness products',
      'health supplements',
      'curated supplements',
    ],
    '/profile': [
      'profile settings',
      'account preferences',
      'personal information',
      'user profile',
      'health profile',
    ],
  },
  
  // Contextual linking rules
  contextualLinks: {
    healthMetrics: [
      { text: 'AI coach insights', href: '/coach', context: 'metrics analysis' },
      { text: 'supplement recommendations', href: '/supplements', context: 'optimization' },
      { text: 'detailed health trends', href: '/health', context: 'data exploration' },
    ],
    supplements: [
      { text: 'health dashboard', href: '/dashboard', context: 'tracking progress' },
      { text: 'AI coaching', href: '/coach', context: 'personalized guidance' },
      { text: 'biometric analysis', href: '/health', context: 'data-driven decisions' },
    ],
    coaching: [
      { text: 'health metrics', href: '/health', context: 'data analysis' },
      { text: 'supplement stack', href: '/supplements', context: 'optimization' },
      { text: 'wellness dashboard', href: '/dashboard', context: 'overview' },
    ],
  },
};

// Generate page metadata
export const generatePageMetadata = (pageId: string): PageMetadata => {
  const metadataMap: Record<string, PageMetadata> = {
    dashboard: {
      title: 'Health Dashboard - Biowell AI Wellness Platform',
      description: 'Monitor your health metrics, track wellness progress, and get AI-powered insights on your personalized dashboard.',
      keywords: ['health dashboard', 'wellness tracking', 'biometric monitoring', 'AI health insights'],
      canonicalUrl: '/dashboard',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboard' },
      ],
      relatedPages: [
        {
          title: 'AI Wellness Coach',
          description: 'Get personalized health guidance from your AI coach',
          href: '/coach',
          category: 'Coaching',
          priority: 'high',
          keywords: ['AI coach', 'personalized guidance', 'health advice'],
        },
        {
          title: 'Health Analytics',
          description: 'Deep dive into your biometric trends and patterns',
          href: '/health',
          category: 'Analytics',
          priority: 'high',
          keywords: ['health analytics', 'biometric trends', 'data analysis'],
        },
      ],
    },
    coach: {
      title: 'AI Wellness Coach - Personalized Health Guidance | Biowell',
      description: 'Chat with your AI wellness coach for personalized health recommendations, supplement advice, and lifestyle optimization.',
      keywords: ['AI wellness coach', 'personalized health', 'health guidance', 'AI recommendations'],
      canonicalUrl: '/coach',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'AI Coach', href: '/coach' },
      ],
      relatedPages: [
        {
          title: 'Health Dashboard',
          description: 'View your comprehensive health metrics and progress',
          href: '/dashboard',
          category: 'Overview',
          priority: 'high',
          keywords: ['health dashboard', 'metrics', 'progress tracking'],
        },
        {
          title: 'Supplement Stack',
          description: 'Explore AI-curated supplements for your health goals',
          href: '/supplements',
          category: 'Products',
          priority: 'medium',
          keywords: ['supplements', 'personalized stack', 'health products'],
        },
      ],
    },
    health: {
      title: 'Health Analytics - Biometric Tracking & Trends | Biowell',
      description: 'Analyze your health trends, track biometric data, and discover patterns in your wellness journey with advanced analytics.',
      keywords: ['health analytics', 'biometric tracking', 'health trends', 'wellness data'],
      canonicalUrl: '/health',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Health Analytics', href: '/health' },
      ],
      relatedPages: [
        {
          title: 'AI Wellness Coach',
          description: 'Get insights and recommendations based on your health data',
          href: '/coach',
          category: 'Coaching',
          priority: 'high',
          keywords: ['AI coach', 'health insights', 'data-driven advice'],
        },
        {
          title: 'Wellness Dashboard',
          description: 'Quick overview of your current health status',
          href: '/dashboard',
          category: 'Overview',
          priority: 'medium',
          keywords: ['dashboard', 'health overview', 'quick metrics'],
        },
      ],
    },
    supplements: {
      title: 'Supplement Stack - AI-Curated Health Products | Biowell',
      description: 'Discover personalized supplement recommendations based on your health data, goals, and AI analysis.',
      keywords: ['supplement stack', 'personalized supplements', 'AI recommendations', 'health products'],
      canonicalUrl: '/supplements',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Supplement Stack', href: '/supplements' },
      ],
      relatedPages: [
        {
          title: 'AI Wellness Coach',
          description: 'Get personalized supplement guidance from your AI coach',
          href: '/coach',
          category: 'Coaching',
          priority: 'high',
          keywords: ['AI coach', 'supplement advice', 'personalized guidance'],
        },
        {
          title: 'Health Analytics',
          description: 'See how supplements impact your health metrics',
          href: '/health',
          category: 'Analytics',
          priority: 'medium',
          keywords: ['health tracking', 'supplement effects', 'biometric analysis'],
        },
      ],
    },
    profile: {
      title: 'Profile Settings - Manage Your Biowell Account',
      description: 'Manage your profile, health preferences, privacy settings, and account information on Biowell.',
      keywords: ['profile settings', 'account management', 'health preferences', 'privacy'],
      canonicalUrl: '/profile',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Profile', href: '/profile' },
      ],
      relatedPages: [
        {
          title: 'Health Dashboard',
          description: 'Return to your personalized health overview',
          href: '/dashboard',
          category: 'Overview',
          priority: 'medium',
          keywords: ['dashboard', 'health overview', 'metrics'],
        },
        {
          title: 'AI Wellness Coach',
          description: 'Update your health goals with your AI coach',
          href: '/coach',
          category: 'Coaching',
          priority: 'low',
          keywords: ['AI coach', 'health goals', 'personalization'],
        },
      ],
    },
  };

  return metadataMap[pageId] || metadataMap.dashboard;
};

// URL structure utilities
export const urlStructure = {
  // Clean URL patterns
  patterns: {
    dashboard: '/dashboard',
    coach: '/coach',
    health: '/health/:category?/:timeframe?',
    supplements: '/supplements/:category?',
    profile: '/profile/:section?',
  },
  
  // Generate clean URLs
  generateUrl: (page: string, params?: Record<string, string>) => {
    let url = urlStructure.patterns[page as keyof typeof urlStructure.patterns] || '/';
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}?`, value).replace(`:${key}`, value);
      });
    }
    
    // Remove unused optional parameters
    url = url.replace(/\/:[^/]*\?/g, '');
    
    return url;
  },
};

// Link attributes best practices
export const linkAttributes = {
  internal: {
    // Standard internal link attributes
    default: {},
    
    // High-priority internal links
    priority: {
      'data-priority': 'high',
      'data-prefetch': 'true',
    },
    
    // Navigation links
    navigation: {
      'data-nav': 'true',
      'data-prefetch': 'true',
    },
  },
  
  external: {
    // External links
    default: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    
    // External links with nofollow
    nofollow: {
      target: '_blank',
      rel: 'noopener noreferrer nofollow',
    },
    
    // Sponsored/affiliate links
    sponsored: {
      target: '_blank',
      rel: 'noopener noreferrer sponsored',
    },
  },
};

// Analytics tracking for internal links
export const trackInternalLink = (href: string, text: string, context?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'internal_link_click', {
      event_category: 'navigation',
      event_label: href,
      custom_parameter_1: text,
      custom_parameter_2: context || 'general',
    });
  }
};

// Generate contextual internal links
export const generateContextualLinks = (currentPage: string, content: string) => {
  const links: Array<{ text: string; href: string; context: string }> = [];
  
  // Health metrics context
  if (content.includes('health') || content.includes('metrics') || content.includes('biometric')) {
    if (currentPage !== '/health') {
      links.push({
        text: 'detailed health analytics',
        href: '/health',
        context: 'health metrics mentioned',
      });
    }
    if (currentPage !== '/dashboard') {
      links.push({
        text: 'wellness dashboard',
        href: '/dashboard',
        context: 'metrics overview',
      });
    }
  }
  
  // AI/coaching context
  if (content.includes('AI') || content.includes('coach') || content.includes('recommendation')) {
    if (currentPage !== '/coach') {
      links.push({
        text: 'AI wellness coach',
        href: '/coach',
        context: 'AI guidance mentioned',
      });
    }
  }
  
  // Supplement context
  if (content.includes('supplement') || content.includes('nutrition') || content.includes('vitamin')) {
    if (currentPage !== '/supplements') {
      links.push({
        text: 'personalized supplement stack',
        href: '/supplements',
        context: 'supplements mentioned',
      });
    }
  }
  
  return links;
};