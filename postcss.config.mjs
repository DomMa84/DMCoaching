// postcss.config.mjs - GEFIXT für Netlify ESM-Kompatibilität
// ✅ Alle require() durch import ersetzt
// ✅ CSS-Optimierung beibehalten

export default {
  plugins: {
    // Automatische Vendor-Präfixe
    'autoprefixer': {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    },
    
    // CSS-Optimierung nur in Production
    ...(process.env.NODE_ENV === 'production' && {
      'cssnano': {
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
      }
    })
  }
};