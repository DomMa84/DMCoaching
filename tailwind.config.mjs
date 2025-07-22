/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ✅ FIXED: Korrigierte Farbnamen für Komponenten-Kompatibilität
        'primary-gold': '#D2AE6C',
        'primary-dark': '#B8941A',
        
        // Light Mode Colors (mit korrekten Namen)
        'light': '#f8fafc',
        'light-darker': '#f1f5f9', 
        'light-darkest': '#e2e8f0',
        
        // Dark Mode Colors
        'dark': '#0f172a',
        'dark-lighter': '#1e293b',
        'dark-lightest': '#334155',
        
        // Text Colors (mit korrekten Namen)
        'text-dark': '#1e293b',
        'text-light': '#f8fafc',
        'text-muted': '#64748b',
        
        // Legacy Support für bestehende Komponenten
        primary: {
          gold: '#D2AE6C',
          DEFAULT: '#D2AE6C',
          light: '#E6C665',
          dark: '#B8941A',
        }
      },
      fontFamily: {
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
        'heading': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s infinite'
      }
    },
  },
  plugins: [],
  // ✅ WICHTIG: Safelist für dynamische Klassen
  safelist: [
    // Text Colors
    'text-text-dark',
    'text-text-light', 
    'text-text-muted',
    'text-primary-gold',
    
    // Background Colors
    'bg-light',
    'bg-light-darker',
    'bg-light-darkest',
    'bg-dark',
    'bg-dark-lighter',
    'bg-dark-lightest',
    'bg-primary-gold',
    'bg-primary-gold/10',
    'bg-primary-gold/20',
    
    // Border Colors
    'border-light-darkest',
    'border-dark-lightest', 
    'border-primary-gold',
    'border-primary-gold/20',
    'border-primary-gold/30',
    
    // Hover States
    'hover:text-primary-gold',
    'hover:bg-primary-gold',
    'hover:bg-primary-dark',
    'hover:border-primary-gold',
    
    // Focus States
    'focus:border-primary-gold',
    'focus:ring-primary-gold',
    
    // Dark Mode Variants
    'dark:text-text-light',
    'dark:bg-dark',
    'dark:bg-dark-lighter',
    'dark:bg-dark-lightest',
    'dark:border-dark-lightest',
    'dark:hover:bg-gray-700',
    'dark:hover:bg-gray-800',
    
    // State Colors
    'text-red-600',
    'text-green-600',
    'bg-red-50',
    'bg-green-50',
    'border-red-500',
    'border-green-500',
  ]
}