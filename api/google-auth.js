// Google OAuth Handler
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SUPABASE_URL = 'https://ridafwpazwqjhimecyyl.supabase.co';

function sbHeaders() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SB_KEY;
  return { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' };
}

async function sbGet(table, filter) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=*`, { headers: sbHeaders() });
  return r.json();
}

async function sbInsert(table, data) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...sbHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  });
  const text = await r.text();
  try { return { ok: r.ok, data: JSON.parse(text) }; }
  catch { return { ok: false, data: text }; }
}

async function sbUpdate(table, filter, data) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: { ...sbHeaders(), 'Prefer': 'return=minimal' },
    body: JSON.stringify(data)
  });
  return r.ok;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const query = req.method === 'GET' ? req.query : (req.body || {});
  const { code, state, action } = query;

  const host = req.headers.host || 'uplyncio.vercel.app';
  const BASE = host.includes('uplyncio.com') ? 'https://uplyncio.com' : 'https://uplyncio.vercel.app';
  const REDIRECT_URI = `${BASE}/api/google-auth`;

  // ── Step 1: Frontend calls this to get Google OAuth URL ──
  if (req.method === 'POST' || action === 'get_url') {
    const role = req.body?.role || 'buyer';
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state: role,
      access_type: 'offline',
      prompt: 'select_account'
    });
    return res.status(200).json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  }

  // ── Step 2: Google redirects back here with code ──
  if (code) {
    try {
      const role = state || 'buyer';

      // Exchange code for access token
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code'
        })
      });
      const tokens = await tokenRes.json();

      if (!tokens.access_token) {
        console.error('Token error:', JSON.stringify(tokens));
        return res.redirect(`${BASE}/uplyncio-full.html?oauth_error=token_failed`);
      }

      // Get Google user info
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      const gu = await userRes.json();

      if (!gu.email) {
        return res.redirect(`${BASE}/uplyncio-full.html?oauth_error=no_email`);
      }

      const email = gu.email.toLowerCase();
      const name = gu.name || email.split('@')[0];

      // Check Supabase for existing user
      const existing = await sbGet('users', `email=eq.${encodeURIComponent(email)}`);
      let user;

      if (existing?.length > 0) {
        user = existing[0];
        // Update google_id
        await sbUpdate('users', `id=eq.${user.id}`, {
          google_id: gu.id,
          updated_at: new Date().toISOString()
        });
      } else {
        // Create new user
        const result = await sbInsert('users', {
          email, name,
          role,
          google_id: gu.id,
          verified: true,
          email_verified: true,
          publisher_verified: false,
          password_hash: 'google_' + gu.id
        });
        user = Array.isArray(result.data) ? result.data[0] : result.data;

        // Send welcome email async
        try {
          const { sendWelcomeEmail } = await import('./email.js');
          sendWelcomeEmail({ to: email, name, role }).catch(() => {});
        } catch(e) {}
      }

      if (!user || !user.id) {
        return res.redirect(`${BASE}/uplyncio-full.html?oauth_error=user_create_failed`);
      }

      const finalRole = user.role || role || 'buyer';
      const userPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: finalRole,
        verified: true,
        email_verified: true,
        publisher_verified: user.publisher_verified || false,
        google: true
      };

      // Redirect to an auto-login bridge page that sets localStorage then goes to dashboard
      const u = encodeURIComponent(JSON.stringify(userPayload));
      const dashboard = finalRole === 'publisher' ? 'publisher.html' : 'buyer.html';
      return res.redirect(`${BASE}/oauth-bridge.html?u=${u}&dest=${dashboard}`);

    } catch(e) {
      console.error('Google OAuth error:', e.message);
      return res.redirect(`${BASE}/uplyncio-full.html?oauth_error=${encodeURIComponent(e.message)}`);
    }
  }

  return res.status(400).json({ error: 'Invalid request - no code provided' });
}
