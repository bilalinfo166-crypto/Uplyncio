// ── Uplyncio Chat Filter — Contact Detection & Blocking System ──

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { message, senderId, receiverId, orderId } = req.body || {};
  if (!message) return res.status(400).json({ error: 'No message provided' });

  const result = analyzeMessage(message);

  // Log violation to Supabase
  if (result.blocked || result.warning) {
    try {
      const SB = process.env.SUPABASE_URL || 'https://ridafwpazwqjhimecyyl.supabase.co';
      const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SB_KEY;
      await fetch(`${SB}/rest/v1/chat_violations`, {
        method: 'POST',
        headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
          order_id: orderId,
          message_preview: message.substring(0, 100),
          violation_type: result.type,
          severity: result.severity,
          detected_at: new Date().toISOString()
        })
      }).catch(() => {});
    } catch(e) {}
  }

  return res.status(200).json(result);
}

function analyzeMessage(msg) {
  const text = msg.toLowerCase().trim();

  // ── PHONE NUMBERS ──
  const phonePatterns = [
    /(\+?92|0)[\s\-]?3\d{2}[\s\-]?\d{7}/,           // Pakistan
    /(\+?1)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/, // US/Canada
    /(\+?44)?[\s\-]?07\d{3}[\s\-]?\d{6}/,            // UK
    /(\+?91)?[\s\-]?[6-9]\d{9}/,                      // India
    /\b\d{4,5}[\s\-]\d{5,6}\b/,                       // Generic
    /\b\d{10,12}\b/,                                   // Plain numbers
    /\(\d{3}\)\s*\d{3}[-\s]\d{4}/,                   // (xxx) xxx-xxxx
  ];

  // ── EMAILS ──
  const emailPatterns = [
    /[a-zA-Z0-9._%+\-]+\s*[@＠at]\s*[a-zA-Z0-9.\-]+\s*[.]\s*[a-zA-Z]{2,}/,
    /[a-zA-Z0-9]+\s+at\s+[a-zA-Z0-9]+\s+dot\s+com/i,
    /[a-zA-Z0-9]+\[at\][a-zA-Z0-9]/i,
    /[a-zA-Z0-9]+\(at\)[a-zA-Z0-9]/i,
    /gmail|yahoo|hotmail|outlook|protonmail/i,
  ];

  // ── SOCIAL MEDIA / MESSAGING ──
  const socialPatterns = [
    /\bwhatsapp\b|\bwhats app\b|\bwatsapp\b/i,
    /\btelegram\b|\bt\.me\b|\btelegr\.am\b/i,
    /\binstagram\b|\binsta\b|\big:\s*/i,
    /\bfacebook\b|\bfb\.com\b|\bfb:\s*/i,
    /\bskype\b/i,
    /\blinkedin\b/i,
    /\bsignal\b/i,
    /\bviber\b/i,
    /\bwechat\b|\bwe chat\b/i,
    /\bline app\b/i,
    /\bdiscord\b/i,
    /\bslack\b/i,
    /\bzoom\b|\bmeet\.google\b|\bteams\b/i,
  ];

  // ── EXTERNAL PLATFORMS ──
  const platformPatterns = [
    /\bfiverr\b/i,
    /\bupwork\b/i,
    /\bfreelancer\b/i,
    /\bpeopleperh(our)?\b/i,
    /\btoptal\b/i,
    /\bguru\.com\b/i,
    /\b99designs\b/i,
  ];

  // ── OFF-PLATFORM PAYMENT ──
  const paymentPatterns = [
    /\bpaypal\b/i,
    /\bbank transfer\b|\baccount number\b|\biban\b/i,
    /\bcrypto\b|\bbitcoin\b|\busdt\b|\bethererum\b/i,
    /\bease paisa\b|\beasypaisa\b|\bjazzcash\b|\bsadapay\b/i,
    /\bpay.*outside\b|\bpay.*direct\b|\bdirect.*pay/i,
    /\bsend money\b|\btransfer money\b/i,
  ];

  // ── AVOIDANCE KEYWORDS ──
  const avoidancePatterns = [
    /\bcontact me\b|\breach me\b|\bmessage me\b/i,
    /\blet.s talk.*outside\b|\btalk.*privately\b/i,
    /\boff.*platform\b|\boutside.*platform\b/i,
    /\bdirect.*deal\b|\bdeal.*direct\b/i,
    /\bsave.*commission\b|\bavoid.*fee\b|\bno.*fee\b/i,
    /\bmy.*number is\b|\bcall me\b|\btext me\b/i,
    /\badd me on\b|\bfind me on\b|\bfollow me on\b/i,
  ];

  // ── URLS ──
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+|\b\w+\.(com|net|org|io|co)\b/i;

  // Check each category
  for (const p of phonePatterns) {
    if (p.test(text)) {
      return {
        blocked: true,
        type: 'phone_number',
        severity: 'high',
        message: '🚫 Message blocked: Phone numbers cannot be shared on Uplyncio. Please communicate only through the platform.',
        tip: 'For faster communication, use our built-in messaging system.'
      };
    }
  }

  for (const p of emailPatterns) {
    if (p.test(text)) {
      return {
        blocked: true,
        type: 'email_address',
        severity: 'high',
        message: '🚫 Message blocked: Email addresses cannot be shared. All communication must stay on Uplyncio.',
        tip: 'Use our messaging system to communicate with your order partner.'
      };
    }
  }

  for (const p of paymentPatterns) {
    if (p.test(text)) {
      return {
        blocked: true,
        type: 'off_platform_payment',
        severity: 'critical',
        message: '🚫 Message blocked: Off-platform payments are strictly prohibited and may result in account suspension.',
        tip: 'All payments are processed securely through Uplyncio wallet.'
      };
    }
  }

  for (const p of platformPatterns) {
    if (p.test(text)) {
      return {
        blocked: true,
        type: 'competitor_platform',
        severity: 'high',
        message: '🚫 Message blocked: Mentioning competitor platforms is not allowed on Uplyncio.',
        tip: 'Stay on Uplyncio for the best experience and buyer protection.'
      };
    }
  }

  for (const p of avoidancePatterns) {
    if (p.test(text)) {
      return {
        blocked: true,
        type: 'off_platform_solicitation',
        severity: 'critical',
        message: '🚫 Message blocked: Attempting to take communication or payments off-platform violates our Terms of Service and may result in permanent account ban.',
        tip: 'All deals must be completed through Uplyncio for your protection.'
      };
    }
  }

  for (const p of socialPatterns) {
    if (p.test(text)) {
      return {
        blocked: true,
        type: 'social_media_contact',
        severity: 'medium',
        message: '🚫 Message blocked: Social media handles and messaging apps cannot be shared on Uplyncio.',
        tip: 'Use our built-in chat for all order-related communication.'
      };
    }
  }

  if (urlPattern.test(text)) {
    // Allow certain safe URLs (e.g. live post links)
    const safeUrls = /uplyncio\.com|google\.com\/drive|docs\.google|dropbox\.com/i;
    if (!safeUrls.test(text)) {
      return {
        blocked: false,
        warning: true,
        type: 'external_url',
        severity: 'low',
        message: '⚠️ Warning: External links detected. Only share links related to your order (e.g. live post URL).',
      };
    }
  }

  return { blocked: false, warning: false, type: null, message: null };
}
