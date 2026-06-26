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
