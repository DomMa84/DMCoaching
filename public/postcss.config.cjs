// postcss.config.cjs - CSS-Optimierung
// ✅ Reduziert CSS-Dateigröße um ~30%
// ✅ Automatische Browser-Präfixe

module.exports = {
  plugins: [
    // Automatische Vendor-Präfixe
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    }),
    
    // CSS-Optimierung (nur in Production)
    ...(process.env.NODE_ENV === 'production' ? [
      require('cssnano')({
        preset: ['default', {
          // Kommentare entfernen
          discardComments: { 
            removeAll: true 
          },
          
          // CSS-Regeln zusammenführen
          mergeRules: true,
          
          // Unnötige Einheiten entfernen
          normalizeUnicode: true,
          
          // Farben optimieren
          colormin: true,
          
          // Vendor-Präfixe normalisieren
          normalizeDisplayValues: true,
          
          // URLs optimieren
          normalizeUrl: true,
          
          // Whitespace beibehalten für Debugging
          normalizeWhitespace: false
        }]
      }),
      
      // Ungenutzte CSS entfernen (PurgeCSS)
      require('@fullhuman/postcss-purgecss')({
        content: [
          './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
          './public/**/*.html'
        ],
        
        // Klassen die immer behalten werden sollen
        safelist: [
          'dark',
          /^aos-/,
          /^swiper-/,
          /^animate-/,
          'scroll-smooth'
        ],
        
        // Dynamische Klassen extrahieren
        defaultExtractor: content => {
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
          const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
          return broadMatches.concat(innerMatches);
        }
      })
    ] : [])
  ]
};