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

  // 1. Authenticate via HttpOnly cookie
  if (!verifySession(req)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session.' });
  }

  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  // 2. Strict Project Validation
  const { projects } = req.body;

  if (!Array.isArray(projects)) {
    return res.status(400).json({ error: 'Validation Error: projects must be an array' });
  }

  if (projects.length > 100) {
    return res.status(400).json({ error: 'Validation Error: Too many projects' });
  }

  for (const p of projects) {
    if (typeof p !== 'object' || p === null) {
      return res.status(400).json({ error: 'Validation Error: Project must be an object' });
    }
    if (typeof p.id !== 'string' || p.id.length > 100) return res.status(400).json({ error: 'Invalid id' });
    if (typeof p.title !== 'string' || p.title.length > 200) return res.status(400).json({ error: 'Invalid title' });
    if (typeof p.description !== 'string' || p.description.length > 2000) return res.status(400).json({ error: 'Invalid description' });
    if (typeof p.thumbnail_url !== 'string' || p.thumbnail_url.length > 500) return res.status(400).json({ error: 'Invalid thumbnail_url' });
    if (typeof p.live_link !== 'string' || p.live_link.length > 500) return res.status(400).json({ error: 'Invalid live_link' });
    if (typeof p.github_link !== 'string' || p.github_link.length > 500) return res.status(400).json({ error: 'Invalid github_link' });
    if (typeof p.featured !== 'boolean') return res.status(400).json({ error: 'Invalid featured flag' });
    if (typeof p.category !== 'string' || p.category.length > 100) return res.status(400).json({ error: 'Invalid category' });
    if (typeof p.display_order !== 'number') return res.status(400).json({ error: 'Invalid display_order' });
    if (!Array.isArray(p.tech_stack)) return res.status(400).json({ error: 'Invalid tech_stack array' });
    for (const tech of p.tech_stack) {
      if (typeof tech !== 'string' || tech.length > 100) return res.status(400).json({ error: 'Invalid tech_stack item' });
    }
  }

  // 3. Update GitHub
  const token = process.env.GITHUB_PAT;
  if (!token) {
    return res.status(500).json({ error: 'Server misconfiguration: GITHUB_PAT is missing.' });
  }

  const owner = 'yashbajaj02';
  const repo = 'connect-yash';
  const path = 'src/data/projects.ts';

  try {
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!getRes.ok) {
      return res.status(500).json({ error: 'Failed to contact GitHub API' }); // Obscure internal API errors
    }

    const fileData = await getRes.json();
    const sha = fileData.sha;

    const newContent = `import { Project } from '../types';\n\nexport const projects: Project[] = ${JSON.stringify(projects, null, 2)};\n`;
    const base64Content = Buffer.from(newContent).toString('base64');

    const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Admin Panel: Updated projects data',
        content: base64Content,
        sha,
      }),
    });

    if (!updateRes.ok) {
      return res.status(500).json({ error: 'Failed to write to GitHub API' }); // Obscure internal API errors
    }

    return res.status(200).json({ success: true, message: 'Projects successfully saved. Vercel is now building the site!' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error during GitHub communication' }); // Safe error message
  }
}
