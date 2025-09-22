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
    const plan = searchParams.get('plan');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // If requesting a specific member by ID
    if (id) {
      const member = await prisma.member.findUnique({
        where: { id }
      });
      
      if (!member) {
        return new Response(JSON.stringify({ error: 'Member not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(member), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const skip = (page - 1) * limit;
    const where: any = {};

    if (plan) where.plan = plan.toUpperCase();
    if (status) where.status = status.toUpperCase();
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.member.count({ where })
    ]);

    return new Response(JSON.stringify({
      members,
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
    console.error('Error fetching members:', error);
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
      name,
      email,
      plan,
      status = 'ACTIVE',
      expiresAt
    } = data;

    const member = await prisma.member.create({
      data: {
        name,
        email,
        plan: plan.toUpperCase(),
        status: status.toUpperCase(),
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return new Response(JSON.stringify(member), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating member:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
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

    if (updateData.plan) {
      updateData.plan = updateData.plan.toUpperCase();
    }

    if (updateData.status) {
      updateData.status = updateData.status.toUpperCase();
    }

    if (updateData.expiresAt) {
      updateData.expiresAt = new Date(updateData.expiresAt);
    }

    const member = await prisma.member.update({
      where: { id },
      data: updateData
    });

    return new Response(JSON.stringify(member), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
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

    const { id } = await request.json();

    await prisma.member.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};