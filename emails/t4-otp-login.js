// Template 4: OTP Verification (Login)
// Sent when user requests OTP to log in

export function otpLoginTemplate({ name, code, expiresIn = '5 minutes' }) {
  return `
  ${header('OTP Verification', '#6366f1')}
  <tr><td style="padding:28px">

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">
      Your one-time login code
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">
      Hi <strong style="color:#1a202c">${name}</strong>, you requested a one-time code to log in to
      your Uplyncio account. Enter the code below to continue.
    </p>

    <!-- Code box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="background:#f5f3ff;border:2px solid #ddd6fe;border-radius:10px;padding:20px;text-align:center">
          <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#6366f1;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">
            One-time login code
          </p>
          <p style="font-family:'Courier New',monospace;font-size:38px;font-weight:700;color:#1a202c;letter-spacing:14px;margin:0">
            ${code}
          </p>
        </td>
      </tr>
    </table>

    <!-- Warning -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;margin:0;line-height:1.6">
            ⏰ This code is valid for <strong>${expiresIn} only</strong>.
            If you did not request this, your account may be at risk —
            please change your password immediately.
          </p>
        </td>
      </tr>
    </table>

    <!-- Security tip -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
            🔒 <strong style="color:#1a202c">Security reminder:</strong>
            Uplyncio will never ask you to share this code via email, phone, or chat.
          </p>
        </td>
      </tr>
    </table>

    <a href="https://uplyncio.vercel.app" style="display:block;text-align:center;background:#6366f1;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;margin-bottom:20px">
      Go to Uplyncio →
    </a>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;
}
