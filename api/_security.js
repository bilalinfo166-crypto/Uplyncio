// ── Uplyncio Security Module v2.0 ──
// Comprehensive protection against XSS, CSRF, injection, DDoS, brute force

const ALLOWED_ORIGINS = [
  'https://uplyncio.com',
  'https://www.uplyncio.com',
  'https://uplyncio.vercel.app'
];

// ── Rate Limiting (in-memory, per IP) ──
const _rl = new Map();
const _blocked = new Map(); // IP ban list

export function rateLimit(key, max = 20, windowMs = 60000) {
  const now = Date.now();
  // Check if IP is temporarily blocked
  if (_blocked.has(key)) {
    if (now < _blocked.get(key)) return true; // still blocked
    _blocked.delete(key);
  }
  const entry = _rl.get(key) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
  entry.count++;
  _rl.set(key, entry);
  // Auto-ban: if 5x over limit in 1 window, block for 10 minutes
  if (entry.count > max * 5) {
    _blocked.set(key, now + 600000);
  }
  if (_rl.size > 2000) {
    for (const [k, v] of _rl) { if (now > v.reset) _rl.delete(k); }
  }
  return entry.count > max;
}

// Strict rate limit for auth endpoints (login/signup)
export function authRateLimit(ip) {
  return rateLimit('auth_' + ip, 5, 60000); // 5 attempts per minute
}

// Strict rate limit for OTP verification
export function otpRateLimit(ip) {
  return rateLimit('otp_' + ip, 3, 60000); // 3 OTP attempts per minute
}

export function getIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.headers['x-real-ip']
    || 'unknown';
}

// ── CORS ──
export function setCors(req, res) {
  const origin = req.headers.origin || '';
  const isDev = origin.includes('localhost') || origin.includes('127.0.0.1');
  const allowed = ALLOWED_ORIGINS.includes(origin) || isDev;
  res.setHeader('Access-Control-Allow-Origin', allowed ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  // Block requests from disallowed origins (except no-origin requests like server-to-server)
  if (origin && !allowed && !isDev) {
    return false; // caller should return 403
  }
  return true;
}

// ── Input Sanitization ──
// Strip all dangerous content
export function sanitize(str, maxLen = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script[\s\S]*?<\/script>/gi, '') // strip script tags
    .replace(/<[^>]*>/g, '')                     // strip all HTML
    .replace(/javascript:/gi, '')                // strip JS protocol
    .replace(/data:/gi, '')                      // strip data URIs
    .replace(/vbscript:/gi, '')                  // strip VBScript
    .replace(/on\w+\s*=/gi, '')                  // strip event handlers
    .replace(/expression\s*\(/gi, '')            // strip CSS expression
    .replace(/[<>"'`]/g, '')                     // strip dangerous chars
    .replace(/\\/g, '')                          // strip backslashes
    .trim()
    .substring(0, maxLen);
}

// Deep sanitize objects
export function sanitizeObj(obj, maxLen = 500) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const cleanKey = sanitize(k, 100);
    if (typeof v === 'string') out[cleanKey] = sanitize(v, maxLen);
    else if (typeof v === 'number' && isFinite(v)) out[cleanKey] = v;
    else if (typeof v === 'boolean') out[cleanKey] = v;
    else if (Array.isArray(v)) out[cleanKey] = v.slice(0, 100).map(i => typeof i === 'string' ? sanitize(i, maxLen) : i);
    else if (v && typeof v === 'object') out[cleanKey] = sanitizeObj(v, maxLen);
  }
  return out;
}

// ── Validation ──
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/.test(email);
}

// Validate password strength
export function isStrongPassword(pass) {
  if (typeof pass !== 'string' || pass.length < 8 || pass.length > 128) return false;
  return /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass);
}

// ── Body Size Check ──
export function checkBodySize(body, maxBytes = 50000) {
  try { return JSON.stringify(body).length <= maxBytes; }
  catch(e) { return false; }
}

// ── SQL Injection Prevention ──
// Sanitize values used in Supabase REST API queries
export function sanitizeQueryParam(val) {
  if (typeof val !== 'string') return '';
  // Block SQL injection patterns
  return val
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|EXECUTE)\b/gi, '')
    .trim()
    .substring(0, 200);
}

// ── Error Response (never expose internals) ──
export function apiError(res, status, message) {
  return res.status(status).json({ error: message });
}

// ── Security Headers for API ──
export function setApiHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-XSS-Protection', '1; mode=block');
}

// ── Request Validator (use at start of every API) ──
export function validateRequest(req, res, { methods = ['POST'], maxBody = 50000, rateKey = null, rateMax = 20 } = {}) {
  // Set security headers
  setApiHeaders(res);
  // CORS
  const corsOk = setCors(req, res);
  // OPTIONS preflight
  if (req.method === 'OPTIONS') { res.status(200).end(); return false; }
  // Method check
  if (!methods.includes(req.method)) {
    apiError(res, 405, 'Method not allowed');
    return false;
  }
  // Rate limit
  if (rateKey) {
    const ip = getIp(req);
    if (rateLimit(rateKey + '_' + ip, rateMax)) {
      apiError(res, 429, 'Too many requests. Please wait a moment.');
      return false;
    }
  }
  // Body size
  if (req.body && !checkBodySize(req.body, maxBody)) {
    apiError(res, 413, 'Request too large');
    return false;
  }
  return true;
}

// ── Suspicious Pattern Detection ──
export function isSuspicious(str) {
  if (typeof str !== 'string') return false;
  const patterns = [
    /(<script|javascript:|on\w+=|eval\(|document\.(cookie|write)|window\.location)/i,
    /(union\s+select|insert\s+into|drop\s+table|alter\s+table|delete\s+from)/i,
    /(\.\.\/(\.\.)?|\/etc\/passwd|\/proc\/|cmd\.exe)/i,
    /(base64_decode|gzinflate|str_rot13|phpinfo\(\))/i,
  ];
  return patterns.some(p => p.test(str));
}
