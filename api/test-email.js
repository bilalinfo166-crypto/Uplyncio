// Simple test email endpoint — hit /api/test-email?to=your@email.com
import { sendWelcomeEmail } from './email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const to = (req.query && req.query.to) || (req.body && req.body.to);
  if (!to) {
    return res.status(400).json({ error: 'Missing ?to=email parameter', usage: '/api/test-email?to=your@email.com' });
  }

  // Check env
  const hasKey = !!process.env.RESEND_API_KEY;
  if (!hasKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY not set in Vercel environment variables', hasKey: false });
  }

  try {
    const result = await sendWelcomeEmail({ to: to, name: 'Test User', role: 'publisher' });
    return res.status(200).json({
      success: result.ok,
      to: to,
      hasResendKey: hasKey,
      resendResponse: result,
      message: result.ok ? 'Email sent! Check inbox (and spam folder).' : 'Email failed — see resendResponse for error.'
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message, hasResendKey: hasKey });
  }
}
