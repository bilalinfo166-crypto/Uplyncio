import handler from './inquiry.js';

export default async function testHandler(req, res) {
  // Service inquiry test
  req.method = 'POST';
  req.body = {
    service: req.query.service || 'Local SEO',
    name: 'Ahmed Khan',
    email: req.query.to || 'info@uplyncio.com',
    phone: '+92 300 1234567',
    website: 'https://mysite.com',
    budget: '$500 - $1000/month',
    message: 'I need help ranking my local business in Lahore. We are a restaurant and want to appear in top 3 Google results.',
    details: {
      'Business Type': 'Restaurant',
      'Target City': 'Lahore, Pakistan'
    },
    type: req.query.type || 'inquiry'
  };
  return handler(req, res);
}
