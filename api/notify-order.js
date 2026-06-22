export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, category, topic, keywords, brief, goal, audience, wordCount, language, productUrl, anchor, deadline, price, buyerEmail } = req.body;

  const ADMIN_EMAIL = 'info@uplyncio.com';
  const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '923001234567'; // Set in Vercel env
  const CALLMEBOT_KEY = process.env.CALLMEBOT_KEY || ''; // CallMeBot API key

  // ── 1. Send Email via Resend ──
  let emailSent = false;
  try {
    const emailHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.header{background:linear-gradient(135deg,#4f7cff,#6366f1);padding:28px 36px;text-align:center}
.logo{color:#fff;font-size:24px;font-weight:800}
.logo span{color:#00d4aa}
.badge{display:inline-block;background:rgba(255,255,255,.2);border-radius:20px;padding:4px 14px;color:#fff;font-size:12px;margin-top:8px}
.body{padding:30px 36px}
.order-id{font-family:monospace;font-size:20px;font-weight:800;color:#4f7cff;background:#f0f4ff;border-radius:8px;padding:8px 16px;display:inline-block;margin-bottom:20px}
.field{margin-bottom:12px;border-bottom:1px solid #f1f5f9;padding-bottom:12px}
.field-lbl{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px}
.field-val{font-size:14px;color:#1a202c;font-weight:500;line-height:1.5}
.price-box{background:linear-gradient(135deg,#4f7cff,#6366f1);border-radius:12px;padding:16px 20px;margin:20px 0;display:flex;justify-content:space-between;align-items:center}
.footer{background:#f8faff;padding:18px 36px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8}
</style></head>
<body><div class="wrap">
  <div class="header">
    <div class="logo">Uply<span>ncio</span></div>
    <div class="badge">✍️ New Content Order Received</div>
  </div>
  <div class="body">
    <div class="order-id">${orderId}</div>
    <div class="field"><div class="field-lbl">Category</div><div class="field-val">${category}</div></div>
    <div class="field"><div class="field-lbl">Title / Topic</div><div class="field-val">${topic || '(Not specified — writer to suggest)'}</div></div>
    <div class="field"><div class="field-lbl">Target Keywords</div><div class="field-val">${keywords}</div></div>
    <div class="field"><div class="field-lbl">Brief Requirements</div><div class="field-val">${brief}</div></div>
    <div class="field"><div class="field-lbl">Content Goal</div><div class="field-val">${goal}</div></div>
    <div class="field"><div class="field-lbl">Target Audience</div><div class="field-val">${audience}</div></div>
    <div class="field"><div class="field-lbl">Word Count</div><div class="field-val">${wordCount}</div></div>
    <div class="field"><div class="field-lbl">Language</div><div class="field-val">${language}</div></div>
    <div class="field"><div class="field-lbl">Promoted Product URL</div><div class="field-val"><a href="${productUrl}" style="color:#4f7cff">${productUrl}</a></div></div>
    <div class="field"><div class="field-lbl">Anchor Text</div><div class="field-val">${anchor}</div></div>
    <div class="field"><div class="field-lbl">Deadline</div><div class="field-val">⏰ ${deadline}</div></div>
    <div class="field" style="border:none"><div class="field-lbl">Client Email</div><div class="field-val">${buyerEmail || 'Not provided'}</div></div>
    <div class="price-box">
      <div style="color:rgba(255,255,255,.8);font-size:13px;font-weight:600">Estimated Price</div>
      <div style="color:#fff;font-size:26px;font-weight:900;font-family:Manrope,sans-serif">$${price}.00</div>
    </div>
    <div style="background:#fef9ee;border:1px solid #fcd34d;border-radius:10px;padding:14px 16px;font-size:13px;color:#92400e">
      ⚡ <strong>Action required:</strong> Assign a writer and start working on this order within 24 hours. Contact the client at <strong>${buyerEmail}</strong> to confirm.
    </div>
  </div>
  <div class="footer">Uplyncio · info@uplyncio.com · Content is handled exclusively by Uplyncio team</div>
</div></body></html>`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Uplyncio Orders <onboarding@resend.dev>',
        to: [ADMIN_EMAIL],
        reply_to: buyerEmail || ADMIN_EMAIL,
        subject: `🆕 New Content Order ${orderId} — ${category} (${wordCount})`,
        html: emailHtml
      })
    });
    emailSent = r.ok;
  } catch(e) {
    console.error('Email error:', e);
  }

  // ── 2. Send WhatsApp via CallMeBot ──
  let whatsappSent = false;
  if (CALLMEBOT_KEY) {
    try {
      const msg = `🆕 *New Content Order!*\n\n📋 *ID:* ${orderId}\n📂 *Category:* ${category}\n📝 *Topic:* ${topic || 'Writer to suggest'}\n🔑 *Keywords:* ${keywords}\n📊 *Words:* ${wordCount}\n⏰ *Deadline:* ${deadline}\n💰 *Price:* $${price}\n👤 *Client:* ${buyerEmail || 'N/A'}\n\n✅ Assign writer within 24hrs!`;
      const encoded = encodeURIComponent(msg);
      const waUrl = `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_NUMBER}&text=${encoded}&apikey=${CALLMEBOT_KEY}`;
      const waR = await fetch(waUrl);
      whatsappSent = waR.ok;
    } catch(e) {
      console.error('WhatsApp error:', e);
    }
  }

  return res.status(200).json({ success: true, emailSent, whatsappSent });
}
