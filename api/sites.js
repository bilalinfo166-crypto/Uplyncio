// Publisher Sites API
const SUPABASE_URL = 'https://ridafwpazwqjhimecyyl.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

function headers() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // GET - fetch sites
    if (req.method === 'GET') {
      const { publisher_id, status, limit = 200 } = req.query;
      let url = `${SUPABASE_URL}/rest/v1/publisher_sites?select=*&limit=${limit}&order=created_at.desc`;
      if (publisher_id) url += `&publisher_id=eq.${publisher_id}`;
      if (status) url += `&status=eq.${encodeURIComponent(status)}`;

      const r = await fetch(url, { headers: headers() });
      const data = await r.json();
      return res.status(200).json({ success: true, sites: data });
    }

    // POST - add site
    if (req.method === 'POST') {
      const body = req.body;
      if (!body.url || !body.publisher_id) return res.status(400).json({ error: 'Missing url or publisher_id' });

      const domain = body.url.replace(/^https?:\/\//,'').replace(/\/.*/,'').toLowerCase();
      
      // Check duplicate
      const existing = await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?domain=eq.${domain}&publisher_id=eq.${body.publisher_id}&select=id`, { headers: headers() });
      const ex = await existing.json();
      if (ex?.length > 0) return res.status(409).json({ error: 'Site already added' });

      const site = { ...body, domain, status: 'Pending Review' };
      const r = await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites`, {
        method: 'POST',
        headers: { ...headers(), 'Prefer': 'return=representation' },
        body: JSON.stringify(site)
      });
      const data = await r.json();
      return res.status(200).json({ success: true, site: Array.isArray(data) ? data[0] : data });
    }

    // PATCH - update site
    if (req.method === 'PATCH') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing site id' });
      const r = await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...headers(), 'Prefer': 'return=representation' },
        body: JSON.stringify({ ...req.body, updated_at: new Date().toISOString() })
      });
      const data = await r.json();
      return res.status(200).json({ success: true, site: Array.isArray(data) ? data[0] : data });
    }

    // DELETE
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing site id' });
      await fetch(`${SUPABASE_URL}/rest/v1/publisher_sites?id=eq.${id}`, { method: 'DELETE', headers: headers() });
      return res.status(200).json({ success: true });
    }

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
