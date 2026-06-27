// ── Uplyncio Chat Filter — Contact Detection & Auto-Restrict System ──

const SUPABASE_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SECRET_KEY;

function sbHeaders() {
  return { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };
}

async function sbGet(table, filter) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=*`, { headers: sbHeaders() });
  return r.json();
}

async function sbInsert(table, data) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST', headers: sbHeaders(), body: JSON.stringify(data)
  });
}

async function sbUpdate(table, filter, data) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH', headers: sbHeaders(), body: JSON.stringify(data)
  });
}

async function sbRpc(fn, params) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST', headers: sbHeaders(), body: JSON.stringify(params)
  });
  return r.json();
}

// ── VIOLATION THRESHOLDS ──
const THRESHOLDS = {
  WARNING_1: 2,    // 2 violations → first warning email
  WARNING_2: 4,    // 4 violations → second warning + temporary restrict
  BAN: 6           // 6 violations → permanent ban
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── ADMIN: Get all violations ──
  if (req.method === 'GET') {
    const action = req.query.action;
    if (action === 'violations') {
      try {
        const data = await sbGet('chat_violations', 'order=detected_at.desc&limit=100');
        return res.status(200).json({ success: true, violations: data });
      } catch(e) {
        return res.status(500).json({ error: e.message });
      }
    }
    if (action === 'flagged_users') {
      try {
        const data = await sbGet('chat_violations', 'select=sender_id,violation_type,severity,detected_at&order=detected_at.desc');
        // Count violations per user
        const counts = {};
        (data || []).forEach(v => {
          if (!counts[v.sender_id]) counts[v.sender_id] = { count: 0, types: [], last: v.detected_at };
          counts[v.sender_id].count++;
          if (!counts[v.sender_id].types.includes(v.violation_type)) counts[v.sender_id].types.push(v.violation_type);
        });
        return res.status(200).json({ success: true, flagged: counts });
      } catch(e) {
        return res.status(500).json({ error: e.message });
      }
    }
  }

  // ── ADMIN: Manual ban ──
  if (req.method === 'POST' && req.body?.action === 'ban_user') {
    const { userId, reason } = req.body;
    try {
      await sbUpdate('users', `id=eq.${userId}`, {
        account_status: 'banned',
        ban_reason: reason || 'Policy violation',
        banned_at: new Date().toISOString()
      });
      const { sendAccountSuspended } = await import('./email.js');
      const users = await sbGet('users', `id=eq.${userId}`);
      if (users?.[0]) {
        sendAccountSuspended({ to: users[0].email, name: users[0].name, role: users[0].role,
          reason: reason || 'Multiple policy violations', suspendedAt: new Date().toLocaleDateString() }).catch(()=>{});
      }
      return res.status(200).json({ success: true, message: 'User banned' });
    } catch(e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── MAIN: Analyze message ──
  const { message, senderId, receiverId, orderId } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message' });

  const result = analyzeMessage(message);

  // Log violation and check auto-restrict
  if (result.blocked && senderId) {
    try {
      // Save violation
      await sbInsert('chat_violations', {
        sender_id: senderId,
        receiver_id: receiverId || null,
        order_id: orderId || null,
        message_preview: message.substring(0, 120),
        violation_type: result.type,
        severity: result.severity,
        detected_at: new Date().toISOString()
      });

      // Count total violations for this user
      const violations = await sbGet('chat_violations', `sender_id=eq.${senderId}`);
      const count = violations?.length || 0;

      // Auto-restrict based on threshold
      const users = await sbGet('users', `id=eq.${senderId}`);
      const user = users?.[0];

      if (user) {
        if (count >= THRESHOLDS.BAN && user.account_status !== 'banned') {
          // Permanent ban
          await sbUpdate('users', `id=eq.${senderId}`, {
            account_status: 'banned',
            ban_reason: 'Repeated policy violations — off-platform solicitation',
            banned_at: new Date().toISOString()
          });
          const { sendAccountPermanentlyBanned } = await import('./email.js');
          sendAccountPermanentlyBanned({
            to: user.email, name: user.name, role: user.role,
            reason: 'You have repeatedly attempted to take communication and payments off the Uplyncio platform.',
            bannedAt: new Date().toLocaleDateString(),
            violationCount: count
          }).catch(()=>{});
          result.accountAction = 'banned';
          result.accountMessage = '🚫 Your account has been permanently banned due to repeated policy violations.';

        } else if (count >= THRESHOLDS.WARNING_2 && user.account_status !== 'restricted') {
          // Temporary restrict
          await sbUpdate('users', `id=eq.${senderId}`, {
            account_status: 'restricted',
            restriction_reason: 'Multiple policy violations',
            restricted_at: new Date().toISOString()
          });
          const { sendAccountSuspended } = await import('./email.js');
          sendAccountSuspended({
            to: user.email, name: user.name, role: user.role,
            reason: `You have ${count} policy violations. Account is now restricted pending review.`,
            suspendedAt: new Date().toLocaleDateString()
          }).catch(()=>{});
          result.accountAction = 'restricted';
          result.accountMessage = '⚠️ Your account has been temporarily restricted. Please contact support.';

        } else if (count >= THRESHOLDS.WARNING_1) {
          // Warning email
          const { sendPolicyViolationWarning } = await import('./email.js');
          sendPolicyViolationWarning({
            to: user.email, name: user.name, role: user.role,
            violation: result.type,
            warningNum: count,
            details: `You attempted to share: ${result.type.replace(/_/g,' ')}`,
            consequenceNext: count >= THRESHOLDS.WARNING_2 - 1
              ? 'Your account will be restricted on the next violation.'
              : `You have ${THRESHOLDS.BAN - count} violations remaining before a permanent ban.`
          }).catch(()=>{});
          result.warningCount = count;
        }
      }
    } catch(e) {
      console.log('Violation log error:', e.message);
    }
  }

  return res.status(200).json(result);
}

// ── MESSAGE ANALYZER ──
function analyzeMessage(msg) {
  const text = msg.toLowerCase().trim();

  // Deobfuscate: remove spaces/symbols people use to bypass filters
  const clean = text
    .replace(/[\s.\-_*|\\\/]+/g, '')
    .replace(/@|＠/g, 'a')
    .replace(/0/g, 'o')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/5|\$/g, 's')
    .replace(/4/g, 'a')
    .replace(/7/g, 't');

  // ── PHONE NUMBERS ──
  const phonePatterns = [
    /(\+?92|0)[\s\-]?3\d{2}[\s\-]?\d{7}/,
    /(\+?1)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/,
    /(\+?44)?[\s\-]?07\d{3}[\s\-]?\d{6}/,
    /(\+?91)?[\s\-]?[6-9]\d{9}/,
    /\b\d{4,5}[\s\-]\d{5,6}\b/,
    /\b\d{11,12}\b/,
    /\(\d{3}\)\s*\d{3}[-\s]\d{4}/,
  ];
  for (const p of phonePatterns) {
    if (p.test(text)) return blocked('phone_number', 'high',
      '🚫 Message blocked: Phone numbers cannot be shared on Uplyncio.',
      'Use our built-in chat for all order communication.');
  }

  // ── EMAILS ──
  const emailPatterns = [
    /[a-z0-9._%+\-]+\s*[@＠]\s*[a-z0-9.\-]+\.[a-z]{2,}/,
    /[a-z0-9]+\s+at\s+[a-z0-9]+\s+dot\s+(com|net|org|io)/,
    /[a-z0-9]+\[at\][a-z0-9]/,
    /[a-z0-9]+\(at\)[a-z0-9]/,
  ];
  const emailDomains = /gmail|yahoo|hotmail|outlook|protonmail|icloud/;
  for (const p of emailPatterns) {
    if (p.test(text)) return blocked('email_address', 'high',
      '🚫 Message blocked: Email addresses cannot be shared. Keep all communication on Uplyncio.',
      'Use our messaging system to communicate.');
  }
  if (emailDomains.test(clean)) return blocked('email_domain', 'high',
    '🚫 Message blocked: Email service mentions are not allowed.',
    'All communication must stay on Uplyncio.');

  // ── SOCIAL MEDIA ──
  const social = [
    { p: /whatsapp|whatsap|watsapp|whtsp|wa\.me/,   name: 'WhatsApp' },
    { p: /telegram|t\.me|telegram/,                  name: 'Telegram' },
    { p: /\binstagram\b|\binsta\b/,                  name: 'Instagram' },
    { p: /\bfacebook\b|\bfb\.com\b/,                name: 'Facebook' },
    { p: /\bskype\b/,                                name: 'Skype' },
    { p: /\bsignal\b/,                               name: 'Signal' },
    { p: /\bviber\b/,                                name: 'Viber' },
    { p: /\bdiscord\b/,                              name: 'Discord' },
    { p: /\bwechat\b|we chat/,                       name: 'WeChat' },
    { p: /\bzoom\b/,                                 name: 'Zoom' },
  ];
  for (const s of social) {
    if (s.p.test(text) || s.p.test(clean)) return blocked('social_media_contact', 'high',
      `🚫 Message blocked: ${s.name} handles cannot be shared on Uplyncio.`,
      'Use our built-in messaging system for all communication.');
  }

  // ── OFF-PLATFORM PAYMENT ──
  const paymentPatterns = [
    /\bpaypal\b|\bpayoneer\b/,
    /bank.?transfer|account.?number|\biban\b|\bswift\b/,
    /\bbitcoin\b|\bcrypto\b|\busdt\b|\bethereum\b|\bbnb\b/,
    /easypaisa|jazzcash|sadapay|nayapay/,
    /pay.*outside|pay.*direct|direct.*pay|pay.*separately/,
    /send.*money|transfer.*money|money.*transfer/,
  ];
  for (const p of paymentPatterns) {
    if (p.test(text) || p.test(clean)) return blocked('off_platform_payment', 'critical',
      '🚫 Message blocked: Off-platform payments are strictly prohibited and may result in account suspension.',
      'All payments are processed securely through Uplyncio wallet.');
  }

  // ── COMPETITOR PLATFORMS ──
  const competitors = [/\bfiverr\b/, /\bupwork\b/, /\bfreelancer\b/, /\bpeopleperh/, /\btoptal\b/, /\bguru\.com\b/];
  for (const p of competitors) {
    if (p.test(text) || p.test(clean)) return blocked('competitor_platform', 'medium',
      '🚫 Message blocked: Competitor platform mentions are not allowed.',
      'Stay on Uplyncio for the best experience and buyer protection.');
  }

  // ── OFF-PLATFORM SOLICITATION ──
  const avoidance = [
    /contact.*outside|outside.*platform|off.*platform/,
    /direct.*deal|deal.*direct|work.*directly/,
    /save.*commission|avoid.*fee|no.*platform.*fee|bypass.*uplyncio/,
    /call me|text me|reach me at|message me on|find me on|add me on/,
    /let.s talk.*privately|talk.*outside|continue.*elsewhere/,
    /my.*handle|my.*username|my.*id is/,
  ];
  for (const p of avoidance) {
    if (p.test(text)) return blocked('off_platform_solicitation', 'critical',
      '🚫 Message blocked: Attempting to take communication or payments off-platform violates our Terms of Service and may result in a permanent ban.',
      'All deals must be completed through Uplyncio for your protection and theirs.');
  }

  // ── EXTERNAL URLS (warning only) ──
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+|\b\w+\.(com|net|org|io|co)\b/;
  const safeUrls = /uplyncio\.com|google\.com\/drive|docs\.google|dropbox\.com/;
  if (urlPattern.test(text) && !safeUrls.test(text)) {
    return { blocked: false, warning: true, type: 'external_url', severity: 'low',
      message: '⚠️ Warning: Only share links directly related to your order (e.g. published article URL).' };
  }

  return { blocked: false, warning: false };
}

function blocked(type, severity, message, tip) {
  return { blocked: true, type, severity, message, tip };
}
