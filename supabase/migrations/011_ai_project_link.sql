-- AI协作记录增加项目关联
ALTER TABLE ai_collabs ADD COLUMN IF NOT EXISTS project_id INT DEFAULT NULL;
