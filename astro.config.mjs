// astro.config.mjs v2.1 (Netlify Server Mode - Balanced & Error-Free)
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // ✅ Site URL für SEO und Canonical URLs
  site: 'https://maier-value.com', // WICHTIG: Deine echte Domain hier eintragen!
  
  // ✅ Integrations
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false // Verwende eigene Base Styles
      }
    }),
    alpinejs()
  ],
  
  // ✅ Server-Modus für Netlify
  output: 'server',
  
  // ✅ Netlify Adapter mit optimierten Einstellungen
  adapter: netlify({
    functionPerRoute: false, // Bessere Performance
    binaryMediaTypes: [
      'image/jpeg',
      'image/png', 
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf'
    ]
  }),
  
  // ✅ Build-Optimierungen
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto' // Automatisches CSS Inlining
  },
  
  // ✅ Vite-Konfiguration für Performance
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild', // Schnellere Minifizierung
      rollupOptions: {
        output: {
          // Besseres Caching durch Hashes
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    // CSS-Optimierung
    css: {
      devSourcemap: true // Nur für Development
    },
    // Dependency-Optimierung
    optimizeDeps: {
      include: ['alpinejs']
    }
  },
  
  // ✅ Image-Service für bessere Bildqualität
  image: {
    formats: ['webp', 'avif', 'jpeg', 'png'],
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  
  // ✅ Prefetch-Strategie
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },
  
  // ✅ Markdown-Konfiguration (für eventuelle Blog-Posts)
  markdown: {
    syntaxHighlight: 'prism',
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  },
  
  // ✅ Sicherheit
  security: {
    checkOrigin: true
  }
});

console.log('🚀 Astro Config v2.1 loaded - Balanced performance & error-free!');