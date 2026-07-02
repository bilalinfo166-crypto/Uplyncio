// ── Uplyncio Shared Security Middleware ──
// Used by all API endpoints

const ALLOWED_ORIGINS = [
  'https://uplyncio.com',
  'https://www.uplyncio.com',
  'https://uplyncio.vercel.app'
];

// In-memory rate limit store (resets on cold start — acceptable for serverless)
const _rl = new Map();

export function rateLimit(key, max = 20, windowMs = 60000) {
  const now = Date.now();
  const entry = _rl.get(key) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
  entry.count++;
  _rl.set(key, entry);
  // Auto-cleanup old entries every 1000 requests
  if (_rl.size > 1000) {
    for (const [k, v] of _rl) { if (now > v.reset) _rl.delete(k); }
  }
  return entry.count > max;
}

export function getIp(req) {
  return (req.headers['x-forwarded-for']||'').split(',')[0].trim()
      || req.headers['x-real-ip']
      || 'unknown';
}

export function setCors(req, res) {
  const origin = req.headers.origin || '';
  // Allow known origins + localhost for dev
  const allowed = ALLOWED_ORIGINS.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('vercel.app');
  res.setHeader('Access-Control-Allow-Origin', allowed ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

// Sanitize string: strip HTML tags and dangerous chars
export function sanitize(str, maxLen = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')          // strip HTML
    .replace(/javascript:/gi, '')      // strip JS protocol
    .replace(/on\w+\s*=/gi, '')       // strip event handlers
    .replace(/[<>]/g, '')             // strip angle brackets
    .trim()
    .substring(0, maxLen);
}

// Sanitize an object recursively
export function sanitizeObj(obj, maxLen = 500) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[k] = sanitize(v, maxLen);
    else if (typeof v === 'number') out[k] = v;
    else if (typeof v === 'boolean') out[k] = v;
    else if (Array.isArray(v)) out[k] = v.map(i => typeof i === 'string' ? sanitize(i, maxLen) : i);
    else if (v && typeof v === 'object') out[k] = sanitizeObj(v, maxLen);
    else out[k] = v;
  }
  return out;
}

// Validate email
export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length < 255;
}

// Check request body size
export function checkBodySize(body, maxBytes = 50000) {
  return JSON.stringify(body).length <= maxBytes;
}

// Standard error response (never expose stack traces)
export function apiError(res, status, message) {
  return res.status(status).json({ error: message });
}

// Standard security headers for API responses
export function setApiHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
}
