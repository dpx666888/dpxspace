# Vercel + Supabase 部署指南

## 前置条件

- 已创建 Supabase 项目并执行迁移脚本
- 已创建 Vercel 账号（可用 GitHub 登录）
- 已将本项目代码推送到 GitHub 仓库

## 一、Supabase 配置

1. 在 Supabase Dashboard → SQL Editor 中执行：
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_fix_rls_policies.sql`
   - `supabase/seed.sql`
2. 进入 Authentication → Users，手动创建管理员账号。
3. 进入 Project Settings → API，记录：
   - Project URL
   - anon public API key

## 二、Vercel 部署

1. 在 Vercel Dashboard 点击 **Add New Project**
2. 选择 GitHub 仓库并导入
3. Framework Preset 选择 **Vite**
4. Build Command 保持默认：`npm run build`
5. Output Directory 保持默认：`dist`
6. 在 Environment Variables 中添加：
   - `VITE_SUPABASE_URL` = 你的 Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 anon public key
7. 点击 Deploy

## 三、自定义域名（可选）

1. 购买域名后，在 Vercel 项目 → Settings → Domains 中添加域名
2. 按 Vercel 提示在域名服务商处配置 DNS 记录
3. 等待 DNS 生效即可访问

## 四、部署后验证

1. 访问前台首页，确认项目/日志/实验室等数据正常显示
2. 访问 `/admin/login`，使用管理员账号登录
3. 登录后进入 `/admin/dashboard`，测试各管理模块的增删改查
4. 修改内容后返回前台，确认数据已同步更新

## 五、安全注意事项

- `.env.local` 已加入 `.gitignore`，不会提交到 Git
- Vercel 的环境变量是加密存储的，不会暴露在构建日志中
- 不要在任何前端代码中写入 `service_role` key
- 后台写入操作依赖 Supabase Auth 会话，匿名用户无法修改数据

## 六、常见问题

**Q：部署后刷新 `/admin/projects` 出现 404？**  
A：已配置 `vercel.json` 将所有路由重写到 `index.html`，React Router 会正常处理。

**Q：后台登录成功但无法保存数据？**  
A：检查是否执行了 `002_fix_rls_policies.sql`，并确认管理员账号在 Supabase Auth 中存在。

**Q：修改内容后前台没有立即更新？**  
A：React Query 默认缓存 5 分钟，后台保存后会自动失效缓存；如仍未更新可刷新页面。
