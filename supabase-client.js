// Uplyncio Supabase Client - Frontend
// This file handles all database operations from the browser

const SUPABASE_URL = 'https://ridafwpazwqjhimecyyl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WU1giuRq6nM-GbGhZZGJxg_dnWSwYS3';

const SB_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

// ── AUTH ──
const UplyncioAuth = {
  async signup(email, password, name, role) {
    const r = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', email, password, name, role })
    });
    return r.json();
  },

  async verify(email, code) {
    const r = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', email, code })
    });
    return r.json();
  },

  async login(email, password) {
    const r = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    return r.json();
  },

  saveSession(user) {
    localStorage.setItem('uplyncio_user', JSON.stringify({
      id: user.id, email: user.email, name: user.name, role: user.role,
      verified: user.verified, email_verified: user.email_verified,
      publisher_verified: user.publisher_verified
    }));
    localStorage.setItem('uplyncio_loggedIn', '1');
    localStorage.setItem('uplyncio_currentUid', user.id);
  },

  logout() {
    localStorage.removeItem('uplyncio_user');
    localStorage.removeItem('uplyncio_loggedIn');
    localStorage.removeItem('uplyncio_currentUid');
  },

  getUser() {
    try { return JSON.parse(localStorage.getItem('uplyncio_user') || 'null'); }
    catch { return null; }
  },

  isLoggedIn() {
    return localStorage.getItem('uplyncio_loggedIn') === '1' && !!this.getUser();
  }
};

// ── SITES ──
const UplyncioDB = {
  async getSites(filters = {}) {
    let url = `${SUPABASE_URL}/rest/v1/publisher_sites?select=*&order=created_at.desc`;
    if (filters.publisher_id) url += `&publisher_id=eq.${filters.publisher_id}`;
    if (filters.status) url += `&status=eq.${encodeURIComponent(filters.status)}`;
    if (filters.limit) url += `&limit=${filters.limit}`;
    const r = await fetch(url, { headers: SB_HEADERS });
    return r.json();
  },

  async addSite(site) {
    const r = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(site)
    });
    return r.json();
  },

  async updateSite(id, updates) {
    const r = await fetch(`/api/sites?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return r.json();
  },

  async deleteSite(id) {
    const r = await fetch(`/api/sites?id=${id}`, { method: 'DELETE' });
    return r.ok;
  },

  async getOrders(filters = {}) {
    let url = `${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`;
    if (filters.buyer_id) url += `&buyer_id=eq.${filters.buyer_id}`;
    if (filters.publisher_id) url += `&publisher_id=eq.${filters.publisher_id}`;
    const r = await fetch(url, { headers: SB_HEADERS });
    return r.json();
  },

  async createOrder(order) {
    const r = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return r.json();
  },

  async getNotifications(userId) {
    const url = `${SUPABASE_URL}/rest/v1/notifications?user_id=eq.${userId}&order=created_at.desc&limit=50`;
    const r = await fetch(url, { headers: SB_HEADERS });
    return r.json();
  },

  async markNotifRead(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/notifications?id=eq.${id}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ read: true })
    });
  }
};

// Make globally available
window.UplyncioAuth = UplyncioAuth;
window.UplyncioDB = UplyncioDB;
