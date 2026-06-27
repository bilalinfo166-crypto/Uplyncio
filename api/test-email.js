import { sendVerifyEmail, sendWelcomeEmail } from './email.js';

export default async function handler(req, res) {
  const { to, name } = req.query;
  
  if (!to) return res.status(400).json({ error: 'Missing ?to=email' });

  try {
    // Test verify email
    const r1 = await sendVerifyEmail({ to, name: name || 'Test User', code: '123456' });
    const r2 = await sendWelcomeEmail({ to, name: name || 'Test User', role: 'publisher' });
    
    return res.status(200).json({
      verifyEmail: r1,
      welcomeEmail: r2,
      RESEND_KEY_SET: !!process.env.RESEND_API_KEY,
      RESEND_KEY_PREFIX: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0,8)+'...' : 'NOT SET',
      FROM: 'info@uplyncio.com'
    });
  } catch(e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
