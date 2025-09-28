import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';

export const GET: APIRoute = async () => {
  try {
    // Get comprehensive blog statistics
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalComments,
      totalLikes,
      recentPosts,
      popularPosts,
      categoriesWithCounts
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.post.aggregate({
        _sum: { views: true }
      }),
      prisma.comment.count({ where: { approved: true } }),
      // For now, we'll calculate likes as a placeholder
      Promise.resolve(0),
      prisma.post.findMany({
        where: { published: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.post.findMany({
        where: { published: true },
        include: { category: true },
        orderBy: { views: 'desc' },
        take: 5
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { posts: true } }
        }
      })
    ]);

    const stats = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews: totalViews._sum.views || 0,
      totalComments,
      totalLikes,
      recentPosts,
      popularPosts,
      categories: categoriesWithCounts,
      // Additional metrics
      averageViews: totalPosts > 0 ? Math.round((totalViews._sum.views || 0) / totalPosts) : 0,
      publishRate: totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0
    };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
      totalComments: 0,
      totalLikes: 0
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};