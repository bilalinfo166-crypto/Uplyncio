import { rateLimit, getIp, setCors, sanitize, sanitizeObj, checkBodySize, setApiHeaders, apiError } from './_security.js';
// Publisher Sites API
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

function h() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

export default async function handler(req, res) {
  setCors(req, res);
      if (req.method === 'OPTIONS') return res.status(200).end();

  const _ip = getIp(req);
  // Skip rate limit for GET (reading sites) — only limit POST/PATCH/DELETE
  if(req.method !== 'GET' && rateLimit(`sites:${_ip}`, 60, 60000)) return apiError(res, 429, 'Too many requests. Please slow down.');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {

    // ── QUICK FIX: Restore admin's Pending sites to Live (one-time) ──
    if (req.query?.mod === 'fix') {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(200).json({ error: 'Missing env vars', hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_KEY });
      }
      try {
        const fixUrl = `${SUPABASE_URL}/rest/v1/publisher_sites?status=eq.${encodeURIComponent('Pending Review')}&publisher_id=eq.uplyncio_team_official`;
        const r = await fetch(fixUrl, { 
          method: 'PATCH', 
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          }, 
          body: JSON.stringify({ status: 'Live' }) 
        });
        const status = r.status;
        const body = await r.text();
        return res.status(200).json({ success: status >= 200 && status < 300, httpStatus: status, response: body.substring(0, 500), url: fixUrl.replace(SUPABASE_KEY, '***') });
      } catch(e) {
        return res.status(200).json({ error: e.message });
      }
    }

    // ── DEDUP: Remove duplicate domains per publisher ──
    if (req.query?.mod === 'dedup') {
      const pid = req.query.publisher_id;
      try {
        // Fetch sites sorted by created_at (oldest first) - 1000 at a time
        let allSites = [], offset = 0;
        for (let page = 0; page < 25; page++) { // Max 25 pages = 25,000 sites
          let url = `${SUPABASE_URL}/rest/v1/publisher_sites?select=id,domain,publisher_id&order=created_at.asc&limit=1000&offset=${page * 1000}`;
          if (pid) url += `&publisher_id=eq.${encodeURIComponent(pid)}`;
          const r = await fetch(url, { headers: h() });
          const data = await r.json();
          if (!Array.isArray(data) || !data.length) break;
          allSites = allSites.concat(data);
          if (data.length < 1000) break;
        }

        // Find duplicates in memory - keep first occurrence (oldest)
        const seen = {};
        const dupeIds = [];
        allSites.forEach(s => {
          const key = (s.domain || '').toLowerCase().trim() + '|' + (s.publisher_id || '');
          if (seen[key]) { dupeIds.push(s.id); }
          else { seen[key] = true; }
        });

        // Delete in batches of 30
        let deleted = 0;
        for (let i = 0; i < dupeIds.length; i += 30) {
          const batch = dupeIds.slice(i, i + 30);
          await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?id=in.(${batch.map(id => `"${id}"`).join(',')})`, { method: 'DELETE', headers: h() });
          deleted += batch.length;
        }

        return res.status(200).json({ success: true, totalScanned: allSites.length, duplicatesRemoved: deleted, remaining: allSites.length - deleted });
      } catch(e) { return res.status(200).json({ error: e.message }); }
    }

    if (req.method === 'GET') {
      const { publisher_id, limit = 1000, offset = 0, search } = req.query;
      let url = `${SUPABASE_URL}/rest/v1/publisher_sites?select=*&order=da.desc&limit=${limit}&offset=${offset}`;
      if (publisher_id) {
        url += `&publisher_id=eq.${encodeURIComponent(publisher_id)}`;
      } else {
        url += `&status=in.(Live,live,Approved,approved,Active,active)`;
      }
      // Server-side search by domain
      if (search) {
        url += `&domain=ilike.*${encodeURIComponent(search.toLowerCase())}*`;
      }
      const r = await fetch(url, { headers: h() });
      const data = await r.json();
      if (!Array.isArray(data)) {
        return res.status(200).json({ success: true, sites: [] });
      }
      return res.status(200).json({ success: true, sites: data });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      
      // ── BATCH UPSERT ──
      if (b.sites && Array.isArray(b.sites)) {
        const results = [];
        let inserted = 0, updated = 0, skipped = 0;
        for (const site of b.sites.slice(0, 2000)) {
          const domain = (site.url||site.domain||'').replace(/^https?:\/\//i,'').replace(/\/.*/,'').toLowerCase().trim();
          if (!domain || !site.publisher_id) { skipped++; continue; }
          const safe = {
            publisher_id: site.publisher_id,
            url: site.url||domain, domain: domain,
            da: parseInt(site.da)||0, dr: parseInt(site.dr)||0,
            traffic: parseInt(site.traffic)||0,
            price: parseFloat(site.price)||0,
            category: site.category||'General',
            link_type: site.link_type||'Dofollow',
            updated_at: new Date().toISOString()
          };
          const optional = ['publisher_name','publisher_email','write_publish_price',
            'link_insertion_price','li_accepted','language','country','tat',
            'requirements','role','site_id_local','max_links'];
          for (const col of optional) {
            if (site[col] !== undefined && site[col] !== null) safe[col] = site[col];
          }
          try {
            const chk = await fetch(
              `${SUPABASE_URL}/rest/v1/publisher_sites?domain=eq.${encodeURIComponent(domain)}&publisher_id=eq.${encodeURIComponent(site.publisher_id)}&select=id,status&limit=1`,
              { headers: h() }
            );
            const existing = await chk.json();
            if (Array.isArray(existing) && existing.length > 0) {
              // EXISTING site — keep current status (don't change Live to Pending)
              // Only update data fields, NOT status
              await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${existing[0].id}`, { method: 'PATCH', headers: h(), body: JSON.stringify(safe) });
              results.push({domain, action:'updated'});
              updated++;
            } else {
              // NEW site — admin goes Live instantly, others go Pending Review
              var isAdmin = site.publisher_id === 'uplyncio_team_official';
              safe.status = isAdmin ? 'Live' : 'Pending Review';
              safe.created_at = new Date().toISOString();
              await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites`, { method: 'POST', headers: h(), body: JSON.stringify(safe) });
              results.push({domain, action:'inserted'});
              inserted++;
            }
          } catch(e) { results.push({domain, action:'error', error:e.message}); skipped++; }
        }
        return res.status(200).json({ success: true, batch: true, count: results.length, inserted, updated, skipped, results });
        // Note: site add notifications handled client-side since publisher is logged in
      }

      // ── SINGLE UPSERT ──
    if(!checkBodySize(b)) return apiError(res, 413, "Request too large");
      if (!b.url || !b.publisher_id) return res.status(400).json({ error: 'Missing url or publisher_id' });
      const domain = b.url.replace(/^https?:\/\//i,'').replace(/\/.*/,'').toLowerCase().trim();

      const safe = {
        publisher_id: b.publisher_id,
        url: b.url, domain: domain,
        da: parseInt(b.da)||0, dr: parseInt(b.dr)||0,
        traffic: parseInt(b.traffic)||0,
        price: parseFloat(b.price)||0,
        category: b.category||'General',
        link_type: b.link_type||'Dofollow',
        status: b.status || ((b.publisher_id === 'uplyncio_team_official') ? 'Live' : 'Pending Review'),
        updated_at: new Date().toISOString()
      };

      const optional = ['publisher_name','publisher_email','write_publish_price',
        'link_insertion_price','li_accepted','language','country','tat',
        'requirements','role','site_id_local'];
      for (const col of optional) {
        if (b[col] !== undefined && b[col] !== null) safe[col] = b[col];
      }

      const chk = await fetch(
        `${SUPABASE_URL}/rest/v1/publisher_sites?domain=eq.${encodeURIComponent(domain)}&publisher_id=eq.${encodeURIComponent(b.publisher_id)}&select=id&limit=1`,
        { headers: h() }
      );
      const existing = await chk.json();

      if (Array.isArray(existing) && existing.length > 0) {
        const upd = await fetch(
          `${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${existing[0].id}`,
          { method: 'PATCH', headers: h(), body: JSON.stringify(safe) }
        );
        const d = await upd.json();
        return res.status(200).json({ success: upd.ok, action: 'updated', site: Array.isArray(d)?d[0]:d });
      } else {
        safe.created_at = new Date().toISOString();
        const ins = await fetch(
          `${SUPABASE_URL}/rest/v1/publisher_sites`,
          { method: 'POST', headers: h(), body: JSON.stringify(safe) }
        );
        const d = await ins.json();
        if (!ins.ok) console.error('Insert error:', JSON.stringify(d).substring(0,300));
        return res.status(200).json({ success: ins.ok, action: 'inserted', site: Array.isArray(d)?d[0]:d });
      }
    }

    if (req.method === 'DELETE') {
      const { domain, publisher_id, id } = req.query;
      let delUrl;
      if (domain && publisher_id) {
        delUrl = `${SUPABASE_URL}/rest/v1/publisher_sites?domain=eq.${encodeURIComponent(domain)}&publisher_id=eq.${encodeURIComponent(publisher_id)}`;
      } else if (id) {
        delUrl = `${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${id}`;
      } else {
        return res.status(400).json({ error: 'Missing params' });
      }
      await fetch(delUrl, { method: 'DELETE', headers: h() });
      return res.status(200).json({ success: true });
    }

    // ═══════════════════════════════════════
    // MODERATION SYSTEM (action-based via query param)
    // ═══════════════════════════════════════
    const modAction = req.query?.mod || (req.body?.action);
    if (modAction === 'start' || modAction === 'process' || modAction === 'complete' || modAction === 'status' || modAction === 'fix') {
      const publisher_id = req.query?.publisher_id || req.body?.publisher_id;
      if (!publisher_id) return res.status(400).json({ error: 'Missing publisher_id' });

      const RESEND_KEY = process.env.RESEND_API_KEY;
      async function sendModEmail(to, name, subject, bodyHtml) {
        if (!RESEND_KEY) return { ok: false };
        try {
          const r = await fetch('https://api.resend.com/emails', {
            method: 'POST', headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: 'Uplyncio <info@uplyncio.com>', to: [to], subject,
              html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0"><div style="background:linear-gradient(135deg,#0f1628,#1a2d5a);padding:20px 24px;text-align:center"><div style="font-size:18px;font-weight:800;color:#fff">Uplyncio</div><div style="font-size:12px;color:rgba(255,255,255,.5);margin-top:4px">Site Review System</div></div><div style="padding:24px 28px"><p style="font-size:14px;color:#333;margin:0 0 16px">Hi <strong>${name}</strong>,</p>${bodyHtml}</div><div style="background:#f8faff;border-top:1px solid #e2e8f0;padding:14px 24px;text-align:center;font-size:11px;color:#94a3b8">© 2026 Uplyncio</div></div>` })
          });
          return { ok: r.ok };
        } catch(e) { return { ok: false }; }
      }

      function isValidDomain(domain) {
        if (!domain || domain.length < 4 || !domain.includes('.')) return false;
        if (/[^a-z0-9.\-]/.test(domain)) return false;
        const blocked = ['example.com','test.com','localhost','abc.com','fake.com','spam.com'];
        return !blocked.includes(domain);
      }

      if (modAction === 'start') {
        const pubR = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(publisher_id)}&select=name,email&limit=1`, { headers: h() });
        const pubs = await pubR.json();
        const pub = pubs?.[0] || { name: 'Publisher', email: '' };
        const countR = await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.${encodeURIComponent('Pending Review')}&select=id`, { headers: h() });
        const pending = await countR.json();
        const total = Array.isArray(pending) ? pending.length : 0;
        if (total === 0) return res.status(200).json({ success: true, message: 'No pending sites', total: 0 });
        const estMinutes = Math.max(1, Math.ceil(total / 80));
        await sendModEmail(pub.email, pub.name, `🔍 Site review started — ${total} sites`, `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px;margin-bottom:16px"><p style="font-size:13px;color:#1e40af;margin:0">📋 Our team has started reviewing your <strong>${total} submitted sites</strong>.</p></div><p style="font-size:13px;color:#64748b">Estimated time: ~${estMinutes} minutes. You'll receive a summary when complete.</p>`);
        return res.status(200).json({ success: true, total, estMinutes });
      }

      if (modAction === 'process') {
        const pendR = await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.${encodeURIComponent('Pending Review')}&select=id,domain,da,price&limit=75&order=created_at.asc`, { headers: h() });
        const pending = await pendR.json();
        if (!Array.isArray(pending) || !pending.length) return res.status(200).json({ success: true, done: true, processed: 0, remaining: 0 });
        const isAdmin = publisher_id === 'uplyncio_team_official';
        const approveIds = [], rejectIds = [], reasons = [];
        for (const site of pending) {
          const domain = (site.domain || '').toLowerCase().trim();
          if (isAdmin) { approveIds.push(site.id); }
          else if (!isValidDomain(domain)) { rejectIds.push(site.id); reasons.push({ domain, reason: 'Invalid domain' }); }
          else if ((parseInt(site.da) || 0) < 5) { rejectIds.push(site.id); reasons.push({ domain, reason: `DA too low (${site.da||0})` }); }
          else if (!site.price || parseFloat(site.price) <= 0) { rejectIds.push(site.id); reasons.push({ domain, reason: 'No price set' }); }
          else { approveIds.push(site.id); }
        }
        if (approveIds.length) await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?id=in.(${approveIds.map(id=>`"${id}"`).join(',')})`, { method: 'PATCH', headers: h(), body: JSON.stringify({ status: 'Live', reviewed_at: new Date().toISOString() }) });
        if (rejectIds.length) await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?id=in.(${rejectIds.map(id=>`"${id}"`).join(',')})`, { method: 'PATCH', headers: h(), body: JSON.stringify({ status: 'Rejected', reviewed_at: new Date().toISOString() }) });
        const remR = await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.${encodeURIComponent('Pending Review')}&select=id`, { headers: h() });
        const rem = await remR.json();
        return res.status(200).json({ success: true, done: !Array.isArray(rem) || !rem.length, processed: pending.length, approved: approveIds.length, rejected: rejectIds.length, remaining: Array.isArray(rem) ? rem.length : 0, reasons: reasons.slice(0, 10) });
      }

      if (modAction === 'complete') {
        const { totalApproved = 0, totalRejected = 0, totalDuplicate = 0, reasons = [] } = req.body || {};
        const pubR = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(publisher_id)}&select=name,email&limit=1`, { headers: h() });
        const pubs = await pubR.json();
        const pub = pubs?.[0] || { name: 'Publisher', email: '' };
        const reasonsHtml = reasons.length ? `<div style="margin-top:12px"><strong>Rejection details:</strong><br>${reasons.slice(0,20).map(r => `• ${r.domain}: ${r.reason}`).join('<br>')}</div>` : '';
        await sendModEmail(pub.email, pub.name, `✅ Review complete — ${totalApproved} approved, ${totalRejected} rejected`,
          `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px;margin-bottom:16px"><p style="font-size:14px;color:#15803d;margin:0;font-weight:700">✅ Review complete!</p></div><p style="font-size:13px;color:#333"><strong style="color:#16a34a">${totalApproved} approved</strong> · <strong style="color:#dc2626">${totalRejected} rejected</strong> · <strong style="color:#d97706">${totalDuplicate} duplicates</strong></p><p style="font-size:13px;color:#64748b">Approved sites are now live in the marketplace.</p>${reasonsHtml}<div style="margin-top:16px;text-align:center"><a href="https://uplyncio.com/publisher" style="display:inline-block;background:#4f7cff;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700">Go to Dashboard →</a></div>`);
        return res.status(200).json({ success: true, message: 'Summary email sent' });
      }

      if (modAction === 'fix') {
        // Bulk approve all Pending Review sites to Live
        const upd = await fetch(
          `${SUPABASE_URL}/rest/v1/publisher_sites?status=eq.Pending Review`,
          { method: 'PATCH', headers: h(), body: JSON.stringify({ status: 'Live', reviewed_at: new Date().toISOString() }) }
        );
        return res.status(200).json({ success: true, message: 'All pending sites set to Live' });
      }

      if (modAction === 'status') {
        const [pendR, liveR, rejR] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.${encodeURIComponent('Pending Review')}&select=id`, { headers: h() }),
          fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=in.(Live,Approved)&select=id`, { headers: h() }),
          fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?publisher_id=eq.${encodeURIComponent(publisher_id)}&status=eq.Rejected&select=id`, { headers: h() })
        ]);
        const [pend, live, rej] = await Promise.all([pendR.json(), liveR.json(), rejR.json()]);
        return res.status(200).json({ success: true, pending: Array.isArray(pend) ? pend.length : 0, approved: Array.isArray(live) ? live.length : 0, rejected: Array.isArray(rej) ? rej.length : 0 });
      }
    }

  } catch (e) {
    console.error('Sites API error:', e.message);
    return res.status(500).json({ error: e.message });
  }
