import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/database';
import { verifyPassword, generateToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find admin user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate session token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Store session in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.adminSession.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': `admin-token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict; Secure`
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};