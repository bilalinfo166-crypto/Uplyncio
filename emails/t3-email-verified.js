// Template 3: Email Verified Successfully
// Sent after user enters correct OTP

export function emailVerifiedTemplate({ name, role, email, verifiedAt }) {
  const dashLink = role === 'publisher'
    ? 'https://uplyncio.vercel.app/publisher.html'
    : 'https://uplyncio.vercel.app/buyer.html';

  return `
  ${header('Verified Successfully', '#00c27a')}
  <tr><td style="padding:28px">

    <!-- Success icon -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td align="center">
          <div style="width:60px;height:60px;border-radius:50%;background:#f0fdf4;border:2px solid #bbf7d0;text-align:center;line-height:58px;font-size:26px;display:inline-block">
            ✅
          </div>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px;text-align:center">
      Email verified successfully!
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7;text-align:center">
      Hi <strong style="color:#1a202c">${name}</strong>, your email has been verified.
      Your Uplyncio account is now fully active and ready to use.
    </p>

    <!-- Details box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Account type</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#1a202c;padding:4px 0;text-transform:capitalize">${role}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Email</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${email}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Verified on</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${verifiedAt}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td align="center">
          <a href="${dashLink}" style="display:inline-block;background:#00c27a;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px">
            Go to Dashboard →
          </a>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;
}
