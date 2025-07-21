// astro.config.mjs v2.0 (Netlify Server Mode)
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    alpinejs()
  ],
  output: 'server',  // ✅ Server-Modus für Netlify (unterstützt kein hybrid)
  adapter: netlify({
    functionPerRoute: false  // ✅ Alle API-Routes in einer Function für bessere Performance
  })
});