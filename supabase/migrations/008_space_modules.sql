-- 个人空间模块配置
CREATE TABLE IF NOT EXISTS space_modules (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Coffee',
  route TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE space_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated full access space_modules" ON space_modules;
CREATE POLICY "Allow authenticated full access space_modules" ON space_modules
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read space_modules" ON space_modules;
CREATE POLICY "Allow public read space_modules" ON space_modules
  FOR SELECT USING (true);

-- 种子数据
INSERT INTO space_modules (title, description, icon, route, active, sort_order) VALUES
('Coffee Lab', '我的咖啡探索与制作记录', 'Coffee', '/space/coffee', true, 1),
('视觉档案', '开发过程中的视觉片段和灵感', 'Image', '/gallery', true, 2),
('阅读记录', '正在阅读和已读的书', 'BookOpen', '', false, 3),
('我的设备', '开发工具和硬件设备', 'Cpu', '', false, 4)
ON CONFLICT DO NOTHING;
