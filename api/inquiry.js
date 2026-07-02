import { rateLimit, getIp, setCors, sanitize, sanitizeObj, checkBodySize, setApiHeaders, apiError } from './_security.js';
const _rl = new Map();
function rlCheck(k,max,ms){ const n=Date.now(),r=_rl.get(k)||{c:0,t:n+ms}; if(n>r.t){r.c=0;r.t=n+ms;} r.c++; _rl.set(k,r); return r.c>max; }

export default async function handler(req, res) {
  const _ip = getIp(req);
  if(rateLimit(`inq:${_ip}`, 5, 60000)) return apiError(res, 429, "Too many requests. Please slow down.");
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Access-Control-Allow-Origin','*');
      if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const ip = req.headers['x-forwarded-for']?.split(',')[0]||'unknown';
  if(rlCheck(`inq:${ip}`,5,3600000)) return res.status(429).json({error:'Too many requests.'});
  const { service, name, email, phone, website, budget, message, details, type } = req.body||{};
  if(!name||!email) return res.status(400).json({error:'Missing required fields'});
  const isContact = type==='contact';
  const LOGO = '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';
  const accent = isContact ? '#6366f1' : '#4f7cff';
  const accentLight = isContact ? '#f5f3ff' : '#eff6ff';
  const accentBorder = isContact ? '#ddd6fe' : '#bfdbfe';
  const dateStr = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  const subject = isContact ? '💬 New Contact Message from '+name : '🔔 New Inquiry: '+(service||'General')+' — '+name;
  const row = (label,val,color) => '<tr><td style="padding:10px 14px;font-family:Arial,sans-serif;font-size:12.5px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e8edf5;width:32%">'+label+'</td><td style="padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:'+(color||'#1a202c')+';border:1px solid #e8edf5">'+val+'</td></tr>';
  const rowLink = (label,val,href) => '<tr><td style="padding:10px 14px;font-family:Arial,sans-serif;font-size:12.5px;font-weight:600;color:#64748b;background:#f8faff;border:1px solid #e8edf5;width:32%">'+label+'</td><td style="padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;border:1px solid #e8edf5"><a href="'+href+'" style="color:'+accent+';text-decoration:none;font-weight:600">'+val+'</a></td></tr>';
  const detailRows = details ? Object.entries(details).map(([k,v])=>row(k,v)).join('') : '';

  const parts = [
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f0f2f5">',
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f2f5;padding:20px 0"><tr><td align="center" style="padding:0 16px">',
    '<table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08)">',
    // HEADER
    '<tr><td style="background:linear-gradient(135deg,#0f1628 0%,#1a2d5a 100%);padding:20px 24px;border-bottom:3px solid '+accent+'">',
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td><table cellpadding="0" cellspacing="0" border="0"><tr>',
    '<td style="padding-right:10px"><img src="data:image/png;base64,'+LOGO+'" width="36" height="36" style="display:block;border-radius:9px;border:0"/></td>',
    '<td><div style="font-size:19px;font-weight:900;color:#fff;font-family:Arial,sans-serif">Uply<span style="color:#4f7cff">ncio</span></div><div style="font-size:10px;color:#8892a4;font-family:Arial,sans-serif;margin-top:2px">Guest Posting Marketplace</div></td>',
    '</tr></table></td>',
    '<td align="right"><div style="font-size:10px;font-weight:700;color:#8892a4;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;font-family:Arial,sans-serif">'+(isContact?'Contact Message':'New Inquiry')+'</div><div style="font-size:11px;color:rgba(255,255,255,.4);font-family:Arial,sans-serif">'+dateStr+'</div></td>',
    '</tr></table></td></tr>',
    // SERVICE BADGE
    (service && !isContact) ? '<tr><td style="padding:18px 24px 0"><div style="background:'+accentLight+';border:1px solid '+accentBorder+';border-left:3px solid '+accent+';border-radius:0 8px 8px 0;padding:12px 16px"><div style="font-size:10px;font-weight:700;color:'+accent+';text-transform:uppercase;letter-spacing:1px;font-family:Arial,sans-serif;margin-bottom:3px">Service Requested</div><div style="font-size:17px;font-weight:800;color:#1a202c;font-family:Arial,sans-serif">'+service+'</div></div></td></tr>' : '',
    // BODY
    '<tr><td style="padding:18px 24px">',
    '<p style="font-family:Arial,sans-serif;font-size:10.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin:0 0 10px">Client Details</p>',
    '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">',
    row('Name', name),
    rowLink('Email', email, 'mailto:'+email),
    phone ? row('Phone', phone) : '',
    website ? rowLink('Website', website, website) : '',
    budget ? row('Budget', budget, '#00c27a') : '',
    detailRows,
    '</table>',
    message ? '<p style="font-family:Arial,sans-serif;font-size:10.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin:0 0 10px">Message</p><div style="background:#f8faff;border:1px solid #e8edf5;border-left:3px solid '+accent+';border-radius:0 8px 8px 0;padding:14px 16px;font-family:Arial,sans-serif;font-size:14px;color:#374151;line-height:1.8;margin-bottom:16px">'+message+'</div>' : '',
    '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:9px;padding:12px 16px;font-family:Arial,sans-serif;font-size:13px;color:#15803d"><strong>&#10003; Reply directly</strong> to this email to respond to <strong>'+name+'</strong></div>',
    '</td></tr>',
    // FOOTER
    '<tr><td style="background:linear-gradient(135deg,#0f1628 0%,#1a2d5a 100%);padding:16px 24px;border-radius:0 0 12px 12px"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td><p style="font-family:Arial,sans-serif;font-size:14px;font-weight:900;color:#fff;margin:0 0 2px">Uply<span style="color:#4f7cff">ncio</span></p><p style="font-family:Arial,sans-serif;font-size:10px;color:#8892a4;margin:0">Guest posting &amp; link building marketplace.</p></td><td align="right"><p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(255,255,255,.25);margin:0"><a href="mailto:info@uplyncio.com" style="color:rgba(255,255,255,.25);text-decoration:none">info@uplyncio.com</a> | &copy; 2026 Uplyncio</p></td></tr></table></td></tr>',
    '</table></td></tr></table></body></html>'
  ].filter(Boolean).join('');

  try {
    const r = await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
      body: JSON.stringify({from:'Uplyncio Inquiries <info@uplyncio.com>',to:['info@uplyncio.com'],reply_to:email,subject,html:parts})
    });
    const data = await r.json();
    if(!r.ok) return res.status(500).json({error:data});
    return res.status(200).json({success:true});
  } catch(e) {
    return res.status(500).json({error:e.message});
  }
}