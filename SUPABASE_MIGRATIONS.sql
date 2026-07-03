-- ═══════════════════════════════════════════════════════
-- Uplyncio Database Migrations — Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Orders table enhancements
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_id TEXT UNIQUE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS publisher_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS publisher_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS site_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS site_da INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS site_dr INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS target_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS anchor_text TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'Guest Post';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS article_content TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS article_type TEXT DEFAULT 'buyer_provided';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS publisher_price NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS requirements TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS campaign_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS live_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_note TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS revision_note TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispute_reason TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispute_opened_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispute_resolution TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispute_resolved_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS link_status TEXT DEFAULT 'Pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS link_last_checked TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS link_guarantee_until TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT,
  buyer_id TEXT,
  publisher_id TEXT,
  site_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_all" ON reviews FOR ALL USING (true);
CREATE INDEX IF NOT EXISTS idx_reviews_publisher ON reviews(publisher_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON reviews(order_id);

-- Withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  publisher_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  fee NUMERIC DEFAULT 0,
  net_amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  account_details TEXT,
  status TEXT DEFAULT 'Pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "withdrawals_all" ON withdrawals FOR ALL USING (true);
CREATE INDEX IF NOT EXISTS idx_withdrawals_publisher ON withdrawals(publisher_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);

-- Users table enhancements
ALTER TABLE users ADD COLUMN IF NOT EXISTS balance NUMERIC DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reserved NUMERIC DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_earned NUMERIC DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_orders INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS orders_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS buyer_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS badge TEXT;

-- Index for fast order lookups
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_publisher ON orders(publisher_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
