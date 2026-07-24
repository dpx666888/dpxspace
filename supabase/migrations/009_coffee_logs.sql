-- 咖啡探索记录表
CREATE TABLE IF NOT EXISTS coffee_logs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  bean TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT '',
  process_method TEXT NOT NULL DEFAULT '',
  equipment TEXT NOT NULL DEFAULT '',
  parameters JSONB DEFAULT '{}'::jsonb,
  description TEXT NOT NULL DEFAULT '',
  flavor_notes TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  rating INT NOT NULL DEFAULT 3,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE coffee_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated full access coffee_logs" ON coffee_logs;
CREATE POLICY "Allow authenticated full access coffee_logs" ON coffee_logs
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read coffee_logs" ON coffee_logs;
CREATE POLICY "Allow public read coffee_logs" ON coffee_logs
  FOR SELECT USING (true);
