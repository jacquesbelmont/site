import type { APIRoute } from 'astro';
import { checkDatabaseHealth } from '../../lib/database';

export const GET: APIRoute = async () => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        api: { status: 'healthy' }
      }
    };

    return new Response(JSON.stringify(health), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        database: { status: 'unhealthy', error: error.message },
        api: { status: 'healthy' }
      }
    };

    return new Response(JSON.stringify(health), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};