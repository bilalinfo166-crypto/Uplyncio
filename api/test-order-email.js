// ── Uplyncio Site Checker API ──
// Checks sites: DNS, HTTP, Google Safe Browsing, domain age, spam TLDs
// Processes up to 8 sites per call — called by publisher frontend in a queue

const SAFE_BROWSING_KEY = process.env.GOOGLE_SAFE_BROWSING_KEY;

const SPAM_TLDS = new Set(['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.click',
  '.download','.link','.work','.date','.faith','.racing','.win','.stream',
  '.party','.loan','.bid','.trade','.review','.accountant','.cricket']);

const PBN_RE = /\b(buy.?link|cheap.?link|seo.?link|pbn\d|linkfarm|link.?farm)\b/i;

function getDomain(url) {
  return (url||'').replace(/^https?:\/\//i,'').replace(/\/.*/,'').toLowerCase().trim();
}

async function checkDNS(domain) {
  try {
    const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
      { headers:{'Accept':'application/dns-json'} });
    const d = await r.json();
    return d.Status === 0 && Array.isArray(d.Answer) && d.Answer.length > 0;
  } catch(e) { return null; }
}

async function checkHTTP(domain) {
  for (const scheme of ['https','http']) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const r = await fetch(`${scheme}://${domain}`, { method:'HEAD', signal:ctrl.signal, redirect:'follow' });
      clearTimeout(t);
      return { ok: r.status < 500, status: r.status };
    } catch(e) { continue; }
  }
  return { ok: false, status: 0 };
}

async function checkSafeBrowsing(domain) {
  if (!SAFE_BROWSING_KEY) return null;
  try {
    const r = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_KEY}`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        client:{ clientId:'uplyncio', clientVersion:'1.0' },
        threatInfo:{
          threatTypes:['MALWARE','SOCIAL_ENGINEERING','UNWANTED_SOFTWARE'],
          platformTypes:['ANY_PLATFORM'], threatEntryTypes:['URL'],
          threatEntries:[{ url:`https://${domain}` }]
        }
      })
    });
    const d = await r.json();
    return Array.isArray(d.matches) && d.matches.length > 0;
  } catch(e) { return null; }
}

async function checkDomainAge(domain) {
  try {
    const r = await fetch(`https://rdap.org/domain/${domain}`,
      { headers:{'Accept':'application/rdap+json'} });
    if (!r.ok) return null;
    const d = await r.json();
    const reg = (d.events||[]).find(e => e.eventAction === 'registration');
    if (!reg) return null;
    return Math.round((Date.now() - new Date(reg.eventDate).getTime()) / (1000*60*60*24*30));
  } catch(e) { return null; }
}

async function checkSite(url) {
  const domain = getDomain(url);
  if (!domain || !domain.includes('.') || domain.length < 4)
    return { status:'rejected', reason:'Invalid domain format', domain };

  const tld = '.' + domain.split('.').pop();
  if (SPAM_TLDS.has(tld))
    return { status:'rejected', reason:`Spam TLD not accepted (${tld})`, domain };

  if (PBN_RE.test(domain))
    return { status:'rejected', reason:'Domain name suggests link farm or PBN', domain };

  const dns = await checkDNS(domain);
  if (dns === false)
    return { status:'rejected', reason:'Domain does not resolve — site may not exist', domain };

  const http = await checkHTTP(domain);
  if (!http.ok) {
    if (http.status === 0)
      return { status:'hold', reason:'Site unreachable — will recheck automatically', domain };
    if (http.status === 404 || http.status === 410)
      return { status:'rejected', reason:`Site returns ${http.status} — page not found`, domain };
    if (http.status >= 500)
      return { status:'hold', reason:`Server error (${http.status}) — will recheck automatically`, domain };
  }

  const threat = await checkSafeBrowsing(domain);
  if (threat === true)
    return { status:'rejected', reason:'Flagged by Google Safe Browsing (malware/phishing)', domain };

  const ageMo = await checkDomainAge(domain);
  if (ageMo !== null && ageMo < 3)
    return { status:'hold', reason:`Domain too new (${ageMo} month${ageMo===1?'':'s'} old) — minimum 3 months`, domain };

  return { status:'approved', domain, ageMonths: ageMo };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sites } = req.body || {};
  if (!Array.isArray(sites) || !sites.length)
    return res.status(400).json({ error: 'sites array required' });

  const batch = sites.slice(0, 8);
  const results = [];

  for (const s of batch) {
    const url = (typeof s === 'string' ? s : s.url || '').trim();
    try {
      results.push({ url, ...(await checkSite(url)) });
    } catch(e) {
      results.push({ url, status:'hold', reason:'Check timed out — will retry', domain: getDomain(url) });
    }
    await new Promise(r => setTimeout(r, 400));
  }

  return res.status(200).json({ success:true, results });
}
