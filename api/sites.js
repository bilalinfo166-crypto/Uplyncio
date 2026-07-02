// Publisher Sites API
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

function headers() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

// Only send fields that definitely exist in base schema
function cleanPayload(body) {
  const allowed = [
    'publisher_id','publisher_name','publisher_email',
    'url','domain','da','dr','traffic',
    'category','link_type','price',
    'write_publish_price','link_insertion_price','li_accepted',
    'language','country','tat','requirements','role',
    'status','site_id_local','updated_at','created_at'
  ];
  const out = {};
  for (const k of allowed) {
    if (body[k] !== undefined && body[k] !== null) out[k] = body[k];
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ── GET ──
    if (req.method === 'GET') {
      const { publisher_id, status, limit = 500 } = req.query;
      // Buyer page fetches status=Live, publisher fetches by publisher_id
      // Accept: Live, Approved, live, approved
      let url = `${SUPABASE_URL}/rest/v1/publisher_sites?select=*&limit=${limit}`;
      if (publisher_id) {
        url += `&publisher_id=eq.${encodeURIComponent(publisher_id)}`;
      } else if (status) {
        // Case-insensitive match for live sites
        url += `&status=in.(Live,live,Approved,approved,Active,active)`;
      }
      url += `&order=created_at.desc`;

      const r = await fetch(url, { headers: headers() });
      const data = await r.json();
      if (!Array.isArray(data)) {
        console.log('Supabase sites error:', JSON.stringify(data));
        return res.status(200).json({ success: true, sites: [] });
      }

      // When fetching for buyer (no publisher_id), only return live sites
      const filtered = publisher_id ? data : data.filter(s => {
        const st = (s.status||'').toLowerCase();
        return st === 'live' || st === 'approved' || st === 'active';
      });

      return res.status(200).json({ success: true, sites: filtered });
    }

    // ── POST (upsert or insert) ──
    if (req.method === 'POST') {
      const body = req.body;
      if (!body.url || !body.publisher_id) {
        return res.status(400).json({ error: 'Missing url or publisher_id' });
      }
      const domain = (body.url||'').replace(/^https?:\/\//,'').replace(/\/.*/,'').toLowerCase();
      const payload = cleanPayload({ ...body, domain, updated_at: new Date().toISOString() });

      if (req.query.upsert === '1') {
        // Try to find existing by domain+publisher_id
        const chkUrl = `${SUPABASE_URL}/rest/v1/publisher_sites?domain=eq.${encodeURIComponent(domain)}&publisher_id=eq.${encodeURIComponent(body.publisher_id)}&select=id&limit=1`;
        const chkR = await fetch(chkUrl, { headers: headers() });
        const existing = await chkR.json();

        if (Array.isArray(existing) && existing.length > 0) {
          // Update
          const patchR = await fetch(
            `${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${existing[0].id}`,
            { method: 'PATCH', headers: headers(), body: JSON.stringify(payload) }
          );
          const data = await patchR.json();
          return res.status(200).json({ success: true, action: 'updated', site: Array.isArray(data)?data[0]:data });
        } else {
          // Insert
          const insR = await fetch(
            `${SUPABASE_URL}/rest/v1/publisher_sites`,
            { method: 'POST', headers: headers(), body: JSON.stringify({ ...payload, created_at: new Date().toISOString() }) }
          );
          const data = await insR.json();
          if (!insR.ok) console.log('Insert error:', JSON.stringify(data));
          return res.status(200).json({ success: insR.ok, action: 'inserted', site: Array.isArray(data)?data[0]:data });
        }
      }

      // Normal insert
      const insR = await fetch(
        `${SUPABASE_URL}/rest/v1/publisher_sites`,
        { method: 'POST', headers: headers(), body: JSON.stringify({ ...payload, status: 'Pending Review', created_at: new Date().toISOString() }) }
      );
      const data = await insR.json();
      return res.status(200).json({ success: insR.ok, site: Array.isArray(data)?data[0]:data });
    }

    // ── PATCH ──
    if (req.method === 'PATCH') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${id}`,
        { method: 'PATCH', headers: headers(), body: JSON.stringify({ ...req.body, updated_at: new Date().toISOString() }) }
      );
      const data = await r.json();
      return res.status(200).json({ success: true, site: Array.isArray(data)?data[0]:data });
    }

    // ── DELETE ──
    if (req.method === 'DELETE') {
      const { id, site_id_local, publisher_id, domain } = req.query;
      let delUrl;
      if (domain && publisher_id) {
        delUrl = `${SUPABASE_URL}/rest/v1/publisher_sites?domain=eq.${encodeURIComponent(domain)}&publisher_id=eq.${encodeURIComponent(publisher_id)}`;
      } else if (site_id_local && publisher_id) {
        delUrl = `${SUPABASE_URL}/rest/v1/publisher_sites?site_id_local=eq.${encodeURIComponent(site_id_local)}&publisher_id=eq.${encodeURIComponent(publisher_id)}`;
      } else if (id) {
        delUrl = `${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${id}`;
      } else {
        return res.status(400).json({ error: 'Missing id, domain, or site_id_local' });
      }
      await fetch(delUrl, { method: 'DELETE', headers: headers() });
      return res.status(200).json({ success: true });
    }

  } catch (e) {
    console.error('Sites API error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
