// Supabase client for server-side API functions
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ridafwpazwqjhimecyyl.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY;

export async function sb(table) {
  return {
    async select(cols = '*', filters = {}) {
      let url = `${SUPABASE_URL}/rest/v1/${table}?select=${cols}`;
      for (const [k, v] of Object.entries(filters)) {
        url += `&${k}=eq.${encodeURIComponent(v)}`;
      }
      const r = await fetch(url, { headers: headers() });
      return r.json();
    },
    async insert(data) {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { ...headers(), 'Prefer': 'return=representation' },
        body: JSON.stringify(data)
      });
      return r.json();
    },
    async update(data, filters = {}) {
      let url = `${SUPABASE_URL}/rest/v1/${table}?`;
      for (const [k, v] of Object.entries(filters)) {
        url += `${k}=eq.${encodeURIComponent(v)}&`;
      }
      const r = await fetch(url, {
        method: 'PATCH',
        headers: { ...headers(), 'Prefer': 'return=representation' },
        body: JSON.stringify(data)
      });
      return r.json();
    },
    async delete(filters = {}) {
      let url = `${SUPABASE_URL}/rest/v1/${table}?`;
      for (const [k, v] of Object.entries(filters)) {
        url += `${k}=eq.${encodeURIComponent(v)}&`;
      }
      const r = await fetch(url, { method: 'DELETE', headers: headers() });
      return r.status;
    }
  };
}

function headers() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };
}

export async function query(sql, params = []) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: { ...headers() },
    body: JSON.stringify({ query: sql, params })
  });
  return r.json();
}
