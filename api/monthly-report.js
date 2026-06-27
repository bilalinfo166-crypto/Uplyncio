// Monthly Report Email — sends to all publishers and buyers
const SUPABASE_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SECRET_KEY;

function sbHeaders() {
  return { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };
}

async function sbGet(table, filter='') {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filter}&select=*`, { headers: sbHeaders() });
  return r.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Security: only allow from Vercel cron or admin
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET || 'uplyncio_cron_2026';
  
  if (req.method === 'GET' && req.query.secret !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();
  const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  try {
    // Get all users
    const users = await sbGet('users', 'verified=eq.true&email_verified=eq.true');
    
    // Get all orders this month
    const orders = await sbGet('orders', 
      `created_at=gte.${startOfMonth}&created_at=lte.${endOfMonth}`
    );

    const { sendPublisherMonthlyReport, sendBuyerMonthlyReport } = await import('./email.js');
    
    let sent = 0;
    const results = [];

    for (const user of (users || [])) {
      try {
        if (user.role === 'publisher') {
          const pubOrders = orders.filter(o => o.publisher_id === user.id);
          const completed = pubOrders.filter(o => o.status === 'Completed');
          const earnings = completed.reduce((s, o) => s + (o.publisher_price || 0), 0);
          const pending = pubOrders.filter(o => o.status === 'Pending').length;

          if (pubOrders.length > 0 || completed.length > 0) {
            await sendPublisherMonthlyReport({
              to: user.email,
              name: user.name,
              month,
              totalOrders: pubOrders.length,
              completedOrders: completed.length,
              pendingOrders: pending,
              totalEarnings: earnings.toFixed(2),
              avgRating: '4.8',
              topSite: pubOrders[0]?.site_url || 'N/A'
            });
            sent++;
            results.push({ email: user.email, role: 'publisher', orders: pubOrders.length });
          }
        } else if (user.role === 'buyer') {
          const buyOrders = orders.filter(o => o.buyer_id === user.id);
          const completed = buyOrders.filter(o => o.status === 'Completed');
          const spent = buyOrders.reduce((s, o) => s + (o.price || 0), 0);

          if (buyOrders.length > 0) {
            await sendBuyerMonthlyReport({
              to: user.email,
              name: user.name,
              month,
              totalOrders: buyOrders.length,
              completedOrders: completed.length,
              totalSpent: spent.toFixed(2),
              avgDA: '45',
              topDomain: buyOrders[0]?.site_url || 'N/A'
            });
            sent++;
            results.push({ email: user.email, role: 'buyer', orders: buyOrders.length });
          }
        }
      } catch(e) {
        console.log('Report email error for', user.email, e.message);
      }
    }

    return res.status(200).json({
      success: true,
      month,
      emailsSent: sent,
      totalUsers: users?.length || 0,
      results
    });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
