export default async function handler(req, res) {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SB_KEY || 'NOT_SET';
  const url = 'https://ridafwpazwqjhimecyyl.supabase.co';
  
  // Test connection
  let dbTest = 'not tested';
  try {
    const r = await fetch(`${url}/rest/v1/users?select=count&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const text = await r.text();
    dbTest = `status:${r.status} body:${text.substring(0,100)}`;
  } catch(e) {
    dbTest = 'error: ' + e.message;
  }

  return res.status(200).json({
    key_set: key !== 'NOT_SET',
    key_prefix: key.substring(0, 15) + '...',
    env_vars: {
      SUPABASE_SECRET_KEY: !!process.env.SUPABASE_SECRET_KEY,
      SB_KEY: !!process.env.SB_KEY,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    },
    db_test: dbTest
  });
}
