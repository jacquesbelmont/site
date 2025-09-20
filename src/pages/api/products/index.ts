import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const type = searchParams.get('type');

    const where: any = { active: true };

    if (category) {
      where.category = category.toUpperCase();
    }

    if (featured) {
      where.featured = true;
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};