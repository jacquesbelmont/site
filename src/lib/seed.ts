import { prisma } from './database';
import { hashPassword } from './auth';

export async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Create admin user
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@jacquesbelmont.com' }
    });

    if (!adminExists) {
      const hashedPassword = await hashPassword('admin123');
      await prisma.user.create({
        data: {
          email: 'admin@jacquesbelmont.com',
          password: hashedPassword,
          name: 'Jacques Belmont',
          role: 'ADMIN'
        }
      });
      console.log('Admin user created');
    }

    // Create categories
    const categories = [
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Articles about digital marketing strategies and trends' },
      { name: 'SEO', slug: 'seo', description: 'Search Engine Optimization tips and techniques' },
      { name: 'AI & Technology', slug: 'ai-technology', description: 'Artificial Intelligence and technology insights' },
      { name: 'Content Marketing', slug: 'content-marketing', description: 'Content creation and marketing strategies' }
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
    }
    console.log('Categories created');

    // Create tags
    const tags = [
      { name: 'SEO', slug: 'seo' },
      { name: 'Content', slug: 'content' },
      { name: 'AI', slug: 'ai' },
      { name: 'Marketing', slug: 'marketing' },
      { name: 'Strategy', slug: 'strategy' },
      { name: 'Analytics', slug: 'analytics' }
    ];

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag
      });
    }
    console.log('Tags created');

    // Create sample blog posts
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@jacquesbelmont.com' }
    });

    const seoCategory = await prisma.category.findUnique({
      where: { slug: 'seo' }
    });

    if (admin && seoCategory) {
      const samplePosts = [
        {
          title: 'The Future of SEO in 2024',
          slug: 'future-of-seo-2024',
          excerpt: 'Discover the latest SEO trends and strategies that will dominate 2024.',
          content: `<h2>Introduction</h2>
<p>Search Engine Optimization continues to evolve rapidly, and 2024 brings new challenges and opportunities for digital marketers.</p>

<h2>Key Trends for 2024</h2>
<p>Here are the most important SEO trends to watch:</p>

<h3>1. AI-Powered Content Optimization</h3>
<p>Artificial intelligence is revolutionizing how we create and optimize content for search engines.</p>

<h3>2. Core Web Vitals Enhancement</h3>
<p>Page experience signals continue to be crucial ranking factors.</p>

<h3>3. Voice Search Optimization</h3>
<p>With the rise of voice assistants, optimizing for voice search is becoming essential.</p>

<h2>Conclusion</h2>
<p>Staying ahead of these trends will be crucial for SEO success in 2024.</p>`,
          image: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800',
          published: true,
          featured: true,
          authorId: admin.id,
          categoryId: seoCategory.id,
          seoTitle: 'The Future of SEO in 2024 - Complete Guide',
          seoDescription: 'Discover the latest SEO trends and strategies that will dominate 2024. Learn about AI-powered optimization, Core Web Vitals, and voice search.',
          seoKeywords: 'SEO 2024, search engine optimization, AI SEO, voice search, Core Web Vitals',
          readTime: '8 min read',
          publishedAt: new Date()
        },
        {
          title: 'AI Tools for Content Creation',
          slug: 'ai-tools-content-creation',
          excerpt: 'Explore the best AI tools that can revolutionize your content creation process.',
          content: `<h2>The AI Revolution in Content</h2>
<p>Artificial intelligence is transforming how we create, optimize, and distribute content.</p>

<h2>Top AI Tools for Content Creators</h2>
<p>Here are the most effective AI tools for content creation:</p>

<h3>1. GPT-4 for Writing</h3>
<p>Advanced language models can help generate high-quality content at scale.</p>

<h3>2. Jasper AI</h3>
<p>Specialized AI writing assistant for marketing content.</p>

<h3>3. Copy.ai</h3>
<p>AI-powered copywriting tool for various content types.</p>

<h2>Best Practices</h2>
<p>Learn how to effectively integrate AI tools into your content workflow.</p>`,
          image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
          published: true,
          featured: false,
          authorId: admin.id,
          categoryId: seoCategory.id,
          seoTitle: 'Best AI Tools for Content Creation in 2024',
          seoDescription: 'Discover the top AI tools that can revolutionize your content creation process. Complete guide to AI-powered writing and optimization.',
          seoKeywords: 'AI content creation, AI writing tools, GPT-4, Jasper AI, Copy.ai',
          readTime: '6 min read',
          publishedAt: new Date()
        }
      ];

      for (const post of samplePosts) {
        await prisma.post.upsert({
          where: { slug: post.slug },
          update: {},
          create: post
        });
      }
      console.log('Sample blog posts created');
    }

    // Create SEO settings
    await prisma.seoSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        siteTitle: 'Jacques Belmont - Digital Marketing Expert & AI Specialist',
        siteDescription: 'Professional digital marketing consultant specializing in SEO, content strategy, and AI optimization. Based in João Pessoa, Brazil.',
        siteKeywords: 'Jacques Belmont, Digital Marketing, SEO Specialist, Content Strategy, AI Optimization',
        canonicalUrl: 'https://jacquesbelmont.com',
        ogTitle: 'Jacques Belmont - Digital Marketing Expert',
        ogDescription: 'Professional digital marketing consultant specializing in SEO, content strategy, and AI optimization.',
        ogImage: 'https://jacquesbelmont.com/og-image.jpg',
        twitterHandle: '@jacquesbelmont'
      }
    });
    console.log('SEO settings created');

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}