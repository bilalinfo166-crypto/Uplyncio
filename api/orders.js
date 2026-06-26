// Orders API
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { buyer_id, publisher_id, status } = req.query;
      let url = `${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`;
      if (buyer_id) url += `&buyer_id=eq.${buyer_id}`;
      if (publisher_id) url += `&publisher_id=eq.${publisher_id}`;
      if (status) url += `&status=eq.${encodeURIComponent(status)}`;
      const r = await fetch(url, { headers: headers() });
      const data = await r.json();
      return res.status(200).json({ success: true, orders: data });
    }

    if (req.method === 'POST') {
      const body = req.body;
      const orderId = '#' + Math.floor(100000 + Math.random() * 900000);
      const order = { ...body, order_id: orderId };
      const r = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: { ...headers(), 'Prefer': 'return=representation' },
        body: JSON.stringify(order)
      });
      const data = await r.json();
      return res.status(200).json({ success: true, order: Array.isArray(data) ? data[0] : data });
    }

    if (req.method === 'PATCH') {
      const { id } = req.query;
      const r = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...headers(), 'Prefer': 'return=representation' },
        body: JSON.stringify({ ...req.body, updated_at: new Date().toISOString() })
      });
      const data = await r.json();
      return res.status(200).json({ success: true, order: Array.isArray(data) ? data[0] : data });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
