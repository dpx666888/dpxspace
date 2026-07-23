-- 为项目、成长日志、实验室表增加排序字段
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE logs ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;

-- 按 id 初始赋值
UPDATE projects SET sort_order = id WHERE sort_order = 0;
UPDATE logs SET sort_order = id WHERE sort_order = 0;
UPDATE labs SET sort_order = id WHERE sort_order = 0;
