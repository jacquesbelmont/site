import { SITE_CONFIG } from '../config/site';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEOTags(data: SEOData) {
  const {
    title = SITE_CONFIG.title,
    description = SITE_CONFIG.description,
    keywords = SITE_CONFIG.seo.keywords,
    image = SITE_CONFIG.image,
    url = SITE_CONFIG.url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author = SITE_CONFIG.seo.author,
    section,
    tags = []
  } = data;

  const seoTags = {
    // Basic Meta Tags
    title,
    description,
    keywords: keywords.join(', '),
    author,
    robots: SITE_CONFIG.seo.robots,
    canonical: url,

    // Open Graph
    ogType: type,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    ogSiteName: SITE_CONFIG.name,

    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterSite: SITE_CONFIG.social.twitterHandle,
    twitterCreator: SITE_CONFIG.social.twitterHandle,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,

    // Article specific (for blog posts)
    ...(type === 'article' && {
      articlePublishedTime: publishedTime,
      articleModifiedTime: modifiedTime,
      articleAuthor: author,
      articleSection: section,
      articleTags: tags
    })
  };

  return seoTags;
}

export function generateStructuredData(type: 'article' | 'website' | 'person' | 'organization', data: any) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'BlogPosting' : type === 'website' ? 'WebSite' : type === 'person' ? 'Person' : 'Organization'
  };

  switch (type) {
    case 'article':
      return {
        ...baseSchema,
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Person',
          name: data.author || SITE_CONFIG.seo.author
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.url}/logo.png`
          }
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        }
      };

    case 'website':
      return {
        ...baseSchema,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };

    case 'person':
      return SITE_CONFIG.schema;

    default:
      return baseSchema;
  }
}

export function optimizeImageForSEO(imageUrl: string, alt: string, width?: number, height?: number) {
  return {
    src: imageUrl,
    alt,
    width,
    height,
    loading: 'lazy' as const,
    decoding: 'async' as const
  };
}

export function generateBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: 'Home', url: '/' }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    breadcrumbs.push({
      name,
      url: currentPath
    });
  });

  return breadcrumbs;
}

export function generateSitemap(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_CONFIG.url}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}