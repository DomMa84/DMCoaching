// astro.config.mjs v2.0 (Netlify Server Mode)
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import alpinejs from '@astrojs/alpinejs';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://maier-value.com', // ✅ NUR das hinzufügen für SEO!
  
  integrations: [
    tailwind(),
    alpinejs()
  ],
  output: 'server',
  adapter: netlify({
    functionPerRoute: false
  })
});