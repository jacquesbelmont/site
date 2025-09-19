import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless'; // [!code ++]

// https://astro.build/config
export default defineConfig({
  site: 'https://jacquesbelmont.com',
  output: 'server',
  adapter: vercel(), // [!code ++]
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