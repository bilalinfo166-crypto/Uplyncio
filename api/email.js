// Uplyncio Email Service — All 9 templates
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = 'Uplyncio <onboarding@resend.dev>';
const SITE = 'https://uplyncio.vercel.app';

// ── SHARED: Header ──
function header(category, accent = '#4f7cff') {
  return `
  <tr><td style="background:#07090f;padding:18px 28px;text-align:center;border-bottom:3px solid ${accent}">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:8px;vertical-align:middle">
          <div style="width:26px;height:26px;background:#4f7cff;border-radius:6px;text-align:center;line-height:26px;display:inline-block">
            <span style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#fff">U</span>
          </div>
        </td>
        <td style="vertical-align:middle">
          <span style="font-family:Arial,sans-serif;font-size:20px;font-weight:700;color:#ffffff">Uplyncio</span>
        </td>
      </tr></table>
      <br>
      <span style="font-family:Arial,sans-serif;font-size:10px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase">${category}</span>
    </td></tr></table>
  </td></tr>`;
}

// ── SHARED: Footer ──
function footer() {
  return `
  <tr><td style="background:#07090f;padding:24px 28px">
    <p style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#fff;margin:0 0 4px">Uplyncio</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);margin:0 0 14px;line-height:1.6">
      Premium guest posting &amp; link building marketplace.<br>20,000+ verified publisher sites across 30+ niches.
    </p>
    <div style="height:1px;background:rgba(255,255,255,0.08);margin:0 0 14px"></div>
    <p style="font-family:Arial,sans-serif;font-size:12px;margin:0 0 14px">
      <a href="${SITE}" style="color:rgba(255,255,255,0.45);text-decoration:none;margin-right:14px">Home</a>
      <a href="${SITE}/buyer.html" style="color:rgba(255,255,255,0.45);text-decoration:none;margin-right:14px">Marketplace</a>
      <a href="${SITE}/publisher.html" style="color:rgba(255,255,255,0.45);text-decoration:none;margin-right:14px">Become Publisher</a>
      <a href="mailto:info@uplyncio.com" style="color:rgba(255,255,255,0.45);text-decoration:none">Contact</a>
    </p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px"><tr>
      <td style="padding-right:8px"><a href="https://www.linkedin.com/company/uplyncio" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">in</a></td>
      <td style="padding-right:8px"><a href="https://www.facebook.com/profile.php?id=61579091653953" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">fb</a></td>
      <td style="padding-right:8px"><a href="https://www.instagram.com/uplyncio" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">ig</a></td>
      <td style="padding-right:8px"><a href="https://wa.me/923001234567" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">wa</a></td>
      <td><a href="https://twitter.com/uplyncio" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">X</a></td>
    </tr></table>
    <div style="height:1px;background:rgba(255,255,255,0.08);margin:0 0 12px"></div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td><span style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25)">© 2026 Uplyncio. All rights reserved.</span></td>
      <td align="right">
        <a href="${SITE}/privacy.html" style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;margin-right:10px">Privacy</a>
        <a href="${SITE}/terms.html" style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;margin-right:10px">Terms</a>
        <a href="mailto:info@uplyncio.com" style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none">info@uplyncio.com</a>
      </td>
    </tr></table>
    <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.18);text-align:center;margin:10px 0 0">
      This is an automated message — please do not reply directly to this email.
    </p>
  </td></tr>`;
}

// ── WRAPPER ──
function wrap(rows) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:24px 0">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb">
        ${rows}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── SEND via Resend ──
async function send(to, subject, html) {
  if (!RESEND_KEY) return { ok: false, error: 'No RESEND_API_KEY' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html })
  });
  const data = await r.json();
  console.log(`Email to ${to}: status=${r.status}`, data);
  return { ok: r.ok, data };
}

// ── BOX helpers ──
function codeBox(code, bg, border, labelColor, label) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
    <tr><td style="background:${bg};border:2px solid ${border};border-radius:10px;padding:20px;text-align:center">
      <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:${labelColor};letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">${label}</p>
      <p style="font-family:'Courier New',monospace;font-size:38px;font-weight:700;color:#1a202c;letter-spacing:14px;margin:0">${code}</p>
    </td></tr>
  </table>`;
}

function alertBox(bg, border, color, text) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
    <tr><td style="background:${bg};border:1px solid ${border};border-radius:8px;padding:12px 14px">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:${color};margin:0;line-height:1.6">${text}</p>
    </td></tr>
  </table>`;
}

function detailsBox(bg, border, rows) {
  const rowsHtml = rows.map(([label, value, valueColor = '#1a202c']) =>
    `<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">${label}</td>
     <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:${valueColor};padding:5px 0">${value}</td></tr>`
  ).join('');
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
    <tr><td style="background:${bg};border:1px solid ${border};border-radius:8px;padding:16px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">${rowsHtml}</table>
    </td></tr>
  </table>`;
}

function ctaBtn(link, text, color) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
    <tr><td align="center">
      <a href="${link}" style="display:inline-block;background:${color};color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px">${text}</a>
    </td></tr>
  </table>`;
}

function bodyStart(title, sub) {
  return `<tr><td style="padding:28px">
    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">${title}</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">${sub}</p>`;
}

function sign() {
  return `<p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">Best regards,<br><strong>Team Uplyncio</strong></p></td></tr>`;
}

// ══════════════════════════════════════════
// T1: WELCOME EMAIL
// ══════════════════════════════════════════
export async function sendWelcomeEmail({ to, name, role }) {
  const dash = role === 'publisher' ? `${SITE}/publisher.html` : `${SITE}/buyer.html`;
  const step3 = role === 'publisher'
    ? 'List your sites — Add your publisher sites, set your price, and start receiving guest post orders.'
    : 'Browse 20,000+ sites — Filter by DA, niche, country and price. Place your first order in minutes.';

  const steps = [
    'Verify your email — Check your inbox for the verification code we just sent and activate your account.',
    `Complete your profile — Add your details so ${role === 'publisher' ? 'buyers can trust your listings' : 'publishers can process your orders'} faster.`,
    step3
  ].map((s, i) => `<tr><td style="padding-bottom:8px"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px"><tr><td style="padding:12px 14px;width:24px;vertical-align:top"><span style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#4f7cff">${i+1}.</span></td><td style="padding:12px 14px 12px 0"><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5">${s}</p></td></tr></table></td></tr>`).join('');

  const html = wrap(
    header('Welcome Aboard', '#4f7cff') +
    bodyStart(`Welcome to Uplyncio, ${name}!`,
      `We are excited to have you on board. Your <strong style="color:#1a202c">${role}</strong> account has been created successfully. Here is what to do next:`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px"><tbody>${steps}</tbody></table>` +
    ctaBtn(dash, 'Get Started on Uplyncio →', '#4f7cff') +
    `<p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0 0 20px;line-height:1.7">If you have any questions, email us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> — we respond within 24 hours.</p>` +
    sign() + footer()
  );

  return send(to, `Welcome to Uplyncio, ${name}!`, html);
}

// ══════════════════════════════════════════
// T2: VERIFY EMAIL
// ══════════════════════════════════════════
export async function sendVerifyEmail({ to, name, code }) {
  const html = wrap(
    header('Email Verification', '#4f7cff') +
    bodyStart('Verify your email address',
      `Hi <strong style="color:#1a202c">${name}</strong>, use the 6-digit code below to verify your Uplyncio account. Do not share this code with anyone.`) +
    codeBox(code, '#f0f4ff', '#c7d7ff', '#4f7cff', 'Your verification code') +
    alertBox('#fef3c7', '#fde68a', '#92400e',
      '⏰ This code expires in <strong>10 minutes</strong>. If you did not create an Uplyncio account, please ignore this email.') +
    sign() + footer()
  );
  return send(to, `Your Uplyncio verification code: ${code}`, html);
}

// ══════════════════════════════════════════
// T3: EMAIL VERIFIED SUCCESSFULLY
// ══════════════════════════════════════════
export async function sendEmailVerifiedEmail({ to, name, role, email, verifiedAt }) {
  const dash = role === 'publisher' ? `${SITE}/publisher.html` : `${SITE}/buyer.html`;
  const html = wrap(
    header('Verified Successfully', '#00c27a') +
    bodyStart('Email verified successfully!',
      `Hi <strong style="color:#1a202c">${name}</strong>, your email has been verified. Your Uplyncio account is now fully active.`) +
    detailsBox('#f0fdf4', '#bbf7d0', [
      ['Account type', role.charAt(0).toUpperCase() + role.slice(1)],
      ['Email', email],
      ['Verified on', verifiedAt]
    ]) +
    ctaBtn(dash, 'Go to Dashboard →', '#00c27a') +
    sign() + footer()
  );
  return send(to, 'Your Uplyncio email is verified!', html);
}

// ══════════════════════════════════════════
// T4: OTP VERIFICATION (Login)
// ══════════════════════════════════════════
export async function sendOtpEmail({ to, name, code, expiresIn = '5 minutes' }) {
  const html = wrap(
    header('OTP Verification', '#6366f1') +
    bodyStart('Your one-time login code',
      `Hi <strong style="color:#1a202c">${name}</strong>, you requested a one-time code to log in to your Uplyncio account. Enter the code below to continue.`) +
    codeBox(code, '#f5f3ff', '#ddd6fe', '#6366f1', 'One-time login code') +
    alertBox('#fef3c7', '#fde68a', '#92400e',
      `⏰ This code is valid for <strong>${expiresIn} only</strong>. If you did not request this, your account may be at risk — please change your password immediately.`) +
    alertBox('#f8faff', '#e0e7ff', '#475569',
      '🔒 <strong style="color:#1a202c">Security reminder:</strong> Uplyncio will never ask you to share this code via email, phone, or chat.') +
    ctaBtn(SITE, 'Go to Uplyncio →', '#6366f1') +
    sign() + footer()
  );
  return send(to, `Your Uplyncio login code: ${code}`, html);
}

// ══════════════════════════════════════════
// T5: FORGOT PASSWORD
// ══════════════════════════════════════════
export async function sendForgotPasswordEmail({ to, name, resetLink, expiresIn = '1 hour' }) {
  const html = wrap(
    header('Password Reset', '#f59e0b') +
    bodyStart('Reset your password',
      `Hi <strong style="color:#1a202c">${name}</strong>, we received a request to reset the password for your Uplyncio account. Click the button below to create a new password.`) +
    ctaBtn(resetLink, 'Reset My Password →', '#f59e0b') +
    alertBox('#fef3c7', '#fde68a', '#92400e',
      `⏰ This link expires in <strong>${expiresIn}</strong>. If you did not request a password reset, please ignore this email — your password will not be changed.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px"><tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px"><p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0 0 6px">If the button does not work, copy and paste this link:</p><p style="font-family:Arial,sans-serif;font-size:12px;color:#4f7cff;margin:0;word-break:break-all">${resetLink}</p></td></tr></table>` +
    sign() + footer()
  );
  return send(to, 'Reset your Uplyncio password', html);
}

// ══════════════════════════════════════════
// T6: PASSWORD RESET SUCCESSFUL
// ══════════════════════════════════════════
export async function sendPasswordResetSuccessEmail({ to, name, email, changedAt, ipAddress }) {
  const html = wrap(
    header('Password Updated', '#00c27a') +
    bodyStart('Password reset successful',
      `Hi <strong style="color:#1a202c">${name}</strong>, your Uplyncio account password has been reset successfully. You can now log in with your new password.`) +
    detailsBox('#f0fdf4', '#bbf7d0', [
      ['Account', email],
      ['Changed on', changedAt],
      ['IP Address', ipAddress || 'Unknown']
    ]) +
    alertBox('#fef2f2', '#fecaca', '#b91c1c',
      '🔴 If you did not make this change, your account may be compromised. <strong>Contact us immediately</strong> at <a href="mailto:info@uplyncio.com" style="color:#b91c1c">info@uplyncio.com</a>') +
    ctaBtn(SITE, 'Log In to Uplyncio →', '#00c27a') +
    sign() + footer()
  );
  return send(to, 'Your Uplyncio password has been reset', html);
}

// ══════════════════════════════════════════
// T7: LOGIN FROM NEW DEVICE
// ══════════════════════════════════════════
export async function sendNewDeviceLoginEmail({ to, name, device, location, ipAddress, loginTime }) {
  const html = wrap(
    header('Security Alert', '#ef4444') +
    bodyStart('New login detected on your account',
      `Hi <strong style="color:#1a202c">${name}</strong>, we detected a login to your Uplyncio account from a new device or location. Review the details below.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px"><tr><td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px">
      <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#ef4444;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px">Login Details</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Date &amp; Time</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${loginTime}</td></tr>
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Device</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${device || 'Unknown device'}</td></tr>
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Location</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${location || 'Unknown location'}</td></tr>
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">IP Address</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${ipAddress || 'Unknown'}</td></tr>
      </table>
    </td></tr></table>` +
    alertBox('#fef2f2', '#fecaca', '#b91c1c',
      '🔴 If this was <strong>not you</strong>, change your password immediately and contact us at <a href="mailto:info@uplyncio.com" style="color:#b91c1c">info@uplyncio.com</a> — we will lock and secure your account.') +
    alertBox('#f8faff', '#e0e7ff', '#475569',
      '✅ <strong style="color:#1a202c">If this was you</strong>, no action is needed. You can safely ignore this email.') +
    ctaBtn(SITE, 'Secure My Account →', '#ef4444') +
    sign() + footer()
  );
  return send(to, '⚠️ New login detected on your Uplyncio account', html);
}

// ══════════════════════════════════════════
// T8: EMAIL CHANGED
// ══════════════════════════════════════════
export async function sendEmailChangedEmail({ to, name, oldEmail, newEmail, changedAt }) {
  const html = wrap(
    header('Account Update', '#f59e0b') +
    bodyStart('Your email address was changed',
      `Hi <strong style="color:#1a202c">${name}</strong>, the email address linked to your Uplyncio account has been updated. Here are the details:`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px"><tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:16px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Previous email</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#94a3b8;padding:5px 0;text-decoration:line-through">${oldEmail}</td></tr>
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">New email</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#00c27a;padding:5px 0">${newEmail}</td></tr>
        <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Changed on</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${changedAt}</td></tr>
      </table>
    </td></tr></table>` +
    alertBox('#fef3c7', '#fde68a', '#92400e',
      `📧 From now on, use <strong>${newEmail}</strong> to log in to your Uplyncio account. Your old email is no longer linked.`) +
    alertBox('#fef2f2', '#fecaca', '#b91c1c',
      '🔴 If you did not make this change, contact us <strong>immediately</strong> at <a href="mailto:info@uplyncio.com" style="color:#b91c1c">info@uplyncio.com</a> — we will secure your account and reverse this change.') +
    ctaBtn(SITE, 'Go to Uplyncio →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, 'Your Uplyncio email address was changed', html);
}

// ══════════════════════════════════════════
// T9: PASSWORD CHANGED
// ══════════════════════════════════════════
export async function sendPasswordChangedEmail({ to, name, email, changedAt, ipAddress }) {
  const html = wrap(
    header('Security Update', '#00c27a') +
    bodyStart('Password changed successfully',
      `Hi <strong style="color:#1a202c">${name}</strong>, your Uplyncio account password was changed successfully. This is a security confirmation.`) +
    detailsBox('#f0fdf4', '#bbf7d0', [
      ['Account', email],
      ['Changed on', changedAt],
      ['IP Address', ipAddress || 'Unknown']
    ]) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px"><tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0 0 8px;line-height:1.6">🔒 <strong style="color:#1a202c">Keep your account secure:</strong></p>
      <ul style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;padding-left:18px;line-height:1.8">
        <li>Never share your password with anyone including Uplyncio staff</li>
        <li>Use a unique password that you do not use on other sites</li>
        <li>Enable 2-factor authentication when available</li>
      </ul>
    </td></tr></table>` +
    alertBox('#fef2f2', '#fecaca', '#b91c1c',
      '🔴 If you did not change your password, your account may be compromised. <strong>Contact us immediately</strong> at <a href="mailto:info@uplyncio.com" style="color:#b91c1c">info@uplyncio.com</a>') +
    ctaBtn(SITE, 'Log In to Uplyncio →', '#00c27a') +
    sign() + footer()
  );
  return send(to, 'Your Uplyncio password was changed', html);
}

// ══════════════════════════════════════════════════════════════════
// PUBLISHER TEMPLATES
// ══════════════════════════════════════════════════════════════════

// P1: New Order Received (Publisher)
export async function sendPublisherNewOrder({ to, name, orderId, siteUrl, buyerName, price, anchorText, targetUrl, deadline, content, requirements }) {
  const html = wrap(
    header('New Order Received', '#4f7cff') +
    bodyStart('You have a new order!',
      `Hi <strong style="color:#1a202c">${name}</strong>, a buyer has placed an order on your site. Please review the details below and accept or decline within <strong style="color:#1a202c">24 hours</strong>.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:8px;padding:16px">
        <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#4f7cff;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px">Order Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Order ID</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;padding:5px 0">${orderId}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Your Site</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${siteUrl}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Buyer</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${buyerName}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Anchor Text</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0">${anchorText}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Target URL</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0;word-break:break-all">${targetUrl}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Deadline</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#ef4444;padding:5px 0">${deadline}</td></tr>
          <tr style="border-top:1px solid #e0e7ff"><td style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a202c;padding:10px 0 4px">Your Earnings</td><td align="right" style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:#00c27a;padding:10px 0 4px">$${price}</td></tr>
        </table>
      </td></tr>
    </table>` +
    (content ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px"><tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px"><p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#4f7cff;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Content / Article</p><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">${content.substring(0,300)}${content.length > 300 ? '...' : ''}</p></td></tr></table>` : '') +
    (requirements ? alertBox('#fef3c7','#fde68a','#92400e', `📋 <strong>Special Requirements:</strong> ${requirements}`) : '') +
    ctaBtn(`${SITE}/publisher.html`, 'View Order & Accept →', '#4f7cff') +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '⏰ Please respond within <strong>24 hours</strong>. Orders not accepted within this window may be reassigned to another publisher.') +
    sign() + footer()
  );
  return send(to, `New Order ${orderId} — $${price} on ${siteUrl}`, html);
}

// P2: Order Accepted Confirmation (Publisher)
export async function sendPublisherOrderAccepted({ to, name, orderId, siteUrl, price, deadline }) {
  const html = wrap(
    header('Order Accepted', '#00c27a') +
    bodyStart('Order accepted successfully',
      `Hi <strong style="color:#1a202c">${name}</strong>, you have accepted order <strong style="color:#1a202c">${orderId}</strong>. The buyer has been notified. Please publish the post before the deadline.`) +
    detailsBox('#f0fdf4','#bbf7d0', [
      ['Order ID', orderId],
      ['Site', siteUrl],
      ['Your Earnings', `$${price}`, '#00c27a'],
      ['Deadline', deadline, '#ef4444']
    ]) +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '📝 <strong>Next steps:</strong> Publish the guest post on your site, then submit the live URL in your dashboard to mark the order complete and receive payment.') +
    ctaBtn(`${SITE}/publisher.html`, 'Go to Publisher Dashboard →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `Order ${orderId} Accepted — Publish by ${deadline}`, html);
}

// P3: Order Completed & Payment Released (Publisher)
export async function sendPublisherOrderComplete({ to, name, orderId, siteUrl, price, liveUrl, totalEarnings }) {
  const html = wrap(
    header('Payment Released', '#00c27a') +
    bodyStart(`Payment of $${price} released!`,
      `Hi <strong style="color:#1a202c">${name}</strong>, the buyer has confirmed receipt of order <strong style="color:#1a202c">${orderId}</strong>. Your payment has been released to your Uplyncio wallet.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#64748b;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Amount Credited</p>
        <p style="font-family:Arial,sans-serif;font-size:42px;font-weight:800;color:#00c27a;margin:0;line-height:1">$${price}</p>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#64748b;margin:8px 0 0">Total wallet balance: <strong style="color:#1a202c">$${totalEarnings}</strong></p>
      </td></tr>
    </table>` +
    detailsBox('#f8faff','#e0e7ff', [
      ['Order ID', orderId],
      ['Site', siteUrl],
      ['Live URL', liveUrl || 'Confirmed', '#4f7cff']
    ]) +
    ctaBtn(`${SITE}/publisher.html`, 'View Wallet & Withdraw →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `💰 $${price} Payment Released — Order ${orderId}`, html);
}

// P4: New Message from Buyer (Publisher)
export async function sendPublisherNewMessage({ to, name, buyerName, orderId, message, siteUrl }) {
  const html = wrap(
    header('New Message', '#6366f1') +
    bodyStart(`Message from ${buyerName}`,
      `Hi <strong style="color:#1a202c">${name}</strong>, you have received a new message from the buyer regarding order <strong style="color:#1a202c">${orderId}</strong>.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px">
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px"><tr>
          <td style="width:36px;height:36px;background:#6366f1;border-radius:50%;text-align:center;line-height:36px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#fff">${buyerName.charAt(0).toUpperCase()}</td>
          <td style="padding-left:10px"><p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;margin:0">${buyerName}</p><p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0">Order ${orderId} · ${siteUrl}</p></td>
        </tr></table>
        <div style="background:#fff;border-radius:8px;padding:12px 14px;border-left:3px solid #6366f1">
          <p style="font-family:Arial,sans-serif;font-size:14px;color:#1a202c;margin:0;line-height:1.7">${message}</p>
        </div>
      </td></tr>
    </table>` +
    ctaBtn(`${SITE}/publisher.html`, 'Reply to Message →', '#6366f1') +
    alertBox('#fef3c7','#fde68a','#92400e',
      '⏰ Please reply within <strong>12 hours</strong> to maintain your publisher response rating.') +
    sign() + footer()
  );
  return send(to, `💬 New message from ${buyerName} — Order ${orderId}`, html);
}

// P5: Order Cancelled by Buyer (Publisher)
export async function sendPublisherOrderCancelled({ to, name, orderId, siteUrl, reason, price }) {
  const html = wrap(
    header('Order Cancelled', '#ef4444') +
    bodyStart('An order has been cancelled',
      `Hi <strong style="color:#1a202c">${name}</strong>, order <strong style="color:#1a202c">${orderId}</strong> has been cancelled by the buyer. No payment will be processed for this order.`) +
    detailsBox('#fef2f2','#fecaca', [
      ['Order ID', orderId],
      ['Site', siteUrl],
      ['Order Value', `$${price}`],
      ['Cancelled By', 'Buyer'],
      ['Reason', reason || 'Not specified']
    ]) +
    alertBox('#f8faff','#e0e7ff','#475569',
      'ℹ️ This cancellation does not affect your publisher rating. Your other active orders remain unaffected. Keep delivering quality content to maintain your standing.') +
    ctaBtn(`${SITE}/publisher.html`, 'View Active Orders →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Order ${orderId} Cancelled — No action required`, html);
}

// P6: Monthly Publisher Report
export async function sendPublisherMonthlyReport({ to, name, month, year, totalOrders, completedOrders, totalEarnings, pendingEarnings, topSite, avgRating, newOrders }) {
  const html = wrap(
    header('Monthly Report', '#4f7cff') +
    bodyStart(`Your ${month} ${year} Performance Report`,
      `Hi <strong style="color:#1a202c">${name}</strong>, here is your Uplyncio publisher performance summary for <strong style="color:#1a202c">${month} ${year}</strong>.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="width:50%;padding-right:6px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:8px;padding:14px;text-align:center">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Total Earnings</p>
            <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;color:#00c27a;margin:0">$${totalEarnings}</p></td></tr>
          </table>
        </td>
        <td style="width:50%;padding-left:6px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;text-align:center">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Completed Orders</p>
            <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;color:#1a202c;margin:0">${completedOrders}</p></td></tr>
          </table>
        </td>
      </tr>
    </table>` +
    detailsBox('#f8faff','#e0e7ff', [
      ['Total Orders Received', totalOrders],
      ['Completed Orders', completedOrders],
      ['Pending Earnings', `$${pendingEarnings}`],
      ['Top Performing Site', topSite],
      ['Average Rating', `${avgRating} ⭐`],
      ['New Orders This Month', newOrders]
    ]) +
    ctaBtn(`${SITE}/publisher.html`, 'View Full Report →', '#4f7cff') +
    alertBox('#fef3c7','#fde68a','#92400e',
      `🎯 <strong>Tip for ${month}:</strong> Publishers with response times under 6 hours receive 40% more orders. Keep your dashboard active to maximize earnings.`) +
    sign() + footer()
  );
  return send(to, `📊 Your ${month} ${year} Publisher Report — $${totalEarnings} earned`, html);
}

// P7: Sites Approved (Publisher) — all approved sites in one email
export async function sendPublisherSitesApproved({ to, name, sites }) {
  // sites = array of { siteUrl, da, dr, price }
  const count = sites.length;
  const siteRows = sites.map(s =>
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px">
      <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a202c;padding-bottom:8px">${s.siteUrl}</td>
            <td align="right"><span style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;background:#00c27a;color:#fff;padding:3px 10px;border-radius:100px">✅ Approved</span></td>
          </tr>
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:12px;color:#64748b">DA ${s.da} &nbsp;·&nbsp; DR ${s.dr} &nbsp;·&nbsp; <strong style="color:#00c27a">$${s.price}/post</strong></td>
          </tr>
        </table>
      </td></tr>
    </table>`
  ).join('');

  const html = wrap(
    header('Uplyncio Approved Sites', '#00c27a') +
    bodyStart(
      count === 1 ? 'Your site is now live on Uplyncio!' : `${count} of your sites are now live on Uplyncio!`,
      `Hi <strong style="color:#1a202c">${name}</strong>, your ${count === 1 ? 'site has' : `${count} sites have`} been reviewed and approved by the Uplyncio team. ${count === 1 ? 'It is' : 'They are'} now live on our marketplace and visible to all buyers.`
    ) +
    siteRows +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '💡 <strong>Pro tip:</strong> Publishers with complete profiles and sample articles receive 3x more orders. Make sure your listings are fully filled out to maximize earnings.') +
    ctaBtn(`${SITE}/publisher.html`, 'View My Live Listings →', '#00c27a') +
    sign() + footer()
  );

  const subject = count === 1
    ? `✅ Your site is live on Uplyncio Marketplace`
    : `✅ ${count} of your sites are now live on Uplyncio`;

  return send(to, subject, html);
}

// P8: Site Rejected by Admin (Publisher)
export async function sendPublisherSiteRejected({ to, name, siteUrl, reason }) {
  const html = wrap(
    header('Site Review Update', '#ef4444') +
    bodyStart('Your site needs some updates',
      `Hi <strong style="color:#1a202c">${name}</strong>, our team has reviewed your submitted site and found some issues that need to be resolved before it can go live on the marketplace.`) +
    detailsBox('#fef2f2','#fecaca', [
      ['Site URL', siteUrl],
      ['Status', '❌ Needs Revision', '#ef4444'],
      ['Reason', reason || 'Does not meet our quality standards']
    ]) +
    alertBox('#f8faff','#e0e7ff','#475569',
      `📋 <strong>Common issues:</strong> Low organic traffic, high spam score, thin content, or domain authority below our minimum threshold. Please review and resubmit once resolved.`) +
    ctaBtn(`${SITE}/publisher.html`, 'Resubmit After Fixing →', '#4f7cff') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
          Have questions? Contact our team at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> — we are happy to guide you through the resubmission process.
        </p>
      </td></tr>
    </table>` +
    sign() + footer()
  );
  return send(to, `Site Review Update — ${siteUrl}`, html);
}


// ══════════════════════════════════════════════════════════════════
// BUYER TEMPLATES
// ══════════════════════════════════════════════════════════════════

// B1: Order Placed Successfully (Buyer)
export async function sendBuyerOrderPlaced({ to, name, orderId, siteUrl, siteDA, siteDR, price, anchorText, targetUrl, deadline }) {
  const html = wrap(
    header('Order Confirmed', '#00c27a') +
    bodyStart('Your order has been placed!',
      `Hi <strong style="color:#1a202c">${name}</strong>, your guest post order has been received and sent to the publisher. You will be notified once the publisher accepts.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:8px;padding:16px">
        <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#4f7cff;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px">Order Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Order ID</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;padding:5px 0">${orderId}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Publisher Site</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${siteUrl}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">DA / DR</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">DA ${siteDA} / DR ${siteDR}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Anchor Text</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0">${anchorText}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Target URL</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0;word-break:break-all">${targetUrl}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Expected Delivery</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#f59e0b;padding:5px 0">${deadline}</td></tr>
          <tr style="border-top:1px solid #e0e7ff"><td style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a202c;padding:10px 0 4px">Total Paid</td><td align="right" style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:#1a202c;padding:10px 0 4px">$${price}</td></tr>
        </table>
      </td></tr>
    </table>` +
    alertBox('#f0fdf4','#bbf7d0','#15803d',
      '🔒 Your payment is held securely in escrow and will only be released to the publisher once you confirm the link is live and correct.') +
    ctaBtn(`${SITE}/buyer.html`, 'Track Your Order →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Order Confirmed ${orderId} — ${siteUrl}`, html);
}

// B2: Order Accepted by Publisher (Buyer)
export async function sendBuyerOrderAccepted({ to, name, orderId, siteUrl, publisherName, deadline }) {
  const html = wrap(
    header('Order Accepted', '#00c27a') +
    bodyStart('Publisher accepted your order!',
      `Hi <strong style="color:#1a202c">${name}</strong>, the publisher has accepted your order <strong style="color:#1a202c">${orderId}</strong> and is now working on your guest post.`) +
    detailsBox('#f0fdf4','#bbf7d0', [
      ['Order ID', orderId],
      ['Publisher Site', siteUrl],
      ['Publisher', publisherName],
      ['Expected Delivery', deadline, '#f59e0b'],
      ['Status', '🟢 In Progress', '#00c27a']
    ]) +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '📝 The publisher is now writing and preparing your guest post. You will receive an email notification as soon as it goes live.') +
    ctaBtn(`${SITE}/buyer.html`, 'Track Order Progress →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `Order ${orderId} Accepted — Publisher is working on it`, html);
}

// B3: Order Delivered — Link is Live (Buyer)
export async function sendBuyerOrderDelivered({ to, name, orderId, siteUrl, liveUrl, anchorText, targetUrl, siteDA }) {
  const html = wrap(
    header('Link is Live!', '#00c27a') +
    bodyStart(`Your backlink is live on DA ${siteDA}!`,
      `Hi <strong style="color:#1a202c">${name}</strong>, great news! Your guest post has been published and your backlink is now live. Please verify the link below and confirm delivery.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0fdf4;border:1.5px solid #00c27a;border-radius:8px;padding:16px">
        <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#15803d;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px">Delivery Confirmation</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Order ID</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;padding:5px 0">${orderId}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Publisher Site</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${siteUrl}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Live Article URL</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#00c27a;padding:5px 0;word-break:break-all"><a href="${liveUrl}" style="color:#00c27a">${liveUrl}</a></td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Your Backlink</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0;word-break:break-all">${targetUrl}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Anchor Text</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${anchorText}</td></tr>
        </table>
      </td></tr>
    </table>` +
    alertBox('#fef3c7','#fde68a','#92400e',
      '⚠️ Please verify the live link within <strong>48 hours</strong> and confirm delivery in your dashboard. Payment will be released to the publisher after your confirmation.') +
    ctaBtn(`${SITE}/buyer.html`, 'Confirm Delivery →', '#00c27a') +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '🔒 <strong>12-Month Guarantee:</strong> If this link is removed within 12 months, Uplyncio will replace it at no extra cost.') +
    sign() + footer()
  );
  return send(to, `🔗 Your backlink is live on ${siteUrl} — Order ${orderId}`, html);
}

// B4: New Message from Publisher (Buyer)
export async function sendBuyerNewMessage({ to, name, publisherName, orderId, message, siteUrl }) {
  const html = wrap(
    header('New Message', '#6366f1') +
    bodyStart(`Message from ${publisherName}`,
      `Hi <strong style="color:#1a202c">${name}</strong>, you have received a new message from the publisher regarding your order <strong style="color:#1a202c">${orderId}</strong>.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px">
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px"><tr>
          <td style="width:36px;height:36px;background:#6366f1;border-radius:50%;text-align:center;line-height:36px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#fff">${publisherName.charAt(0).toUpperCase()}</td>
          <td style="padding-left:10px"><p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;margin:0">${publisherName}</p><p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0">Order ${orderId} · ${siteUrl}</p></td>
        </tr></table>
        <div style="background:#fff;border-radius:8px;padding:12px 14px;border-left:3px solid #6366f1">
          <p style="font-family:Arial,sans-serif;font-size:14px;color:#1a202c;margin:0;line-height:1.7">${message}</p>
        </div>
      </td></tr>
    </table>` +
    ctaBtn(`${SITE}/buyer.html`, 'Reply to Message →', '#6366f1') +
    sign() + footer()
  );
  return send(to, `💬 New message from ${publisherName} — Order ${orderId}`, html);
}

// B5: Order Cancelled (Buyer)
export async function sendBuyerOrderCancelled({ to, name, orderId, siteUrl, reason, price, refundStatus }) {
  const html = wrap(
    header('Order Cancelled', '#ef4444') +
    bodyStart('Your order has been cancelled',
      `Hi <strong style="color:#1a202c">${name}</strong>, order <strong style="color:#1a202c">${orderId}</strong> has been cancelled. Here are the details:`) +
    detailsBox('#fef2f2','#fecaca', [
      ['Order ID', orderId],
      ['Site', siteUrl],
      ['Order Value', `$${price}`],
      ['Reason', reason || 'Cancelled by request'],
      ['Refund Status', refundStatus || 'Full refund — within 3-5 business days', '#00c27a']
    ]) +
    alertBox('#f0fdf4','#bbf7d0','#15803d',
      `💰 <strong>Refund Notice:</strong> Your payment of <strong>$${price}</strong> will be refunded to your original payment method within 3-5 business days.`) +
    ctaBtn(`${SITE}/buyer.html`, 'Place a New Order →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Order ${orderId} Cancelled — Refund Processing`, html);
}

// B6: Order Rejected by Publisher (Buyer)
export async function sendBuyerOrderRejected({ to, name, orderId, siteUrl, reason, price }) {
  const html = wrap(
    header('Order Not Accepted', '#ef4444') +
    bodyStart('Publisher declined your order',
      `Hi <strong style="color:#1a202c">${name}</strong>, unfortunately the publisher was unable to accept your order <strong style="color:#1a202c">${orderId}</strong>. Your payment will be fully refunded.`) +
    detailsBox('#fef2f2','#fecaca', [
      ['Order ID', orderId],
      ['Site', siteUrl],
      ['Publisher\'s Reason', reason || 'Unable to fulfill at this time'],
      ['Refund', `$${price} — Full refund within 3-5 days`, '#00c27a']
    ]) +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '🔍 <strong>Alternative sites available:</strong> We have 20,000+ verified publisher sites. Browse similar sites in the same niche to find a replacement quickly.') +
    ctaBtn(`${SITE}/buyer.html`, 'Find Alternative Sites →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Order ${orderId} Not Accepted — Full Refund Processing`, html);
}

// B7: Monthly Buyer Report
export async function sendBuyerMonthlyReport({ to, name, month, year, totalOrders, liveLinks, totalSpent, avgDA, topNiche, pendingOrders }) {
  const html = wrap(
    header('Monthly Report', '#4f7cff') +
    bodyStart(`Your ${month} ${year} Link Building Report`,
      `Hi <strong style="color:#1a202c">${name}</strong>, here is your Uplyncio link building summary for <strong style="color:#1a202c">${month} ${year}</strong>.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="width:33%;padding-right:4px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:8px;padding:14px;text-align:center">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Total Spent</p>
            <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#4f7cff;margin:0">$${totalSpent}</p></td></tr>
          </table>
        </td>
        <td style="width:33%;padding:0 4px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;text-align:center">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Live Links</p>
            <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#00c27a;margin:0">${liveLinks}</p></td></tr>
          </table>
        </td>
        <td style="width:33%;padding-left:4px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px;text-align:center">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Avg DA</p>
            <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#b45309;margin:0">${avgDA}</p></td></tr>
          </table>
        </td>
      </tr>
    </table>` +
    detailsBox('#f8faff','#e0e7ff', [
      ['Total Orders This Month', totalOrders],
      ['Live Links Acquired', liveLinks],
      ['Pending Orders', pendingOrders],
      ['Top Niche', topNiche],
      ['Average Domain Authority', `DA ${avgDA}`]
    ]) +
    ctaBtn(`${SITE}/buyer.html`, 'View All Orders →', '#4f7cff') +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      `🎯 <strong>SEO Tip:</strong> Building 5-10 high-DA links per month consistently is more effective than large one-time campaigns. Keep your link building steady for best results.`) +
    sign() + footer()
  );
  return send(to, `📊 Your ${month} ${year} Link Building Report — ${liveLinks} links live`, html);
}

// B8: Reminder — Order Awaiting Confirmation (Buyer)
export async function sendBuyerConfirmReminder({ to, name, orderId, siteUrl, liveUrl, hoursLeft }) {
  const html = wrap(
    header('Action Required', '#f59e0b') +
    bodyStart('Please confirm your delivery',
      `Hi <strong style="color:#1a202c">${name}</strong>, your guest post for order <strong style="color:#1a202c">${orderId}</strong> has been delivered. You have <strong style="color:#ef4444">${hoursLeft} hours</strong> left to confirm.`) +
    detailsBox('#fef3c7','#fde68a', [
      ['Order ID', orderId],
      ['Publisher Site', siteUrl],
      ['Live URL', liveUrl, '#4f7cff'],
      ['Time to Confirm', `${hoursLeft} hours remaining`, '#ef4444']
    ]) +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      `⚠️ If you do not confirm within <strong>${hoursLeft} hours</strong>, the order will be automatically marked as complete and payment released to the publisher.`) +
    ctaBtn(`${SITE}/buyer.html`, 'Confirm Delivery Now →', '#f59e0b') +
    sign() + footer()
  );
  return send(to, `⏰ Action Required: Confirm Order ${orderId} — ${hoursLeft} hours left`, html);
}

// B9: Welcome Publisher After First Order (Buyer)
export async function sendBuyerFirstOrderCongrats({ to, name, orderId, siteUrl }) {
  const html = wrap(
    header('First Order Placed!', '#4f7cff') +
    bodyStart(`Congratulations, ${name}!`,
      `You have just placed your first order on Uplyncio. Welcome to the world of strategic link building! Here is what happens next:`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="padding-bottom:8px"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px"><tr>
        <td style="padding:12px 14px;width:30px;vertical-align:top"><span style="font-family:Arial,sans-serif;font-size:16px">⏳</span></td>
        <td style="padding:12px 14px 12px 0"><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5"><strong style="color:#1a202c">Publisher reviews your order</strong> — They will accept within 24 hours and begin working on your guest post.</p></td>
      </tr></table></td></tr>
      <tr><td style="padding-bottom:8px"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px"><tr>
        <td style="padding:12px 14px;width:30px;vertical-align:top"><span style="font-family:Arial,sans-serif;font-size:16px">✍️</span></td>
        <td style="padding:12px 14px 12px 0"><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5"><strong style="color:#1a202c">Post is written and published</strong> — Your guest post goes live on ${siteUrl} with your backlink.</p></td>
      </tr></table></td></tr>
      <tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px"><tr>
        <td style="padding:12px 14px;width:30px;vertical-align:top"><span style="font-family:Arial,sans-serif;font-size:16px">🔗</span></td>
        <td style="padding:12px 14px 12px 0"><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5"><strong style="color:#1a202c">You verify and confirm</strong> — Check the live link, confirm delivery, and your SEO journey begins!</p></td>
      </tr></table></td></tr>
    </table>` +
    ctaBtn(`${SITE}/buyer.html`, 'Track Your Order →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `🎉 First order placed on Uplyncio — ${siteUrl}`, html);
}
