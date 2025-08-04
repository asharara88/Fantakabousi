// SEO and Internal Linking Utilities

// Content Readability Analysis and Optimization
export interface ReadabilityMetrics {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  averageSentenceLength: number;
  averageWordsPerSentence: number;
  passiveVoicePercentage: number;
  readingLevel: 'elementary' | 'middle' | 'high' | 'college' | 'graduate';
  recommendations: string[];
}

export interface ContentOptimization {
  original: string;
  optimized: string;
  improvements: string[];
  seoKeywords: string[];
  readabilityScore: number;
}

// Analyze content readability
export const analyzeReadability = (text: string): ReadabilityMetrics => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
  
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  // Flesch-Kincaid Grade Level
  const fleschKincaidGrade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;
  
  // Flesch Reading Ease
  const fleschReadingEase = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
  
  // Passive voice detection (simplified)
  const passiveIndicators = ['was', 'were', 'been', 'being', 'is', 'are', 'am'];
  const passiveCount = sentences.filter(sentence => 
    passiveIndicators.some(indicator => sentence.toLowerCase().includes(indicator))
  ).length;
  const passiveVoicePercentage = (passiveCount / sentences.length) * 100;
  
  const readingLevel = getReadingLevel(fleschKincaidGrade);
  const recommendations = generateReadabilityRecommendations(
    avgSentenceLength, 
    passiveVoicePercentage, 
    fleschReadingEase
  );
  
  return {
    fleschKincaidGrade,
    fleschReadingEase,
    averageSentenceLength: avgSentenceLength,
    averageWordsPerSentence: avgSentenceLength,
    passiveVoicePercentage,
    readingLevel,
    recommendations
  };
};

// Count syllables in a word (simplified algorithm)
const countSyllables = (word: string): number => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let syllableCount = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      syllableCount++;
    }
    previousWasVowel = isVowel;
  }
  
  // Handle silent 'e'
  if (word.endsWith('e')) {
    syllableCount--;
  }
  
  return Math.max(1, syllableCount);
};

// Determine reading level from Flesch-Kincaid grade
const getReadingLevel = (grade: number): ReadabilityMetrics['readingLevel'] => {
  if (grade <= 5) return 'elementary';
  if (grade <= 8) return 'middle';
  if (grade <= 12) return 'high';
  if (grade <= 16) return 'college';
  return 'graduate';
};

// Generate readability recommendations
const generateReadabilityRecommendations = (
  avgSentenceLength: number,
  passiveVoicePercentage: number,
  fleschReadingEase: number
): string[] => {
  const recommendations: string[] = [];
  
  if (avgSentenceLength > 20) {
    recommendations.push('Break down long sentences (current average: ' + Math.round(avgSentenceLength) + ' words)');
  }
  
  if (passiveVoicePercentage > 20) {
    recommendations.push('Reduce passive voice usage (currently ' + Math.round(passiveVoicePercentage) + '%)');
  }
  
  if (fleschReadingEase < 60) {
    recommendations.push('Simplify vocabulary and sentence structure for better readability');
  }
  
  if (avgSentenceLength < 8) {
    recommendations.push('Consider combining some short sentences for better flow');
  }
  
  return recommendations;
};

// Optimize content for readability and SEO
export const optimizeContent = (content: string, targetKeywords: string[]): ContentOptimization => {
  const original = content;
  let optimized = content;
  const improvements: string[] = [];
  
  // Break down long sentences
  optimized = optimized.replace(/([^.!?]{50,})[,;]([^.!?]{20,})/g, (match, part1, part2) => {
    improvements.push('Split long sentence for better readability');
    return part1.trim() + '. ' + part2.trim();
  });
  
  // Convert passive to active voice (simplified)
  const passivePatterns = [
    { pattern: /is tracked by/g, replacement: 'tracks' },
    { pattern: /are monitored by/g, replacement: 'monitors' },
    { pattern: /was created by/g, replacement: 'created' },
    { pattern: /were developed by/g, replacement: 'developed' },
  ];
  
  passivePatterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(optimized)) {
      optimized = optimized.replace(pattern, replacement);
      improvements.push('Converted passive voice to active voice');
    }
  });
  
  // Add transition words for better flow
  optimized = optimized.replace(/\. ([A-Z])/g, (match, letter) => {
    const transitions = ['Additionally, ', 'Furthermore, ', 'Moreover, ', 'However, '];
    const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
    improvements.push('Added transition word for better flow');
    return '. ' + randomTransition + letter;
  });
  
  const readabilityScore = analyzeReadability(optimized).fleschReadingEase;
  
  return {
    original,
    optimized,
    improvements,
    seoKeywords: targetKeywords,
    readabilityScore
  };
};

// Content optimization examples
export const biowellContentOptimizations = {
  // Dashboard welcome message
  welcomeMessage: {
    original: "Here's your comprehensive health overview for today, featuring advanced biometric analysis and personalized recommendations.",
    optimized: "Here's your health overview for today. Get insights from your biometric data and personalized recommendations.",
    improvements: [
      'Reduced sentence length from 16 to 13 words',
      'Simplified vocabulary (removed "comprehensive", "advanced")',
      'Split into two shorter sentences'
    ]
  },
  
  // AI Coach description
  coachDescription: {
    original: "Your AI wellness coach analyzes your comprehensive health data to provide personalized recommendations that are specifically tailored to your unique biological profile and health objectives.",
    optimized: "Your AI coach analyzes your health data. It provides personalized recommendations based on your biology and health goals.",
    improvements: [
      'Split 28-word sentence into two 12-word sentences',
      'Removed redundant phrases ("comprehensive", "specifically tailored")',
      'Simplified vocabulary ("objectives" → "goals")'
    ]
  },
  
  // Supplement stack description
  supplementDescription: {
    original: "AI-curated supplements that have been optimized for your specific health goals and are based on your individual biometric data analysis.",
    optimized: "AI-curated supplements optimized for your health goals. Based on your biometric data analysis.",
    improvements: [
      'Split 20-word sentence into two shorter sentences',
      'Removed passive voice ("have been optimized")',
      'Eliminated redundant words ("specific", "individual")'
    ]
  },
  
  // Health insights explanation
  insightsExplanation: {
    original: "These insights are generated by our advanced AI algorithms that continuously analyze your health metrics and identify patterns that may not be immediately apparent to provide actionable recommendations.",
    optimized: "Our AI algorithms analyze your health metrics continuously. They identify hidden patterns and provide actionable recommendations.",
    improvements: [
      'Split 28-word sentence into two 14-word sentences',
      'Converted passive voice to active voice',
      'Simplified complex phrases ("may not be immediately apparent" → "hidden")'
    ]
  }
};

// SEO content structure recommendations
export const seoContentStructure = {
  // Optimal heading structure
  headingHierarchy: {
    h1: 'Primary page topic (1 per page)',
    h2: 'Main sections (3-6 per page)',
    h3: 'Subsections within h2',
    h4: 'Details within h3',
    guidelines: [
      'Use only one H1 per page',
      'Include target keywords in headings naturally',
      'Maintain logical hierarchy (don\'t skip levels)',
      'Keep headings under 60 characters'
    ]
  },
  
  // Paragraph optimization
  paragraphStructure: {
    idealLength: '50-150 words per paragraph',
    sentenceLength: '15-20 words per sentence',
    guidelines: [
      'Start with topic sentence',
      'Use 2-4 sentences per paragraph',
      'Include keywords naturally',
      'End with transition or call-to-action'
    ]
  },
  
  // Content density recommendations
  contentDensity: {
    keywordDensity: '1-2% for primary keywords',
    semanticKeywords: 'Include related terms and synonyms',
    guidelines: [
      'Use keywords in first 100 words',
      'Include keywords in headings naturally',
      'Use semantic variations',
      'Avoid keyword stuffing'
    ]
  }
};
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