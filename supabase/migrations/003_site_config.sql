-- 首页配置表
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated full access site_config" ON site_config;
CREATE POLICY "Allow authenticated full access site_config" ON site_config
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read site_config" ON site_config;
CREATE POLICY "Allow public read site_config" ON site_config
  FOR SELECT USING (true);

-- 种子数据
INSERT INTO site_config (key, value) VALUES
('home', '{
  "greeting": "你好，我是",
  "name": "丁鹏翔",
  "bio": "一个学生开发者，利用 AI 和自己的代码，不断建造属于自己的数字世界。",
  "button_text": "查看项目",
  "skills": ["C++", "Vue", "uni-app", "Git", "React", "TypeScript", "Tailwind CSS"],
  "skills_title": "技术方向",
  "projects_title": "精选项目",
  "logs_title": "最新日志"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
