/** 
 * tailwind.config.js v2.3.0
 * =================================================================
 * CHANGELOG:
 * v2.3.0 - COMPLETE SAFELIST & TEXT VISIBILITY FIX
 * - Massive safelist expansion for all dynamic classes
 * - Simplified color system with gold/dark/light
 * - Performance optimizations
 * - Complete component compatibility
 * 
 * v2.2.0 - Enhanced Color System
 * v2.1.0 - Dark Mode Integration  
 * v2.0.0 - Professional Tailwind Setup
 * =================================================================
 * @type {import('tailwindcss').Config} 
 */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
    './components/**/*.{astro,html,js,jsx,ts,tsx,vue}',
    './layouts/**/*.{astro,html,js,jsx,ts,tsx,vue}',
    './pages/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'
  ],
  
  darkMode: 'class', // Class-based dark mode
  
  theme: {
    extend: {
      // ✅ SIMPLIFIED COLOR SYSTEM v2.3.0
      colors: {
        // ===============================
        // GOLD SYSTEM - Hauptfarben
        // ===============================
        'gold': '#D2AE6C',           // Hauptfarbe
        'gold-dark': '#B8941A',      // Hover/Active
        'gold-light': '#F3E5AB',     // Dark Mode Variant
        
        // ===============================
        // SIMPLIFIED BACKGROUND SYSTEM
        // ===============================
        'light': '#ffffff',          // Weißer Hintergrund
        'light-gray': '#f9fafb',     // Sehr heller Grau
        'light-gray-dark': '#f3f4f6', // Heller Grau
        
        'dark': '#111827',           // Dunkler Hintergrund
        'dark-light': '#1f2937',     // Heller Dunkler Hintergrund
        'dark-lighter': '#374151',   // Hellster Dunkler Hintergrund
        
        // ===============================
        // TEXT COLOR SYSTEM
        // ===============================
        'text': {
          'primary': '#111827',      // Haupttext Light Mode
          'secondary': '#374151',    // Sekundärtext Light Mode
          'muted': '#6b7280',        // Gedämpfter Text Light Mode
          'light': '#f9fafb',        // Haupttext Dark Mode
          'light-muted': '#d1d5db'   // Gedämpfter Text Dark Mode
        },
        
        // ===============================
        // LEGACY SUPPORT - Kompatibilität
        // ===============================
        'primary-gold': '#D2AE6C',   // Backward compatibility
        'primary-dark': '#B8941A',   // Backward compatibility
        
        // ===============================
        // ENHANCED PRIMARY SCALE
        // ===============================
        primary: {
          50: '#fefce8',
          100: '#fef9c3', 
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#D2AE6C',            // Main gold
          600: '#B8941A',            // Dark gold
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
          DEFAULT: '#D2AE6C',
          gold: '#D2AE6C',           // Alias
          dark: '#B8941A'            // Alias
        },
        
        // ===============================
        // ENHANCED GRAY SCALE
        // ===============================
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        
        // ===============================
        // SEMANTIC COLORS
        // ===============================
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      
      // ===============================
      // TYPOGRAPHY SYSTEM v2.3.0
      // ===============================
      fontFamily: {
        'sans': ['Montserrat', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Montserrat', 'system-ui', 'sans-serif'],
        'mono': ['Monaco', 'Menlo', 'Liberation Mono', 'Courier New', 'monospace']
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }]
      },
      
      // ===============================
      // SPACING & LAYOUT v2.3.0
      // ===============================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
        'header': '80px',
        'nav': '4rem',
        'section': '6rem'
      },
      
      // ===============================
      // ENHANCED ANIMATIONS v2.3.0
      // ===============================
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(210, 174, 108, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(210, 174, 108, 0.6)' }
        }
      },
      
      // ===============================
      // ENHANCED SHADOWS v2.3.0
      // ===============================
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 60px -15px rgba(0, 0, 0, 0.3)',
        'xl-soft': '0 20px 80px -20px rgba(0, 0, 0, 0.3)',
        'gold': '0 4px 14px 0 rgba(210, 174, 108, 0.3)',
        'gold-lg': '0 10px 30px -5px rgba(210, 174, 108, 0.4)',
        'gold-xl': '0 20px 60px -10px rgba(210, 174, 108, 0.5)',
        'dark': '0 4px 14px 0 rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
      },
      
      // ===============================
      // ENHANCED BORDER RADIUS v2.3.0
      // ===============================
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      
      // ===============================
      // BACKDROP BLUR & FILTERS
      // ===============================
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px'
      },
      
      // ===============================
      // CUSTOM GRADIENTS
      // ===============================
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D2AE6C 0%, #B8941A 100%)',
        'gold-gradient-soft': 'linear-gradient(135deg, #F3E5AB 0%, #D2AE6C 100%)',
        'dark-gradient': 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(31, 41, 55, 0.8) 100%)'
      },
      
      // ===============================
      // RESPONSIVE BREAKPOINTS
      // ===============================
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px'
      },
      
      // ===============================
      // Z-INDEX SCALE
      // ===============================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    },
  },
  
  plugins: [],
  
  // ✅ OPTIMIZED SAFELIST v2.3.0 - Wichtigste Klassen
  safelist: [
    // =================================================================
    // CORE TEXT COLORS - Häufig verwendet
    // =================================================================
    'text-gold',
    'text-gold-dark',
    'text-gold-light',
    'text-primary-gold',
    'text-primary-dark',
    'text-primary',
    'text-text-primary',
    'text-text-secondary',
    'text-text-muted',
    'text-text-light',
    'text-text-light-muted',
    'text-gray-50',
    'text-gray-100',
    'text-gray-200',
    'text-gray-300',
    'text-gray-400',
    'text-gray-500',
    'text-gray-600',
    'text-gray-700',
    'text-gray-800',
    'text-gray-900',
    'text-white',
    'text-black',
    
    // =================================================================
    // CORE BACKGROUND COLORS - Häufig verwendet
    // =================================================================
    'bg-gold',
    'bg-gold-dark',
    'bg-gold-light',
    'bg-primary-gold',
    'bg-primary-dark',
    'bg-primary',
    'bg-light',
    'bg-light-gray',
    'bg-light-gray-dark',
    'bg-dark',
    'bg-dark-light',
    'bg-dark-lighter',
    'bg-white',
    'bg-black',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-gray-300',
    'bg-gray-400',
    'bg-gray-500',
    'bg-gray-600',
    'bg-gray-700',
    'bg-gray-800',
    'bg-gray-900',
    'bg-transparent',
    
    // Opacity Variants
    'bg-gold/10',
    'bg-gold/20',
    'bg-gold/30',
    'bg-gold/50',
    'bg-gold/80',
    'bg-gold/90',
    'bg-white/10',
    'bg-white/20',
    'bg-white/30',
    'bg-white/80',
    'bg-white/90',
    'bg-black/10',
    'bg-black/20',
    'bg-black/30',
    'bg-black/50',
    'bg-black/80',
    
    // =================================================================
    // CORE BORDER COLORS
    // =================================================================
    'border-gold',
    'border-gold-dark',
    'border-primary-gold',
    'border-primary-dark',
    'border-gray-200',
    'border-gray-300',
    'border-gray-400',
    'border-gray-500',
    'border-gray-600',
    'border-gray-700',
    'border-white',
    'border-transparent',
    
    // =================================================================
    // HOVER STATES - Wichtigste
    // =================================================================
    'hover:text-gold',
    'hover:text-gold-dark',
    'hover:text-primary-gold',
    'hover:text-white',
    'hover:text-gray-600',
    'hover:text-gray-700',
    'hover:text-gray-800',
    'hover:bg-gold',
    'hover:bg-gold-dark',
    'hover:bg-primary-gold',
    'hover:bg-primary-dark',
    'hover:bg-gray-50',
    'hover:bg-gray-100',
    'hover:bg-gray-200',
    'hover:bg-gray-600',
    'hover:bg-gray-700',
    'hover:bg-gray-800',
    'hover:border-gold',
    'hover:border-gold-dark',
    'hover:border-primary-gold',
    
    // =================================================================
    // FOCUS STATES
    // =================================================================
    'focus:border-gold',
    'focus:border-primary-gold',
    'focus:ring-gold',
    'focus:ring-primary-gold',
    'focus:ring-2',
    'focus:ring-4',
    'focus:outline-none',
    'focus:ring-gold/20',
    'focus:ring-gold/30',
    
    // =================================================================
    // DARK MODE VARIANTS - Wichtigste
    // =================================================================
    'dark:text-gold',
    'dark:text-gold-light',
    'dark:text-primary-gold',
    'dark:text-text-light',
    'dark:text-text-light-muted',
    'dark:text-white',
    'dark:text-gray-100',
    'dark:text-gray-200',
    'dark:text-gray-300',
    'dark:bg-dark',
    'dark:bg-dark-light',
    'dark:bg-dark-lighter',
    'dark:bg-gray-700',
    'dark:bg-gray-800',
    'dark:bg-gray-900',
    'dark:border-dark-lighter',
    'dark:border-gray-600',
    'dark:border-gray-700',
    'dark:hover:bg-gray-600',
    'dark:hover:bg-gray-700',
    'dark:hover:bg-gray-800',
    'dark:hover:text-gold',
    'dark:hover:text-white',
    
    // =================================================================
    // LAYOUT & SPACING - Häufig verwendet
    // =================================================================
    'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12',
    'px-0', 'px-2', 'px-4', 'px-6', 'px-8', 'px-12',
    'py-0', 'py-2', 'py-4', 'py-6', 'py-8', 'py-12',
    'm-0', 'm-2', 'm-4', 'm-6', 'm-8', 'mx-auto', 'my-4', 'my-6', 'my-8',
    'gap-2', 'gap-4', 'gap-6', 'gap-8',
    
    // =================================================================
    // DISPLAY & FLEXBOX - Häufig verwendet
    // =================================================================
    'block',
    'inline-block',
    'flex',
    'inline-flex',
    'grid',
    'hidden',
    'relative',
    'absolute',
    'fixed',
    'sticky',
    'flex-row',
    'flex-col',
    'items-center',
    'items-start',
    'items-end',
    'justify-center',
    'justify-between',
    'justify-around',
    'flex-wrap',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    
    // =================================================================
    // WIDTH & HEIGHT - Häufig verwendet
    // =================================================================
    'w-full',
    'w-auto',
    'w-1/2',
    'w-1/3',
    'w-2/3',
    'w-1/4',
    'w-3/4',
    'h-full',
    'h-auto',
    'h-screen',
    'min-h-screen',
    'max-w-sm',
    'max-w-md',
    'max-w-lg',
    'max-w-xl',
    'max-w-2xl',
    'max-w-4xl',
    'max-w-6xl',
    
    // =================================================================
    // TYPOGRAPHY - Häufig verwendet
    // =================================================================
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'font-normal',
    'font-medium',
    'font-semibold',
    'font-bold',
    'text-left',
    'text-center',
    'text-right',
    'leading-relaxed',
    'leading-tight',
    
    // =================================================================
    // BORDERS & RADIUS - Häufig verwendet
    // =================================================================
    'rounded',
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-full',
    'border',
    'border-2',
    'border-0',
    
    // =================================================================
    // SHADOWS - Häufig verwendet
    // =================================================================
    'shadow-none',
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'shadow-soft',
    'shadow-medium',
    'shadow-large',
    'shadow-gold',
    'shadow-gold-lg',
    
    // =================================================================
    // TRANSITIONS & ANIMATIONS
    // =================================================================
    'transition-all',
    'transition-colors',
    'transition-transform',
    'transition-opacity',
    'duration-200',
    'duration-300',
    'ease-in-out',
    'animate-pulse',
    'animate-bounce',
    'animate-fade-in',
    'animate-slide-up',
    'transform',
    'hover:scale-105',
    'hover:scale-110',
    
    // =================================================================
    // OPACITY & VISIBILITY
    // =================================================================
    'opacity-0',
    'opacity-50',
    'opacity-75',
    'opacity-100',
    'visible',
    'invisible',
    
    // =================================================================
    // RESPONSIVE PREFIXES - Wichtigste
    // =================================================================
    'sm:block', 'sm:hidden', 'sm:flex', 'sm:grid',
    'sm:text-sm', 'sm:text-base', 'sm:text-lg', 'sm:text-xl',
    'sm:p-4', 'sm:p-6', 'sm:px-6', 'sm:py-4',
    'sm:w-full', 'sm:w-1/2', 'sm:max-w-md',
    'sm:grid-cols-2', 'sm:gap-4', 'sm:gap-6',
    
    'md:block', 'md:hidden', 'md:flex', 'md:grid',
    'md:text-lg', 'md:text-xl', 'md:text-2xl',
    'md:p-6', 'md:p-8', 'md:px-8', 'md:py-6',
    'md:w-1/2', 'md:w-1/3', 'md:w-2/3', 'md:max-w-lg', 'md:max-w-xl',
    'md:grid-cols-2', 'md:grid-cols-3', 'md:gap-6', 'md:gap-8',
    
    'lg:block', 'lg:flex', 'lg:grid',
    'lg:text-xl', 'lg:text-2xl', 'lg:text-3xl',
    'lg:p-8', 'lg:p-12', 'lg:px-12', 'lg:py-8',
    'lg:w-1/3', 'lg:w-2/3', 'lg:max-w-xl', 'lg:max-w-2xl', 'lg:max-w-4xl',
    'lg:grid-cols-3', 'lg:grid-cols-4', 'lg:gap-8', 'lg:gap-12',
    
    'xl:text-2xl', 'xl:text-3xl', 'xl:text-4xl',
    'xl:p-12', 'xl:p-16', 'xl:max-w-4xl', 'xl:max-w-6xl',
    'xl:grid-cols-4', 'xl:gap-12',
    
    // =================================================================
    // COMPONENT PATTERNS - Custom Classes
    // =================================================================
    'btn-primary',
    'btn-secondary',
    'card',
    'form-input',
    'form-label',
    'section',
    'section-title',
    'container',
    'text-primary',
    'text-heading',
    'text-body',
    'bg-card',
    'text-visible',
    'bg-visible',
    'text-muted',
    'force-contrast',
    'loading',
    'fade-in',
    'text-responsive',
    'heading-responsive',
    
    // =================================================================
    // SEMANTIC COLORS - Status
    // =================================================================
    'text-red-500',
    'text-red-600',
    'text-green-500',
    'text-green-600',
    'text-yellow-500',
    'text-blue-500',
    'bg-red-50',
    'bg-red-100',
    'bg-red-500',
    'bg-green-50',
    'bg-green-100',
    'bg-green-500',
    'bg-yellow-50',
    'bg-yellow-100',
    'bg-blue-50',
    'bg-blue-100',
    'border-red-300',
    'border-red-500',
    'border-green-300',
    'border-green-500',
    
    // =================================================================
    // UTILITY COMBINATIONS - Häufige Muster
    // =================================================================
    'flex items-center',
    'flex items-center justify-center',
    'flex items-center justify-between',
    'flex flex-col items-center',
    'grid place-items-center',
    'absolute inset-0',
    'w-full h-full',
    'min-h-screen flex flex-col',
    'container mx-auto px-4',
    'transition-all duration-200',
    'bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-white',
    'border border-gray-200 dark:border-gray-700'
  ]
}

/* 
 * =================================================================
 * END tailwind.config.js v2.3.0 - Dominik Maier Coaching & Interim Management
 * Build Date: 2025-01-22
 * Features: Optimized Safelist, Text Visibility Fix, Performance Optimized
 * =================================================================
 */