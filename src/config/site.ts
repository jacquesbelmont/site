// Site Configuration - Centralized settings
export const SITE_CONFIG = {
  // Basic Info
  name: 'Jacques Belmont',
  title: 'Jacques Belmont - Digital Marketing Expert & AI Specialist',
  description: 'Professional digital marketing consultant specializing in SEO, content strategy, and AI optimization. Based in João Pessoa, Brazil.',
  url: 'https://jacquesbelmont.com',
  image: '/og-image.jpg',
  
  // Contact Info
  contact: {
    email: 'contact@jacquesbelmont.com',
    phone: '+55 (83) 9 9999-9999',
    location: 'João Pessoa, Paraíba, Brazil',
    linkedin: 'https://linkedin.com/in/jacquesbelmont',
    youtube: 'https://youtube.com/@jacquesbelmont',
    github: 'https://github.com/jacquesbelmont',
    twitter: 'https://twitter.com/jacquesbelmont',
  },
  
  // SEO & Analytics
  seo: {
    keywords: [
      'Jacques Belmont',
      'Digital Marketing',
      'SEO Specialist',
      'Content Strategy',
      'AI Optimization',
      'João Pessoa Marketing',
      'Paraíba SEO',
      'Marketing Digital Brasil'
    ],
    author: 'Jacques Belmont',
    robots: 'index, follow',
    googleSiteVerification: 'your-google-verification-code',
    bingSiteVerification: 'your-bing-verification-code',
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with your GA4 ID
    googleTagManagerId: 'GTM-XXXXXXX', // Replace with your GTM ID
    hotjarId: 'XXXXXXX', // Replace with your Hotjar ID
    clarityId: 'XXXXXXXX', // Replace with your Microsoft Clarity ID
  },
  
  // Social Media
  social: {
    twitterHandle: '@jacquesbelmont',
    facebookAppId: 'your-facebook-app-id',
  },
  
  // Languages
  languages: {
    default: 'en',
    supported: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'zh-cn', name: '中文', flag: '🇨🇳' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'pt', name: 'Português', flag: '🇧🇷' },
    ]
  },
  
  // Schema.org structured data
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jacques Belmont',
    jobTitle: 'Digital Marketing Expert & AI Specialist',
    description: 'Professional digital marketing consultant specializing in SEO, content strategy, and AI optimization.',
    url: 'https://jacquesbelmont.com',
    sameAs: [
      'https://linkedin.com/in/jacquesbelmont',
      'https://youtube.com/@jacquesbelmont',
      'https://github.com/jacquesbelmont',
      'https://twitter.com/jacquesbelmont',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'João Pessoa',
      addressRegion: 'Paraíba',
      addressCountry: 'BR'
    },
    email: 'contact@jacquesbelmont.com',
    telephone: '+55 (83) 9 9999-9999',
  }
};

// Feature flags for easy toggling
export const FEATURES = {
  blog: true,
  portfolio: false,
  membersArea: true,
  ecommerce: false,
  newsletter: true,
  contactForm: true,
  darkMode: false,
  animations: true,
  lazyLoading: true,
};

// Performance settings
export const PERFORMANCE = {
  enableServiceWorker: true,
  enableImageOptimization: true,
  enableMinification: true,
  enableGzip: true,
  cacheMaxAge: 31536000, // 1 year in seconds
};