// Template 8: Email Changed

export function emailChangedTemplate({ name, oldEmail, newEmail, changedAt }) {
  return `
  ${header('Account Update', '#f59e0b')}
  <tr><td style="padding:28px">

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">
      Your email address was changed
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">
      Hi <strong style="color:#1a202c">${name}</strong>, the email address linked to your Uplyncio
      account has been updated. Here are the details:
    </p>

    <!-- Change details -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:16px">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Previous email</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#94a3b8;padding:5px 0;text-decoration:line-through">${oldEmail}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">New email</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#00c27a;padding:5px 0">${newEmail}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:5px 0">Changed on</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:5px 0">${changedAt}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Alert -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#b91c1c;margin:0;line-height:1.6">
            🔴 If you did not make this change, contact us <strong>immediately</strong> at
            <a href="mailto:info@uplyncio.com" style="color:#b91c1c">info@uplyncio.com</a>
            — we will secure your account and reverse this change right away.
          </p>
        </td>
      </tr>
    </table>

    <!-- Note -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#92400e;margin:0;line-height:1.6">
            📧 From now on, use <strong>${newEmail}</strong> to log in to your Uplyncio account.
            Your old email address is no longer linked.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td align="center">
          <a href="https://uplyncio.vercel.app" style="display:inline-block;background:#4f7cff;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px">
            Go to Uplyncio →
          </a>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;
}
