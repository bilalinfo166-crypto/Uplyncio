// Template 1: Welcome Email
// Sent after successful signup

export function welcomeEmail({ name, role }) {
  const dashLink = role === 'publisher'
    ? 'https://uplyncio.vercel.app/publisher.html'
    : 'https://uplyncio.vercel.app/buyer.html';

  const roleLabel = role === 'publisher' ? 'Publisher' : 'Buyer';

  const body = `
  ${header('Welcome Aboard', '#4f7cff')}
  <tr><td style="padding:28px">

    <p style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#1a202c;margin:0 0 10px">
      Welcome to Uplyncio, ${name}!
    </p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7">
      We are excited to have you on board. Your <strong style="color:#1a202c">${roleLabel}</strong> account
      has been created successfully. Here is everything you need to get started:
    </p>

    <!-- Steps -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr><td style="padding-bottom:8px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px">
          <tr>
            <td style="padding:12px 14px;vertical-align:top;width:24px">
              <span style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#4f7cff">1.</span>
            </td>
            <td style="padding:12px 14px 12px 0">
              <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5">
                <strong style="color:#1a202c">Verify your email</strong> — Check your inbox for the verification
                code we just sent and activate your account.
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding-bottom:8px">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px">
          <tr>
            <td style="padding:12px 14px;vertical-align:top;width:24px">
              <span style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#4f7cff">2.</span>
            </td>
            <td style="padding:12px 14px 12px 0">
              <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5">
                <strong style="color:#1a202c">Complete your profile</strong> — Add your details so
                ${role === 'publisher' ? 'buyers can trust your listings' : 'publishers can process your orders'} faster.
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px">
          <tr>
            <td style="padding:12px 14px;vertical-align:top;width:24px">
              <span style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:#4f7cff">3.</span>
            </td>
            <td style="padding:12px 14px 12px 0">
              <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:0;line-height:1.5">
                <strong style="color:#1a202c">
                  ${role === 'publisher' ? 'List your sites' : 'Browse 20,000+ sites'}
                </strong> —
                ${role === 'publisher'
                  ? 'Add your publisher sites, set your price, and start receiving guest post orders.'
                  : 'Filter by DA, niche, country and price. Place your first order in minutes.'}
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px">
      <tr>
        <td align="center">
          <a href="${dashLink}" style="display:inline-block;background:#4f7cff;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px">
            Get Started on Uplyncio →
          </a>
        </td>
      </tr>
    </table>

    <p style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:1.7">
      If you have any questions, email us at
      <a href="mailto:info@uplyncio.com" style="color:#4f7cff;text-decoration:none">info@uplyncio.com</a>
      — we respond within 24 hours.
    </p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#475569;margin:20px 0 0">
      Best regards,<br><strong>Team Uplyncio</strong>
    </p>

  </td></tr>`;

  return body;
}
