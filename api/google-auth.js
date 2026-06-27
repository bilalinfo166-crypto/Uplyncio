// Google OAuth Handler
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'https://uplyncio.vercel.app/api/google-auth';
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

  const { code, state, action } = req.method === 'GET' ? req.query : (req.body || {});

  // Dynamic redirect URI based on host
  const host = req.headers.host || 'uplyncio.vercel.app';
  const dynamicRedirectURI = host.includes('uplyncio.com')
    ? 'https://uplyncio.com/api/google-auth'
    : 'https://uplyncio.vercel.app/api/google-auth';

  // Step 1: Generate Google OAuth URL
  if (action === 'get_url' || req.method === 'POST') {
    const role = req.body?.role || 'buyer';
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: dynamicRedirectURI,
      response_type: 'code',
      scope: 'openid email profile',
      state: role,
      access_type: 'offline',
      prompt: 'select_account'
    });
    return res.status(200).json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  }

  // Step 2: Handle callback with code
  if (code) {
    try {
      const role = state || 'buyer';

      // Exchange code for tokens
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: dynamicRedirectURI,
          grant_type: 'authorization_code'
        })
      });
      const tokens = await tokenRes.json();

      if (!tokens.access_token) {
        return res.redirect(`https://uplyncio.vercel.app/uplyncio-full.html?oauth_error=token_failed`);
      }

      // Get user info from Google
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      const googleUser = await userRes.json();

      if (!googleUser.email) {
        return res.redirect(`https://uplyncio.vercel.app/uplyncio-full.html?oauth_error=no_email`);
      }

      const email = googleUser.email.toLowerCase();
      const name = googleUser.name || email.split('@')[0];

      // Check if user exists in Supabase
      const existing = await sbGet('users', `email=eq.${encodeURIComponent(email)}`);
      let user;

      if (existing?.length > 0) {
        // Existing user — login
        user = existing[0];
        await sbUpdate('users', `id=eq.${user.id}`, {
          google_id: googleUser.id,
          updated_at: new Date().toISOString()
        });
      } else {
        // New user — create account
        const result = await sbInsert('users', {
          email, name,
          role,
          google_id: googleUser.id,
          verified: true,
          email_verified: true,
          publisher_verified: false,
          password_hash: 'google_oauth_' + googleUser.id
        });
        user = Array.isArray(result.data) ? result.data[0] : result.data;

        // Send welcome email
        try {
          const { sendWelcomeEmail } = await import('./email.js');
          await sendWelcomeEmail({ to: email, name, role });
        } catch(e) {}
      }

      // Redirect with user data encoded
      const userData = encodeURIComponent(JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: true,
        email_verified: true,
        publisher_verified: user.publisher_verified || false,
        google: true
      }));

      return res.redirect(`https://uplyncio.vercel.app/uplyncio-full.html?oauth_success=1&user=${userData}`);

    } catch(e) {
      console.error('Google OAuth error:', e);
      return res.redirect(`https://uplyncio.vercel.app/uplyncio-full.html?oauth_error=${encodeURIComponent(e.message)}`);
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
