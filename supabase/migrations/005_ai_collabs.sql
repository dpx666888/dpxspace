-- 协作记录表
CREATE TABLE IF NOT EXISTS ai_collabs (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '',
  prompt TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  project TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE ai_collabs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated full access ai_collabs" ON ai_collabs;
CREATE POLICY "Allow authenticated full access ai_collabs" ON ai_collabs
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow public read ai_collabs" ON ai_collabs;
CREATE POLICY "Allow public read ai_collabs" ON ai_collabs
  FOR SELECT USING (true);

-- 种子数据（从静态数据迁移）
INSERT INTO ai_collabs (date, title, context, prompt, result, project, sort_order) VALUES
('2026-07-21', '【待补充：AI协作案例标题】', '【待补充：在什么场景下使用AI辅助？如学习C++时、搭建网站时】', '【待补充：你向AI提出的具体问题/Prompt是什么？】', '【待补充：AI给出了什么帮助？解决了什么问题？】', '个人电子名片网站', 1),
('【待补充】', '【待补充】', '【待补充】', '【待补充】', '【待补充】', '', 2);
