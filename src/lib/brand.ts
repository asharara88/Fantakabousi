// Biowell Brand System - Extracted from Logo Analysis
// Based on the exact Biowell logo colors provided

export const brandColors = {
  // Exact Biowell Brand Colors from Logo
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#48C6FF', // Top Dash - Light Blue
    500: '#48C6FF', // Top Dash - Light Blue
    600: '#2A7FFF', // Middle Dash - Medium Blue
    700: '#2A7FFF', // Middle Dash - Medium Blue
    800: '#0026CC', // Bottom Dash - Deep Blue
    900: '#0026CC', // Bottom Dash - Deep Blue
    950: '#001a99',
  },
  
  // Secondary Blue (Medium Blue from logo)
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#2A7FFF',
    500: '#2A7FFF', // Middle Dash - Medium Blue
    600: '#2A7FFF',
    700: '#0026CC',
    800: '#0026CC',
    900: '#0026CC',
    950: '#001a99',
  },
  
  // Accent Blue (Deep Blue from logo)
  accent: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#0026CC',
    500: '#0026CC', // Bottom Dash - Deep Blue
    600: '#0026CC',
    700: '#0026CC',
    800: '#0026CC',
    900: '#0026CC',
    950: '#001a99',
  },
  
  // Brand Neutrals (black/white from logo)
  neutral: {
    0: '#ffffff',    // Pure white from logo
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
    1000: '#000000', // Pure black from logo
  },
  
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    900: '#14532d',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    900: '#92400e',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    900: '#7f1d1d',
  },
};

// Brand Gradients (matching logo)
export const brandGradients = {
  primary: 'linear-gradient(135deg, #48C6FF 0%, #2A7FFF 100%)',
  secondary: 'linear-gradient(135deg, #2A7FFF 0%, #0026CC 100%)',
  accent: 'linear-gradient(135deg, #48C6FF 0%, #0026CC 100%)',
  hero: 'linear-gradient(135deg, #48C6FF 0%, #2A7FFF 50%, #0026CC 100%)',
  glass: 'linear-gradient(135deg, rgba(72, 198, 255, 0.1) 0%, rgba(42, 127, 255, 0.05) 100%)',
};

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
};

// Spacing System (8px base)
export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
};

// Border Radius System
export const borderRadius = {
  none: '0px',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  full: '9999px',
};

// Shadow System
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
  
  // Brand-specific shadows
  brand: '0 10px 30px rgba(14, 165, 233, 0.3)',
  'brand-lg': '0 20px 40px rgba(14, 165, 233, 0.4)',
  glow: '0 0 20px rgba(14, 165, 233, 0.5)',
  'glow-lg': '0 0 40px rgba(14, 165, 233, 0.6)',
};

// Animation Curves
export const animations = {
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
  },
};

// Breakpoints (Mobile-first)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};