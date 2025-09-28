import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';
import { verifyToken } from '../../../lib/auth';

export const GET: APIRoute = async ({ url, cookies }) => {
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

    const searchParams = new URL(url).searchParams;
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // If requesting a specific post by ID
    if (id) {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: { select: { name: true } },
          category: true,
          tags: { include: { tag: true } }
        }
      });
      
      if (!post) {
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(post), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status === 'published') where.published = true;
    if (status === 'draft') where.published = false;
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { name: true } },
          category: true,
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
    console.error('Error fetching admin posts:', error);
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
      seoTitle,
      seoDescription,
      seoKeywords,
      readTime,
      publishedAt
    } = data;

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Validate required fields
    if (!title || !categoryId) {
      return new Response(JSON.stringify({ error: 'Title and category are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if slug is unique
    const existingPost = await prisma.post.findUnique({
      where: { slug: finalSlug }
    });
    
    if (existingPost) {
      return new Response(JSON.stringify({ error: 'Slug already exists' }), {
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
        publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
      },
      include: {
        author: { select: { name: true } },
        category: true
      }
    });

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Slug already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
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
    const { id, ...updateData } = data;
    
    // Validate required fields
    if (!updateData.title || !updateData.categoryId) {
      return new Response(JSON.stringify({ error: 'Title and category are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate slug if not provided
    if (!updateData.slug) {
      updateData.slug = updateData.title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if slug is unique (excluding current post)
    const existingPost = await prisma.post.findFirst({
      where: { 
        slug: updateData.slug,
        id: { not: id }
      }
    });
    
    if (existingPost) {
      return new Response(JSON.stringify({ error: 'Slug already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle published date logic
    if (updateData.published) {
      if (updateData.publishedAt) {
        updateData.publishedAt = new Date(updateData.publishedAt);
      } else {
        // Check if post was previously unpublished
        const currentPost = await prisma.post.findUnique({
          where: { id },
          select: { published: true, publishedAt: true }
        });
        
        if (!currentPost?.published) {
          updateData.publishedAt = new Date();
        }
      }
    } else {
      // If unpublishing, keep the original published date
      // updateData.publishedAt = null; // Uncomment if you want to clear the date
    }
    
    // Set SEO defaults
    updateData.seoTitle = updateData.seoTitle || updateData.title;
    updateData.seoDescription = updateData.seoDescription || updateData.excerpt;

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { name: true } },
        category: true
      }
    });

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating post:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Slug already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
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

    const { id } = params;

    await prisma.post.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};