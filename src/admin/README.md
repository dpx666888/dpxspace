# admin 目录

## 作用

存放个人内容管理系统（CMS）的后台管理相关代码。

## 文件说明

- `components/`：后台公共组件
  - `AdminLayout.tsx`：后台页面整体布局（侧边栏 + 顶部栏 + 主内容区）
  - `AdminSidebar.tsx`：左侧导航菜单
  - `AdminHeader.tsx`：顶部栏，显示当前登录用户
  - `ProtectedRoute.tsx`：登录路由保护，未登录重定向到登录页
- `pages/`：后台页面
  - `Login.tsx`：管理员登录页
  - `Dashboard.tsx`：后台首页概览
  - `AboutManage.tsx`：关于我管理
  - `ProjectsManage.tsx` / `ProjectEdit.tsx`：项目管理/编辑
  - `LabsManage.tsx` / `LabEdit.tsx`：实验室管理/编辑
  - `LogsManage.tsx` / `LogEdit.tsx`：成长日志管理/编辑
  - `ContactManage.tsx`：联系方式管理
- `hooks/`：后台专用 hooks
  - `useAuth.tsx`：认证上下文与状态管理

## 依赖关系

- 依赖 `src/services/` 中的认证与数据服务
- 依赖 `src/types/database.ts` 中的类型定义
- 被 `src/App.tsx` 中的 `/admin/*` 路由引用

## 注意事项

- 后台路径为 `/admin/*`，安全性由 Supabase Auth + RLS 保证，而非路径隐藏
- 所有后台管理页面必须包裹在 `ProtectedRoute` 内
- 未配置 Supabase 时，后台显示配置引导，无法进入管理功能
