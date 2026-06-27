// Publisher Sites API
import { sendPublisherSitesApproved, sendPublisherSiteRejected } from './email.js';
const SUPABASE_URL = process.env.SUPABASE_URL;
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
      const site = Array.isArray(data) ? data[0] : data;

      // Email on approve/reject
      try {
        const newStatus = (req.body.status||'').toLowerCase();
        if (site && (newStatus==='live'||newStatus==='approved'||newStatus==='rejected')) {
          const pRes = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${site.publisher_id}&select=*`, { headers: headers() });
          const pubs = await pRes.json();
          const pub = Array.isArray(pubs) ? pubs[0] : null;
          if (pub) {
            if (newStatus==='live'||newStatus==='approved') {
              const { sendPublisherSitesApproved } = await import('./email.js');
              sendPublisherSitesApproved({ to: pub.email, name: pub.name,
                sites:[{ siteUrl: site.url||site.domain, da: site.da, dr: site.dr, price: site.price }]
              }).catch(()=>{});
            } else {
              const { sendPublisherSiteRejected } = await import('./email.js');
              sendPublisherSiteRejected({ to: pub.email, name: pub.name,
                siteUrl: site.url||site.domain,
                reason: site.rejection_reason||req.body.rejection_reason||'Does not meet quality standards'
              }).catch(()=>{});
            }
          }
        }
      } catch(e) { console.log('Site email err:', e.message); }

      return res.status(200).json({ success: true, site });
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
