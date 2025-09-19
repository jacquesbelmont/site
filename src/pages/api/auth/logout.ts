import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Set-Cookie': 'auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
    }
  });
};