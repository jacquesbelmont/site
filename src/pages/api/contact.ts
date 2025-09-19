import type { APIRoute } from 'astro';
import { prisma } from '../../lib/database';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message
      }
    });

    // Here you could add email notification logic
    // await sendEmailNotification(contact);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};