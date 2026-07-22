# 个人内容管理系统架构设计

## 一、系统概述

阶段9目标：将当前基于静态数据文件的 React 个人网站，升级为支持后台管理、数据库存储、内容持续更新的个人数字资产管理系统。

升级后数据流：

```
用户 → React 前台 → Service 层 → Supabase Client → PostgreSQL 数据库
                                        ↑
管理员 → React 后台登录 → Supabase Auth → 验证通过后操作数据
```

---

## 二、模块组成

### 2.1 前台展示系统（保留并扩展）

负责面向访客的页面展示，保持现有视觉和交互：

- 首页 `/`
- 关于我 `/about`
- 项目展示 `/projects`、`/projects/:id`
- 实验室 `/lab`
- 成长日志 `/log`
- 联系方式 `/contact`
- 404 页面

升级点：数据来源从 `src/data/*.ts` 静态文件改为 Supabase 数据库，保留本地 fallback 数据用于离线或数据库不可用时降级展示。

### 2.2 后台管理系统（新增）

负责管理员内容管理：

- 登录页 `/admin/login`
- 后台首页 `/admin/dashboard`
- 关于我管理 `/admin/about`
- 项目管理 `/admin/projects`
- 实验室管理 `/admin/labs`
- 成长日志管理 `/admin/logs`
- 联系方式管理 `/admin/contact`

### 2.3 数据服务层（新增）

统一封装所有数据访问：

- `services/supabase.ts`：Supabase 客户端初始化
- `services/projects.service.ts`：项目相关 CRUD
- `services/logs.service.ts`：日志相关 CRUD
- `services/about.service.ts`：关于我相关 CRUD
- `services/labs.service.ts`：实验室相关 CRUD
- `services/contact.service.ts`：联系方式 CRUD

### 2.4 状态管理（新增）

使用 **React Query (TanStack Query)** 管理服务端状态：

- 数据缓存
- 自动刷新
- 请求状态（loading / error）
- 乐观更新

---

## 三、技术选型

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前台框架 | React | ^19.0.0 | 保持现有 |
| 构建工具 | Vite | ^6.0.0 | 保持现有 |
| 路由 | React Router v7 | ^7.0.0 | 保持现有 |
| 样式 | Tailwind CSS v4 | ^4.0.0 | 保持现有 |
| 动画 | Framer Motion | ^12.0.0 | 保持现有 |
| 图标 | Lucide React | ^0.470.0 | 保持现有 |
| 数据库/后端 | Supabase | latest | PostgreSQL + Auth + Storage |
| 服务端状态 | @tanstack/react-query | ^5.x | 新增 |
| 后台 UI 组件 | shadcn/ui | via CLI | 新增 |
| 表单处理 | React Hook Form | ^7.x | 新增（可选） |
| 表单校验 | Zod | ^3.x | 新增（可选） |

---

## 四、目录结构调整

```
E:\.com\dpxworld.com
├── docs/
│   ├── admin-design/              # 后台架构设计文档
│   │   ├── ADMIN_ARCHITECTURE.md
│   │   ├── DATABASE_SCHEMA.md
│   │   └── API_DESIGN.md
│   └── development-log/
│       ├── 001-009...md           # 已有
│       └── 010-阶段9架构设计.md
├── public/
│   ├── avatar.jpg
│   └── favicon.svg
├── src/
│   ├── components/                # 前台公共组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ui/                    # shadcn/ui 组件（新增）
│   ├── pages/                     # 前台页面
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Lab.tsx
│   │   ├── Log.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── admin/                     # 后台系统（新增）
│   │   ├── components/            # 后台公共组件
│   │   │   ├── AdminLayout.tsx    # 后台布局（侧边栏 + 顶部）
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── ProtectedRoute.tsx # 登录保护
│   │   ├── pages/                 # 后台页面
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AboutManage.tsx
│   │   │   ├── ProjectsManage.tsx
│   │   │   ├── ProjectEdit.tsx
│   │   │   ├── LabsManage.tsx
│   │   │   ├── LabEdit.tsx
│   │   │   ├── LogsManage.tsx
│   │   │   ├── LogEdit.tsx
│   │   │   └── ContactManage.tsx
│   │   └── hooks/                 # 后台专用 hooks
│   │       └── useAuth.ts
│   ├── services/                  # 数据服务层（新增）
│   │   ├── supabase.ts
│   │   ├── projects.service.ts
│   │   ├── logs.service.ts
│   │   ├── about.service.ts
│   │   ├── labs.service.ts
│   │   └── contact.service.ts
│   ├── hooks/                     # 前台/通用 hooks
│   │   ├── useScrollToTop.ts
│   │   └── useAuth.ts             # 新增：前台检测登录态
│   ├── data/                      # 静态数据（降级用）
│   │   ├── projects.ts
│   │   ├── logs.ts
│   │   ├── lab.ts
│   │   ├── profile.ts
│   │   └── aiCollabs.ts
│   ├── types/                     # TypeScript 类型
│   │   └── index.ts
│   ├── lib/                       # 新增：工具函数、shadcn 配置
│   │   └── utils.ts
│   ├── App.tsx                    # 扩展：包含 /admin/* 路由
│   ├── main.tsx                   # 扩展：注入 QueryClientProvider
│   └── index.css                  # 扩展：shadcn 变量
├── supabase/                      # 新增：SQL 迁移/种子脚本
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── .env.example                   # 新增：环境变量示例
├── .env.local                     # 新增：本地环境变量（不提交）
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## 五、权限方案

### 5.1 认证方式

采用 **Supabase Auth** 邮箱密码登录。

- 管理员账号：由用户在 Supabase Dashboard 手动创建
- 登录页：`/admin/login`
- 登录成功后：Supabase 返回 session，写入 cookie/localStorage
- 受保护路由：`/admin/*` 全部需要登录
- 退出：调用 `supabase.auth.signOut()`

### 5.2 数据权限（RLS）

启用 Supabase Row Level Security：

- 前台数据表：`SELECT` 对所有用户开放（匿名只读）
- 后台数据表：`INSERT/UPDATE/DELETE` 仅对认证用户开放
- 使用 `auth.uid()` 判断当前用户

### 5.3 路由保护

- `ProtectedRoute` 组件检测 session
- 未登录访问 `/admin/*` 重定向到 `/admin/login`
- 已登录访问 `/admin/login` 重定向到 `/admin/dashboard`

---

## 六、数据流设计

### 6.1 前台读取

```
页面组件
  ↓
React Query useQuery
  ↓
services/*.service.ts
  ↓
Supabase Client
  ↓
PostgreSQL
```

### 6.2 后台修改

```
管理员操作
  ↓
React Hook Form + Zod 校验
  ↓
services/*.service.ts
  ↓
Supabase Client
  ↓
PostgreSQL 更新
  ↓
React Query invalidateQueries 刷新缓存
  ↓
前台下次访问显示最新内容
```

---

## 七、降级策略

当 Supabase 未配置或不可用时，前台继续使用 `src/data/*.ts` 中的静态数据，确保网站始终可展示。

实现方式：

- `services/*.service.ts` 中如果 Supabase client 未初始化，返回本地 fallback 数据
- 后台系统在未配置 Supabase 时显示配置引导页，禁用管理功能

---

## 八、开发阶段划分

| 子阶段 | 目标 | 关键产出 |
|--------|------|----------|
| 9.0 | 架构设计 | ADMIN_ARCHITECTURE.md、DATABASE_SCHEMA.md、API_DESIGN.md |
| 9.1 | Supabase 接入 | `.env.local`、Supabase client、连接测试 |
| 9.2 | 数据迁移 | 数据库表创建、seed 数据导入、静态数据 fallback |
| 9.3 | 后台认证 | 登录页、ProtectedRoute、Auth hook |
| 9.4 | 后台管理界面 | Dashboard、各管理模块 CRUD 页面 |
| 9.5 | 前后台同步 | Service 层替换静态数据、React Query 接入、前台读取数据库 |
| 9.6 | 安全与部署优化 | RLS 策略、输入校验、错误处理、部署文档 |

---

## 九、依赖清单

需要安装的 npm 包：

```bash
# Supabase
npm install @supabase/supabase-js

# React Query
npm install @tanstack/react-query

# React Hook Form + Zod（后台表单）
npm install react-hook-form zod @hookform/resolvers

# shadcn/ui 组件（通过 CLI 添加）
# npx shadcn add button input textarea card table dialog form label badge select tabs sonner
```

---

## 十、需要用户提供的资源

1. **Supabase 项目**：在 https://supabase.com 创建项目
2. **Supabase URL**：Project Settings → API → Project URL
3. **Supabase Anon Key**：Project Settings → API → Project API keys → anon public
4. **管理员账号**：在 Supabase Auth 中手动创建管理员邮箱和密码
5. **环境变量**：将上述信息写入 `.env.local` 文件

---

## 十一、验收标准

阶段9.0 验收：

- [x] 完成 ADMIN_ARCHITECTURE.md
- [x] 完成 DATABASE_SCHEMA.md
- [x] 完成 API_DESIGN.md
- [ ] 目录结构调整完成
- [ ] 不影响现有前台功能
- [ ] 方案经用户确认

进入下一阶段条件：本方案经用户确认后执行。
