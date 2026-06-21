export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, code, name } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Missing email or code' });

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Uplyncio <info@uplyncio.com>',
        to: [email],
        subject: `Your Uplyncio Verification Code: ${code}`,
        html: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.header{background:linear-gradient(135deg,#0a1628 0%,#1a3a6b 100%);padding:32px 40px;text-align:center}
.logo{color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px}
.logo span{color:#00d4aa}
.body{padding:36px 40px}
.greeting{font-size:16px;color:#1a202c;font-weight:600;margin-bottom:8px}
.subtext{font-size:14px;color:#64748b;line-height:1.7;margin-bottom:28px}
.code-box{background:#f8faff;border:2px dashed #4f7cff;border-radius:14px;padding:24px;text-align:center;margin-bottom:28px}
.code-label{font-size:12px;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px}
.code{font-size:42px;font-weight:800;letter-spacing:14px;color:#0a1628;font-family:'Courier New',monospace}
.timer{font-size:13px;color:#f59e0b;margin-top:10px;font-weight:600}
.note{background:#fff8f0;border-left:4px solid #f59e0b;border-radius:0 10px 10px 0;padding:14px 16px;font-size:13px;color:#92400e;line-height:1.6;margin-bottom:24px}
.divider{border:none;border-top:1px solid #e2e8f0;margin:24px 0}
.footer-text{font-size:12px;color:#94a3b8;text-align:center;line-height:1.8}
.footer{background:#f8faff;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0}
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">Uply<span>ncio</span></div>
    <div style="color:rgba(255,255,255,.5);font-size:13px;margin-top:6px">Guest Posting & Link Building Platform</div>
  </div>
  <div class="body">
    <div class="greeting">Hi ${name || email.split('@')[0]},</div>
    <div class="subtext">Welcome to Uplyncio! Use the 6-digit code below to verify your account. Enter it within <strong>3 minutes</strong>.</div>
    <div class="code-box">
      <div class="code-label">Your Verification Code</div>
      <div class="code">${code}</div>
      <div class="timer">⏰ Expires in 3 minutes</div>
    </div>
    <div class="note">⚠️ <strong>Never share this code.</strong> Uplyncio will never ask for your code via phone or chat. If you didn't request this, ignore this email.</div>
    <hr class="divider">
    <div class="footer-text">Questions? <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none;font-weight:600">info@uplyncio.com</a></div>
  </div>
  <div class="footer">
    <div class="footer-text">
      <strong style="color:#4f7cff">Uplyncio</strong> · Guest Posting & Link Building<br>
      © 2026 Uplyncio. All rights reserved.
    </div>
  </div>
</div>
</body>
</html>`
      })
    });

    const data = await response.json();
    if (response.ok) {
      return res.status(200).json({ success: true, id: data.id });
    } else {
      console.error('Resend error:', data);
      return res.status(500).json({ error: data.message || 'Failed to send email' });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
