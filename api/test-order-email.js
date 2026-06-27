import {
  sendWelcomeEmail,
  sendVerifyEmail,
  sendEmailVerifiedEmail,
  sendOtpEmail,
  sendForgotPasswordEmail,
  sendPasswordResetSuccessEmail,
  sendNewDeviceLoginEmail,
  sendPublisherNewOrder,
  sendBuyerOrderPlaced,
  sendBuyerOrderDelivered,
  sendPublisherSitesApproved,
  sendPublisherBadgeEarned,
  sendDisputeRaised,
  sendAccountSuspended,
  sendPolicyViolationWarning
} from './email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const to = req.query.to || 'info@uplyncio.com';
  const type = req.query.type || 'all';
  const now = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });
  const results = {};

  try {

    if (type === 'all' || type === 'welcome') {
      results.welcome = await sendWelcomeEmail({ to, name: 'Ahmed Khan', role: 'publisher' });
    }

    if (type === 'all' || type === 'otp') {
      results.verifyOtp = await sendVerifyEmail({ to, name: 'Ahmed Khan', code: '483921' });
    }

    if (type === 'all' || type === 'verified') {
      results.emailVerified = await sendEmailVerifiedEmail({ to, name: 'Ahmed Khan', role: 'publisher', email: to, verifiedAt: now });
    }

    if (type === 'all' || type === 'newdevice') {
      results.newDevice = await sendNewDeviceLoginEmail({ to, name: 'Ahmed Khan', device: 'Chrome on MacOS', location: 'Lahore, Pakistan', ipAddress: '103.47.12.88', loginTime: now });
    }

    if (type === 'all' || type === 'forgot') {
      results.forgotPassword = await sendForgotPasswordEmail({ to, name: 'Ahmed Khan', resetLink: 'https://uplyncio.com/reset?token=abc123', expiresIn: '5 minutes' });
    }

    if (type === 'all' || type === 'resetdone') {
      results.resetSuccess = await sendPasswordResetSuccessEmail({ to, name: 'Ahmed Khan', email: to, changedAt: now, ipAddress: '103.47.12.88' });
    }

    if (type === 'all' || type === 'neworder') {
      results.publisherOrder = await sendPublisherNewOrder({ to, name: 'Br Advertisers', orderId: '#OR72910', siteUrl: 'techbullion.com', buyerName: 'Ahmed Khan', price: '120', anchorText: 'best link building service', targetUrl: 'https://example.com/seo', deadline: 'July 10, 2026', requirements: 'No gambling content.' });
    }

    if (type === 'all' || type === 'orderplaced') {
      results.buyerOrder = await sendBuyerOrderPlaced({ to, name: 'Ahmed Khan', orderId: '#OR72910', siteUrl: 'techbullion.com', siteDA: 72, siteDR: 68, price: '120', anchorText: 'best link building', targetUrl: 'https://example.com', deadline: 'July 10, 2026' });
    }

    if (type === 'all' || type === 'delivered') {
      results.delivered = await sendBuyerOrderDelivered({ to, name: 'Ahmed Khan', orderId: '#OR72910', siteUrl: 'techbullion.com', liveUrl: 'https://techbullion.com/best-seo-tips', anchorText: 'best link building', targetUrl: 'https://example.com', siteDA: 72 });
    }

    if (type === 'all' || type === 'siteapproved') {
      results.siteApproved = await sendPublisherSitesApproved({ to, name: 'Br Advertisers', sites: [{ siteUrl: 'myblog.com', da: 45, dr: 40, price: 80 }, { siteUrl: 'techsite.com', da: 62, dr: 55, price: 150 }] });
    }

    if (type === 'all' || type === 'badge') {
      results.badge = await sendPublisherBadgeEarned({ to, name: 'Br Advertisers', completedOrders: 10, earnedAt: now, totalEarnings: '1200', nextMilestone: 'Complete 25 orders to earn the Gold Publisher badge' });
    }

    if (type === 'all' || type === 'dispute') {
      results.dispute = await sendDisputeRaised({ to, name: 'Ahmed Khan', role: 'buyer', disputeId: 'DIS-001', orderId: '#OR72910', siteUrl: 'techbullion.com', raisedBy: 'buyer', reason: 'Link was removed within 30 days of delivery', raisedAt: now });
    }

    if (type === 'all' || type === 'warning') {
      results.warning = await sendPolicyViolationWarning({ to, name: 'Ahmed Khan', role: 'publisher', violation: 'Submitting fake live URLs', warningNum: 1, details: 'Submitted a URL that does not contain the agreed backlink', consequenceNext: 'Account will be suspended on second violation.' });
    }

    return res.status(200).json({ success: true, sentTo: to, type, results });

  } catch(e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
