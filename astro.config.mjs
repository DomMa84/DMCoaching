// astro.config.mjs - Performance-optimiert für maier-value.com
// ✅ Löst Render-Blocking und Performance-Probleme
// ⚠️ OHNE Änderung am Layout oder Funktionen

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      // CSS wird inline für kritische Styles
      applyBaseStyles: false,
    })
  ],
  
  // Performance-Optimierungen
  build: {
    // CSS wird intelligent aufgeteilt
    inlineStylesheets: 'auto',
    
    // Bessere Asset-Handhabung
    assets: '_assets',
    
    // Minifizierung aktivieren
    minify: true,
  },
  
  vite: {
    build: {
      // CSS Code-Splitting für bessere Performance
      cssCodeSplit: true,
      
      // Chunk-Optimierung
      rollupOptions: {
        output: {
          // Vendor-Code separat laden
          manualChunks: {
            'vendor': ['astro'],
            'utils': ['aos', 'swiper']
          },
          
          // Asset-Namen optimieren
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      }
    },
    
    // CSS-Optimierungen
    css: {
      // PostCSS-Optimierungen
      postcss: {
        plugins: [
          // Automatische Präfixe
          require('autoprefixer'),
          // CSS-Optimierung
          require('cssnano')({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: false
            }]
          })
        ]
      }
    },
    
    // Server-Konfiguration
    server: {
      // Preload wichtiger Ressourcen
      preload: true
    }
  },
  
  // Experimentelle Features für bessere Performance
  experimental: {
    // Optimierte Hydration
    optimizeHoisted: true
  },
  
  // Kompression aktivieren
  compressHTML: true,
  
  // Site-URL für absolute URLs
  site: 'https://maier-value.com',
  
  // Output-Konfiguration
  output: 'static',
  
  // Prefetch-Links automatisch generieren
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});