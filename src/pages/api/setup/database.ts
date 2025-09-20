import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';
import { seedDatabase } from '../../../lib/seed';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'check':
        // Check database connection and tables
        const tables = await prisma.$queryRaw`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `;
        
        return new Response(JSON.stringify({
          success: true,
          connected: true,
          tables: tables
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'seed':
        // Run database seed
        await seedDatabase();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Database seeded successfully'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      case 'reset':
        // Reset and seed database (use with caution)
        await prisma.$executeRaw`TRUNCATE TABLE "posts", "categories", "tags", "post_tags", "users", "members", "contacts", "videos", "products", "orders", "order_items", "seo_settings", "admin_sessions" RESTART IDENTITY CASCADE`;
        await seedDatabase();
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Database reset and seeded successfully'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      default:
        return new Response(JSON.stringify({
          error: 'Invalid action'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Database setup error:', error);
    return new Response(JSON.stringify({
      error: 'Database setup failed',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};