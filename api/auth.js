import { sendVerifyEmail, sendWelcomeEmail, sendEmailVerifiedEmail } from './email.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const RESEND_KEY = process.env.RESEND_API_KEY;

function sbHeaders() {
  const key = process.env.SUPABASE_SECRET_KEY;
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
    body: JSON.stringify({ from: 'Uplyncio <info@uplyncio.com>', to: [to], subject, html })
  });
  return { ok: r.ok, data: await r.json() };
}

// ── Rate limit store (in-memory, resets on deploy — use Upstash Redis for production) ──
const rateLimitStore = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { count: 0, reset: now + windowMs };
  if (now > record.reset) { record.count = 0; record.reset = now + windowMs; }
  record.count++;
  rateLimitStore.set(key, record);
  return record.count > max;
}

// ── Input validators ──
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e||'').trim()); }
function isValidPassword(p) { return typeof p === 'string' && p.length >= 8; }
function sanitize(str, maxLen=200) { return String(str||'').trim().substring(0, maxLen).replace(/[<>]/g, ''); }

export default async function handler(req, res) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Access-Control-Allow-Origin', 'https://uplyncio.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  // Rate limiting by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown';
  if (rateLimit(`auth:${ip}`, 20, 60000)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const body = req.body || {};
  const { action } = body;

  try {

    // ── SIGNUP ──
    if (action === 'signup') {
      const { email, password, name, role } = body;
      if (!email || !password || !name || !role)
        return res.status(400).json({ error: 'Missing required fields' });
      if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address' });
      if (!isValidPassword(password)) return res.status(400).json({ error: 'Password must be at least 8 characters' });
      if (typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ error: 'Name too short' });
      if (!['buyer','publisher'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
      if (rateLimit(`signup:${ip}`, 5, 3600000)) return res.status(429).json({ error: 'Too many signup attempts. Try again in 1 hour.' });

      const emailLow = email.toLowerCase().trim();
      const isTeam = emailLow === 'info@uplyncio.com';

      // Validate strong password (server-side)
      if (!isTeam) {
        if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        if (!/[A-Z]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one uppercase letter (A-Z)' });
        if (!/[a-z]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one lowercase letter (a-z)' });
        if (!/[0-9]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one number (0-9)' });
        if (!/[^A-Za-z0-9]/.test(password)) return res.status(400).json({ error: 'Password must contain at least one special character (!@#$%^&*)' });
      }

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

      // Send OTP verification email only (welcome email sent after verify)
      if (!isTeam) {
        const emailResult = await sendVerifyEmail({ to: emailLow, name, code }).catch(e => ({ ok: false, error: e.message }));
        console.log('OTP email result:', JSON.stringify(emailResult));
        return res.status(200).json({
          success: true,
          emailSent: emailResult.ok,
          code: emailResult.ok ? undefined : code,
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

      // Send welcome email AFTER successful verification
      const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
      sendWelcomeEmail({ to: emailLow, name: user.name, role: user.role }).catch(e => console.log('Welcome email err:', e.message));
      sendEmailVerifiedEmail({ to: emailLow, name: user.name, role: user.role, email: emailLow, verifiedAt: now }).catch(e => console.log('Verified email err:', e.message));

      return res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, verified: true, email_verified: true, publisher_verified: user.publisher_verified || false }
      });
    }

    // ── LOGIN ──
    if (action === 'login') {
      const { email, password } = body;
      if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
      if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email address' });
      // Rate limit login attempts per email (brute force protection)
      if (rateLimit(`login:${email.toLowerCase()}`, 10, 900000)) {
        return res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes.' });
      }

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

      // Send new device login alert
      try {
        const ua = req.headers['user-agent'] || 'Unknown device';
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown';
        const now2 = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
        const { sendNewDeviceLoginEmail } = await import('./email.js');
        sendNewDeviceLoginEmail({
          to: emailLow, name: user.name,
          device: ua.substring(0, 80),
          location: 'Unknown', ipAddress: ip, loginTime: now2
        }).catch(() => {});
      } catch(e) {}

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

    // ── FORGOT PASSWORD ──
    if (action === 'forgot_password') {
      const { email } = body;
      if (!email) return res.status(400).json({ error: 'Missing email' });
      if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email' });
      if (rateLimit(`forgot:${email.toLowerCase()}`, 3, 900000)) return res.status(429).json({ error: 'Too many reset attempts. Please wait 15 minutes.' });
      const emailLow = email.toLowerCase().trim();

      // Always return success (don't reveal if email exists)
      const users = await sbGet('users', `email=eq.${encodeURIComponent(emailLow)}`);
      if (!users?.length) {
        return res.status(200).json({ success: true });
      }
      const user = users[0];

      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

      // Save OTP to DB
      await sbUpdate('users', `id=eq.${user.id}`, {
        verify_code: `RESET:${code}:${expiresAt}`
      });

      // Send OTP email
      const { sendOtpEmail } = await import('./email.js');
      await sendOtpEmail({
        to: emailLow,
        name: user.name || 'there',
        code,
        expiresIn: '5 minutes'
      });

      return res.status(200).json({ success: true });
    }

    // ── CHANGE PASSWORD ──
    if (action === 'change_password') {
      const { userId, newPassword } = body;
      if (!userId || !newPassword) return res.status(400).json({ error: 'Missing fields' });
      if (newPassword.length < 8) return res.status(400).json({ error: 'Password too short' });
      if (!/[A-Z]/.test(newPassword)) return res.status(400).json({ error: 'Add uppercase letter' });
      if (!/[a-z]/.test(newPassword)) return res.status(400).json({ error: 'Add lowercase letter' });
      if (!/[0-9]/.test(newPassword)) return res.status(400).json({ error: 'Add a number' });
      if (!/[^A-Za-z0-9]/.test(newPassword)) return res.status(400).json({ error: 'Add special character' });
      const hash = await hashPass(newPassword);
      await sbUpdate('users', `id=eq.${userId}`, { password_hash: hash });
      const { sendPasswordChangedEmail, sendPasswordResetSuccessEmail } = await import('./email.js');
      const users2 = await sbGet('users', `id=eq.${userId}`);
      if (users2?.length) {
        const u = users2[0];
        const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
        sendPasswordChangedEmail({ to: u.email, name: u.name, email: u.email, changedAt: now, ipAddress: req.headers['x-forwarded-for'] || 'Unknown' }).catch(()=>{});
      }
      return res.status(200).json({ success: true });
    }

    // ── CHANGE EMAIL ──
    if (action === 'change_email') {
      const { userId, newEmail } = body;
      if (!userId || !newEmail) return res.status(400).json({ error: 'Missing fields' });
      const newEmailLow = newEmail.toLowerCase().trim();
      const existing = await sbGet('users', `email=eq.${encodeURIComponent(newEmailLow)}`);
      if (existing?.length) return res.status(409).json({ error: 'This email is already registered' });
      const users3 = await sbGet('users', `id=eq.${userId}`);
      if (!users3?.length) return res.status(404).json({ error: 'User not found' });
      const oldUser = users3[0];
      await sbUpdate('users', `id=eq.${userId}`, { email: newEmailLow, email_verified: false });
      const { sendEmailChangedEmail } = await import('./email.js');
      const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
      sendEmailChangedEmail({ to: oldUser.email, name: oldUser.name, oldEmail: oldUser.email, newEmail: newEmailLow, changedAt: now }).catch(()=>{});
      return res.status(200).json({ success: true });
    }

    // ── VERIFY RESET CODE ──
    if (action === 'verify_reset_code') {
      const { email, code } = body;
      if (!email || !code) return res.status(400).json({ error: 'Missing email or code' });
      const emailLow = email.toLowerCase().trim();

      const users = await sbGet('users', `email=eq.${encodeURIComponent(emailLow)}`);
      if (!users?.length) return res.status(404).json({ error: 'User not found' });

      const user = users[0];
      const stored = user.verify_code || '';

      // Format: RESET:CODE:EXPIRY
      if (!stored.startsWith('RESET:')) return res.status(400).json({ error: 'No reset code found. Please request a new one.' });

      const parts = stored.split(':');
      const savedCode = parts[1];
      const expiresAt = parts[2];

      // Check expiry
      if (new Date() > new Date(expiresAt)) {
        return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
      }

      // Check code
      if (savedCode !== code) {
        return res.status(400).json({ error: 'Incorrect code. Please try again.' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown action: ' + action });

  } catch (e) {
    console.error('Auth error:', e);
    return res.status(500).json({ error: e.message });
  }
}
