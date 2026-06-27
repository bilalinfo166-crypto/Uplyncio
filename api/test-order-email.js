import { sendPublisherNewOrder, sendBuyerOrderPlaced, sendBuyerOrderInvoice } from './email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const to = req.query.to || 'info@uplyncio.com';
    const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

    // 1. Publisher new order email
    const r1 = await sendPublisherNewOrder({
      to,
      name: 'Uplyncio Team',
      orderId: '#OR72910',
      siteUrl: 'techbullion.com',
      buyerName: 'Ahmed Khan',
      price: '120',
      anchorText: 'best link building service',
      targetUrl: 'https://example.com/seo',
      deadline: 'July 10, 2026',
      content: 'Please write a 700-word article about link building strategies.',
      requirements: 'No gambling or adult content. Dofollow link required.'
    });

    // 2. Buyer order placed email
    const r2 = await sendBuyerOrderPlaced({
      to,
      name: 'Ahmed Khan',
      orderId: '#OR72910',
      siteUrl: 'techbullion.com',
      siteDA: 72, siteDR: 68,
      price: '120',
      anchorText: 'best link building service',
      targetUrl: 'https://example.com/seo',
      deadline: 'July 10, 2026'
    });

    return res.status(200).json({
      publisherEmail: r1,
      buyerEmail: r2,
      sentTo: to,
      time: now
    });

  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
