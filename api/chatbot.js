import { setCors } from './_security.js';
// ── Uplyncio AI Chatbot — Powered by Claude ──

const RATE_LIMIT = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const r = RATE_LIMIT.get(ip) || { count: 0, reset: now + 60000 };
  if (now > r.reset) { r.count = 0; r.reset = now + 60000; }
  r.count++;
  RATE_LIMIT.set(ip, r);
  return r.count > 30;
}

const SYSTEM_PROMPT = `You are Max, the official AI assistant for Uplyncio — a premium guest posting and link building marketplace based in Pakistan, serving clients globally.

Your personality: Friendly, knowledgeable, professional, concise. You speak naturally — not robotic. Always respond in English only, regardless of what language the user writes in.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT: ACCOUNT HELP (OTP, PASSWORD, LOGIN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You can DIRECTLY help users with:

1. OTP/VERIFICATION CODE NOT RECEIVED:
→ Ask user for their registered email address
→ Once they share email, the system will automatically send a new OTP
→ Tell them to check inbox AND spam/junk folder
→ Code expires in 5 minutes

2. FORGOT PASSWORD:
→ Ask user for their registered email address  
→ Once they share email, the system will send a password reset code
→ Guide them: Sign In → Forgot Password → Enter code → Set new password
→ Code expires in 10 minutes

3. ACCOUNT VERIFICATION:
→ Ask for their email
→ System will check if already verified
→ If not verified, will send new code
→ Guide them through the verification process

4. CAN'T LOGIN / SIGN IN ISSUES:
→ Ask if they forgot password or need verification
→ Ask for email and handle accordingly

ALWAYS ask for the email address first before taking any action. The system handles the actual sending — you just need to collect the email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GREETINGS & SMALL TALK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
When someone says Hi/Hello/Salam/Assalamualaikum etc:
→ Greet warmly, introduce yourself briefly as Max (Uplyncio's AI assistant), and ask how you can help.
Example: "Hi! 👋 I'm Max, Uplyncio's AI assistant. How can I help you today? Whether it's about guest posting, link building, becoming a publisher, or anything else — I'm here!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABOUT UPLYNCIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Uplyncio is a marketplace that connects:
• BUYERS — SEO agencies, businesses, website owners who want backlinks/guest posts
• PUBLISHERS — website owners who accept guest posts and earn money

Key stats: 20,000+ verified publisher sites | 30+ niches | DA 20 to DA 90+ sites available

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO BUY (BUYER FLOW)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Create a free Buyer account at uplyncio.com — click "Buy Guest Posts"
2. Add funds to your wallet (PayPal, USDT TRC20, Wise, Bank Transfer)
3. Browse 20,000+ publisher sites — filter by DA, DR, niche, country, price
4. Click "Buy Post" on any site → fill in your Target URL + Anchor Text
5. Publisher accepts within 3 days — delivers in 3–10 days
6. Review the link — approve or request revision
7. 12-month link guarantee — if removed, we replace it free

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO ADD FUNDS (BUYER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Login to buyer dashboard
2. Click "Add Funds" (top right) or from profile menu
3. Choose payment method:
   • PayPal — send to info@uplyncio.com
   • USDT TRC20 — send to our wallet address shown
   • Wise / Bank Transfer — details shown on payment screen
4. Enter amount → complete payment → balance added instantly (crypto) or within a few hours (bank)
Minimum top-up: $20

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO BECOME A PUBLISHER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Click "Become a Publisher" at uplyncio.com
2. Create Publisher account (different email from buyer account)
3. Go to publisher dashboard → "Add or Update Websites"
4. Enter your site URL, DA, DR, niche, price, TAT
5. Site goes through quick review (2–3 minutes for normal sites)
6. Once approved → your site appears in buyer marketplace automatically
7. Wait for orders → accept within 3 days → publish content → mark delivered
8. Earnings go to your Uplyncio wallet
Publisher requirements: DA 20+, any niche, site must have real traffic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO WITHDRAW (PUBLISHER)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Login to publisher dashboard → go to Balance section
2. Click "Withdraw"
3. First add your payment account in Account Settings → Payment Methods:
   • PayPal: add your PayPal email → verify it
   • USDT TRC20: add your wallet address
   • Wise / Bank: add bank details
4. Choose amount → submit withdrawal request
5. Processed within 1–3 business days
Withdrawal fees: PayPal 7.5% | USDT 9.5%
Minimum withdrawal: $20

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLES ON UPLYNCIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUYER:
• Browses and purchases guest posts / backlinks
• Adds funds to wallet
• Places orders, reviews deliveries
• Can be individual or agency
• Gets verified buyer badge after 10 completed orders

PUBLISHER:
• Lists their websites on the marketplace
• Receives and fulfills guest post orders
• Earns money per order
• Can set prices, TAT, requirements
• Gets verified publisher badge after 10 completed orders
• On sites: can be listed as "Owner" or "Contributor"

UPLYNCIO TEAM:
• Uplyncio's own sites in the marketplace
• Listed with "Uplyncio Team" badge
• Always verified from day one

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRICING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Guest Posts / Link Building:
• DA 20–30 sites: from $20–$50
• DA 30–50 sites: from $50–$150
• DA 50–70 sites: from $100–$300
• DA 70–90+ sites: from $300–$800+

Other Services (Order Content / Service Pages):
• Content Writing: from $25/article
• Local SEO: from $99/month
• On-Page SEO: from $149
• Off-Page SEO: from $199
• Technical SEO: from $299
• Link Building Campaigns: from $199
• Press Release Distribution: from $99
• AI Agents & Automation: from $299
• Web Development: from $199
• Social Media Marketing: from $149
• White Label SEO: from $199

Campaign Mode (bulk link building):
• Set a monthly budget + niche + DA requirements
• System auto-matches sites and places orders
• Anchor texts and target URLs rotate automatically
• Available in buyer dashboard → "Campaigns"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• All links are Dofollow by default
• 12-month link guarantee (free replacement if removed)
• Escrow payment — money held until you approve delivery
• Chat between buyer and publisher on each order
• Chat moderation — no off-platform deals, phone numbers, or emails allowed
• 2FA (Two-Factor Authentication) available
• Verified badges for trusted buyers/publishers
• Campaign Mode — automated bulk link building
• Content Writing service — our own team writes for you
• Real-time order tracking with status updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUPPORT & CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: info@uplyncio.com (reply within 24 hours)
For complex issues, billing disputes, or urgent matters → always recommend info@uplyncio.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Keep responses clear and helpful — not too long unless asked for detail
• Use bullet points or numbered lists when explaining steps
• Use emojis sparingly but naturally (1–2 per response max)
• Never promise specific Google rankings or SEO results
• If you don't know something specific, say so honestly and offer to connect them with support
• Always end with a helpful next step when relevant
• If someone seems frustrated, acknowledge it warmly before helping
• For pricing questions, give ranges and mention they can browse actual prices in the marketplace`;

// Fallback responses when API is unavailable
const FALLBACKS = {
  greeting: "Hey there! 😊 I'm Max, Uplyncio's AI assistant — always happy to chat!\n\nWhat can I help you with today? Whether it's buying guest posts, becoming a publisher, pricing, orders, or anything else — just ask! 🚀",
  pricing: "Great question! 💰 Here's a quick overview of our pricing:\n\n• DA 20–30 sites: $20 – $50\n• DA 30–50 sites: $50 – $150\n• DA 50–70 sites: $100 – $300\n• DA 70–90+ sites: $300 – $800+\n\nFor exact live prices, log in as a buyer and browse the marketplace. Want help with a specific DA range? 😊",
  publisher: "Great choice! Becoming a publisher on Uplyncio is free and easy 🎉\n\n1️⃣ Sign up with a publisher account (use a different email than your buyer account)\n2️⃣ Go to your dashboard and add your website\n3️⃣ Set your price, niche, and turnaround time\n4️⃣ Your site gets reviewed — approved in about 2–3 minutes\n5️⃣ Start receiving orders and earning! 💸\n\nYou need DA 20+ to get approved. Any other questions? 😊",
  order: "Placing an order is super easy! Here's how:\n\n1️⃣ Add funds to your wallet (PayPal, USDT, Wise, or Bank Transfer)\n2️⃣ Browse 20,000+ publisher sites — filter by DA, niche, price, country\n3️⃣ Click **Buy Post** on the site you like\n4️⃣ Enter your Target URL and Anchor Text\n5️⃣ Publisher accepts within 3 days and delivers in 3–10 days\n6️⃣ 12-month link guarantee — if removed, we replace it free! ✅\n\nAnything else you'd like to know? 😊",
  withdraw: "Withdrawing your earnings is straightforward! 💰\n\n1️⃣ Go to your Publisher Dashboard → Balance section\n2️⃣ First, add your payment method in Account Settings:\n   • PayPal (7.5% fee)\n   • USDT TRC20 (9.5% fee)\n   • Wise or Bank Transfer\n3️⃣ Click Withdraw, enter amount, and submit\n4️⃣ Processed within 1–3 business days\n\nMinimum withdrawal is $20. Need more help? 😊",
  default: "I'm here to help! Could you give me a bit more detail about what you need? I can help with:\n\n• **Account issues** — password reset, verification, login problems\n• **Buying guest posts** — browsing, ordering, payments\n• **Publishing** — adding sites, managing orders, withdrawals\n• **Pricing** — cost breakdown for different DA ranges\n• **SEO questions** — DA, DR, link types explained\n\nJust ask anything! 😊"
};

function getFallback(text) {
  const t = (text || '').toLowerCase();
  if (t.match(/\b(hi|hello|hey|salam|assalam|helo|good|hiya|howdy)\b/)) return FALLBACKS.greeting;
  if (t.match(/\b(price|cost|how much|rate|pricing|cheap|expensive|kitna)\b/)) return FALLBACKS.pricing;
  if (t.match(/\b(publisher|publish|list|add site|sell|become|my site|my website)\b/)) return FALLBACKS.publisher;
  if (t.match(/\b(order|buy|purchase|how to order|place|guest post|backlink)\b/)) return FALLBACKS.order;
  if (t.match(/\b(withdraw|withdrawal|earn|money|payment|payout|cash out)\b/)) return FALLBACKS.withdraw;
  return FALLBACKS.default;
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SB_KEY;

function sbHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
}

async function saveChatHistory(userId, messages) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !userId) return;
  const payload = {
    user_id: userId,
    messages: JSON.stringify(messages),
    updated_at: new Date().toISOString()
  };
  // Upsert by user_id
  const existing = await fetch(`${SUPABASE_URL}/rest/v1/chat_history?user_id=eq.${encodeURIComponent(userId)}&select=id`, { headers: sbHeaders() });
  const rows = await existing.json().catch(() => []);
  if (Array.isArray(rows) && rows.length > 0) {
    await fetch(`${SUPABASE_URL}/rest/v1/chat_history?user_id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH', headers: sbHeaders(), body: JSON.stringify({ messages: payload.messages, updated_at: payload.updated_at })
    });
  } else {
    await fetch(`${SUPABASE_URL}/rest/v1/chat_history`, {
      method: 'POST', headers: { ...sbHeaders(), 'Prefer': 'return=minimal' }, body: JSON.stringify(payload)
    });
  }
}

async function loadChatHistory(userId) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !userId) return null;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/chat_history?user_id=eq.${encodeURIComponent(userId)}&select=messages,updated_at&limit=1`, { headers: sbHeaders() });
  const rows = await r.json().catch(() => []);
  if (!Array.isArray(rows) || !rows.length) return null;
  try { return JSON.parse(rows[0].messages); } catch(e) { return null; }
}

export default async function handler(req, res) {
  setCors(req, res);
      if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: load chat history ──
  if (req.method === 'GET') {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    const history = await loadChatHistory(user_id);
    return res.status(200).json({ success: true, messages: history || [] });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (rateLimit(ip)) return res.status(429).json({ error: 'Too many messages. Please wait a moment.' });

  const { messages, userType, action, userId } = req.body || {};

  // ── POST action=save_history: save chat history ──
  if (action === 'save_history') {
    if (!userId || !Array.isArray(messages)) return res.status(400).json({ error: 'userId and messages required' });
    await saveChatHistory(userId, messages);
    return res.status(200).json({ success: true });
  }

  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages required' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const lastMsg = messages[messages.length - 1]?.content || '';
  
  // ── SMART ACTION DETECTION (runs ALWAYS, before Claude API) ──
  const lm = lastMsg.toLowerCase();
  const emailMatch = lastMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const prevMsgs = messages.slice(-8).map(m => (m.content||'').toLowerCase()).join(' ');
  const prevMsgsRaw = messages.slice(-8).map(m => m.content||'');
  const isOtpFlow = prevMsgs.includes('otp') || prevMsgs.includes('verification code') || prevMsgs.includes('code not received') || prevMsgs.includes('verify');
  const isPasswordFlow = prevMsgs.includes('password') || prevMsgs.includes('forgot') || prevMsgs.includes('reset') || prevMsgs.includes('lost') || prevMsgs.includes('posword');
  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SECRET_KEY;
  const sbHeaders = { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };

  // Find email from conversation history
  function findEmailInHistory() {
    for (let i = prevMsgsRaw.length - 1; i >= 0; i--) {
      const m = prevMsgsRaw[i].match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (m) return m[0].toLowerCase();
    }
    return null;
  }

  // STEP 3: User sent new password after code was verified
  const codeVerifiedInHistory = prevMsgs.includes('code verified') || prevMsgs.includes('enter your new password') || prevMsgs.includes('set your new password');
  if (codeVerifiedInHistory && lastMsg.length >= 8 && !emailMatch && !/^\d{6}$/.test(lastMsg.trim())) {
    const newPassword = lastMsg.trim();
    const email = findEmailInHistory();
    if (email && SB_URL) {
      try {
        // Find the code from history
        let code = '';
        for (const m of prevMsgsRaw) { const c = m.trim().match(/^\d{6}$/); if (c) code = c[0]; }
        const r = await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,name,verify_code`, { headers: sbHeaders });
        const users = await r.json();
        if (users?.[0]) {
          const stored = users[0].verify_code || '';
          if (stored.startsWith('RESET|') &&  stored.split('|')[1] === code) {
            // Hash and set new password
            const enc = new TextEncoder();
            const buf = await crypto.subtle.digest('SHA-256', enc.encode(newPassword + '_uplyncio_salt'));
            const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
            await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
              method: 'PATCH', headers: sbHeaders, body: JSON.stringify({ password_hash: hash, verify_code: null })
            });
            // Send confirmation email
            try {
              const { sendVerifyEmail } = await import('./_email.js');
              await sendVerifyEmail({ to: email, name: users[0].name || 'there', code: 'Your password has been changed successfully. If you did not make this change, please contact info@uplyncio.com immediately.' }).catch(() => {});
            } catch(e) {}
            return res.status(200).json({ reply: `✅ **Password changed successfully!**\n\nYour new password has been set for **${email}**. A confirmation email has been sent.\n\nYou can now log in at [uplyncio.com](https://uplyncio.com) with your new password. Stay safe! 🔐` });
          }
        }
        return res.status(200).json({ reply: `Something went wrong. Please start the password reset process again by saying **"forgot password"**. 🔄` });
      } catch(e) { console.error('Bot set password error:', e.message); }
    }
  }

  // STEP 2: User sent 6-digit code → verify it
  const isCodeInput = /^\d{6}$/.test(lastMsg.trim());
  if (isCodeInput && isPasswordFlow) {
    const email = findEmailInHistory();
    const code = lastMsg.trim();
    if (email && SB_URL) {
      try {
        const r = await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=verify_code`, { headers: sbHeaders });
        const users = await r.json();
        if (users?.[0]) {
          const stored = users[0].verify_code || '';
          let isValid = false;
          
          // Check RESET:code:expiry format
          if (stored.startsWith('RESET|')) {
            const parts =  stored.split('|');
            if (parts[1] === code && new Date(parts[2]) > new Date()) isValid = true;
            else if (new Date(parts[2]) < new Date()) {
              return res.status(200).json({ reply: `❌ This code has **expired**. Please say **"forgot password"** to get a new code. ⏰` });
            }
          }
          // Check plain code format (from resend OTP)
          else if (stored === code) {
            isValid = true;
            // Convert to RESET format for password step
            const expiresAt = new Date(Date.now() + 10*60*1000).toISOString();
            await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
              method: 'PATCH', headers: sbHeaders,
              body: JSON.stringify({ verify_code: `RESET|${code}|${expiresAt}` })
            });
          }
          
          if (isValid) {
            return res.status(200).json({ reply: `✅ **Code verified!**\n\nNow please **enter your new password** below. Make sure it's at least 8 characters with uppercase, number, and special character.\n\nJust type your new password here 👇` });
          }
        }
        return res.status(200).json({ reply: `❌ **Invalid code**. Please check the code in your email and try again.\n\nIf you need a new code, say **"forgot password"**. 🔄` });
      } catch(e) { console.error('Bot verify code error:', e.message); }
    }
  }

  // STEP 1a: Password/forgot queries → ask for email
  if ((lm.includes('forgot') || lm.includes('password') || lm.includes('lost') || lm.includes('reset') || lm.includes('can\'t login') || lm.includes('cant login') || lm.includes('unable to login') || lm.includes('posword') || lm.includes('pasword')) && !emailMatch) {
    return res.status(200).json({ reply: `No worries, I can help! 🔐\n\nPlease share your **registered email address** and I'll send you a password reset code right away.\n\nJust type your email here 👇` });
  }

  // OTP/verification queries → ask for email
  if ((lm.includes('otp') || lm.includes('verification') || lm.includes('code') || lm.includes('not received') || lm.includes('didn\'t receive') || lm.includes('no code') || lm.includes('verify')) && !emailMatch) {
    return res.status(200).json({ reply: `I can help with that! 🛠️\n\nPlease share your **registered email address** and I'll send you a new verification code.\n\nJust type your email here 👇` });
  }

  // STEP 1b: User shared email in password flow → send reset code
  if (emailMatch && isPasswordFlow) {
    const email = emailMatch[0].toLowerCase();
    try {
      const otpRes = await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,name,email`, { headers: sbHeaders });
      const users = await otpRes.json();
      if (!users?.length) return res.status(200).json({ reply: `I couldn't find an account with **${email}**. Please check the spelling and try again. 🔍` });
      const user = users[0];
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10*60*1000).toISOString();
      await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH', headers: sbHeaders,
        body: JSON.stringify({ verify_code: `RESET|${resetCode}|${expiresAt}` })
      });
      const { sendVerifyEmail } = await import('./_email.js');
      await sendVerifyEmail({ to: email, name: user.name || 'there', code: resetCode }).catch(() => {});
      return res.status(200).json({ reply: `Done! I've sent a **6-digit reset code** to **${email}** 📩\n\nCheck your inbox (and spam folder) and type the code here 👇\n\nThe code expires in 10 minutes.` });
    } catch(e) { console.error('Bot password reset error:', e.message); }
  }

  // User shared email in OTP flow → send OTP
  if (emailMatch && (isOtpFlow || lm.includes('send') || lm.includes('code') || lm.includes('otp') || lm.includes('verify'))) {
    const email = emailMatch[0].toLowerCase();
    try {
      const otpRes = await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=id,name,email,email_verified`, { headers: sbHeaders });
      const users = await otpRes.json();
      if (!users?.length) return res.status(200).json({ reply: `I couldn't find an account with **${email}**. Please check the spelling. If you haven't signed up yet, go to [uplyncio.com](https://uplyncio.com) and create an account first! 🔗` });
      const user = users[0];
      if (user.email_verified) return res.status(200).json({ reply: `Good news! Your email **${email}** is already verified ✅\n\nYou can log in directly. If you're having trouble with your password, just tell me and I'll help you reset it! 🔑` });
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      await fetch(`${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH', headers: sbHeaders,
        body: JSON.stringify({ verify_code: newCode })
      });
      const { sendVerifyEmail } = await import('./_email.js');
      await sendVerifyEmail({ to: email, name: user.name || 'there', code: newCode }).catch(() => {});
      return res.status(200).json({ reply: `Done! I've sent a new verification code to **${email}** 📩\n\nCheck your inbox (and spam folder). Enter the code when you log in to verify your account.\n\nCode expires in 5 minutes. Let me know if you need more help! 🙌` });
    } catch(e) { console.error('Bot OTP error:', e.message); }
  }

  // If no API key, use fallbacks
  if (!ANTHROPIC_KEY) {
    return res.status(200).json({ reply: getFallback(lastMsg) });
  }

  const history = messages.slice(-20).filter(m => m.role && m.content);

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SYSTEM_PROMPT + (userType && userType !== 'visitor' ? `\n\nCurrent user is logged in as: ${userType}` : ''),
        messages: history
      })
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error('Claude API error:', r.status, err);
      const lastMsg = messages[messages.length - 1]?.content || '';
      return res.status(200).json({ reply: getFallback(lastMsg) });
    }

    const data = await r.json();
    const reply = data.content?.[0]?.text;

    if (!reply) {
      const lastMsg = messages[messages.length - 1]?.content || '';
      return res.status(200).json({ reply: getFallback(lastMsg) });
    }

    // Auto-save full conversation to Supabase (non-blocking)
    if (userId) {
      const fullHistory = [...history, { role: 'assistant', content: reply }];
      saveChatHistory(userId, fullHistory).catch(() => {});
    }

    return res.status(200).json({ reply });

  } catch(e) {
    console.error('Chatbot error:', e.message);
    const lastMsg = messages[messages.length - 1]?.content || '';
    return res.status(200).json({ reply: getFallback(lastMsg) });
  }
}
