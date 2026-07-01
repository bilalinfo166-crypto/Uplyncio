// ── Uplyncio Site Checker API ──
// Scoring system: sites need 60%+ to approve, 90%+ bad signals to reject, else hold

const SAFE_BROWSING_KEY = process.env.GOOGLE_SAFE_BROWSING_KEY;

// Hard-reject TLDs (these alone = instant reject, no scoring)
const INSTANT_REJECT_TLDS = new Set(['.tk','.ml','.ga','.cf','.gq']);

// Soft-bad TLDs (contributes to score but doesn't alone reject)
const SOFT_BAD_TLDS = new Set(['.xyz','.top','.click','.download','.link','.work',
  '.date','.faith','.racing','.win','.stream','.party','.loan','.bid','.trade',
  '.review','.accountant','.cricket','.men','.pw','.rest','.press']);

const PBN_RE = /\b(buy.?link|cheap.?link|pbn\d|linkfarm|link.?farm)\b/i;

function getDomain(url) {
  return (url||'').replace(/^https?:\/\//i,'').replace(/\/.*/,'').toLowerCase().trim();
}

function getTLD(domain) {
  const parts = domain.split('.');
  return parts.length >= 2 ? '.' + parts[parts.length-1] : '';
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
    const r = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_KEY}`, {
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

  // ── Basic format check ──
  if (!domain || !domain.includes('.') || domain.length < 4) {
    return { status:'rejected', reason:'Invalid domain format', score:0, domain };
  }

  const tld = getTLD(domain);

  // ── Instant hard rejects (these alone = reject) ──
  if (INSTANT_REJECT_TLDS.has(tld)) {
    return { status:'rejected', reason:`TLD "${tld}" is not accepted on this platform`, score:0, domain };
  }
  if (PBN_RE.test(domain)) {
    return { status:'rejected', reason:'Domain name indicates a PBN or link farm', score:0, domain };
  }

  // ── Safe Browsing — hard reject if flagged ──
  const threat = await checkSafeBrowsing(domain);
  if (threat === true) {
    return { status:'rejected', reason:'Flagged by Google Safe Browsing (malware/phishing)', score:0, domain };
  }

  // ── Scoring system ──
  // Each check adds to badScore (0-100) or goodScore (0-100)
  // Decision: reject if badScore >= 90, approve if badScore < 60, else hold

  let badScore = 0;
  let goodScore = 0;
  const notes = [];

  // Soft bad TLD (-20 bad points)
  if (SOFT_BAD_TLDS.has(tld)) {
    badScore += 20;
    notes.push(`Uncommon TLD (${tld})`);
  } else {
    goodScore += 10;
  }

  // DNS check
  const dns = await checkDNS(domain);
  if (dns === false) {
    badScore += 50;
    notes.push('DNS not resolving');
  } else if (dns === true) {
    goodScore += 30;
  }
  // dns===null means inconclusive (no penalty, no bonus)

  // HTTP liveness
  const http = await checkHTTP(domain);
  if (!http.ok) {
    if (http.status === 404 || http.status === 410) {
      badScore += 40;
      notes.push(`Site returns ${http.status}`);
    } else if (http.status >= 500) {
      badScore += 20; // server error — could be temporary
      notes.push(`Server error ${http.status} (may be temporary)`);
    } else if (http.status === 0) {
      badScore += 25; // unreachable — could be temporary
      notes.push('Site unreachable (may be temporary)');
    }
  } else {
    goodScore += 40;
    // Bonus: if site redirected to same domain = legit
    if (http.status >= 200 && http.status < 400) goodScore += 10;
  }

  // Domain age
  const ageMo = await checkDomainAge(domain);
  if (ageMo !== null) {
    if (ageMo < 1) {
      badScore += 30;
      notes.push('Domain registered less than 1 month ago');
    } else if (ageMo < 3) {
      badScore += 15;
      notes.push(`Domain only ${ageMo} month(s) old`);
    } else if (ageMo >= 12) {
      goodScore += 20; // established domain
    } else if (ageMo >= 6) {
      goodScore += 10;
    }
  }

  // Numeric domain (e.g. 12345abc.com) — mild bad signal
  if (/^\d{4,}/.test(domain.split('.')[0])) {
    badScore += 15;
    notes.push('Domain starts with long number sequence');
  }

  // Clamp scores
  badScore = Math.min(100, badScore);
  goodScore = Math.min(100, goodScore);

  // ── Final decision ──
  if (badScore >= 90) {
    return {
      status: 'rejected',
      reason: notes.length ? notes[0] : 'Too many quality issues detected',
      notes, badScore, goodScore, domain
    };
  }

  if (badScore < 60) {
    return {
      status: 'approved',
      notes, badScore, goodScore, domain,
      ageMonths: ageMo
    };
  }

  // badScore 60-89 → hold
  return {
    status: 'hold',
    reason: notes.length
      ? `Quality signals mixed — ${notes[0]}`
      : 'Some quality checks were inconclusive',
    notes, badScore, goodScore, domain
  };
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
    const url = (typeof s === 'string' ? s : (s.url || '')).trim();
    try {
      results.push({ url, ...(await checkSite(url)) });
    } catch(e) {
      results.push({ url, status:'hold', reason:'Check timed out — will retry', domain: getDomain(url) });
    }
    await new Promise(r => setTimeout(r, 400));
  }

  return res.status(200).json({ success:true, results });
}
