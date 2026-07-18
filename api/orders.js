import { setCors, checkBodySize, apiError, getIp, rateLimit } from './_security.js';
import {
  sendBuyerOrderPlaced, sendBuyerOrderAccepted, sendBuyerOrderDelivered,
  sendBuyerOrderCancelled, sendBuyerOrderRejected, sendBuyerOrderInvoice,
  sendPublisherNewOrder, sendPublisherOrderComplete, sendPublisherOrderCancelled
} from './email.js';

const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRET_KEY;

function h() {
  return { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
}
// Store in-app notification in Supabase
async function notify(userId, title, message, type='info') {
  if(!SB || !KEY || !userId) return;
  try {
    await fetch(`${SB}/rest/v1/notifications`, {
      method: 'POST', headers: h(),
      body: JSON.stringify({ user_id: userId, title, message, type, read: false, created_at: new Date().toISOString() })
    });
  } catch(e) { console.warn('Notification insert error:', e.message); }
}
async function sb(path, method='GET', body=null) {
  const r = await fetch(`${SB}/rest/v1/${path}`, { method, headers: h(), body: body ? JSON.stringify(body) : null });
  const d = await r.json().catch(()=>({}));
  return { ok: r.ok, data: d };
}
function fmt(d){ return new Date(d||Date.now()).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}); }
function ordId(){ return '#ORD-' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2,5).toUpperCase(); }
function invNum(){ return 'INV-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6); }

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const ip = getIp(req);
  if (rateLimit('ord:'+ip, 60, 60000)) return apiError(res, 429, 'Too many requests.');

  try {
    const { resource, action } = req.query;

    // CAMPAIGNS
    if (resource === 'campaigns') {
      if (req.method === 'GET') {
        const { buyer_id } = req.query;
        let url = 'campaigns?select=*&order=created_at.desc';
        if (buyer_id) url += '&buyer_id=eq.'+buyer_id;
        const { data } = await sb(url);
        return res.status(200).json({ success: true, campaigns: Array.isArray(data)?data:[] });
      }
      if (req.method === 'POST') {
        const b = req.body||{};
        const cid = b.campaign_id||('CMP'+Math.floor(10000+Math.random()*90000));
        const { data, ok } = await sb('campaigns','POST',{...b, campaign_id:cid, created_at:new Date().toISOString()});
        return res.status(200).json({ success:ok, campaign:Array.isArray(data)?data[0]:data });
      }
      if (req.method === 'PATCH') {
        const { campaign_id } = req.query;
        const { data,ok } = await sb('campaigns?campaign_id=eq.'+encodeURIComponent(campaign_id),'PATCH',{...req.body, updated_at:new Date().toISOString()});
        return res.status(200).json({ success:ok, campaign:Array.isArray(data)?data[0]:data });
      }
      if (req.method === 'DELETE') {
        const { campaign_id } = req.query;
        await sb('campaigns?campaign_id=eq.'+encodeURIComponent(campaign_id),'DELETE');
        return res.status(200).json({ success:true });
      }
    }

    // GET ORDERS
    if (req.method === 'GET' && !action && !resource) {
      const { buyer_id, publisher_id, order_id, status, limit=100 } = req.query;
      let url = 'orders?select=*&limit='+limit+'&order=created_at.desc';
      if (buyer_id) url += '&buyer_id=eq.'+buyer_id;
      if (publisher_id) url += '&publisher_id=eq.'+publisher_id;
      if (order_id) url += '&order_id=eq.'+order_id;
      if (status) url += '&status=eq.'+encodeURIComponent(status);
      const { data } = await sb(url);
      return res.status(200).json({ success:true, orders:Array.isArray(data)?data:[] });
    }

    // PLACE ORDER
    if (action === 'place') {
      const b = req.body||{};
      if (!b.buyer_id||!b.site_url||!b.target_url||!b.anchor_text||!b.price)
        return apiError(res,400,'Missing required fields');
      const deadline = new Date(Date.now()+(parseInt(b.tat||7))*86400000).toISOString();
      const order = {
        order_id:ordId(), buyer_id:b.buyer_id, buyer_email:b.buyer_email||'',
        buyer_name:b.buyer_name||'Buyer', publisher_id:b.publisher_id||'',
        publisher_email:b.publisher_email||'', publisher_name:b.publisher_name||'Publisher',
        site_url:b.site_url, site_da:parseInt(b.site_da)||0, site_dr:parseInt(b.site_dr)||0,
        target_url:b.target_url, anchor_text:b.anchor_text, service_type:b.service_type||'Guest Post',
        article_content:b.article_content||'', article_type:b.article_type||'buyer_provided',
        price:parseFloat(b.price)||0, publisher_price:parseFloat(b.publisher_price)||0,
        requirements:b.requirements||'', status:'Pending', campaign_id:b.campaign_id||null,
        deadline:deadline, invoice_number:invNum(), created_at:new Date().toISOString(), updated_at:new Date().toISOString()
      };
      const { data,ok } = await sb('orders','POST',order);
      if (!ok) return apiError(res,500,'Failed to create order');
      // Deduct buyer balance
      if (b.buyer_id) {
        const br = await sb('users?id=eq.'+b.buyer_id+'&select=balance,reserved');
        if (Array.isArray(br.data)&&br.data[0]) {
          const u=br.data[0];
          await sb('users?id=eq.'+b.buyer_id,'PATCH',{ balance:Math.max(0,parseFloat(u.balance||0)-order.price), reserved:parseFloat(u.reserved||0)+order.price });
        }
      }
      // Emails + In-app notifications
      sendBuyerOrderPlaced({ to:b.buyer_email, name:b.buyer_name, orderId:order.order_id, siteUrl:order.site_url, siteDA:order.site_da, siteDR:order.site_dr, price:order.price, anchorText:order.anchor_text, targetUrl:order.target_url, deadline:fmt(deadline) }).catch(()=>{});
      if (b.publisher_email) sendPublisherNewOrder({ to:b.publisher_email, name:b.publisher_name, orderId:order.order_id, siteUrl:order.site_url, buyerName:b.buyer_name, price:order.publisher_price, anchorText:order.anchor_text, targetUrl:order.target_url, deadline:fmt(deadline), requirements:order.requirements }).catch(()=>{});
      sendBuyerOrderInvoice({ to:b.buyer_email, name:b.buyer_name, invoiceNum:order.invoice_number, date:fmt(new Date()), orderId:order.order_id, siteUrl:order.site_url, siteDA:order.site_da, siteDR:order.site_dr, serviceType:order.service_type, anchorText:order.anchor_text, targetUrl:order.target_url, subtotal:order.price, platformFee:0, total:order.price }).catch(()=>{});
      // In-app notifications
      notify(b.buyer_id, 'Order Placed', 'Your order '+order.order_id+' for '+order.site_url+' has been placed ($'+order.price+')', 'order').catch(()=>{});
      if(order.publisher_id) notify(order.publisher_id, 'New Order', 'New order '+order.order_id+' on '+order.site_url+' from '+b.buyer_name, 'order').catch(()=>{});
      return res.status(200).json({ success:true, order:Array.isArray(data)?data[0]:data });
    }

    // ACCEPT
    if (action === 'accept') {
      const { order_id } = req.query;
      const { data } = await sb('orders?order_id=eq.'+order_id+'&select=*');
      const o = Array.isArray(data)?data[0]:null;
      if (!o) return apiError(res,404,'Order not found');
      await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:'Accepted', accepted_at:new Date().toISOString(), updated_at:new Date().toISOString() });
      sendBuyerOrderAccepted({ to:o.buyer_email, name:o.buyer_name, orderId:order_id, siteUrl:o.site_url, publisherName:o.publisher_name, deadline:fmt(o.deadline) }).catch(()=>{});
      notify(o.buyer_id, 'Order Accepted', o.publisher_name+' accepted your order '+order_id+' for '+o.site_url, 'success').catch(()=>{});
      return res.status(200).json({ success:true });
    }

    // REJECT
    if (action === 'reject') {
      const { order_id } = req.query;
      const b = req.body||{};
      const { data } = await sb('orders?order_id=eq.'+order_id+'&select=*');
      const o = Array.isArray(data)?data[0]:null;
      if (!o) return apiError(res,404,'Order not found');
      await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:'Rejected', rejection_reason:b.reason||'Publisher rejected', updated_at:new Date().toISOString() });
      // Refund
      if (o.buyer_id) {
        const br = await sb('users?id=eq.'+o.buyer_id+'&select=balance,reserved');
        if (Array.isArray(br.data)&&br.data[0]) {
          const u=br.data[0];
          await sb('users?id=eq.'+o.buyer_id,'PATCH',{ balance:parseFloat(u.balance||0)+o.price, reserved:Math.max(0,parseFloat(u.reserved||0)-o.price) });
        }
      }
      sendBuyerOrderRejected({ to:o.buyer_email, name:o.buyer_name, orderId:order_id, siteUrl:o.site_url, reason:b.reason||'Publisher rejected', price:o.price }).catch(()=>{});
      notify(o.buyer_id, "Order Rejected", "Your order "+order_id+" for "+o.site_url+" was rejected. $"+o.price+" refunded.", "warning").catch(()=>{});
      return res.status(200).json({ success:true });
    }

    // DELIVER
    if (action === 'deliver') {
      const { order_id } = req.query;
      const b = req.body||{};
      if (!b.live_url) return apiError(res,400,'live_url required');
      const { data } = await sb('orders?order_id=eq.'+order_id+'&select=*');
      const o = Array.isArray(data)?data[0]:null;
      if (!o) return apiError(res,404,'Order not found');
      await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:'Delivered', live_url:b.live_url, delivery_note:b.note||'', delivered_at:new Date().toISOString(), updated_at:new Date().toISOString() });
      sendBuyerOrderDelivered({ to:o.buyer_email, name:o.buyer_name, orderId:order_id, siteUrl:o.site_url, liveUrl:b.live_url, publisherName:o.publisher_name }).catch(()=>{});
      notify(o.buyer_id, "Order Delivered", o.publisher_name+" delivered order "+order_id+" for "+o.site_url+". Review and approve it.", "success").catch(()=>{});
      return res.status(200).json({ success:true });
    }

    // CONFIRM DELIVERY → release payment
    if (action === 'confirm') {
      const { order_id } = req.query;
      const b = req.body||{};
      const { data } = await sb('orders?order_id=eq.'+order_id+'&select=*');
      const o = Array.isArray(data)?data[0]:null;
      if (!o) return apiError(res,404,'Order not found');
      await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:'Completed', confirmed_at:new Date().toISOString(), link_guarantee_until:new Date(Date.now()+365*86400000).toISOString(), link_status:'Live', updated_at:new Date().toISOString() });
      // Pay publisher
      if (o.publisher_id) {
        const pr = await sb('users?id=eq.'+o.publisher_id+'&select=balance,total_earned,completed_orders');
        if (Array.isArray(pr.data)&&pr.data[0]) {
          const u=pr.data[0]; const earn=o.publisher_price||Math.round(o.price*0.75);
          await sb('users?id=eq.'+o.publisher_id,'PATCH',{ balance:parseFloat(u.balance||0)+earn, total_earned:parseFloat(u.total_earned||0)+earn, completed_orders:parseInt(u.completed_orders||0)+1, orders_completed:parseInt(u.orders_completed||0)+1 });
        }
      }
      // Clear buyer escrow
      if (o.buyer_id) {
        const br = await sb('users?id=eq.'+o.buyer_id+'&select=reserved');
        if (Array.isArray(br.data)&&br.data[0]) await sb('users?id=eq.'+o.buyer_id,'PATCH',{ reserved:Math.max(0,parseFloat(br.data[0].reserved||0)-o.price) });
      }
      sendPublisherOrderComplete({ to:o.publisher_email, name:o.publisher_name, orderId:order_id, siteUrl:o.site_url, price:o.publisher_price||o.price, liveUrl:o.live_url }).catch(()=>{});
      notify(o.publisher_id, "Payment Released", "Order "+order_id+" completed! $"+(o.publisher_price||o.price)+" added to your balance.", "success").catch(()=>{});
      // Save review
      if (b.rating) await sb('reviews','POST',{ order_id, buyer_id:o.buyer_id, publisher_id:o.publisher_id, site_url:o.site_url, rating:parseInt(b.rating)||5, review:b.review||'', created_at:new Date().toISOString() }).catch(()=>{});
      return res.status(200).json({ success:true });
    }

    // REVISION
    if (action === 'revision') {
      const { order_id } = req.query;
      const b = req.body||{};
      await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:'Revision Requested', revision_note:b.note||'', updated_at:new Date().toISOString() });
      return res.status(200).json({ success:true });
    }

    // DISPUTE
    if (action === 'dispute') {
      const { order_id } = req.query;
      const b = req.body||{};
      await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:'Disputed', dispute_reason:b.reason||'', dispute_opened_at:new Date().toISOString(), updated_at:new Date().toISOString() });
      return res.status(200).json({ success:true });
    }

    // CANCEL
    if (action === 'cancel') {
      const { order_id } = req.query;
      const b = req.body||{};
      const { data } = await sb('orders?order_id=eq.'+order_id+'&select=*');
      const o = Array.isArray(data)?data[0]:null;
      if (!o) return apiError(res,404,'Order not found');
      await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:'Cancelled', cancel_reason:b.reason||'', updated_at:new Date().toISOString() });
      if (o.buyer_id&&o.status!=='Completed') {
        const br = await sb('users?id=eq.'+o.buyer_id+'&select=balance,reserved');
        if (Array.isArray(br.data)&&br.data[0]) {
          const u=br.data[0];
          await sb('users?id=eq.'+o.buyer_id,'PATCH',{ balance:parseFloat(u.balance||0)+o.price, reserved:Math.max(0,parseFloat(u.reserved||0)-o.price) });
        }
      }
      sendBuyerOrderCancelled({ to:o.buyer_email, name:o.buyer_name, orderId:order_id, siteUrl:o.site_url, reason:b.reason, price:o.price }).catch(()=>{});
      notify(o.buyer_id, "Order Cancelled", "Order "+order_id+" for "+o.site_url+" has been cancelled. $"+o.price+" refunded.", "warning").catch(()=>{});
      return res.status(200).json({ success:true });
    }

    // REVIEWS
    if (resource === 'reviews') {
      if (req.method==='GET') {
        const { publisher_id, buyer_id, site_url } = req.query;
        let url = 'reviews?select=*&order=created_at.desc&limit=50';
        if (publisher_id) url += '&publisher_id=eq.'+publisher_id;
        if (buyer_id) url += '&buyer_id=eq.'+buyer_id;
        if (site_url) url += '&site_url=eq.'+encodeURIComponent(site_url);
        const { data } = await sb(url);
        const revs = Array.isArray(data)?data:[];
        const avg = revs.length?revs.reduce((s,r)=>s+(r.rating||5),0)/revs.length:5;
        return res.status(200).json({ success:true, reviews:revs, avgRating:Math.round(avg*10)/10, count:revs.length });
      }
      if (req.method==='POST') {
        const { data,ok } = await sb('reviews','POST',{...req.body, created_at:new Date().toISOString()});
        return res.status(200).json({ success:ok, review:Array.isArray(data)?data[0]:data });
      }
    }

    // WITHDRAWALS
    if (resource === 'withdraw') {
      if (req.method==='POST') {
        const b = req.body||{};
        if (!b.publisher_id||!b.amount||!b.method) return apiError(res,400,'publisher_id, amount, method required');
        const amount = parseFloat(b.amount);
        if (amount < 20) return apiError(res,400,'Minimum withdrawal is $20');
        const pr = await sb('users?id=eq.'+b.publisher_id+'&select=balance');
        if (!Array.isArray(pr.data)||!pr.data[0]) return apiError(res,404,'Publisher not found');
        const balance = parseFloat(pr.data[0].balance||0);
        if (balance < amount) return apiError(res,400,'Insufficient balance');
        const fee = parseFloat((amount*(b.method==='paypal'?0.075:0.095)).toFixed(2));
        const net = parseFloat((amount-fee).toFixed(2));
        const { data,ok } = await sb('withdrawals','POST',{ publisher_id:b.publisher_id, amount, fee, net_amount:net, method:b.method, account_details:b.account_details||'', status:'Pending', created_at:new Date().toISOString() });
        if (!ok) return apiError(res,500,'Failed to create withdrawal');
        await sb('users?id=eq.'+b.publisher_id,'PATCH',{ balance:parseFloat((balance-amount).toFixed(2)) });
        return res.status(200).json({ success:true, withdrawal:Array.isArray(data)?data[0]:data, net, fee });
      }
      if (req.method==='GET') {
        const { publisher_id } = req.query;
        const { data } = await sb('withdrawals?publisher_id=eq.'+publisher_id+'&order=created_at.desc&limit=20');
        return res.status(200).json({ success:true, withdrawals:Array.isArray(data)?data:[] });
      }
    }

    // LINK MONITORING
    if (resource === 'links') {
      if (req.method==='GET') {
        const { buyer_id } = req.query;
        const { data } = await sb('orders?buyer_id=eq.'+buyer_id+'&status=eq.Completed&select=order_id,site_url,live_url,target_url,anchor_text,confirmed_at,link_guarantee_until,link_status&order=confirmed_at.desc');
        return res.status(200).json({ success:true, links:Array.isArray(data)?data:[] });
      }
      if (req.method==='POST') {
        const { order_id, live_url } = req.body||{};
        if (!live_url) return apiError(res,400,'live_url required');
        try {
          const r = await fetch(live_url,{ method:'HEAD', signal:AbortSignal.timeout(8000), redirect:'follow' });
          const alive = r.ok||r.status<500;
          await sb('orders?order_id=eq.'+order_id,'PATCH',{ link_status:alive?'Live':'Down', link_last_checked:new Date().toISOString() });
          return res.status(200).json({ success:true, alive, status:r.status });
        } catch(e) {
          await sb('orders?order_id=eq.'+order_id,'PATCH',{ link_status:'Unknown', link_last_checked:new Date().toISOString() });
          return res.status(200).json({ success:true, alive:false });
        }
      }
    }

    // ADMIN
    if (resource === 'admin') {
      const k = req.headers['x-admin-key'];
      if (!k) return apiError(res,403,'Unauthorized');
      // Verify: either direct ADMIN_SECRET_KEY match, or validate session token
      const adminSecret = process.env.ADMIN_SECRET_KEY;
      const adminPwd = process.env.ADMIN_PASSWORD;
      let authorized = false;
      // Direct key match (for server-to-server)
      if (adminSecret && k === adminSecret) authorized = true;
      // Session token match: re-derive expected token from admin password
      if (!authorized && adminPwd) {
        const enc = new TextEncoder();
        const buf = enc.encode(adminPwd + '_admin_token_salt_2026');
        const hashBuf = await crypto.subtle.digest('SHA-256', buf);
        const expectedToken = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2,'0')).join('');
        if (k === expectedToken) authorized = true;
      }
      if (!authorized) return apiError(res,403,'Unauthorized');

      if (action === 'stats') {
        const [ords,usrs,sites,wds,revs] = await Promise.all([
          sb('orders?select=status,price'), sb('users?select=role'),
          sb('publisher_sites?select=status'), sb('withdrawals?select=status,net_amount'), sb('reviews?select=rating')
        ]);
        const os=Array.isArray(ords.data)?ords.data:[];
        const us=Array.isArray(usrs.data)?usrs.data:[];
        const ws=Array.isArray(wds.data)?wds.data:[];
        const rs=Array.isArray(revs.data)?revs.data:[];
        return res.status(200).json({ success:true, stats:{
          totalOrders:os.length, pendingOrders:os.filter(o=>o.status==='Pending').length,
          completedOrders:os.filter(o=>o.status==='Completed').length, disputedOrders:os.filter(o=>o.status==='Disputed').length,
          totalRevenue:parseFloat(os.filter(o=>o.status==='Completed').reduce((s,o)=>s+parseFloat(o.price||0),0).toFixed(2)),
          totalUsers:us.length, buyers:us.filter(u=>u.role==='buyer').length, publishers:us.filter(u=>u.role==='publisher').length,
          totalSites:Array.isArray(sites.data)?sites.data.length:0, liveSites:Array.isArray(sites.data)?sites.data.filter(s=>s.status==='Live').length:0,
          pendingWithdrawals:parseFloat(ws.filter(w=>w.status==='Pending').reduce((s,w)=>s+parseFloat(w.net_amount||0),0).toFixed(2)),
          avgRating:rs.length?Math.round(rs.reduce((s,r)=>s+(r.rating||5),0)/rs.length*10)/10:5
        }});
      }
      if (action==='resolve_dispute') {
        const { order_id } = req.query; const { winner,note } = req.body||{};
        const { data } = await sb('orders?order_id=eq.'+order_id+'&select=*');
        const o = Array.isArray(data)?data[0]:null;
        if (!o) return apiError(res,404,'Order not found');
        await sb('orders?order_id=eq.'+order_id,'PATCH',{ status:winner==='buyer'?'Refunded':'Completed', dispute_resolution:note||'', dispute_resolved_at:new Date().toISOString(), updated_at:new Date().toISOString() });
        if (winner==='buyer'&&o.buyer_id) {
          const br=await sb('users?id=eq.'+o.buyer_id+'&select=balance,reserved');
          if (Array.isArray(br.data)&&br.data[0]) { const u=br.data[0]; await sb('users?id=eq.'+o.buyer_id,'PATCH',{ balance:parseFloat(u.balance||0)+o.price, reserved:Math.max(0,parseFloat(u.reserved||0)-o.price) }); }
        }
        return res.status(200).json({ success:true });
      }
      if (action==='approve_withdrawal') {
        const { withdrawal_id } = req.query;
        await sb('withdrawals?id=eq.'+withdrawal_id,'PATCH',{ status:'Paid', paid_at:new Date().toISOString() });
        return res.status(200).json({ success:true });
      }
      if (action==='all_orders') {
        const { status,limit=50,offset=0 } = req.query;
        let url = 'orders?select=*&order=created_at.desc&limit='+limit+'&offset='+offset;
        if (status) url += '&status=eq.'+status;
        const { data } = await sb(url);
        return res.status(200).json({ success:true, orders:Array.isArray(data)?data:[] });
      }
      if (action==='all_users') {
        const { data } = await sb('users?select=*&order=created_at.desc&limit=200');
        return res.status(200).json({ success:true, users:Array.isArray(data)?data:[] });
      }
      if (action==='all_withdrawals') {
        const { data } = await sb('withdrawals?select=*&order=created_at.desc&limit=100');
        return res.status(200).json({ success:true, withdrawals:Array.isArray(data)?data:[] });
      }
    }

    return apiError(res, 404, 'Unknown action');
  } catch(e) {
    console.error('Orders API:', e.message);
    return apiError(res, 500, 'Server error');
  }
}
