import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';
import { verifyToken } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
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

    // Get dashboard statistics
    const [
      totalPosts,
      publishedPosts,
      totalMembers,
      activeMembers,
      totalVideos,
      totalProducts,
      totalOrders,
      recentContacts,
      recentPosts,
      popularPosts
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.member.count(),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.video.count({ where: { published: true } }),
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.contact.findMany({
        where: { read: false },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.post.findMany({
        include: { category: true, author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { views: 'desc' },
        take: 5,
        include: { category: true }
      })
    ]);

    const stats = {
      posts: {
        total: totalPosts,
        published: publishedPosts,
        draft: totalPosts - publishedPosts
      },
      members: {
        total: totalMembers,
        active: activeMembers,
        inactive: totalMembers - activeMembers
      },
      content: {
        videos: totalVideos,
        products: totalProducts,
        orders: totalOrders
      },
      recent: {
        contacts: recentContacts,
        posts: recentPosts,
        popular: popularPosts
      }
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};