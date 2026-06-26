// Template 6: Password Reset Successful

export function passwordResetSuccessTemplate({ name, email, changedAt, ipAddress }) {
  return `
  ${header('Password Updated', '#00c27a')}
  <tr><td style="padding:28px">

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">
      Password reset successful
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">
      Hi <strong style="color:#1a202c">${name}</strong>, your Uplyncio account password has been
      reset successfully. You can now log in with your new password.
    </p>

    <!-- Details -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Account</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${email}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Changed on</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${changedAt}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">IP Address</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${ipAddress || 'Unknown'}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Security alert -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#b91c1c;margin:0;line-height:1.6">
            🔴 If you did not make this change, your account may be compromised.
            <strong>Contact us immediately</strong> at
            <a href="mailto:info@uplyncio.com" style="color:#b91c1c">info@uplyncio.com</a>
            and we will secure your account right away.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td align="center">
          <a href="https://uplyncio.vercel.app" style="display:inline-block;background:#00c27a;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px">
            Log In to Uplyncio →
          </a>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;
}
