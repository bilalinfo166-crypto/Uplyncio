// Shared email components for all Uplyncio templates

const SITE_URL = 'https://uplyncio.vercel.app';

export function emailHeader(category, accentColor = '#4f7cff') {
  return `
  <div style="background:#07090f;padding:18px 28px;text-align:center;border-bottom:3px solid ${accentColor}">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right:8px;vertical-align:middle">
                <div style="width:26px;height:26px;background:#4f7cff;border-radius:6px;display:inline-flex;align-items:center;justify-content:center">
                  <img src="https://uplyncio.vercel.app/favicon.svg" width="14" height="14" alt="Uplyncio" style="display:block"/>
                </div>
              </td>
              <td style="vertical-align:middle">
                <span style="font-family:Arial,sans-serif;font-size:20px;font-weight:700;color:#ffffff">Uplyncio</span>
              </td>
            </tr>
          </table>
          <br>
          <span style="font-family:Arial,sans-serif;font-size:10px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase">${category}</span>
        </td>
      </tr>
    </table>
  </div>`;
}

export function emailFooter() {
  return `
  <div style="background:#07090f;padding:24px 28px">
    <!-- Logo + tagline -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px">
      <tr>
        <td>
          <span style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff">Uplyncio</span>
          <br>
          <span style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.6">
            Premium guest posting &amp; link building marketplace.<br>
            20,000+ verified publisher sites across 30+ niches.
          </span>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <div style="height:1px;background:rgba(255,255,255,0.08);margin:0 0 14px"></div>

    <!-- Quick links -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px">
      <tr>
        <td>
          <a href="${SITE_URL}" style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none;margin-right:14px">Home</a>
          <a href="${SITE_URL}/buyer.html" style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none;margin-right:14px">Marketplace</a>
          <a href="${SITE_URL}/publisher.html" style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none;margin-right:14px">Become Publisher</a>
          <a href="mailto:info@uplyncio.com" style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.45);text-decoration:none">Contact</a>
        </td>
      </tr>
    </table>

    <!-- Social icons (text-based for email compatibility) -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px">
      <tr>
        <td style="padding-right:8px">
          <a href="https://www.linkedin.com/company/uplyncio" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">in</a>
        </td>
        <td style="padding-right:8px">
          <a href="https://www.facebook.com/profile.php?id=61579091653953" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">fb</a>
        </td>
        <td style="padding-right:8px">
          <a href="https://www.instagram.com/uplyncio" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">ig</a>
        </td>
        <td style="padding-right:8px">
          <a href="https://wa.me/923001234567" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">wa</a>
        </td>
        <td>
          <a href="https://twitter.com/uplyncio" style="display:inline-block;width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);text-align:center;line-height:30px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.6);text-decoration:none">𝕏</a>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <div style="height:1px;background:rgba(255,255,255,0.08);margin:0 0 12px"></div>

    <!-- Bottom row -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <span style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25)">© 2026 Uplyncio. All rights reserved.</span>
        </td>
        <td align="right">
          <a href="${SITE_URL}/privacy.html" style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;margin-right:10px">Privacy</a>
          <a href="${SITE_URL}/terms.html" style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;margin-right:10px">Terms</a>
          <a href="mailto:info@uplyncio.com" style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none">info@uplyncio.com</a>
        </td>
      </tr>
    </table>

    <!-- Note -->
    <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.18);text-align:center;margin:10px 0 0">
      This is an automated message — please do not reply directly to this email.
    </p>
  </div>`;
}

export function emailWrapper(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Uplyncio</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;-webkit-font-smoothing:antialiased">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:24px 0">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
