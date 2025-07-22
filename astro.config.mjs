// astro.config.mjs v2.0 (Netlify Server Mode - VOLLSTÄNDIG)
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // ✅ Site URL für SEO und Canonical URLs
  site: 'https://maier-value.com', // WICHTIG: Deine echte Domain hier eintragen!
  
  // ✅ Base für Subfolder-Deployments (falls nötig)
  base: '/',
  
  // ✅ Integrations
  integrations: [
    tailwind({
      // Tailwind Config
      config: {
        applyBaseStyles: false, // Verwende eigene Base Styles
      }
    }),
    alpinejs({
      // Alpine.js Config für bessere Performance
      entrypoint: '/src/entrypoint'
    })
  ],
  
  // ✅ Server-Modus für Netlify (unterstützt kein hybrid)
  output: 'server',
  
  // ✅ Netlify Adapter mit optimierten Einstellungen
  adapter: netlify({
    functionPerRoute: false, // Bessere Performance - alle Routes in einer Function
    dist: new URL('./dist/', import.meta.url), // Output-Verzeichnis
    binaryMediaTypes: [
      // Binäre Dateitypen die korrekt verarbeitet werden sollen
      'image/jpeg',
      'image/png', 
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf',
      'application/zip'
    ]
  }),
  
  // ✅ Build-Optimierungen
  build: {
    // Minify für Production
    assets: '_astro',
    // Server-side rendering
    serverEntry: 'entry.mjs',
    // Client-side hydration
    client: './dist/client/',
    server: './dist/server/'
  },
  
  // ✅ Vite-Konfiguration für bessere Performance
  vite: {
    // Build-Optimierungen
    build: {
      cssMinify: 'lightningcss', // Schnellere CSS-Minifizierung
      rollupOptions: {
        output: {
          // Asset-Namen für besseres Caching
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    // Optimiere Dependencies
    optimizeDeps: {
      include: [
        '@astrojs/alpinejs > alpinejs',
        'aos'
      ]
    },
    // CSS-Verarbeitung
    css: {
      transformer: 'lightningcss'
    }
  },
  
  // ✅ Markdown-Konfiguration (falls du Blog hinzufügst)
  markdown: {
    // Syntax Highlighting
    syntaxHighlight: 'prism',
    // Markdown-Plugins
    remarkPlugins: [],
    rehypePlugins: []
  },
  
  // ✅ Image-Optimierung
  image: {
    // Unterstützte Formate
    formats: ['webp', 'avif', 'jpeg', 'png', 'svg'],
    // Service für Image-Processing
    service: {
      entrypoint: 'astro/assets/services/sharp' // Für bessere Bildqualität
    }
  },
  
  // ✅ Prefetch-Strategie
  prefetch: {
    prefetchAll: false, // Nur bei Hover/Focus
    defaultStrategy: 'hover'
  },
  
  // ✅ Security Headers
  security: {
    checkOrigin: true // CSRF-Schutz für Server-Mode
  },
  
  // ✅ Experimentelle Features
  experimental: {
    contentCollectionCache: true, // Bessere Performance
    serverIslands: true // Für partielle Hydration
  },
  
  // ✅ Legacy Browser Support (optional)
  legacy: {
    astroFlavoredMarkdown: false // Verwende Standard Markdown
  }
});

// ✅ Console Output für Debugging
console.log('🚀 Astro Config v2.0 loaded - Server Mode with Netlify optimization enabled');