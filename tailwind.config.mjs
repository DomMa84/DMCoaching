/** 
 * tailwind.config.mjs v2.5.0 - NOTFALL REPARATUR
 * =================================================================
 * CHANGELOG:
 * v2.5.0 - NOTFALL: Minimale Konfiguration für sofortige Funktionalität
 * v2.3.1 - Emergency Safelist Fix
 * =================================================================
 * @type {import('tailwindcss').Config} 
 */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html'
  ],
  
  darkMode: 'class',
  
  theme: {
    extend: {
      // ✅ NOTFALL: Minimale Gold Farben
      colors: {
        'gold': '#D2AE6C',
        'gold-dark': '#B8941A',
        'gold-light': '#F3E5AB',
        
        // ✅ Einfache Graustufen
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
          900: '#111827'
        }
      },
      
      // ✅ NOTFALL: Font Familie
      fontFamily: {
        'sans': ['Montserrat', 'system-ui', '-apple-system', 'sans-serif']
      },
      
      // ✅ NOTFALL: Container
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      
      // ✅ NOTFALL: Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  
  plugins: [],
  
  // ✅ NOTFALL: Reduzierter Safelist - nur kritische Klassen
  safelist: [
    // Text Farben
    'text-white', 'text-black', 'text-gold', 'text-gray-100', 'text-gray-200', 
    'text-gray-300', 'text-gray-400', 'text-gray-500', 'text-gray-600', 
    'text-gray-700', 'text-gray-800', 'text-gray-900',
    
    // Background Farben
    'bg-white', 'bg-gold', 'bg-gold-dark', 'bg-gray-50', 'bg-gray-100', 
    'bg-gray-200', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
    
    // Background Opacity
    'bg-opacity-10', 'bg-opacity-20', 'bg-opacity-30', 'bg-opacity-40',
    
    // Hover States
    'hover:text-gold', 'hover:bg-gold', 'hover:bg-gold-dark', 'hover:underline',
    'hover:transform', 'hover:scale-105',
    
    // Dark Mode
    'dark:text-white', 'dark:text-gray-100', 'dark:text-gray-200', 
    'dark:bg-gray-700', 'dark:bg-gray-800', 'dark:bg-gray-900',
    
    // Layout
    'container', 'mx-auto', 'px-4', 'py-8', 'py-12', 'py-16',
    'flex', 'grid', 'items-center', 'justify-center', 'justify-between',
    'grid-cols-1', 'grid-cols-2', 'grid-cols-4', 'gap-4', 'gap-5', 'gap-8',
    
    // Responsive Grid
    'sm:grid-cols-2', 'lg:grid-cols-2', 'lg:grid-cols-4',
    
    // Typography
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-semibold', 'font-bold', 'text-center', 'leading-tight',
    
    // Responsive Typography
    'md:text-3xl', 'md:text-4xl', 'lg:text-5xl',
    
    // Spacing
    'p-4', 'p-5', 'p-6', 'mb-4', 'mb-6', 'mb-8', 'mb-12',
    
    // Responsive Spacing
    'md:p-6', 'md:p-8', 'md:mb-6', 'md:mb-8', 'md:mb-12', 'md:py-16',
    
    // Dimensions
    'w-full', 'h-full', 'min-h-screen', 'max-w-3xl',
    
    // Position
    'relative', 'absolute', 'inset-0', 'z-10',
    
    // Border & Radius
    'rounded-lg', 'rounded-full', 'border', 'border-y', 'border-gold',
    
    // Shadows
    'shadow-xl',
    
    // Transitions
    'transition-transform',
    
    // Flex Direction
    'flex-col',
    
    // Gradients
    'bg-gradient-to-br', 'from-gray-800', 'to-gray-900'
  ]
}

/* 
 * =================================================================
 * END tailwind.config.mjs v2.5.0 - NOTFALL REPARATUR
 * Build Date: 2025-01-22
 * Status: Minimale funktionsfähige Konfiguration
 * =================================================================
 */