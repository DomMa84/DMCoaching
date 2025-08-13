// astro.config.mjs v2.0 - Server Mode + Contact Form Fix
// CHANGELOG v2.0:
// - ✅ CHANGE: output: 'static' → 'server' (API Routes funktionieren)
// - ✅ NEW: Netlify Adapter hinzugefügt
// - ✅ KEEP: Tailwind Integration
// - ✅ FIX: Contact Form wird wieder funktional

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [
    tailwind()
  ],
  
  // ✅ SERVER MODE: API Routes funktionieren wieder
  output: 'server',
  adapter: netlify(),
  
  // Site-Konfiguration
  site: 'https://maier-value.com',
  
  // Build-Konfiguration
  build: {
    assets: '_astro'
  },
  
  // Server-Konfiguration für Netlify
  server: {
    port: 3000,
    host: true
  }
});

console.log('🚀 Astro Config v2.0 - Server Mode + Contact Form Fix aktiviert');
