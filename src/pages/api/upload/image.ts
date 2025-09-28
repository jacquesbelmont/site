import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'File must be an image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size must be less than 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For now, we'll use a placeholder service
    // In production, you would integrate with Vercel Blob, Cloudinary, or similar
    
    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `blog-image-${timestamp}.${extension}`;
    
    // For demonstration, we'll return a Pexels URL
    // In production, you would upload to your chosen service
    const imageUrl = `https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=800`;
    
    // TODO: Implement actual file upload to Vercel Blob
    // const blob = await put(filename, file, { access: 'public' });
    // return new Response(JSON.stringify({ url: blob.url }), {
    
    return new Response(JSON.stringify({ 
      url: imageUrl,
      filename,
      size: file.size,
      type: file.type
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};