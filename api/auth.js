import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const adminPwd = process.env.ADMIN_PASSWORD;

  if (!adminPwd) {
    return res.status(500).json({ error: 'Server misconfiguration: ADMIN_PASSWORD is missing.' });
  }

  if (!password || password !== adminPwd) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Generate a simple token payload
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = `admin|${expiresAt}`;
  const signature = crypto.createHmac('sha256', adminPwd).update(payload).digest('hex');
  const token = `${payload}|${signature}`;

  // Set the cookie (HttpOnly prevents XSS extraction, SameSite=Strict prevents CSRF)
  const cookieValue = `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
  res.setHeader('Set-Cookie', cookieValue);

  return res.status(200).json({ success: true });
}
