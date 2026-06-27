// Uplyncio Email Service — All 9 templates
const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = 'Uplyncio <info@uplyncio.com>';
const SITE = 'https://uplyncio.vercel.app';

// ── SHARED: Header ──
function header(category, accent = '#4f7cff') {
  return `
  <tr><td style="background:linear-gradient(135deg,#0f1628,#1a2d5a);padding:20px 28px;border-bottom:3px solid ${accent}">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;padding-right:10px">
            <img src="data:image/png;base64,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" width="32" height="32" alt="Uplyncio" style="display:block;border-radius:8px;border:0"/>
          </td>
          <td style="vertical-align:middle">
            <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;line-height:1">Uply<span style="color:#4f7cff">ncio</span></div>
            <div style="font-family:Arial,sans-serif;font-size:10px;color:#8892a4;margin-top:2px">Guest Posting Marketplace</div>
          </td>
        </tr></table>
      </td>
      <td align="right" style="vertical-align:middle">
        <div style="font-family:Arial,sans-serif;font-size:10px;color:#8892a4;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${category}</div>
        <div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.5)">${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
      </td>
    </tr></table>
  </td></tr>`;
}
// ── SHARED: Footer ──
function footer() {
  return `
  <tr><td style="background:#07090f;padding:24px 28px">
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px"><tr>
      <td style="vertical-align:middle;padding-right:8px">
        <img src="data:image/png;base64,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" width="32" height="32" alt="Uplyncio" style="display:block;border-radius:8px;border:0"/>
      </td>
      <td style="vertical-align:middle">
        <span style="font-family:Arial,sans-serif;font-size:18px;font-weight:900;color:#ffffff;letter-spacing:-0.5px">Uply<span style="color:#4f7cff">ncio</span></span>
      </td>
    </tr></table>
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


// Truncate text for privacy in emails
function truncate(str, len=30) {
  if(!str) return '—';
  if(str.length <= len) return str;
  return str.substring(0, len) + '...';
}
function maskUrl(url, len=25) {
  if(!url) return '—';
  // Remove https:// for display
  const clean = url.replace(/https?:\/\//,'');
  if(clean.length <= len) return clean.substring(0,3)+'...'+clean.slice(-6);
  return clean.substring(0,len)+'...';
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
      '⏰ This code expires in <strong>5 minutes</strong>. If you did not create an Uplyncio account, please ignore this email.') +
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
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Anchor Text</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0">${truncate(anchorText,25)}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Target URL</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0">${maskUrl(targetUrl)}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Deadline</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#ef4444;padding:5px 0">${deadline}</td></tr>
          <tr style="border-top:1px solid #e0e7ff"><td style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a202c;padding:10px 0 4px">Your Earnings</td><td align="right" style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:#00c27a;padding:10px 0 4px">$${price}</td></tr>
        </table>
      </td></tr>
    </table>` +
    (content ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px"><tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px"><p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#4f7cff;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Content / Article</p><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">${content.substring(0,300)}${content.length > 300 ? '...' : ''}</p></td></tr></table>` : '') +
    (requirements ? alertBox('#fef3c7','#fde68a','#92400e', `📋 <strong>Special Requirements:</strong> ${requirements}`) : '') +
    ctaBtn(`${SITE}/publisher.html`, 'View Order & Accept →', '#4f7cff') +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '🔒 <strong>For security:</strong> Full order details including complete anchor text and target URL are available in your publisher dashboard.') +
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
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Anchor Text</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0">${truncate(anchorText,25)}</td></tr>
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Target URL</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0">${maskUrl(targetUrl)}</td></tr>
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
          <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Anchor Text</td><td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#4f7cff;padding:5px 0">${truncate(anchorText,25)}</td></tr>
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


// ══════════════════════════════════════════════════════════════════
// PAYMENT & INVOICE TEMPLATES
// ══════════════════════════════════════════════════════════════════

function invoiceRow(label, value, opts = {}) {
  const { bold, color, borderTop, large } = opts;
  return `<tr${borderTop ? ' style="border-top:1.5px solid #e0e7ff"' : ''}>
    <td style="font-family:Arial,sans-serif;font-size:${large ? '14' : '13'}px;${bold ? 'font-weight:700;' : ''}color:${color || (bold ? '#1a202c' : '#64748b')};padding:${borderTop ? '10' : '5'}px 0">${label}</td>
    <td align="right" style="font-family:Arial,sans-serif;font-size:${large ? '16' : '13'}px;font-weight:${bold ? '800' : '600'};color:${color || (bold ? '#1a202c' : '#1a202c')};padding:${borderTop ? '10' : '5'}px 0">${value}</td>
  </tr>`;
}

function invoiceBox(invoiceNum, date, rows, bgColor = '#f0f4ff', borderColor = '#c7d7ff', labelColor = '#4f7cff') {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
    <tr><td style="background:${bgColor};border:1px solid ${borderColor};border-radius:8px;padding:16px">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px">
        <tr>
          <td><p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:${labelColor};letter-spacing:1.5px;text-transform:uppercase;margin:0">Invoice</p>
          <p style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#1a202c;margin:4px 0 0">${invoiceNum}</p></td>
          <td align="right"><p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0">Date</p>
          <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;margin:4px 0 0">${date}</p></td>
        </tr>
      </table>
      <div style="height:1px;background:${borderColor};margin:0 0 12px"></div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
    </td></tr>
  </table>`;
}

// ─────────────────────────────────────────
// F1: Buyer — Funds Added Invoice
// ─────────────────────────────────────────
export async function sendBuyerFundsAdded({ to, name, invoiceNum, date, amount, method, transactionId, walletBalance }) {
  const rows =
    invoiceRow('Description', 'Wallet Top-Up — Uplyncio') +
    invoiceRow('Payment Method', method) +
    invoiceRow('Transaction ID', transactionId || '—') +
    invoiceRow('Amount Added', `$${amount}`, { bold: true, color: '#00c27a', borderTop: true, large: true });

  const html = wrap(
    header('Payment Receipt', '#00c27a') +
    bodyStart('Funds added successfully!',
      `Hi <strong style="color:#1a202c">${name}</strong>, your wallet has been topped up. Your funds are ready to use for ordering guest posts and backlinks.`) +
    invoiceBox(invoiceNum, date, rows, '#f0fdf4', '#bbf7d0', '#15803d') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Current Wallet Balance</p>
        <p style="font-family:Arial,sans-serif;font-size:32px;font-weight:800;color:#1a202c;margin:0">$${walletBalance}</p>
      </td></tr>
    </table>` +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '🔒 Your funds are held securely in your Uplyncio wallet. They will only be deducted when you place an order and you confirm delivery.') +
    ctaBtn(`${SITE}/buyer.html`, 'Browse Publisher Sites →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `✅ $${amount} added to your Uplyncio wallet — ${invoiceNum}`, html);
}

// ─────────────────────────────────────────
// F2: Buyer — Order Payment Invoice
// ─────────────────────────────────────────
export async function sendBuyerOrderInvoice({ to, name, invoiceNum, date, orderId, siteUrl, siteDA, siteDR, serviceType, subtotal, platformFee, total, paymentMethod, walletBalance }) {
  const rows =
    invoiceRow('Order ID', orderId) +
    invoiceRow('Publisher Site', siteUrl) +
    invoiceRow('Domain Authority', `DA ${siteDA} / DR ${siteDR}`) +
    invoiceRow('Service Type', serviceType || 'Guest Post') +
    invoiceRow('Payment Method', paymentMethod || 'Uplyncio Wallet') +
    invoiceRow('Subtotal', `$${subtotal}`, { bold: false }) +
    invoiceRow('Platform Fee', platformFee > 0 ? `$${platformFee}` : 'Included', { bold: false }) +
    invoiceRow('Total Paid', `$${total}`, { bold: true, color: '#1a202c', borderTop: true, large: true });

  const html = wrap(
    header('Order Invoice', '#4f7cff') +
    bodyStart('Your order invoice',
      `Hi <strong style="color:#1a202c">${name}</strong>, thank you for your order. Please find your invoice below. Keep this for your records.`) +
    invoiceBox(invoiceNum, date, rows, '#f0f4ff', '#c7d7ff', '#4f7cff') +
    (walletBalance !== undefined ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0">Remaining wallet balance</p>
        <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1a202c;margin:0">$${walletBalance}</p>
      </td></tr>
    </table>` : '') +
    alertBox('#f0fdf4','#bbf7d0','#15803d',
      '🔒 Your payment is held in escrow until you confirm delivery of the live link. You are fully protected.') +
    ctaBtn(`${SITE}/buyer.html`, 'Track Your Order →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Invoice ${invoiceNum} — Order ${orderId} on ${siteUrl}`, html);
}

// ─────────────────────────────────────────
// F3: Buyer — Refund Invoice
// ─────────────────────────────────────────
export async function sendBuyerRefundInvoice({ to, name, invoiceNum, date, orderId, siteUrl, refundAmount, refundMethod, transactionId, arrivalDays = '3-5' }) {
  const rows =
    invoiceRow('Original Order ID', orderId) +
    invoiceRow('Publisher Site', siteUrl) +
    invoiceRow('Refund Method', refundMethod) +
    invoiceRow('Transaction ID', transactionId || 'Processing') +
    invoiceRow('Expected Arrival', `${arrivalDays} business days`) +
    invoiceRow('Refund Amount', `$${refundAmount}`, { bold: true, color: '#00c27a', borderTop: true, large: true });

  const html = wrap(
    header('Refund Processed', '#f59e0b') +
    bodyStart(`Refund of $${refundAmount} is on its way`,
      `Hi <strong style="color:#1a202c">${name}</strong>, your refund has been processed successfully. Here are the details:`) +
    invoiceBox(invoiceNum, date, rows, '#fef3c7', '#fde68a', '#b45309') +
    alertBox('#f0fdf4','#bbf7d0','#15803d',
      `💰 Your refund of <strong>$${refundAmount}</strong> will arrive within <strong>${arrivalDays} business days</strong> depending on your payment provider.`) +
    alertBox('#f8faff','#e0e7ff','#475569',
      'ℹ️ If you do not receive your refund within the expected timeframe, please contact us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> with your invoice number.') +
    ctaBtn(`${SITE}/buyer.html`, 'Browse Publisher Sites →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Refund ${invoiceNum} — $${refundAmount} processed for Order ${orderId}`, html);
}

// ─────────────────────────────────────────
// F4: Publisher — Withdrawal Request Received
// ─────────────────────────────────────────
export async function sendPublisherWithdrawalRequested({ to, name, withdrawalId, date, amount, method, accountMasked, processingDays = '1-3' }) {
  const rows =
    invoiceRow('Withdrawal ID', withdrawalId) +
    invoiceRow('Payment Method', method) +
    invoiceRow('Account / Address', accountMasked) +
    invoiceRow('Processing Time', `${processingDays} business days`) +
    invoiceRow('Amount Requested', `$${amount}`, { bold: true, color: '#4f7cff', borderTop: true, large: true });

  const html = wrap(
    header('Withdrawal Requested', '#4f7cff') +
    bodyStart('Withdrawal request received',
      `Hi <strong style="color:#1a202c">${name}</strong>, we have received your withdrawal request. Our team will process it within <strong style="color:#1a202c">${processingDays} business days</strong>.`) +
    invoiceBox(withdrawalId, date, rows, '#f0f4ff', '#c7d7ff', '#4f7cff') +
    alertBox('#fef3c7','#fde68a','#92400e',
      `⏳ Your withdrawal is being reviewed. You will receive a confirmation email with your payout invoice once the payment has been sent to your ${method} account.`) +
    alertBox('#f8faff','#e0e7ff','#475569',
      '🔒 If you did not request this withdrawal, contact us immediately at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a>') +
    ctaBtn(`${SITE}/publisher.html`, 'View Wallet →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Withdrawal ${withdrawalId} Received — $${amount} via ${method}`, html);
}

// ─────────────────────────────────────────
// F5: Publisher — Withdrawal Successful (Payout Invoice)
// ─────────────────────────────────────────
export async function sendPublisherPayoutInvoice({ to, name, payoutId, date, grossAmount, platformFee, netAmount, method, accountMasked, transactionId, walletBalance }) {
  const rows =
    invoiceRow('Payout ID', payoutId) +
    invoiceRow('Payment Method', method) +
    invoiceRow('Account / Address', accountMasked) +
    invoiceRow('Transaction ID', transactionId || 'Completed') +
    invoiceRow('Gross Amount', `$${grossAmount}`) +
    invoiceRow('Platform Fee', platformFee > 0 ? `-$${platformFee}` : 'None', { color: platformFee > 0 ? '#ef4444' : '#00c27a' }) +
    invoiceRow('Net Payout', `$${netAmount}`, { bold: true, color: '#00c27a', borderTop: true, large: true });

  const html = wrap(
    header('Payout Invoice', '#00c27a') +
    bodyStart(`$${netAmount} sent to your ${method}!`,
      `Hi <strong style="color:#1a202c">${name}</strong>, your withdrawal has been processed successfully. Here is your official payout invoice.`) +
    invoiceBox(payoutId, date, rows, '#f0fdf4', '#bbf7d0', '#15803d') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Remaining Wallet Balance</p>
        <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;color:#1a202c;margin:0">$${walletBalance}</p>
      </td></tr>
    </table>` +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '📁 Please save this invoice for your financial records. You can also download it from your publisher dashboard under Wallet → Withdrawal History.') +
    ctaBtn(`${SITE}/publisher.html`, 'View Withdrawal History →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `💰 Payout ${payoutId} Sent — $${netAmount} via ${method}`, html);
}

// ─────────────────────────────────────────
// F6: Publisher — Withdrawal Failed
// ─────────────────────────────────────────
export async function sendPublisherWithdrawalFailed({ to, name, withdrawalId, date, amount, method, reason, walletBalance }) {
  const rows =
    invoiceRow('Withdrawal ID', withdrawalId) +
    invoiceRow('Amount', `$${amount}`) +
    invoiceRow('Payment Method', method) +
    invoiceRow('Failure Reason', reason || 'Payment gateway error') +
    invoiceRow('Status', 'Failed — Amount Refunded to Wallet', { bold: true, color: '#ef4444', borderTop: true });

  const html = wrap(
    header('Withdrawal Failed', '#ef4444') +
    bodyStart('Your withdrawal could not be processed',
      `Hi <strong style="color:#1a202c">${name}</strong>, unfortunately your withdrawal request could not be completed. The full amount has been credited back to your Uplyncio wallet.`) +
    invoiceBox(withdrawalId, date, rows, '#fef2f2', '#fecaca', '#ef4444') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px">Amount Credited Back to Wallet</p>
        <p style="font-family:Arial,sans-serif;font-size:28px;font-weight:800;color:#00c27a;margin:0">$${amount}</p>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#64748b;margin:6px 0 0">Current balance: <strong style="color:#1a202c">$${walletBalance}</strong></p>
      </td></tr>
    </table>` +
    alertBox('#fef3c7','#fde68a','#92400e',
      `📋 <strong>How to fix:</strong> ${reason === 'Invalid account details' ? 'Please update your payment details in dashboard settings and retry.' : reason === 'Insufficient balance' ? 'Minimum withdrawal amount is $20. Keep earning and try again.' : 'Please try again or contact support if the issue persists.'}`) +
    ctaBtn(`${SITE}/publisher.html`, 'Retry Withdrawal →', '#4f7cff') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
          Need help? Contact us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> with your Withdrawal ID <strong>${withdrawalId}</strong> and we will resolve this within 24 hours.
        </p>
      </td></tr>
    </table>` +
    sign() + footer()
  );
  return send(to, `⚠️ Withdrawal ${withdrawalId} Failed — $${amount} credited back to wallet`, html);
}


// ══════════════════════════════════════════════════════════════════
// PAYMENT ACCOUNT & WITHDRAWAL TEMPLATES
// ══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────
// PA1: Payment Account Added — Verify Request
// Sent when publisher adds a new payment account
// ─────────────────────────────────────────
export async function sendPaymentAccountVerifyRequest({ to, name, method, accountDisplay, verifyCode, addedAt }) {
  const methodIcons = { PayPal: '🅿️', Wise: '💳', USDT: '₮', Bank: '🏦' };
  const icon = methodIcons[method] || '💰';

  const html = wrap(
    header('Verify Payment Account', '#f59e0b') +
    bodyStart('Confirm your payment account',
      `Hi <strong style="color:#1a202c">${name}</strong>, a new payment account has been added to your Uplyncio profile. Please verify it before you can use it for withdrawals.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef3c7;border:1.5px solid #f59e0b;border-radius:10px;padding:20px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:28px;margin:0 0 8px">${icon}</p>
        <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#b45309;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 6px">Payment Method</p>
        <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 4px">${method}</p>
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0">${accountDisplay}</p>
      </td></tr>
    </table>` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0f4ff;border:2px solid #c7d7ff;border-radius:10px;padding:20px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#4f7cff;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">Your Verification Code</p>
        <p style="font-family:'Courier New',monospace;font-size:36px;font-weight:700;color:#1a202c;letter-spacing:12px;margin:0">${verifyCode}</p>
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:10px 0 0">Expires in 10 minutes</p>
      </td></tr>
    </table>` +
    detailsBox('#f8faff','#e0e7ff', [
      ['Payment Method', method],
      ['Account Details', accountDisplay],
      ['Added On', addedAt],
      ['Status', '⏳ Pending Verification', '#f59e0b']
    ]) +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '🔴 If you did not add this payment account, contact us immediately at <a href="mailto:info@uplyncio.com" style="color:#b91c1c;text-decoration:none">info@uplyncio.com</a> — do not share this code with anyone.') +
    ctaBtn(`${SITE}/publisher.html`, 'Enter Code in Dashboard →', '#f59e0b') +
    sign() + footer()
  );
  return send(to, `Verify your ${method} account — Code: ${verifyCode}`, html);
}

// ─────────────────────────────────────────
// PA2: Payment Account Verified Successfully
// ─────────────────────────────────────────
export async function sendPaymentAccountVerified({ to, name, method, accountDisplay, verifiedAt }) {
  const methodIcons = { PayPal: '🅿️', Wise: '💳', USDT: '₮', Bank: '🏦' };
  const icon = methodIcons[method] || '💰';

  const html = wrap(
    header('Payment Account Verified', '#00c27a') +
    bodyStart('Payment account verified successfully!',
      `Hi <strong style="color:#1a202c">${name}</strong>, your payment account has been verified and is now active. You can use it to withdraw your earnings anytime.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0fdf4;border:1.5px solid #00c27a;border-radius:10px;padding:20px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:28px;margin:0 0 8px">${icon}</p>
        <p style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#15803d;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 6px">Verified Account</p>
        <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 4px">${method}</p>
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 10px">${accountDisplay}</p>
        <span style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;background:#00c27a;color:#fff;padding:4px 14px;border-radius:100px">✅ Active & Ready</span>
      </td></tr>
    </table>` +
    detailsBox('#f0fdf4','#bbf7d0', [
      ['Payment Method', method],
      ['Account', accountDisplay],
      ['Verified On', verifiedAt],
      ['Status', '✅ Verified', '#00c27a']
    ]) +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      `💡 You can now withdraw your earnings via ${method} anytime from your publisher dashboard. Minimum withdrawal is <strong>$20</strong>. Processing takes 1-3 business days.`) +
    ctaBtn(`${SITE}/publisher.html`, 'Withdraw Earnings →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `✅ Your ${method} account is verified and ready`, html);
}

// ─────────────────────────────────────────
// PA3: Payment Account Removed
// ─────────────────────────────────────────
export async function sendPaymentAccountRemoved({ to, name, method, accountDisplay, removedAt }) {
  const html = wrap(
    header('Payment Account Removed', '#f59e0b') +
    bodyStart('A payment account was removed',
      `Hi <strong style="color:#1a202c">${name}</strong>, the following payment account has been removed from your Uplyncio profile.`) +
    detailsBox('#fef3c7','#fde68a', [
      ['Payment Method', method],
      ['Account', accountDisplay],
      ['Removed On', removedAt],
      ['Status', '❌ Removed', '#ef4444']
    ]) +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '🔴 If you did not remove this account, contact us immediately at <a href="mailto:info@uplyncio.com" style="color:#b91c1c;text-decoration:none">info@uplyncio.com</a> — your account may be compromised.') +
    alertBox('#f8faff','#e0e7ff','#475569',
      'ℹ️ Any pending withdrawals to this account have been cancelled and the amount has been credited back to your wallet.') +
    ctaBtn(`${SITE}/publisher.html`, 'Add New Payment Account →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Payment account ${method} removed from your profile`, html);
}

// ─────────────────────────────────────────
// F4: Publisher — Withdrawal Request Received (Updated)
// ─────────────────────────────────────────
export async function sendWithdrawalRequested({ to, name, withdrawalId, date, amount, method, accountDisplay, walletBalanceAfter, processingDays = '1–3' }) {
  const rows =
    invoiceRow('Withdrawal ID', withdrawalId) +
    invoiceRow('Payment Method', method) +
    invoiceRow('To Account', accountDisplay) +
    invoiceRow('Submitted On', date) +
    invoiceRow('Processing Time', `${processingDays} business days`) +
    invoiceRow('Wallet After Request', `$${walletBalanceAfter}`) +
    invoiceRow('Amount Requested', `$${amount}`, { bold: true, color: '#4f7cff', borderTop: true, large: true });

  const html = wrap(
    header('Withdrawal Requested', '#4f7cff') +
    bodyStart('Withdrawal request submitted',
      `Hi <strong style="color:#1a202c">${name}</strong>, your withdrawal request has been received and is now being reviewed by our payments team.`) +
    invoiceBox(withdrawalId, date, rows, '#f0f4ff', '#c7d7ff', '#4f7cff') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="width:50%;padding-right:5px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px;text-align:center">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#92400e;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Requested</p>
            <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#b45309;margin:0">$${amount}</p></td></tr>
          </table>
        </td>
        <td style="width:50%;padding-left:5px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px;text-align:center">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Wallet Balance</p>
            <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:800;color:#1a202c;margin:0">$${walletBalanceAfter}</p></td></tr>
          </table>
        </td>
      </tr>
    </table>` +
    alertBox('#f0fdf4','#bbf7d0','#15803d',
      `✅ Your withdrawal is being processed. You will receive a <strong>Payout Invoice</strong> email as soon as the payment is sent to your ${method} account.`) +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '🔴 Did not request this withdrawal? Contact us immediately at <a href="mailto:info@uplyncio.com" style="color:#b91c1c;text-decoration:none">info@uplyncio.com</a>') +
    ctaBtn(`${SITE}/publisher.html`, 'View Withdrawal Status →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Withdrawal ${withdrawalId} submitted — $${amount} via ${method}`, html);
}

// ─────────────────────────────────────────
// F5: Publisher — Payout Invoice (Withdrawal Complete)
// ─────────────────────────────────────────
export async function sendPayoutInvoice({ to, name, payoutId, date, grossAmount, platformFee, netAmount, method, accountDisplay, transactionId, walletBalance }) {
  const rows =
    invoiceRow('Payout ID', payoutId) +
    invoiceRow('Payment Method', method) +
    invoiceRow('Paid To', accountDisplay) +
    invoiceRow('Transaction ID', transactionId || 'Completed') +
    invoiceRow('Date', date) +
    invoiceRow('Gross Amount', `$${grossAmount}`) +
    invoiceRow('Platform Fee', platformFee > 0 ? `-$${platformFee}` : 'None', { color: platformFee > 0 ? '#ef4444' : '#00c27a' }) +
    invoiceRow('Net Amount Paid', `$${netAmount}`, { bold: true, color: '#00c27a', borderTop: true, large: true });

  const html = wrap(
    header('Payout Invoice', '#00c27a') +
    `<tr><td style="padding:28px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="width:64px;height:64px;border-radius:50%;background:#f0fdf4;border:2px solid #00c27a;display:inline-flex;align-items:center;justify-content:center;font-size:28px;line-height:64px">💰</div>
      </div>
      <p style="font-family:Arial,sans-serif;font-size:20px;font-weight:700;color:#1a202c;margin:0 0 8px;text-align:center">$${netAmount} sent to your ${method}!</p>
      <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 24px;line-height:1.7;text-align:center">Hi <strong style="color:#1a202c">${name}</strong>, your withdrawal has been processed successfully. Here is your official payout invoice — keep it for your records.</p>
    </td></tr>` +
    `<tr><td style="padding:0 28px 28px">` +
    invoiceBox(payoutId, date, rows, '#f0fdf4', '#bbf7d0', '#15803d') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b">Remaining wallet balance</td>
            <td align="right" style="font-family:Arial,sans-serif;font-size:16px;font-weight:800;color:#1a202c">$${walletBalance}</td>
          </tr>
        </table>
      </td></tr>
    </table>` +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '📁 Save this payout invoice for your tax and financial records. You can also download all payout history from your publisher dashboard under <strong>Wallet → Payout History</strong>.') +
    ctaBtn(`${SITE}/publisher.html`, 'View Payout History →', '#00c27a') +
    `<p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">Best regards,<br><strong>Team Uplyncio</strong></p>` +
    `</td></tr>`+
    footer()
  );
  return send(to, `💰 Payout ${payoutId} — $${netAmount} sent via ${method}`, html);
}

// ─────────────────────────────────────────
// F6: Publisher — Withdrawal Failed
// ─────────────────────────────────────────
export async function sendWithdrawalFailed({ to, name, withdrawalId, date, amount, method, accountDisplay, reason, walletBalance }) {
  const fixGuide = {
    'Invalid account details': 'Please update your payment account details in dashboard settings and submit a new withdrawal request.',
    'Insufficient balance': 'Minimum withdrawal amount is $20. Continue earning and try again once your balance reaches the minimum.',
    'Account not verified': 'Your payment account is not verified. Please verify it first from your dashboard settings.',
    'Payment gateway error': 'This was a temporary issue on our end. Please try again in 24 hours or contact support.'
  };
  const fix = fixGuide[reason] || 'Please check your account details and try again, or contact our support team.';

  const rows =
    invoiceRow('Withdrawal ID', withdrawalId) +
    invoiceRow('Requested On', date) +
    invoiceRow('Payment Method', method) +
    invoiceRow('Account', accountDisplay) +
    invoiceRow('Failure Reason', reason || 'Processing error') +
    invoiceRow('Amount Returned to Wallet', `$${amount}`, { bold: true, color: '#00c27a', borderTop: true, large: true });

  const html = wrap(
    header('Withdrawal Failed', '#ef4444') +
    bodyStart('Your withdrawal could not be processed',
      `Hi <strong style="color:#1a202c">${name}</strong>, unfortunately your withdrawal request <strong style="color:#1a202c">${withdrawalId}</strong> could not be completed. The full amount has been returned to your wallet.`) +
    invoiceBox(withdrawalId, date, rows, '#fef2f2', '#fecaca', '#ef4444') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b">$${amount} returned. Current wallet balance</td>
            <td align="right" style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:#00c27a">$${walletBalance}</td>
          </tr>
        </table>
      </td></tr>
    </table>` +
    alertBox('#fef3c7','#fde68a','#92400e',
      `🔧 <strong>How to fix this:</strong> ${fix}`) +
    ctaBtn(`${SITE}/publisher.html`, 'Retry Withdrawal →', '#4f7cff') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
          Still having issues? Email us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> with your Withdrawal ID <strong style="color:#1a202c">${withdrawalId}</strong> and we will resolve it within 24 hours.
        </p>
      </td></tr>
    </table>` +
    sign() + footer()
  );
  return send(to, `⚠️ Withdrawal ${withdrawalId} Failed — $${amount} returned to wallet`, html);
}

// ─────────────────────────────────────────
// F7: Buyer — Funds Added Receipt
// ─────────────────────────────────────────
export async function sendFundsAddedReceipt({ to, name, invoiceNum, date, amount, method, transactionId, walletBalance }) {
  const methodIcons = { PayPal: '🅿️', Wise: '💳', USDT: '₮', Bank: '🏦', Card: '💳' };
  const icon = methodIcons[method] || '💰';

  const rows =
    invoiceRow('Invoice Number', invoiceNum) +
    invoiceRow('Date & Time', date) +
    invoiceRow('Payment Method', `${icon} ${method}`) +
    invoiceRow('Transaction ID', transactionId || 'Confirmed') +
    invoiceRow('Amount Added', `$${amount}`, { bold: true, color: '#00c27a', borderTop: true, large: true });

  const html = wrap(
    header('Funds Added — Receipt', '#00c27a') +
    bodyStart(`$${amount} added to your wallet`,
      `Hi <strong style="color:#1a202c">${name}</strong>, your payment was successful. Your Uplyncio wallet has been topped up and is ready to use.`) +
    invoiceBox(invoiceNum, date, rows, '#f0fdf4', '#bbf7d0', '#15803d') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:18px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">Updated Wallet Balance</p>
        <p style="font-family:Arial,sans-serif;font-size:36px;font-weight:800;color:#1a202c;margin:0">$${walletBalance}</p>
      </td></tr>
    </table>` +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '🔒 Your funds are secured in your Uplyncio wallet. They will only be deducted when you place an order — and only released to publishers after you confirm delivery.') +
    ctaBtn(`${SITE}/buyer.html`, 'Browse Publisher Sites →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `✅ $${amount} added to your Uplyncio wallet — ${invoiceNum}`, html);
}

// ─────────────────────────────────────────
// F8: Buyer — Order Payment Invoice
export async function sendOrderPaymentInvoice({ to, name, invoiceNum, date, orderId, siteUrl, siteDA, siteDR, serviceType, anchorText, targetUrl, subtotal, platformFee, total, walletBalanceAfter }) {
  const rows =
    invoiceRow('Invoice Number', invoiceNum) +
    invoiceRow('Order ID', orderId) +
    invoiceRow('Date', date) +
    invoiceRow('Publisher Site', siteUrl) +
    invoiceRow('Domain Authority / Rating', 'DA ' + siteDA + ' / DR ' + siteDR) +
    invoiceRow('Service', serviceType || 'Guest Post with Dofollow Link') +
    invoiceRow('Subtotal', '$' + subtotal) +
    invoiceRow('Platform Fee', platformFee > 0 ? '$' + platformFee : 'Included') +
    invoiceRow('Total Charged', '$' + total, { bold: true, color: '#4f7cff', borderTop: true, large: true });

  const html = wrap(
    header('Order Invoice', '#4f7cff') +
    bodyStart('Your order payment invoice',
      'Hi <strong style="color:#1a202c">' + name + '</strong>, thank you for your order on Uplyncio. Your payment invoice is below — keep this for your records.') +
    invoiceBox(invoiceNum, date, rows, '#f0f4ff', '#c7d7ff', '#4f7cff') +
    (walletBalanceAfter !== undefined ? '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px"><tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b">Remaining wallet balance after this order</td><td align="right" style="font-family:Arial,sans-serif;font-size:16px;font-weight:800;color:#1a202c">$' + walletBalanceAfter + '</td></tr></table></td></tr></table>' : '') +
    alertBox('#f0fdf4', '#bbf7d0', '#15803d',
      '\u2714 Dofollow link guaranteed &middot; 12-month link lifetime &middot; Payment held in escrow until you confirm delivery') +
    ctaBtn(SITE + '/buyer.html', 'View Order in Dashboard →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, 'Invoice ' + invoiceNum + ' — Order ' + orderId + ' on ' + siteUrl, html);
}
// F9: Buyer — Refund Invoice
// ─────────────────────────────────────────
export async function sendRefundInvoice({ to, name, refundId, date, orderId, siteUrl, originalAmount, refundAmount, refundMethod, transactionId, reason, arrivalDays = '3–5' }) {
  const rows =
    invoiceRow('Refund ID', refundId) +
    invoiceRow('Date', date) +
    invoiceRow('Original Order', orderId) +
    invoiceRow('Publisher Site', siteUrl) +
    invoiceRow('Reason', reason || 'Order cancelled') +
    invoiceRow('Original Amount', `$${originalAmount}`) +
    invoiceRow('Refund Method', refundMethod) +
    invoiceRow('Transaction ID', transactionId || 'Processing') +
    invoiceRow('Expected Arrival', `${arrivalDays} business days`) +
    invoiceRow('Refund Amount', `$${refundAmount}`, { bold: true, color: '#00c27a', borderTop: true, large: true });

  const html = wrap(
    header('Refund Invoice', '#f59e0b') +
    bodyStart(`Refund of $${refundAmount} is processing`,
      `Hi <strong style="color:#1a202c">${name}</strong>, your refund has been approved and is on its way. Here is your official refund invoice.`) +
    invoiceBox(refundId, date, rows, '#fef3c7', '#fde68a', '#b45309') +
    alertBox('#f0fdf4','#bbf7d0','#15803d',
      `💰 <strong>$${refundAmount}</strong> will be credited to your <strong>${refundMethod}</strong> within <strong>${arrivalDays} business days</strong>. Actual time may vary by payment provider.`) +
    alertBox('#f8faff','#e0e7ff','#475569',
      `ℹ️ Did not receive your refund after ${arrivalDays} days? Contact us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> with Refund ID <strong>${refundId}</strong>.`) +
    ctaBtn(`${SITE}/buyer.html`, 'Browse Publisher Sites →', '#4f7cff') +
    sign() + footer()
  );
  return send(to, `Refund ${refundId} — $${refundAmount} processing for Order ${orderId}`, html);
}


// ══════════════════════════════════════════════════════════════════
// SECURITY TEMPLATES (S1 – S13)
// ══════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────
// S1: Suspicious Login Attempt Blocked
// ─────────────────────────────────────────
export async function sendSuspiciousLoginBlocked({ to, name, attempts, lockedUntil, ipAddress, device, location, time }) {
  const html = wrap(
    header('Security Alert', '#ef4444') +
    bodyStart('Suspicious login activity detected',
      `Hi <strong style="color:#1a202c">${name}</strong>, we detected <strong style="color:#ef4444">${attempts} failed login attempts</strong> on your Uplyncio account. For your security, we have temporarily blocked access.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef2f2;border:1.5px solid #ef4444;border-radius:10px;padding:18px">
        <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#ef4444;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px">Login Attempt Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${invoiceRow('Time', time)}
          ${invoiceRow('IP Address', ipAddress || 'Unknown')}
          ${invoiceRow('Device', device || 'Unknown')}
          ${invoiceRow('Location', location || 'Unknown')}
          ${invoiceRow('Failed Attempts', attempts)}
          ${invoiceRow('Account Locked Until', lockedUntil, { bold: true, color: '#ef4444' })}
        </table>
      </td></tr>
    </table>` +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      `🔴 <strong>Was this you?</strong> If you forgot your password, use the Forgot Password option to reset it. If this was NOT you, your password may be compromised — reset it immediately.`) +
    alertBox('#fef3c7','#fde68a','#92400e',
      `⏳ Your account will automatically unlock at <strong>${lockedUntil}</strong>. Or contact us at <a href="mailto:info@uplyncio.com" style="color:#b45309;text-decoration:none">info@uplyncio.com</a> to unlock it immediately.`) +
    ctaBtn(`${SITE}/uplyncio-full.html`, 'Reset Password Now →', '#ef4444') +
    sign() + footer()
  );
  return send(to, `🔴 Security Alert: ${attempts} failed login attempts on your Uplyncio account`, html);
}

// ─────────────────────────────────────────
// S2: Account Temporarily Locked
// ─────────────────────────────────────────
export async function sendAccountLocked({ to, name, reason, lockedUntil, role }) {
  const dashLink = role === 'publisher' ? `${SITE}/publisher.html` : `${SITE}/buyer.html`;
  const html = wrap(
    header('Account Locked', '#ef4444') +
    bodyStart('Your account has been temporarily locked',
      `Hi <strong style="color:#1a202c">${name}</strong>, your Uplyncio account has been temporarily locked due to security reasons.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef2f2;border:1.5px solid #ef4444;border-radius:10px;padding:18px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:32px;margin:0 0 10px">🔒</p>
        <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1a202c;margin:0 0 6px">Account Locked</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0 0 12px">Reason: <strong style="color:#ef4444">${reason || 'Multiple failed login attempts'}</strong></p>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;margin:0">Unlocks automatically at</p>
        <p style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1a202c;margin:4px 0 0">${lockedUntil}</p>
      </td></tr>
    </table>` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="padding-bottom:8px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px">
          <tr><td style="padding:12px 14px"><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5">
            <strong style="color:#1a202c">Option 1 — Wait:</strong> Your account will automatically unlock at ${lockedUntil}. No action needed.
          </p></td></tr>
        </table>
      </td></tr>
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px">
          <tr><td style="padding:12px 14px"><p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5">
            <strong style="color:#1a202c">Option 2 — Reset Password:</strong> Use Forgot Password to verify your identity and unlock your account immediately.
          </p></td></tr>
        </table>
      </td></tr>
    </table>` +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '🔴 If you did not trigger this lock, contact us at <a href="mailto:info@uplyncio.com" style="color:#b91c1c;text-decoration:none">info@uplyncio.com</a> immediately — include your registered email in the subject line.') +
    ctaBtn(`${SITE}/uplyncio-full.html`, 'Reset Password to Unlock →', '#ef4444') +
    sign() + footer()
  );
  return send(to, `🔒 Your Uplyncio account has been temporarily locked`, html);
}

// ─────────────────────────────────────────
// S3: Account Unlocked
// ─────────────────────────────────────────
export async function sendAccountUnlocked({ to, name, unlockedAt, unlockedBy = 'System' }) {
  const html = wrap(
    header('Account Unlocked', '#00c27a') +
    bodyStart('Your account is unlocked and active',
      `Hi <strong style="color:#1a202c">${name}</strong>, your Uplyncio account has been unlocked and is fully accessible again.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0fdf4;border:1.5px solid #00c27a;border-radius:10px;padding:18px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:32px;margin:0 0 10px">🔓</p>
        <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1a202c;margin:0 0 6px">Account Unlocked</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0">Unlocked on ${unlockedAt} by ${unlockedBy}</p>
      </td></tr>
    </table>` +
    alertBox('#fef3c7','#fde68a','#92400e',
      '💡 <strong>For your security:</strong> We strongly recommend changing your password immediately if you did not initiate the failed login attempts.') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;margin:0 0 8px">Stay secure:</p>
        <ul style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;padding-left:18px;line-height:1.9">
          <li>Use a strong, unique password for Uplyncio</li>
          <li>Never share your login credentials with anyone</li>
          <li>Always log out from shared or public devices</li>
          <li>Contact us immediately if you notice unusual activity</li>
        </ul>
      </td></tr>
    </table>` +
    ctaBtn(`${SITE}/uplyncio-full.html`, 'Log In to Your Account →', '#00c27a') +
    sign() + footer()
  );
  return send(to, `🔓 Your Uplyncio account has been unlocked`, html);
}

// ─────────────────────────────────────────
// S4: Unauthorized Access Attempt
// ─────────────────────────────────────────
export async function sendUnauthorizedAccessAttempt({ to, name, role, attemptedArea, time, ipAddress }) {
  const html = wrap(
    header('Security Alert', '#ef4444') +
    bodyStart('Unauthorized area access attempt',
      `Hi <strong style="color:#1a202c">${name}</strong>, someone attempted to access a restricted area of Uplyncio using your account that does not match your role permissions.`) +
    detailsBox('#fef2f2','#fecaca', [
      ['Your Role', role.charAt(0).toUpperCase() + role.slice(1), '#4f7cff'],
      ['Attempted Area', attemptedArea, '#ef4444'],
      ['Time', time],
      ['IP Address', ipAddress || 'Unknown'],
      ['Action Taken', 'Access Blocked ✅', '#00c27a']
    ]) +
    alertBox('#fef3c7','#fde68a','#92400e',
      `⚠️ <strong>Role reminder:</strong> Your account is registered as a <strong>${role}</strong>. You can only access the ${role} dashboard. If you need a different role, please create a separate account with a different email.`) +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '🔴 If this was NOT you, your account may be compromised. Change your password immediately and contact us at <a href="mailto:info@uplyncio.com" style="color:#b91c1c;text-decoration:none">info@uplyncio.com</a>') +
    ctaBtn(`${SITE}/uplyncio-full.html`, 'Secure My Account →', '#ef4444') +
    sign() + footer()
  );
  return send(to, `⚠️ Security Alert: Unauthorized access attempt on your Uplyncio account`, html);
}

// ─────────────────────────────────────────
// S5: Account Suspended by Admin
// ─────────────────────────────────────────
export async function sendAccountSuspended({ to, name, role, reason, suspendedAt, pendingOrdersInfo, pendingPaymentInfo, appealDeadline }) {
  const html = wrap(
    header('Account Suspended', '#ef4444') +
    bodyStart('Your account has been suspended',
      `Hi <strong style="color:#1a202c">${name}</strong>, your Uplyncio ${role} account has been suspended following a review by our Trust & Safety team.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef2f2;border:1.5px solid #ef4444;border-radius:10px;padding:18px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${invoiceRow('Account Type', role.charAt(0).toUpperCase() + role.slice(1))}
          ${invoiceRow('Suspended On', suspendedAt)}
          ${invoiceRow('Reason', reason || 'Violation of Uplyncio Terms of Service', { bold: true, color: '#ef4444' })}
          ${invoiceRow('Status', 'Suspended — Access Restricted', { bold: true, color: '#ef4444' })}
          ${pendingOrdersInfo ? invoiceRow('Pending Orders', pendingOrdersInfo) : ''}
          ${pendingPaymentInfo ? invoiceRow('Pending Payments', pendingPaymentInfo) : ''}
        </table>
      </td></tr>
    </table>` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#92400e;margin:0 0 8px">How to appeal this decision:</p>
        <ol style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;margin:0;padding-left:18px;line-height:1.9">
          <li>Email us at <a href="mailto:info@uplyncio.com" style="color:#92400e">info@uplyncio.com</a></li>
          <li>Use subject line: <strong>Account Appeal — ${name}</strong></li>
          <li>Explain your situation and provide any relevant evidence</li>
          <li>Appeals must be submitted before <strong>${appealDeadline || '30 days from suspension date'}</strong></li>
        </ol>
      </td></tr>
    </table>` +
    alertBox('#f8faff','#e0e7ff','#475569',
      'ℹ️ During suspension, you cannot access your dashboard, place or receive orders. Any active orders will be managed by Uplyncio. Pending earnings will be held until the suspension is resolved.') +
    sign() + footer()
  );
  return send(to, `Your Uplyncio account has been suspended`, html);
}

// ─────────────────────────────────────────
// S6: Account Reactivated
// ─────────────────────────────────────────
export async function sendAccountReactivated({ to, name, role, reactivatedAt, pendingOrdersStatus }) {
  const dashLink = role === 'publisher' ? `${SITE}/publisher.html` : `${SITE}/buyer.html`;
  const html = wrap(
    header('Account Reactivated', '#00c27a') +
    bodyStart(`Welcome back, ${name}!`,
      `Your Uplyncio ${role} account has been reviewed and is now fully reactivated. We are glad to have you back on the platform.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0fdf4;border:1.5px solid #00c27a;border-radius:10px;padding:18px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:32px;margin:0 0 10px">✅</p>
        <p style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#1a202c;margin:0 0 4px">Account Active</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0">Reactivated on ${reactivatedAt}</p>
      </td></tr>
    </table>` +
    (pendingOrdersStatus ? alertBox('#f0f4ff','#c7d7ff','#1e40af', `📋 <strong>Pending orders update:</strong> ${pendingOrdersStatus}`) : '') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#92400e;margin:0 0 8px">⚠️ Please note:</p>
        <ul style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;margin:0;padding-left:18px;line-height:1.9">
          <li>Any future violations may result in permanent suspension</li>
          <li>Please review our <a href="${SITE}/terms.html" style="color:#92400e">Terms of Service</a> and <a href="${SITE}/privacy.html" style="color:#92400e">Policies</a></li>
          <li>Contact us if you have any questions before resuming activity</li>
        </ul>
      </td></tr>
    </table>` +
    ctaBtn(dashLink, `Go to ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard →`, '#00c27a') +
    sign() + footer()
  );
  return send(to, `✅ Your Uplyncio account has been reactivated`, html);
}

// ─────────────────────────────────────────
// S7: Publisher Verified Badge Earned
// ─────────────────────────────────────────
export async function sendPublisherBadgeEarned({ to, name, completedOrders, earnedAt, totalEarnings, nextMilestone }) {
  const html = wrap(
    header('Verified Badge Earned', '#f59e0b') +
    `<tr><td style="padding:28px">
      <div style="text-align:center;margin-bottom:20px">
        <p style="font-family:Arial,sans-serif;font-size:48px;margin:0 0 8px">👑</p>
        <p style="font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#1a202c;margin:0 0 6px">Congratulations, ${name}!</p>
        <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0">You have earned the Uplyncio Verified Publisher badge</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
        <tr>
          <td style="width:33%;padding-right:4px">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px;text-align:center">
              <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#92400e;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Orders Done</p>
              <p style="font-family:Arial,sans-serif;font-size:24px;font-weight:800;color:#b45309;margin:0">${completedOrders}</p></td></tr>
            </table>
          </td>
          <td style="width:33%;padding:0 4px">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;text-align:center">
              <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#15803d;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Total Earned</p>
              <p style="font-family:Arial,sans-serif;font-size:24px;font-weight:800;color:#00c27a;margin:0">$${totalEarnings}</p></td></tr>
            </table>
          </td>
          <td style="width:33%;padding-left:4px">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:8px;padding:14px;text-align:center">
              <tr><td><p style="font-family:Arial,sans-serif;font-size:10px;color:#1e40af;margin:0 0 4px;text-transform:uppercase;letter-spacing:.5px">Badge</p>
              <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:800;color:#4f7cff;margin:0">👑 Verified</p></td></tr>
            </table>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
        <tr><td style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#92400e;margin:0 0 8px">What your Verified badge means:</p>
          <ul style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;margin:0;padding-left:18px;line-height:1.9">
            <li>👑 Crown badge displayed on your profile and all listings</li>
            <li>📈 Priority placement in buyer search results</li>
            <li>🤝 Higher buyer trust — verified publishers get 3x more orders</li>
            <li>💰 Access to premium buyer requests not available to unverified publishers</li>
          </ul>
        </td></tr>
      </table>
      ${nextMilestone ? alertBox('#f0f4ff','#c7d7ff','#1e40af', `🎯 <strong>Next milestone:</strong> ${nextMilestone}`) : ''}
    </td></tr>` +
    `<tr><td style="padding:0 28px 28px">` +
    ctaBtn(`${SITE}/publisher.html`, 'View My Verified Profile →', '#f59e0b') +
    sign() +
    `</td></tr>` +
    footer()
  );
  return send(to, `👑 Congratulations! You earned the Uplyncio Verified Publisher badge`, html);
}

// ─────────────────────────────────────────
// S8: Policy Violation Warning
// ─────────────────────────────────────────
export async function sendPolicyViolationWarning({ to, name, role, violation, warningNum, details, consequenceNext }) {
  const html = wrap(
    header('Policy Violation Warning', '#ef4444') +
    bodyStart(`Warning ${warningNum}: Policy violation detected`,
      `Hi <strong style="color:#1a202c">${name}</strong>, our Trust & Safety team has reviewed your account and found a violation of Uplyncio's policies. This is a formal warning.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef2f2;border:1.5px solid #ef4444;border-radius:10px;padding:18px">
        <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#ef4444;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px">Violation Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${invoiceRow('Warning Number', `${warningNum} of 3`)}
          ${invoiceRow('Account Type', role.charAt(0).toUpperCase() + role.slice(1))}
          ${invoiceRow('Violation Type', violation, { bold: true, color: '#ef4444' })}
          ${details ? invoiceRow('Details', details) : ''}
        </table>
      </td></tr>
    </table>` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="width:33%;padding-right:4px;text-align:center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${warningNum >= 1 ? '#fef2f2' : '#f8faff'};border:1px solid ${warningNum >= 1 ? '#fecaca' : '#e0e7ff'};border-radius:8px;padding:12px">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin:0 0 4px">Warning 1</p>
            <p style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:${warningNum >= 1 ? '#ef4444' : '#94a3b8'};margin:0">${warningNum >= 1 ? '⚠️ Issued' : '—'}</p></td></tr>
          </table>
        </td>
        <td style="width:33%;padding:0 4px;text-align:center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${warningNum >= 2 ? '#fef2f2' : '#f8faff'};border:1px solid ${warningNum >= 2 ? '#fecaca' : '#e0e7ff'};border-radius:8px;padding:12px">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin:0 0 4px">Warning 2</p>
            <p style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:${warningNum >= 2 ? '#ef4444' : '#94a3b8'};margin:0">${warningNum >= 2 ? '⚠️ Issued' : 'Pending'}</p></td></tr>
          </table>
        </td>
        <td style="width:33%;padding-left:4px;text-align:center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${warningNum >= 3 ? '#fef2f2' : '#f8faff'};border:1px solid ${warningNum >= 3 ? '#fecaca' : '#e0e7ff'};border-radius:8px;padding:12px">
            <tr><td><p style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin:0 0 4px">Warning 3</p>
            <p style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:${warningNum >= 3 ? '#ef4444' : '#94a3b8'};margin:0">${warningNum >= 3 ? '❌ Ban' : 'Permanent Ban'}</p></td></tr>
          </table>
        </td>
      </tr>
    </table>` +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      `🔴 <strong>Next consequence:</strong> ${consequenceNext || 'A third violation will result in permanent account suspension with no possibility of appeal.'}`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
          Review our <a href="${SITE}/terms.html" style="color:#4f7cff;text-decoration:none">Terms of Service</a> to understand what is and is not permitted. If you believe this warning was issued in error, contact us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a>
        </p>
      </td></tr>
    </table>` +
    sign() + footer()
  );
  return send(to, `⚠️ Policy Violation Warning ${warningNum}/3 — Action Required`, html);
}

// ─────────────────────────────────────────
// S9: Account Permanently Banned
// ─────────────────────────────────────────
export async function sendAccountPermanentlyBanned({ to, name, role, reason, bannedAt, pendingEarnings, refundInfo }) {
  const html = wrap(
    header('Account Banned', '#1a202c') +
    bodyStart('Your account has been permanently closed',
      `Hi <strong style="color:#1a202c">${name}</strong>, after multiple violations of Uplyncio's policies, your ${role} account has been permanently closed. This decision is final.`) +
    detailsBox('#fef2f2','#fecaca', [
      ['Account Type', role.charAt(0).toUpperCase() + role.slice(1)],
      ['Banned On', bannedAt],
      ['Reason', reason || 'Repeated violation of Uplyncio Terms of Service', '#ef4444'],
      ['Status', '❌ Permanently Banned', '#ef4444'],
      ...(pendingEarnings ? [['Pending Earnings', pendingEarnings]] : []),
      ...(refundInfo ? [['Refund / Payment Info', refundInfo]] : [])
    ]) +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '🔴 <strong>This ban is permanent.</strong> Creating a new account with a different email to bypass this ban is a violation and will result in legal action. All associated accounts have been flagged.') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
          For questions regarding pending payments or data, contact us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> with the subject line: <strong>Account Closure — ${name}</strong>
        </p>
      </td></tr>
    </table>` +
    sign() + footer()
  );
  return send(to, `Your Uplyncio account has been permanently closed`, html);
}

// ─────────────────────────────────────────
// S10: Dispute Raised — Notification to Both Parties
// ─────────────────────────────────────────
export async function sendDisputeRaised({ to, name, role, disputeId, orderId, siteUrl, raisedBy, reason, raisedAt }) {
  const isRaiser = raisedBy === role;
  const html = wrap(
    header('Dispute Opened', '#f59e0b') +
    bodyStart(
      isRaiser ? 'Your dispute has been received' : 'A dispute has been raised on your order',
      isRaiser
        ? `Hi <strong style="color:#1a202c">${name}</strong>, your dispute for order <strong style="color:#1a202c">${orderId}</strong> has been received. Our team will investigate and respond within 48–72 hours.`
        : `Hi <strong style="color:#1a202c">${name}</strong>, a dispute has been raised on order <strong style="color:#1a202c">${orderId}</strong>. Please do not take any action — our team is reviewing the case.`
    ) +
    detailsBox('#fef3c7','#fde68a', [
      ['Dispute ID', disputeId],
      ['Order ID', orderId],
      ['Publisher Site', siteUrl],
      ['Raised By', raisedBy.charAt(0).toUpperCase() + raisedBy.slice(1)],
      ['Reason', reason],
      ['Raised On', raisedAt],
      ['Expected Resolution', '48–72 business hours', '#f59e0b']
    ]) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;margin:0 0 8px">What happens next:</p>
        <ol style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;padding-left:18px;line-height:1.9">
          <li>Uplyncio's Trust & Safety team reviews all evidence</li>
          <li>Both parties may be contacted for additional information</li>
          <li>A fair decision will be made within 48–72 hours</li>
          <li>Both parties will be notified of the final decision by email</li>
        </ol>
      </td></tr>
    </table>` +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      '🔒 Payment for this order is held in escrow and will not be released until the dispute is fully resolved.') +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
          To add evidence or comments, email us at <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> with subject: <strong>Dispute ${disputeId}</strong>
        </p>
      </td></tr>
    </table>` +
    sign() + footer()
  );
  return send(to, `Dispute ${disputeId} Opened — Order ${orderId} Under Review`, html);
}

// ─────────────────────────────────────────
// S11: Dispute Resolved
// ─────────────────────────────────────────
export async function sendDisputeResolved({ to, name, role, disputeId, orderId, decision, decisionInFavor, paymentAction, resolvedAt }) {
  const won = decisionInFavor === role;
  const accentColor = won ? '#00c27a' : '#f59e0b';
  const html = wrap(
    header('Dispute Resolved', accentColor) +
    bodyStart('Dispute resolution — final decision',
      `Hi <strong style="color:#1a202c">${name}</strong>, our Trust & Safety team has completed the review of dispute <strong style="color:#1a202c">${disputeId}</strong> for order <strong style="color:#1a202c">${orderId}</strong>.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:${won ? '#f0fdf4' : '#fef3c7'};border:1.5px solid ${won ? '#00c27a' : '#f59e0b'};border-radius:10px;padding:18px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:28px;margin:0 0 8px">${won ? '✅' : '⚖️'}</p>
        <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1a202c;margin:0 0 6px">
          ${won ? 'Decision in your favor' : 'Decision in favor of ' + (decisionInFavor.charAt(0).toUpperCase() + decisionInFavor.slice(1))}
        </p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0">Resolved on ${resolvedAt}</p>
      </td></tr>
    </table>` +
    detailsBox('#f8faff','#e0e7ff', [
      ['Dispute ID', disputeId],
      ['Order ID', orderId],
      ['Decision', decision],
      ['In Favor Of', decisionInFavor.charAt(0).toUpperCase() + decisionInFavor.slice(1)],
      ['Payment Action', paymentAction, '#00c27a'],
      ['Resolved On', resolvedAt]
    ]) +
    alertBox('#f0f4ff','#c7d7ff','#1e40af',
      `📋 <strong>Payment update:</strong> ${paymentAction}`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
          If you disagree with this decision, you may appeal within <strong>7 days</strong> by emailing <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a> with subject: <strong>Appeal — Dispute ${disputeId}</strong>
        </p>
      </td></tr>
    </table>` +
    sign() + footer()
  );
  return send(to, `Dispute ${disputeId} Resolved — Final Decision Issued`, html);
}

// ─────────────────────────────────────────
// S12: Data Export Request Received
// ─────────────────────────────────────────
export async function sendDataExportRequest({ to, name, requestId, requestedAt, deliveryHours = 72 }) {
  const html = wrap(
    header('Data Export Request', '#4f7cff') +
    bodyStart('Your data export request is received',
      `Hi <strong style="color:#1a202c">${name}</strong>, we have received your request to export your personal data from Uplyncio. This is your right under applicable data protection laws.`) +
    detailsBox('#f0f4ff','#c7d7ff', [
      ['Request ID', requestId],
      ['Requested On', requestedAt],
      ['Data Delivery', `Within ${deliveryHours} hours by email`, '#4f7cff'],
      ['Format', 'JSON / CSV (downloadable link)'],
      ['Status', '⏳ Processing', '#f59e0b']
    ]) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:14px">
        <p style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;margin:0 0 8px">Your export will include:</p>
        <ul style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;padding-left:18px;line-height:1.9">
          <li>Account details and profile information</li>
          <li>Order history (placed or received)</li>
          <li>Payment and transaction records</li>
          <li>Publisher site listings (if applicable)</li>
          <li>Message history</li>
        </ul>
      </td></tr>
    </table>` +
    alertBox('#fef3c7','#fde68a','#92400e',
      '🔒 Your data export download link will be sent to this email address only and will expire after 24 hours for security reasons.') +
    sign() + footer()
  );
  return send(to, `Data Export Request ${requestId} Received`, html);
}

// ─────────────────────────────────────────
// S13: Account Deletion Confirmation
// ─────────────────────────────────────────
export async function sendAccountDeletionConfirm({ to, name, role, deletionCode, requestedAt, recoveryWindowDays = 30 }) {
  const html = wrap(
    header('Account Deletion Request', '#ef4444') +
    bodyStart('Confirm your account deletion',
      `Hi <strong style="color:#1a202c">${name}</strong>, we received a request to permanently delete your Uplyncio ${role} account. This action is irreversible after the recovery window.`) +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#fef2f2;border:1.5px solid #ef4444;border-radius:10px;padding:20px">
        <p style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#ef4444;letter-spacing:1px;text-transform:uppercase;margin:0 0 16px">⚠️ What will be permanently deleted:</p>
        <ul style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;padding-left:18px;line-height:1.9">
          <li>Your account and all profile information</li>
          <li>All order history and transaction records</li>
          ${role === 'publisher' ? '<li>All publisher site listings</li><li>Any pending or unpaid earnings</li>' : '<li>All wallet balance (non-refundable)</li>'}
          <li>All messages and communication history</li>
        </ul>
      </td></tr>
    </table>` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr><td style="background:#f0f4ff;border:2px solid #c7d7ff;border-radius:10px;padding:20px;text-align:center">
        <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#4f7cff;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">Deletion Confirmation Code</p>
        <p style="font-family:'Courier New',monospace;font-size:34px;font-weight:700;color:#1a202c;letter-spacing:10px;margin:0">${deletionCode}</p>
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:10px 0 0">Enter this code in your dashboard to confirm deletion</p>
      </td></tr>
    </table>` +
    alertBox('#f0fdf4','#bbf7d0','#15803d',
      `✅ <strong>Recovery window:</strong> You have <strong>${recoveryWindowDays} days</strong> to cancel this deletion request by logging in to your account. After that, deletion is permanent and cannot be reversed.`) +
    alertBox('#fef2f2','#fecaca','#b91c1c',
      '🔴 If you did NOT request account deletion, do not enter this code. Contact us immediately at <a href="mailto:info@uplyncio.com" style="color:#b91c1c;text-decoration:none">info@uplyncio.com</a>') +
    sign() + footer()
  );
  return send(to, `Account Deletion Request — Confirmation Code Inside`, html);
}
