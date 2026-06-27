// Orders API — with full email notifications
import {
  sendBuyerOrderPlaced, sendBuyerOrderAccepted, sendBuyerOrderDelivered,
  sendBuyerOrderCancelled, sendBuyerOrderRejected, sendBuyerFirstOrderCongrats,
  sendBuyerOrderInvoice,
  sendPublisherNewOrder, sendPublisherOrderAccepted, sendPublisherOrderComplete,
  sendPublisherOrderCancelled, sendPublisherSiteRejected
} from './email.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

function hdrs() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
}

async function getUser(id) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${id}&select=*`, { headers: hdrs() });
  const d = await r.json();
  return Array.isArray(d) ? d[0] : null;
}

async function getUserByEmail(email) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`, { headers: hdrs() });
  const d = await r.json();
  return Array.isArray(d) ? d[0] : null;
}

function fmt(date) {
  return new Date(date || Date.now()).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
}

function invNum() {
  return 'INV-' + Date.now().toString().slice(-8);
}

const _rlOrders = new Map();
function rlOrders(k,max,ms){ const n=Date.now(),r=_rlOrders.get(k)||{c:0,t:n+ms}; if(n>r.t){r.c=0;r.t=n+ms;} r.c++; _rlOrders.set(k,r); return r.c>max; }

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', 'https://uplyncio.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (rlOrders(`ord:${ip}`, 30, 60000)) return res.status(429).json({ error: 'Too many requests.' });

  try {

    // ── GET ORDERS ──
    if (req.method === 'GET') {
      const { buyer_id, publisher_id, status } = req.query;
      let url = `${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`;
      if (buyer_id) url += `&buyer_id=eq.${buyer_id}`;
      if (publisher_id) url += `&publisher_id=eq.${publisher_id}`;
      if (status) url += `&status=eq.${encodeURIComponent(status)}`;
      const r = await fetch(url, { headers: hdrs() });
      const data = await r.json();
      return res.status(200).json({ success: true, orders: data });
    }

    // ── CREATE ORDER ──
    if (req.method === 'POST') {
      const body = req.body;
      const orderId = '#OR' + Math.floor(10000 + Math.random() * 90000);
      const order = { ...body, order_id: orderId, status: 'Pending', created_at: new Date().toISOString() };

      const r = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: { ...hdrs(), 'Prefer': 'return=representation' },
        body: JSON.stringify(order)
      });
      const data = await r.json();
      const savedOrder = Array.isArray(data) ? data[0] : data;

      // Send emails async
      try {
        const buyer = body.buyer_id ? await getUser(body.buyer_id) : null;
        const publisher = body.publisher_id ? await getUser(body.publisher_id) : null;

        const deadline = fmt(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        const now = fmt(new Date());

        if (buyer) {
          // Check if first order
          const prevOrders = await fetch(
            `${SUPABASE_URL}/rest/v1/orders?buyer_id=eq.${body.buyer_id}&select=id`,
            { headers: hdrs() }
          ).then(r => r.json());

          if (prevOrders?.length <= 1) {
            sendBuyerFirstOrderCongrats({
              to: buyer.email, name: buyer.name,
              orderId, siteUrl: body.site_url
            }).catch(() => {});
          }

          // Order placed email
          sendBuyerOrderPlaced({
            to: buyer.email, name: buyer.name,
            orderId, siteUrl: body.site_url,
            siteDA: body.da || 'N/A', siteDR: body.dr || 'N/A',
            price: body.price, anchorText: body.anchor_text || 'N/A',
            targetUrl: body.target_url || 'N/A', deadline
          }).catch(() => {});

          // Order invoice
          sendBuyerOrderInvoice({
            to: buyer.email, name: buyer.name,
            invoiceNum: invNum(), date: now,
            orderId, siteUrl: body.site_url,
            siteDA: body.da || 'N/A', siteDR: body.dr || 'N/A',
            serviceType: body.service_type || 'Guest Post',
            anchorText: body.anchor_text || 'N/A',
            targetUrl: body.target_url || 'N/A',
            subtotal: body.price, platformFee: 0,
            total: body.price,
            walletBalanceAfter: body.wallet_balance_after || 'N/A'
          }).catch(() => {});
        }

        if (publisher) {
          sendPublisherNewOrder({
            to: publisher.email, name: publisher.name,
            orderId, siteUrl: body.site_url,
            buyerName: buyer?.name || 'A buyer',
            price: body.publisher_price || body.price,
            anchorText: body.anchor_text || 'N/A',
            targetUrl: body.target_url || 'N/A',
            deadline, content: body.content,
            requirements: body.requirements
          }).catch(() => {});
        }
      } catch(e) { console.log('Order email error:', e.message); }

      return res.status(200).json({ success: true, order: savedOrder });
    }

    // ── UPDATE ORDER STATUS ──
    if (req.method === 'PATCH') {
      const { id } = req.query;
      const updates = { ...req.body, updated_at: new Date().toISOString() };
      const newStatus = updates.status;

      const r = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
        method: 'PATCH',
        headers: { ...hdrs(), 'Prefer': 'return=representation' },
        body: JSON.stringify(updates)
      });
      const data = await r.json();
      const updatedOrder = Array.isArray(data) ? data[0] : data;

      // Send status emails async
      try {
        const o = updatedOrder || req.body;
        const buyer = o.buyer_id ? await getUser(o.buyer_id) : null;
        const publisher = o.publisher_id ? await getUser(o.publisher_id) : null;
        const now = fmt(new Date());

        // Publisher accepted order
        if (newStatus === 'In Progress' || newStatus === 'Accepted') {
          const deadline = fmt(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
          if (buyer) {
            sendBuyerOrderAccepted({
              to: buyer.email, name: buyer.name,
              orderId: o.order_id, siteUrl: o.site_url,
              publisherName: publisher?.name || 'Publisher',
              deadline
            }).catch(() => {});
          }
          if (publisher) {
            sendPublisherOrderAccepted({
              to: publisher.email, name: publisher.name,
              orderId: o.order_id, siteUrl: o.site_url,
              price: o.price,
              deadline
            }).catch(() => {});
          }
        }

        // Order delivered (publisher submitted live URL)
        if (newStatus === 'Delivered') {
          if (buyer) {
            sendBuyerOrderDelivered({
              to: buyer.email, name: buyer.name,
              orderId: o.order_id, siteUrl: o.site_url,
              liveUrl: o.live_url || 'N/A',
              anchorText: o.anchor_text || 'N/A',
              targetUrl: o.target_url || 'N/A',
              siteDA: o.da || 'N/A'
            }).catch(() => {});
          }
        }

        // Order completed (buyer confirmed)
        if (newStatus === 'Completed') {
          if (publisher) {
            sendPublisherOrderComplete({
              to: publisher.email, name: publisher.name,
              orderId: o.order_id, siteUrl: o.site_url,
              price: o.publisher_price || o.price,
              liveUrl: o.live_url || 'N/A',
              totalEarnings: 'N/A'
            }).catch(() => {});
          }
        }

        // Order cancelled
        if (newStatus === 'Cancelled') {
          if (buyer) {
            sendBuyerOrderCancelled({
              to: buyer.email, name: buyer.name,
              orderId: o.order_id, siteUrl: o.site_url,
              reason: updates.notes || 'Order cancelled',
              price: o.price,
              refundStatus: 'Full refund within 3-5 business days'
            }).catch(() => {});
          }
          if (publisher) {
            sendPublisherOrderCancelled({
              to: publisher.email, name: publisher.name,
              orderId: o.order_id, siteUrl: o.site_url,
              reason: updates.notes || 'Cancelled by buyer',
              price: o.publisher_price || o.price
            }).catch(() => {});
          }
        }

        // Order rejected by publisher
        if (newStatus === 'Rejected') {
          if (buyer) {
            sendBuyerOrderRejected({
              to: buyer.email, name: buyer.name,
              orderId: o.order_id, siteUrl: o.site_url,
              reason: updates.notes || 'Publisher unable to fulfill',
              price: o.price
            }).catch(() => {});
          }
        }

      } catch(e) { console.log('Status email error:', e.message); }

      return res.status(200).json({ success: true, order: updatedOrder });
    }

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
