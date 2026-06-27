// Uplyncio Client — All DB operations go through API routes (server-side)
// The anon key is intentionally public (read-only, RLS protected)
// NEVER put service_role key here

const SUPABASE_URL = 'https://ridafwpazwqjhimecyyl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WU1giuRq6nM-GbGhZZGJxg_dnWSwYS3';

const SB_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

// ── AUTH (all through server-side API) ──
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
    // Only store non-sensitive data client-side
    const safe = {
      id: user.id, email: user.email, name: user.name,
      role: user.role, verified: user.verified,
      email_verified: user.email_verified,
      publisher_verified: user.publisher_verified,
      account_status: user.account_status || 'active'
    };
    localStorage.setItem('uplyncio_user', JSON.stringify(safe));
    localStorage.setItem('uplyncio_loggedIn', '1');
    localStorage.setItem('uplyncio_currentUid', user.id);
  },

  logout() {
    ['uplyncio_user','uplyncio_loggedIn','uplyncio_currentUid',
     'uplyncio_data_','uplyncio_settings','uplyncio_last_email'].forEach(k => {
      if (k.endsWith('_')) {
        Object.keys(localStorage).filter(x => x.startsWith(k)).forEach(x => localStorage.removeItem(x));
      } else {
        localStorage.removeItem(k);
      }
    });
  },

  getUser() {
    try { return JSON.parse(localStorage.getItem('uplyncio_user') || 'null'); }
    catch { return null; }
  },

  isLoggedIn() {
    return localStorage.getItem('uplyncio_loggedIn') === '1' && !!this.getUser();
  }
};

// ── DB (read-only queries with anon key — RLS protects data) ──
const UplyncioDB = {
  // Sites are public — anyone can browse
  async getSites(filters = {}) {
    let url = `${SUPABASE_URL}/rest/v1/publisher_sites?select=*&status=eq.live&order=created_at.desc`;
    if (filters.publisher_id) url += `&publisher_id=eq.${encodeURIComponent(filters.publisher_id)}`;
    if (filters.limit) url += `&limit=${parseInt(filters.limit)||50}`;
    const r = await fetch(url, { headers: SB_HEADERS });
    return r.json();
  },

  // Write operations go through API (server validates identity)
  async addSite(site) {
    const r = await fetch('/api/sites', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(site)
    });
    return r.json();
  },

  async updateSite(id, updates) {
    const r = await fetch(`/api/sites?id=${encodeURIComponent(id)}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return r.json();
  },

  async deleteSite(id) {
    const r = await fetch(`/api/sites?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    return r.ok;
  },

  // Orders go through API for validation
  async getOrders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.buyer_id) params.set('buyer_id', filters.buyer_id);
    if (filters.publisher_id) params.set('publisher_id', filters.publisher_id);
    const r = await fetch(`/api/orders?${params}`, { headers: { 'Content-Type': 'application/json' } });
    return r.json();
  },

  async createOrder(order) {
    const r = await fetch('/api/orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return r.json();
  },

  // Notifications (read-only, anon key safe with RLS)
  async getNotifications(userId) {
    if (!userId) return [];
    const url = `${SUPABASE_URL}/rest/v1/notifications?user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=50`;
    const r = await fetch(url, { headers: SB_HEADERS });
    return r.json();
  },

  async markNotifRead(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/notifications?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ read: true })
    });
  }
};

window.UplyncioAuth = UplyncioAuth;
window.UplyncioDB = UplyncioDB;
