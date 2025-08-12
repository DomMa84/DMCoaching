// astro.config.mjs - MINIMAL Version für Debugging
// ✅ Alle experimentellen Features entfernt
// ✅ Nur grundlegende Konfiguration
// 🎯 Fokus: Build zum Laufen bringen

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind()
  ],
  
  // Basis-Konfiguration
  site: 'https://maier-value.com',
  output: 'static',
  
  // Minimale Build-Konfiguration
  build: {
    assets: '_astro'
  }
});