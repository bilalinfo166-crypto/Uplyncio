// Template 2: Verify Email
// Sent when user signs up - contains OTP code

export function verifyEmailTemplate({ name, code }) {
  return `
  ${header('Email Verification', '#4f7cff')}
  <tr><td style="padding:28px">

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">
      Verify your email address
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">
      Hi <strong style="color:#1a202c">${name}</strong>, use the 6-digit code below to verify your
      Uplyncio account. Do not share this code with anyone — our team will never ask for it.
    </p>

    <!-- Code box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="background:#f0f4ff;border:2px solid #c7d7ff;border-radius:10px;padding:20px;text-align:center">
          <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#4f7cff;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px">
            Your verification code
          </p>
          <p style="font-family:'Courier New',monospace;font-size:38px;font-weight:700;color:#1a202c;letter-spacing:14px;margin:0">
            ${code}
          </p>
        </td>
      </tr>
    </table>

    <!-- Warning box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;margin:0;line-height:1.6">
            ⏰ This code expires in <strong>10 minutes</strong>. If you did not create an Uplyncio account,
            please ignore this email — no action is required.
          </p>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;
}
