-- 修复 RLS 策略：使用 auth.uid() IS NOT NULL 判断认证用户
-- 替换之前基于 auth.role() 的策略，避免 anon 用户绕过写入限制

-- 删除所有旧的写入策略
DROP POLICY IF EXISTS "Allow admin full access about" ON about;
DROP POLICY IF EXISTS "Allow admin full access projects" ON projects;
DROP POLICY IF EXISTS "Allow admin full access project_timeline" ON project_timeline;
DROP POLICY IF EXISTS "Allow admin full access labs" ON labs;
DROP POLICY IF EXISTS "Allow admin full access logs" ON logs;
DROP POLICY IF EXISTS "Allow admin full access contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admin read profiles" ON profiles;

-- 删除可能已存在的新策略（避免重复创建报错）
DROP POLICY IF EXISTS "Allow authenticated full access about" ON about;
DROP POLICY IF EXISTS "Allow authenticated full access projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated full access project_timeline" ON project_timeline;
DROP POLICY IF EXISTS "Allow authenticated full access labs" ON labs;
DROP POLICY IF EXISTS "Allow authenticated full access logs" ON logs;
DROP POLICY IF EXISTS "Allow authenticated full access contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated read profiles" ON profiles;

-- 认证用户可管理全部内容
CREATE POLICY "Allow authenticated full access about" ON about
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated full access projects" ON projects
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated full access project_timeline" ON project_timeline
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated full access labs" ON labs
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated full access logs" ON logs
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated full access contacts" ON contacts
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- profiles 保持只读给认证用户（如需修改可后续扩展）
CREATE POLICY "Allow authenticated read profiles" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);
