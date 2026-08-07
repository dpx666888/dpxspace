# dpxworld.com — 个人开发者电子名片

> 一个学生开发者的个人网站，集**数字名片**与**个人内容管理系统（CMS）**于一体。展示项目、学习历程、AI 协作记录、视觉档案与个人空间，所有内容均可通过后台管理系统在线维护。

在线访问：[www.dpxspace.com](https://www.dpxspace.com)

---

## ✨ 功能特性

### 前台展示

| 模块 | 路由 | 说明 |
|---|---|---|
| 首页 | `/` | 问候语、技术方向、精选项目、最新日志，个人空间模块预览 |
| 关于我 | `/about` | 个人简介、教育背景、技术栈、项目实践、证书、成长路线 |
| 项目 | `/projects` | 项目卡片列表，点击进入项目详情（含开发故事、技术栈、时间线） |
| 实验室 | `/lab` | 实验、工具、Demo 展示 |
| 日志 | `/log` | 学习历程与项目复盘日志 |
| 个人空间 | `/space` | 动态模块入口（可配置启用/停用与排序） |
| 咖啡角 | `/space/coffee` | 咖啡冲煮记录（豆种、产地、参数、风味、评分） |
| 视觉档案 | `/gallery` | 图片展示墙，支持分类 |
| 联系 | `/contact` | 邮箱、GitHub、社交链接 |

### 后台管理系统（`/admin`）

| 功能 | 说明 |
|---|---|
| 登录认证 | Supabase Auth，路由守卫保护 |
| 首页配置 | 问候语、姓名、技能、按钮文案等，JSON 存储 |
| 项目管理 | 完整 CRUD、草稿/发布状态、精选标记、**拖拽排序** |
| 项目详情编辑 | 开发故事七要素、AI 协作关联、时间线 |
| 实验室管理 | CRUD + 拖拽排序 |
| 成长日志管理 | CRUD + 拖拽排序 |
| 关于我配置 | 分区块编辑、**区块拖拽排序**、图标选择器 |
| 联系信息 | 邮箱、社交链接维护 |
| 协作记录 | AI 协作案例，关联项目，拖拽排序 |
| 视觉档案 | 图片上传（类型/大小校验）、分类、排序 |
| 个人空间 | 模块启用/停用、图标、路由、排序 |
| 咖啡角 | 咖啡日志 CRUD + 图片上传 + 评分 |

### 其他亮点

- **HTML5 原生拖拽排序**：项目/实验室/日志/协作记录/空间模块/关于区块均支持拖拽调整顺序，无需额外依赖
- **环境感知日志**：开发环境输出 `console` 日志，生产环境自动静默
- **优雅降级**：Supabase 未配置时自动回退本地静态数据，前端可独立演示
- **错误兜底**：图片上传前置类型与大小校验，编辑页加载守卫与"未找到"兜底

---

## 🛠️ 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | React 19 + TypeScript + Vite 6 |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite` 插件） |
| 路由 | React Router v7（嵌套路由 + 页面过渡动画） |
| 数据请求 | TanStack React Query v5（缓存、失效重取） |
| 表单校验 | React Hook Form + Zod |
| 动画 | Framer Motion |
| 图标 | Lucide React |
| 后端 | Supabase（PostgreSQL + Auth + Storage + RLS） |
| 部署 | Vercel（SPA 重写配置） |

---

## 📁 项目结构

```
├── public/                     # 静态资源（favicon、头像占位）
├── src/
│   ├── admin/                  # 后台管理系统
│   │   ├── components/         # 布局、侧边栏、路由守卫、图标选择器
│   │   ├── hooks/              # 认证、增删改 mutations
│   │   └── pages/              # 各模块管理页（列表 + 编辑页）
│   ├── components/             # 前台通用组件（Header、Footer、个人空间预览）
│   ├── data/                   # 本地静态兜底数据
│   ├── hooks/                  # React Query 数据获取 hooks
│   ├── pages/                  # 前台页面
│   ├── services/               # 数据访问层（Supabase 封装）
│   ├── types/                  # TypeScript 类型定义（含数据库表结构）
│   └── utils/                  # 工具（环境感知 logger）
├── supabase/
│   └── migrations/             # 数据库迁移脚本（011 个）
├── docs/
│   └── development-log/        # 38 篇开发记录
└── 阶段*.md                    # 各阶段建设指导方案
```

### 架构分层

```
页面（Page）→ Hooks（React Query）→ Services（Supabase 封装）→ 数据库
```

前台与后台复用同一套 Services/Hooks，通过 React Query 的 `queryKey` 区分数据作用域。

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

### 环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> 在 Supabase Dashboard → Project Settings → API 中获取。
> 未配置时网站以前端静态数据模式运行，后台管理不可用。

---

## 🗄️ 数据库（Supabase）

共 11 张核心表，位于 `supabase/migrations/`：

| 表名 | 用途 |
|---|---|
| `about` | 关于我数据（JSONB 分段） |
| `projects` | 项目（含开发故事 JSONB、状态、排序） |
| `project_timeline` | 项目时间线事件 |
| `labs` | 实验室条目 |
| `logs` | 成长日志 |
| `contacts` | 联系信息 |
| `site_config` | 站点配置（key-value，JSONB 存储首页配置） |
| `ai_collabs` | AI 协作记录（关联 `projects.project_id`） |
| `gallery` | 视觉档案图片 |
| `space_modules` | 个人空间模块 |
| `coffee_logs` | 咖啡冲煮日志 |

配套 RLS（行级安全）策略：前台公开读，后台通过认证访问写。图片存储于 Supabase Storage 的 `gallery` bucket。

### 迁移执行

在 Supabase SQL Editor 中按编号顺序执行 `supabase/migrations/` 下的脚本即可。

---

## 🌐 部署

项目默认部署于 **Vercel**，已配置 `vercel.json` 的 SPA 重写：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

部署步骤：

1. 推送代码到 GitHub 仓库
2. Vercel 中导入仓库，框架选 **Vite**
3. 配置环境变量 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`
4. 构建命令 `npm run build`，输出目录 `dist`
5. 部署完成后访问 `https://<project>.vercel.app`，后台入口 `/admin`

---

## 🔐 后台管理

- 访问路径：`https://<你的域名>/admin`
- 登录方式：Supabase Auth 邮箱密码
- 保护机制：`ProtectedRoute` 路由守卫，未登录自动跳转登录页

---

## 📚 开发记录

38 篇开发记录记录了从项目初始化、阶段 1 到阶段 10.7 的全部建设过程：

- `docs/development-log/001-项目初始化.md` ~ `038-阶段10.7-拖拽排序系统补丁修复.md`
- `docs/README.md` — 文档索引

---

## 📄 License

本项目为个人作品，源码归作者所有。欢迎参考与交流，请注明出处。
