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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require admin auth
  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session.' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: 'Cloudinary server configuration missing.' });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = req.query.folder || 'portfolio-projects';

  const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  res.status(200).json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}
