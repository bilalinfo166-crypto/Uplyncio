// Unified Auth API - handles signup, login, verify
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ridafwpazwqjhimecyyl.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SB_KEY;

function headers() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
}

async function dbQuery(endpoint, method = 'GET', body = null, extra = {}) {
  const opts = { method, headers: { ...headers(), ...extra } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, opts);
  const text = await r.text();
  try { return { ok: r.ok, status: r.status, data: JSON.parse(text) }; }
  catch { return { ok: r.ok, status: r.status, data: text }; }
}

// Simple password hash (for demo - in production use bcrypt)
async function hashPassword(pass) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pass + 'uplyncio_salt_2026');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, password, name, role, code } = req.body || {};

  try {
    // ── SIGNUP ──
    if (action === 'signup') {
      if (!email || !password || !name || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user exists
      const existing = await dbQuery(`users?email=eq.${encodeURIComponent(email)}&select=id`);
      if (existing.data?.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const hash = await hashPassword(password);
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const isTeam = email.toLowerCase() === 'info@uplyncio.com';

      const newUser = {
        email: email.toLowerCase(),
        name,
        role,
        password_hash: hash,
        verified: isTeam,
        email_verified: isTeam,
        publisher_verified: isTeam,
      };

      const result = await dbQuery('users', 'POST', newUser, { 'Prefer': 'return=representation' });
      if (!result.ok) return res.status(500).json({ error: 'Failed to create user', detail: result.data });

      const user = Array.isArray(result.data) ? result.data[0] : result.data;

      // Send verification email
      if (!isTeam) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Uplyncio <onboarding@resend.dev>',
            to: [email],
            subject: `Your Uplyncio verification code: ${verifyCode}`,
            html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#f8faff;border-radius:16px">
              <h2 style="color:#1a202c">Verify your Uplyncio account</h2>
              <p style="color:#64748b">Enter this code to verify your email:</p>
              <div style="font-size:36px;font-weight:800;color:#4f7cff;letter-spacing:8px;padding:20px;background:#fff;border-radius:12px;text-align:center;margin:20px 0">${verifyCode}</div>
              <p style="color:#94a3b8;font-size:13px">Code expires in 10 minutes.</p>
            </div>`
          })
        });
        // Store code temporarily (in production use Redis/DB)
        await dbQuery('users', 'PATCH', { password_hash: hash + '|CODE:' + verifyCode }, { 'Prefer': 'return=minimal' });
        // Update with code
        await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
          method: 'PATCH',
          headers: { ...headers(), 'Prefer': 'return=minimal' },
          body: JSON.stringify({ password_hash: hash + '|CODE:' + verifyCode })
        });
      }

      return res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, verified: isTeam, email_verified: isTeam, publisher_verified: isTeam }
      });
    }

    // ── VERIFY EMAIL ──
    if (action === 'verify') {
      if (!email || !code) return res.status(400).json({ error: 'Missing email or code' });

      const existing = await dbQuery(`users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id,password_hash,name,role`);
      if (!existing.data?.length) return res.status(404).json({ error: 'User not found' });

      const user = existing.data[0];
      const parts = (user.password_hash || '').split('|CODE:');
      const storedCode = parts[1];

      if (storedCode !== code) return res.status(400).json({ error: 'Invalid code' });

      // Mark verified, clean up code
      await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
        method: 'PATCH',
        headers: { ...headers(), 'Prefer': 'return=minimal' },
        body: JSON.stringify({ verified: true, email_verified: true, password_hash: parts[0] })
      });

      return res.status(200).json({
        success: true,
        user: { id: user.id, email, name: user.name, role: user.role, verified: true, email_verified: true }
      });
    }

    // ── LOGIN ──
    if (action === 'login') {
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

      const existing = await dbQuery(`users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=*`);
      if (!existing.data?.length) return res.status(401).json({ error: 'Invalid email or password' });

      const user = existing.data[0];
      const hash = await hashPassword(password);
      const storedHash = (user.password_hash || '').split('|CODE:')[0];

      if (storedHash !== hash) return res.status(401).json({ error: 'Invalid email or password' });
      if (!user.email_verified && user.email !== 'info@uplyncio.com') {
        return res.status(403).json({ error: 'Please verify your email first', needsVerify: true });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id, email: user.email, name: user.name, role: user.role,
          verified: user.verified, email_verified: user.email_verified,
          publisher_verified: user.publisher_verified
        }
      });
    }

    // ── SYNC USER (upsert) ──
    if (action === 'sync_user') {
      const { id, email, name, role, verified } = req.body;
      if (!email) return res.status(400).json({ error: 'Missing email' });

      // Check if user exists by email
      const existing = await fetch(
        `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id`,
        { headers: headers() }
      );
      const existingData = await existing.json();

      if (existingData?.length > 0) {
        // Update existing user
        const userId = existingData[0].id;
        await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
          method: 'PATCH',
          headers: { ...headers(), 'Prefer': 'return=minimal' },
          body: JSON.stringify({ name, verified: true, email_verified: true, updated_at: new Date().toISOString() })
        });
        return res.status(200).json({ success: true, userId });
      } else {
        // Insert new user
        const isTeam = email.toLowerCase() === 'info@uplyncio.com';
        const newUser = {
          email: email.toLowerCase(), name, role: role || 'publisher',
          verified: true, email_verified: true,
          publisher_verified: isTeam,
          password_hash: 'local_auth_' + Date.now()
        };
        const r = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
          method: 'POST',
          headers: { ...headers(), 'Prefer': 'return=representation' },
          body: JSON.stringify(newUser)
        });
        const data = await r.json();
        const user = Array.isArray(data) ? data[0] : data;
        return res.status(200).json({ success: true, userId: user?.id });
      }
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
