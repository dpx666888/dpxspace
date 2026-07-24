-- 视觉档案（图片资源中心）
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '生活记录',
  related_type TEXT DEFAULT '',
  related_id INT DEFAULT NULL,
  date TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated full access gallery" ON gallery;
CREATE POLICY "Allow authenticated full access gallery" ON gallery
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read gallery" ON gallery;
CREATE POLICY "Allow public read gallery" ON gallery
  FOR SELECT USING (true);
