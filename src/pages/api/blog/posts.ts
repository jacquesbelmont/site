import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';
import { verifyToken } from '../../../lib/auth';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const published = searchParams.get('published') !== 'false';

    const skip = (page - 1) * limit;

    const where: any = { published };

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { slug: tag }
        }
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { name: true, email: true } },
          category: true,
          tags: { include: { tag: true } },
          _count: { select: { comments: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    return new Response(JSON.stringify({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get('admin-token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      image,
      published = false,
      featured = false,
      categoryId,
      tags = [],
      seoTitle,
      seoDescription,
      seoKeywords,
      readTime
    } = data;

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure category exists
    if (!categoryId) {
      return new Response(JSON.stringify({ error: 'Category is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        image,
        published,
        featured,
        authorId: user.id,
        categoryId,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
        seoKeywords,
        readTime,
        publishedAt: published ? new Date() : null,
      },
      include: {
        author: { select: { name: true, email: true } },
        category: true,
        tags: { include: { tag: true } }
      }
    });

    // Add tags if provided
    if (tags.length > 0) {
      await prisma.postTag.createMany({
        data: tags.map((tagId: string) => ({
          postId: post.id,
          tagId
        }))
      });
    }

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};