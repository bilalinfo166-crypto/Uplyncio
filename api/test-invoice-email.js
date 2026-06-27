import { 
  sendBuyerOrderInvoice, 
  sendPayoutInvoice,
  sendBuyerOrderPlaced,
  sendPublisherNewOrder
} from './email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const to = req.query.to || 'info@uplyncio.com';
  const now = new Date().toLocaleDateString('en-US', { 
    year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' 
  });

  try {
    // 1. Buyer Order Invoice
    const r1 = await sendBuyerOrderInvoice({
      to,
      name: 'Ahmed Khan',
      invoiceNum: 'INV-20260001',
      date: now,
      orderId: '#OR72910',
      siteUrl: 'techbullion.com',
      siteDA: 72, siteDR: 68,
      serviceType: 'Guest Post with Dofollow Link',
      anchorText: 'best link building service',
      targetUrl: 'https://example.com/seo-services',
      subtotal: 120,
      platformFee: 0,
      total: 120,
      walletBalanceAfter: 380
    });

    // 2. Publisher Payout Invoice
    const r2 = await sendPayoutInvoice({
      to,
      name: 'Br Advertisers',
      payoutId: 'PAY-20260001',
      date: now,
      grossAmount: 120,
      platformFee: 0,
      netAmount: 120,
      method: 'PayPal',
      accountDisplay: 'p****@gmail.com',
      transactionId: 'TXN-' + Date.now().toString().slice(-8),
      walletBalance: 480
    });

    return res.status(200).json({
      buyerInvoice: r1,
      publisherPayout: r2,
      sentTo: to,
      time: now
    });

  } catch(e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
