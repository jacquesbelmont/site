import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://jacquesbelmont.com',
  output: 'server', // [!code ++]
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwind(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        es: 'es',
        'zh-cn': 'zh-CN',
        ar: 'ar',
        pt: 'pt',
      },
    }
  })],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "zh-cn", "ar", "pt"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});