import { sendVerifyEmail, sendWelcomeEmail, sendEmailVerifiedEmail } from './email.js';

const SUPABASE_URL = 'https://ridafwpazwqjhimecyyl.supabase.co';
const RESEND_KEY = process.env.RESEND_API_KEY;

function sbHeaders() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SB_KEY;
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  };
}

async function sbGet(table, filter) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}&select=*`;
  const r = await fetch(url, { headers: sbHeaders() });
  return r.json();
}

async function sbInsert(table, data) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...sbHeaders(), 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  });
  const text = await r.text();
  console.log(`sbInsert ${table} status:`, r.status, text.substring(0, 200));
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

async function hashPass(pass) {
  const enc = new TextEncoder();
  const buf = enc.encode(pass + '_uply_2026_salt');
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function sendEmail(to, subject, html) {
  if (!RESEND_KEY) return { ok: false, error: 'No RESEND_API_KEY' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'Uplyncio <onboarding@resend.dev>', to: [to], subject, html })
  });
  return { ok: r.ok, data: await r.json() };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const { action } = body;

  try {

    // ── SIGNUP ──
    if (action === 'signup') {
      const { email, password, name, role } = body;
      if (!email || !password || !name || !role)
        return res.status(400).json({ error: 'Missing required fields' });

      const emailLow = email.toLowerCase().trim();
      const isTeam = emailLow === 'info@uplyncio.com';

      // Check duplicate
      const existing = await sbGet('users', `email=eq.${encodeURIComponent(emailLow)}`);
      if (existing?.length > 0)
        return res.status(409).json({ error: 'Email already registered' });

      const hash = await hashPass(password);
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Insert user
      const result = await sbInsert('users', {
        email: emailLow, name, role,
        password_hash: hash,
        verify_code: isTeam ? null : code,
        verified: isTeam,
        email_verified: isTeam,
        publisher_verified: isTeam
      });

      if (!result.ok) {
        console.error('Supabase insert error:', JSON.stringify(result.data));
        return res.status(500).json({ 
          error: 'Failed to create user', 
          detail: result.data,
          hint: typeof result.data === 'object' ? result.data.message || result.data.hint || result.data.code : result.data
        });
      }

      const user = Array.isArray(result.data) ? result.data[0] : result.data;

      // Send verification email
    if (!isTeam) {
        // Send welcome email
        await sendWelcomeEmail({ to: emailLow, name, role }).catch(e => console.log('Welcome email error:', e.message));
        // Send verify email with OTP
        const emailResult = await sendVerifyEmail({ to: emailLow, name, code }).catch(e => ({ ok: false, error: e.message }));
        console.log('Email result:', JSON.stringify(emailResult));
        // Always return code in response so frontend can show it as fallback
        return res.status(200).json({
          success: true,
          emailSent: emailResult.ok,
          code: emailResult.ok ? undefined : code, // only expose if email failed
          user: { id: user.id, email: user.email, name: user.name, role: user.role, verified: false }
        });
      }

      return res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, verified: isTeam }
      });
    }

    // ── VERIFY EMAIL ──
    if (action === 'verify') {
      const { email, code } = body;
      if (!email || !code) return res.status(400).json({ error: 'Missing email or code' });

      const emailLow = email.toLowerCase().trim();
      const users = await sbGet('users', `email=eq.${encodeURIComponent(emailLow)}`);
      if (!users?.length) return res.status(404).json({ error: 'User not found' });

      const user = users[0];
      if (user.verify_code !== code)
        return res.status(400).json({ error: 'Invalid verification code' });

      await sbUpdate('users', `id=eq.${user.id}`, {
        verified: true, email_verified: true, verify_code: null
      });

      return res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, verified: true, email_verified: true, publisher_verified: user.publisher_verified || false }
      });
    }

    // ── LOGIN ──
    if (action === 'login') {
      const { email, password } = body;
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

      const emailLow = email.toLowerCase().trim();
      const users = await sbGet('users', `email=eq.${encodeURIComponent(emailLow)}`);
      if (!users?.length) return res.status(401).json({ error: 'No account found with this email' });

      const user = users[0];
      const hash = await hashPass(password);

      if (user.password_hash !== hash)
        return res.status(401).json({ error: 'Incorrect password' });

      const isTeam = emailLow === 'info@uplyncio.com';
      if (!user.email_verified && !isTeam)
        return res.status(403).json({ error: 'Please verify your email first', needsVerify: true, email: emailLow });

      return res.status(200).json({
        success: true,
        user: {
          id: user.id, email: user.email, name: user.name, role: user.role,
          verified: user.verified, email_verified: user.email_verified,
          publisher_verified: user.publisher_verified || isTeam
        }
      });
    }

    // ── SYNC USER (upsert on every login) ──
    if (action === 'sync_user') {
      const { email, name, role, verified } = body;
      if (!email) return res.status(400).json({ error: 'Missing email' });

      const emailLow = email.toLowerCase().trim();
      const isTeam = emailLow === 'info@uplyncio.com';
      const users = await sbGet('users', `email=eq.${encodeURIComponent(emailLow)}`);

      if (users?.length > 0) {
        const u = users[0];
        await sbUpdate('users', `id=eq.${u.id}`, {
          name: name || u.name,
          verified: true, email_verified: true,
          publisher_verified: isTeam ? true : u.publisher_verified,
          updated_at: new Date().toISOString()
        });
        return res.status(200).json({ success: true, id: u.id });
      } else {
        // Create user
        const result = await sbInsert('users', {
          email: emailLow, name: name || email.split('@')[0],
          role: role || 'publisher',
          password_hash: 'local_' + Date.now(),
          verified: true, email_verified: true,
          publisher_verified: isTeam
        });
        const u = Array.isArray(result.data) ? result.data[0] : result.data;
        return res.status(200).json({ success: true, id: u?.id });
      }
    }

    return res.status(400).json({ error: 'Unknown action: ' + action });

  } catch (e) {
    console.error('Auth error:', e);
    return res.status(500).json({ error: e.message });
  }
}
