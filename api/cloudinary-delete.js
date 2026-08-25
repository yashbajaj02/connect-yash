import crypto from 'crypto';

function verifySession(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;

  const token = match[1];
  const parts = token.split('|');
  if (parts.length !== 3) return false;

  const [role, expiresAt, signature] = parts;

  if (role !== 'admin' || !expiresAt || !signature) return false;
  if (Date.now() > parseInt(expiresAt, 10)) return false;

  const adminPwd = process.env.ADMIN_PASSWORD;
  if (!adminPwd) return false;

  const expectedSignature = crypto
    .createHmac('sha256', adminPwd)
    .update(`${role}|${expiresAt}`)
    .digest('hex');

  return signature === expectedSignature;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require admin auth
  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session.' });
  }

  const { publicId } = req.body || {};
  if (!publicId || typeof publicId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid publicId.' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary server configuration missing.' });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
  
  try {
    const response = await fetch(destroyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        public_id: publicId,
        api_key: apiKey,
        timestamp: timestamp.toString(),
        signature: signature,
      }).toString(),
    });

    const data = await response.json();
    if (data.result === 'ok') {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: data.error?.message || 'Failed to delete image.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error during Cloudinary communication.' });
  }
}
