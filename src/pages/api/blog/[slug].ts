import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
        comments: {
          where: { approved: true },
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Increment views
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    });

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};