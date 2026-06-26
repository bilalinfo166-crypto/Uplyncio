// Template 5: Forgot Password
// Sent when user requests password reset

export function forgotPasswordTemplate({ name, resetLink, expiresIn = '1 hour' }) {
  return `
  ${header('Password Reset', '#f59e0b')}
  <tr><td style="padding:28px">

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">
      Reset your password
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">
      Hi <strong style="color:#1a202c">${name}</strong>, we received a request to reset the password
      for your Uplyncio account. Click the button below to create a new password.
    </p>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td align="center">
          <a href="${resetLink}" style="display:inline-block;background:#f59e0b;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px">
            Reset My Password →
          </a>
        </td>
      </tr>
    </table>

    <!-- Expiry warning -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;margin:0;line-height:1.6">
            ⏰ This link expires in <strong>${expiresIn}</strong>. If you did not request a
            password reset, please ignore this email — your password will not be changed.
          </p>
        </td>
      </tr>
    </table>

    <!-- Fallback link -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;margin:0 0 6px">
            If the button does not work, copy and paste this link into your browser:
          </p>
          <p style="font-family:Arial,sans-serif;font-size:12px;color:#4f7cff;margin:0;word-break:break-all">
            ${resetLink}
          </p>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;
}
