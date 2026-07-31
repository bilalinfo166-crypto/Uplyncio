import { setCors, getIp, rateLimit, apiError } from './_security.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;

function h() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

// ── DOMAIN VALIDATION ──
function isValidDomain(domain) {
  if (!domain || domain.length < 4) return false;
  // Must have at least one dot
  if (!domain.includes('.')) return false;
  // No spaces or special chars (except - and .)
  if (/[^a-z0-9.\-]/.test(domain)) return false;
  // Must end with valid TLD (2+ chars)
  const parts = domain.split('.');
  if (parts[parts.length - 1].length < 2) return false;
  // No double dots
  if (domain.includes('..')) return false;
  // Reject obvious spam/test domains
  const blocked = ['example.com','test.com','localhost','127.0.0.1','abc.com','xyz.com','asdf.com','temp.com','fake.com','spam.com'];
  if (blocked.includes(domain)) return false;
  return true;
}

// ── SEND NOTIFICATION EMAIL ──
async function sendModEmail(to, name, subject, bodyHtml) {
  if (!RESEND_KEY) return { ok: false };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Uplyncio <info@uplyncio.com>',
        to: [to],
        subject,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
          <div style="background:linear-gradient(135deg,#0f1628,#1a2d5a);padding:20px 24px;text-align:center">
            <div style="font-size:18px;font-weight:800;color:#fff;font-family:Manrope,sans-serif">Uplyncio</div>
            <div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px">Site Review System</div>
          </div>
          <div style="padding:24px 28px">
            <p style="font-size:14px;color:#333;margin:0 0 16px">Hi <strong>${name}</strong>,</p>
            ${bodyHtml}
          </div>
          <div style="background:#f8faff;border-top:1px solid #e2e8f0;padding:14px 24px;text-align:center;font-size:11px;color:#94a3b8">
            © 2026 Uplyncio — Guest Posting Marketplace
          </div>
        </div>`
      })
    });
    return { ok: r.ok };
  } catch(e) { return { ok: false, error: e.message }; }
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!SUPABASE_URL || !SUPABASE_KEY) return apiError(res, 500, 'Not configured');

  const ip = getIp(req);
  if (rateLimit(`mod:${ip}`, 30, 60000)) return apiError(res, 429, 'Too many requests');

  try {
    const { action, publisher_id, batch_id } = req.method === 'POST' ? (req.body || {}) : (req.query || {});

    // ═══════════════════════════════════════
    // ACTION: START — Begin moderation for a publisher's pending sites
    // Called once after bulk upload
    // ═══════════════════════════════════════
    if (action === 'start') {
      if (!publisher_id) return apiError(res, 400, 'Missing publisher_id');

      // Get publisher info
      const pubR = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(publisher_id)}&select=name,email&limit=1`, { headers: h() });
      const pubs = await pubR.json();
      const pub = pubs?.[0] || { name: 'Publisher', email: '' };

      // Count pending sites
      const countR = await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.Pending Review&select=id`, { headers: h() });
      const pending = await countR.json();
      const total = Array.isArray(pending) ? pending.length : 0;

      if (total === 0) return res.status(200).json({ success: true, message: 'No pending sites', total: 0 });

      const batchId = 'batch_' + Date.now();
      const estMinutes = Math.max(1, Math.ceil(total / 80));

      // Send "Review Started" email
      await sendModEmail(pub.email, pub.name,
        `🔍 Site review started — ${total} sites being reviewed`,
        `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;margin-bottom:16px">
          <p style="font-size:13px;color:#1e40af;margin:0;line-height:1.6">
            📋 Our team has started reviewing your <strong>${total} submitted sites</strong>. Each site is checked for domain validity, DA requirements, and quality standards.
          </p>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:16px">
          <div style="flex:1;background:#f8faff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:22px;font-weight:800;color:#4f7cff">${total}</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px">Sites Submitted</div>
          </div>
          <div style="flex:1;background:#f8faff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:22px;font-weight:800;color:#f59e0b">~${estMinutes} min</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px">Est. Review Time</div>
          </div>
        </div>
        <p style="font-size:13px;color:#64748b;margin:0">You'll receive another email when the review is complete with a full breakdown. Sites will appear in the marketplace as they're approved.</p>`
      );

      return res.status(200).json({
        success: true, batchId, total,
        estMinutes,
        message: `Review started for ${total} sites`
      });
    }

    // ═══════════════════════════════════════
    // ACTION: PROCESS — Approve/reject a batch of pending sites
    // Called repeatedly by frontend every ~15 seconds
    // Processes 50-100 sites per call
    // ═══════════════════════════════════════
    if (action === 'process') {
      if (!publisher_id) return apiError(res, 400, 'Missing publisher_id');

      const BATCH_SIZE = 75; // Process 75 sites per call (~5 calls per minute)

      // Fetch next batch of pending sites
      const pendR = await fetch(
        `${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.Pending Review&select=id,domain,url,da,dr,price,traffic&limit=${BATCH_SIZE}&order=created_at.asc`,
        { headers: h() }
      );
      const pending = await pendR.json();

      if (!Array.isArray(pending) || pending.length === 0) {
        return res.status(200).json({ success: true, done: true, processed: 0, remaining: 0 });
      }

      const results = { approved: 0, rejected: 0, reasons: [] };
      const approveIds = [];
      const rejectBatch = [];

      for (const site of pending) {
        const domain = (site.domain || '').toLowerCase().trim();
        let rejectReason = null;

        // ── REJECTION RULES ──
        if (!isValidDomain(domain)) {
          rejectReason = `Invalid domain: ${domain}`;
        } else if ((parseInt(site.da) || 0) < 5) {
          rejectReason = `DA too low (${site.da || 0}) — minimum DA 5 required`;
        } else if (!site.price || parseFloat(site.price) <= 0) {
          rejectReason = `No price set for ${domain}`;
        }

        if (rejectReason) {
          rejectBatch.push(site.id);
          results.rejected++;
          results.reasons.push({ domain, reason: rejectReason });
        } else {
          approveIds.push(site.id);
          results.approved++;
        }
      }

      // Batch approve
      if (approveIds.length > 0) {
        const ids = approveIds.map(id => `"${id}"`).join(',');
        await fetch(
          `${SUPABASE_URL}/rest/v1/publisher_sites?id=in.(${ids})`,
          { method: 'PATCH', headers: h(), body: JSON.stringify({ status: 'Live', reviewed_at: new Date().toISOString() }) }
        );
      }

      // Batch reject
      if (rejectBatch.length > 0) {
        const ids = rejectBatch.map(id => `"${id}"`).join(',');
        await fetch(
          `${SUPABASE_URL}/rest/v1/publisher_sites?id=in.(${ids})`,
          { method: 'PATCH', headers: h(), body: JSON.stringify({ status: 'Rejected', reviewed_at: new Date().toISOString() }) }
        );
      }

      // Check remaining
      const remR = await fetch(
        `${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.Pending Review&select=id`,
        { headers: h() }
      );
      const remaining = await remR.json();
      const remCount = Array.isArray(remaining) ? remaining.length : 0;

      return res.status(200).json({
        success: true,
        done: remCount === 0,
        processed: pending.length,
        approved: results.approved,
        rejected: results.rejected,
        remaining: remCount,
        reasons: results.reasons.slice(0, 10) // Max 10 reasons per batch
      });
    }

    // ═══════════════════════════════════════
    // ACTION: COMPLETE — Send summary email after all processing done
    // Called once by frontend when process returns done:true
    // ═══════════════════════════════════════
    if (action === 'complete') {
      if (!publisher_id) return apiError(res, 400, 'Missing publisher_id');
      const { totalApproved = 0, totalRejected = 0, totalDuplicate = 0, reasons = [] } = req.body || {};
      const total = totalApproved + totalRejected + totalDuplicate;

      // Get publisher info
      const pubR = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(publisher_id)}&select=name,email&limit=1`, { headers: h() });
      const pubs = await pubR.json();
      const pub = pubs?.[0] || { name: 'Publisher', email: '' };

      // Build reasons table
      let reasonsHtml = '';
      if (reasons.length > 0) {
        reasonsHtml = `<div style="margin-top:16px">
          <div style="font-size:13px;font-weight:700;color:#333;margin-bottom:8px">❌ Rejection Details (showing ${Math.min(reasons.length, 20)} of ${totalRejected}):</div>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <tr style="background:#f8faff">
              <th style="padding:8px 10px;text-align:left;border:1px solid #e2e8f0;color:#64748b">Domain</th>
              <th style="padding:8px 10px;text-align:left;border:1px solid #e2e8f0;color:#64748b">Reason</th>
            </tr>
            ${reasons.slice(0, 20).map(r => `<tr>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:#333;font-weight:600">${r.domain || '—'}</td>
              <td style="padding:6px 10px;border:1px solid #e2e8f0;color:#ef4444">${r.reason || '—'}</td>
            </tr>`).join('')}
          </table>
        </div>`;
      }

      // Send summary email
      await sendModEmail(pub.email, pub.name,
        `✅ Site review complete — ${totalApproved} approved, ${totalRejected} rejected`,
        `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;margin-bottom:16px">
          <p style="font-size:14px;color:#15803d;margin:0;font-weight:700">
            ✅ Your site review is complete!
          </p>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
          <div style="flex:1;min-width:80px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:#16a34a">${totalApproved}</div>
            <div style="font-size:11px;color:#15803d;margin-top:2px">Approved ✓</div>
          </div>
          <div style="flex:1;min-width:80px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:#dc2626">${totalRejected}</div>
            <div style="font-size:11px;color:#b91c1c;margin-top:2px">Rejected ✗</div>
          </div>
          <div style="flex:1;min-width:80px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:#d97706">${totalDuplicate}</div>
            <div style="font-size:11px;color:#92400e;margin-top:2px">Duplicates</div>
          </div>
          <div style="flex:1;min-width:80px;background:#f8faff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:#4f7cff">${total}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">Total</div>
          </div>
        </div>
        <p style="font-size:13px;color:#64748b;margin:0 0 8px">
          Approved sites are now <strong>live in the marketplace</strong> and visible to buyers. Rejected sites can be fixed and re-submitted.
        </p>
        ${reasonsHtml}
        <div style="margin-top:20px;text-align:center">
          <a href="https://uplyncio.com/publisher" style="display:inline-block;background:#4f7cff;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px">Go to Dashboard →</a>
        </div>`
      );

      return res.status(200).json({ success: true, message: 'Summary email sent' });
    }

    // ═══════════════════════════════════════
    // ACTION: STATUS — Check moderation progress
    // ═══════════════════════════════════════
    if (action === 'status') {
      if (!publisher_id) return apiError(res, 400, 'Missing publisher_id');

      const [pendR, liveR, rejR] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.Pending Review&select=id`, { headers: h() }),
        fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=in.(Live,Approved)&select=id`, { headers: h() }),
        fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.Rejected&select=id`, { headers: h() })
      ]);

      const [pend, live, rej] = await Promise.all([pendR.json(), liveR.json(), rejR.json()]);

      return res.status(200).json({
        success: true,
        pending: Array.isArray(pend) ? pend.length : 0,
        approved: Array.isArray(live) ? live.length : 0,
        rejected: Array.isArray(rej) ? rej.length : 0
      });
    }

    return apiError(res, 400, 'Invalid action. Use: start, process, complete, status');

  } catch(e) {
    console.error('Moderate error:', e);
    return apiError(res, 500, 'Server error');
  }
}
