-- 为 gallery 和 coffee_logs 添加 storage_path 字段
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS storage_path TEXT DEFAULT '';
ALTER TABLE coffee_logs ADD COLUMN IF NOT EXISTS storage_path TEXT DEFAULT '';

-- Storage bucket 权限策略
-- 允许 authenticated 用户上传
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery');

-- 允许 authenticated 用户删除
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery');

-- 允许 public 读取
DROP POLICY IF EXISTS "Allow public read gallery" ON storage.objects;
CREATE POLICY "Allow public read gallery" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery');

-- 更新现有记录的 storage_path（从 image_url 提取）
UPDATE gallery SET storage_path = regexp_replace(image_url, '^.*/gallery/', '') WHERE image_url != '' AND storage_path = '';
UPDATE coffee_logs SET storage_path = regexp_replace(image_url, '^.*/gallery/', '') WHERE image_url != '' AND storage_path = '';
