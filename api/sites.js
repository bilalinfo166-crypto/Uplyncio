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
  if(rateLimit(`sites:${_ip}`, 60, 60000)) return apiError(res, 429, 'Too many requests. Please slow down.');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {

    if (req.method === 'GET') {
      const { publisher_id, limit = 1000, offset = 0 } = req.query;
      let url = `${SUPABASE_URL}/rest/v1/publisher_sites?select=*&limit=${limit}&offset=${offset}&order=da.desc`;
      if (publisher_id) {
        url += `&publisher_id=eq.${encodeURIComponent(publisher_id)}`;
      } else {
        url += `&status=in.(Live,live,Approved,approved,Active,active)`;
      }
      const r = await fetch(url, { headers: h() });
      const data = await r.json();
      if (!Array.isArray(data)) {
        console.error('GET error:', JSON.stringify(data).substring(0,300));
        return res.status(200).json({ success: true, sites: [] });
      }
      return res.status(200).json({ success: true, sites: data });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      
      // ── BATCH UPSERT ──
      if (b.sites && Array.isArray(b.sites)) {
        const results = [];
        for (const site of b.sites.slice(0, 50)) { // Max 100 per batch
          const domain = (site.url||site.domain||'').replace(/^https?:\/\//i,'').replace(/\/.*/,'').toLowerCase().trim();
          if (!domain || !site.publisher_id) continue;
          const safe = {
            publisher_id: site.publisher_id,
            url: site.url||domain, domain: domain,
            da: parseInt(site.da)||0, dr: parseInt(site.dr)||0,
            traffic: parseInt(site.traffic)||0,
            price: parseFloat(site.price)||0,
            category: site.category||'General',
            link_type: site.link_type||'Dofollow',
            status: site.status||'Live',
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
              `${SUPABASE_URL}/rest/v1/publisher_sites?domain=eq.${encodeURIComponent(domain)}&publisher_id=eq.${encodeURIComponent(site.publisher_id)}&select=id&limit=1`,
              { headers: h() }
            );
            const existing = await chk.json();
            if (Array.isArray(existing) && existing.length > 0) {
              await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${existing[0].id}`, { method: 'PATCH', headers: h(), body: JSON.stringify(safe) });
              results.push({domain, action:'updated'});
            } else {
              safe.created_at = new Date().toISOString();
              await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites`, { method: 'POST', headers: h(), body: JSON.stringify(safe) });
              results.push({domain, action:'inserted'});
            }
          } catch(e) { results.push({domain, action:'error', error:e.message}); }
        }
        return res.status(200).json({ success: true, batch: true, count: results.length, results });
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
        status: b.status||'Pending Review',
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

  } catch (e) {
    console.error('Sites API error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
