// Vercel serverless function to proxy ImgBB uploads
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, name } = req.body;

    console.log('Upload request received:', { 
      hasImage: !!image, 
      imageLength: image?.length,
      imageSample: image?.substring(0, 50) + '...',
      name 
    });

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
    
    if (!IMGBB_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Create form data for ImgBB API
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', image);
    if (name) {
      formData.append('name', name.replace(/[^a-zA-Z0-9.-]/g, ''));
    }

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ImgBB API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return res.status(200).json({
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url
      });
    } else {
      throw new Error('ImgBB upload failed: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
}