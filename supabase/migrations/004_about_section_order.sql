-- 关于我表新增模块排序字段
ALTER TABLE about ADD COLUMN IF NOT EXISTS section_order JSONB DEFAULT '["about","education","tech","practices","certificates","growth"]'::jsonb;

-- 更新现有记录（若有）
UPDATE about SET section_order = '["about","education","tech","practices","certificates","growth"]'::jsonb WHERE section_order IS NULL;
