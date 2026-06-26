// Template 7: Login From New Device — Security Alert

export function newDeviceLoginTemplate({ name, device, location, ipAddress, loginTime }) {
  return `
  ${header('Security Alert', '#ef4444')}
  <tr><td style="padding:28px">

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">
      New login detected on your account
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">
      Hi <strong style="color:#1a202c">${name}</strong>, we detected a login to your Uplyncio account
      from a new device or location. Review the details below to confirm it was you.
    </p>

    <!-- Login details -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px">
      <tr>
        <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px">
          <p style="font-family:Arial,sans-serif;font-size:10px;font-weight:700;color:#ef4444;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px">
            Login Details
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Date &amp; Time</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${loginTime}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Device</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${device || 'Unknown device'}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">Location</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${location || 'Unknown location'}</td>
            </tr>
            <tr>
              <td style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;padding:4px 0">IP Address</td>
              <td align="right" style="font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1a202c;padding:4px 0">${ipAddress || 'Unknown'}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- If not you warning -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#b91c1c;margin:0;line-height:1.6">
            🔴 If this was <strong>not you</strong>, change your password immediately and contact us at
            <a href="mailto:info@uplyncio.com" style="color:#b91c1c">info@uplyncio.com</a>
            — we will lock and secure your account right away.
          </p>
        </td>
      </tr>
    </table>

    <!-- Was it you? -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:12px 14px">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.6">
            ✅ <strong style="color:#1a202c">If this was you</strong>, no action is needed.
            You can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td align="center">
          <a href="https://uplyncio.vercel.app" style="display:inline-block;background:#ef4444;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px">
            Secure My Account →
          </a>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;
}
