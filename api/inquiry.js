export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { service, name, email, phone, website, budget, message, details } = req.body;
  if (!name || !email || !service) return res.status(400).json({ error: 'Missing required fields' });

  const detailsHtml = details ? Object.entries(details).map(([k,v]) => `<tr><td style="padding:8px 12px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e2e8f0">${k}</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${v}</td></tr>`).join('') : '';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Uplyncio Inquiries <onboarding@resend.dev>',
        to: ['info@uplyncio.com'],
        reply_to: email,
        subject: `🔔 New ${service} Inquiry from ${name}`,
        html: `
<div style="font-family:'Plus Jakarta Sans',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <div style="background:linear-gradient(135deg,#0f1628,#1a2d5a);padding:28px 32px">
    <div style="font-family:Manrope,sans-serif;font-size:22px;font-weight:800;color:#fff">Uply<span style="color:#4f7cff">ncio</span></div>
    <div style="color:rgba(255,255,255,.6);font-size:13px;margin-top:4px">New Service Inquiry</div>
  </div>
  <div style="padding:28px 32px">
    <div style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;color:#4f7cff;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Service Requested</div>
      <div style="font-size:20px;font-weight:800;color:#1a202c">${service}</div>
    </div>
    <h3 style="font-size:14px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin:0 0 12px">Client Details</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr><td style="padding:8px 12px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e2e8f0">Name</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${name}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e2e8f0">Email</td><td style="padding:8px 12px;border:1px solid #e2e8f0"><a href="mailto:${email}">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:8px 12px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e2e8f0">Phone</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${phone}</td></tr>` : ''}
      ${website ? `<tr><td style="padding:8px 12px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e2e8f0">Website</td><td style="padding:8px 12px;border:1px solid #e2e8f0"><a href="${website}">${website}</a></td></tr>` : ''}
      ${budget ? `<tr><td style="padding:8px 12px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e2e8f0">Budget</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${budget}</td></tr>` : ''}
      ${detailsHtml}
    </table>
    ${message ? `<h3 style="font-size:14px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin:0 0 10px">Message</h3><div style="background:#f8faff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;font-size:14px;color:#1a202c;line-height:1.7">${message}</div>` : ''}
    <div style="margin-top:24px;padding:14px 20px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;font-size:13px;color:#15803d">
      ✅ Reply directly to this email to respond to ${name}
    </div>
  </div>
  <div style="background:#f8faff;padding:16px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center">
    Sent via Uplyncio · info@uplyncio.com · uplyncio.com
  </div>
</div>`
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data });
    return res.status(200).json({ success: true });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
