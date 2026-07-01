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

const SYSTEM_PROMPT = `You are Ace, the official AI assistant for Uplyncio — a premium guest posting and link building marketplace based in Pakistan, serving clients globally.

Your personality: Friendly, knowledgeable, professional, concise. You speak naturally — not robotic. Always respond in English only, regardless of what language the user writes in.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GREETINGS & SMALL TALK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
When someone says Hi/Hello/Salam/Assalamualaikum etc:
→ Greet warmly, introduce yourself briefly as Ace (Uplyncio's AI assistant), and ask how you can help.
Example: "Hi! 👋 I'm Ace, Uplyncio's AI assistant. How can I help you today? Whether it's about guest posting, link building, becoming a publisher, or anything else — I'm here!"

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
  greeting: "Hey there! 😊 I'm Ace, Uplyncio's AI assistant — always happy to chat!\n\nWhat can I help you with today? Whether it's buying guest posts, becoming a publisher, pricing, orders, or anything else — just ask! 🚀",
  pricing: "Great question! 💰 Here's a quick overview of our pricing:\n\n• DA 20–30 sites: $20 – $50\n• DA 30–50 sites: $50 – $150\n• DA 50–70 sites: $100 – $300\n• DA 70–90+ sites: $300 – $800+\n\nFor exact live prices, log in as a buyer and browse the marketplace. Want help with a specific DA range? 😊",
  publisher: "Great choice! Becoming a publisher on Uplyncio is free and easy 🎉\n\n1️⃣ Sign up with a publisher account (use a different email than your buyer account)\n2️⃣ Go to your dashboard and add your website\n3️⃣ Set your price, niche, and turnaround time\n4️⃣ Your site gets reviewed — approved in about 2–3 minutes\n5️⃣ Start receiving orders and earning! 💸\n\nYou need DA 20+ to get approved. Any other questions? 😊",
  order: "Placing an order is super easy! Here's how:\n\n1️⃣ Add funds to your wallet (PayPal, USDT, Wise, or Bank Transfer)\n2️⃣ Browse 20,000+ publisher sites — filter by DA, niche, price, country\n3️⃣ Click **Buy Post** on the site you like\n4️⃣ Enter your Target URL and Anchor Text\n5️⃣ Publisher accepts within 3 days and delivers in 3–10 days\n6️⃣ 12-month link guarantee — if removed, we replace it free! ✅\n\nAnything else you'd like to know? 😊",
  withdraw: "Withdrawing your earnings is straightforward! 💰\n\n1️⃣ Go to your Publisher Dashboard → Balance section\n2️⃣ First, add your payment method in Account Settings:\n   • PayPal (7.5% fee)\n   • USDT TRC20 (9.5% fee)\n   • Wise or Bank Transfer\n3️⃣ Click Withdraw, enter amount, and submit\n4️⃣ Processed within 1–3 business days\n\nMinimum withdrawal is $20. Need more help? 😊",
  default: "Hmm, that's a great question! 😊\n\nI want to make sure I give you the right answer — for anything specific, feel free to email **info@uplyncio.com** and our team will get back to you within 24 hours.\n\nOr just tell me more about what you need — guest posting, publishing, pricing, orders — I'm here! 🙌"
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (rateLimit(ip)) return res.status(429).json({ error: 'Too many messages. Please wait a moment.' });

  const { messages, userType } = req.body || {};
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Messages required' });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  // If no API key, use smart fallbacks
  if (!ANTHROPIC_KEY) {
    const lastMsg = messages[messages.length - 1]?.content || '';
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

    return res.status(200).json({ reply });

  } catch(e) {
    console.error('Chatbot error:', e.message);
    const lastMsg = messages[messages.length - 1]?.content || '';
    return res.status(200).json({ reply: getFallback(lastMsg) });
  }
}
