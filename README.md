# dpxworld.com — 个人开发者电子名片

> 一个学生开发者的个人网站，集**数字名片**与**个人内容管理系统（CMS）**于一体。展示项目、学习历程、AI 协作记录、视觉档案与个人空间，所有内容均可通过后台管理系统在线维护。

- 在线访问：[www.dpxspace.com](https://www.dpxspace.com)
- 源码仓库：[github.com/dpx666888/dpxspace](https://github.com/dpx666888/dpxspace)

---

## ✨ 功能特性

### 前台展示

| 模块 | 路由 | 说明 |
|---|---|---|
| 首页 | `/` | 问候语、终端卡片、技术方向、精选项目 Bento、最新日志、个人空间预览 |
| 关于我 | `/about` | 个人简介、教育背景、技术栈、项目实践、证书、成长路线 |
| 项目 | `/projects` | 封面卡片列表，点击进入详情（开发故事、技术栈、时间线、AI 协作） |
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

### 视觉与交互（阶段11）

- **首屏氛围层**：点阵网格 + 紫青径向光晕 + 低透明度噪点，渐变姓名逐字淡入
- **项目封面**：支持真实 `cover_image`；无图时按 slug 生成确定性渐变封面（序号 + 技术栈水印）
- **Bento 布局**：首页精选区随项目数量在 1 大 2 小 / 两列 / 单卡之间自适应
- **光标跟随光斑**：卡片 hover 出现跟随指针的高光与边框光斑，键盘聚焦时切换为清晰 focus ring
- **终端卡片**：逐行打字展示身份/技术栈/状态，支持 ±6° 指针倾斜与高光
- **技术栈跑马灯**：纯 CSS 无限滚动，hover 暂停
- **滚动叙事**：顶部滚动进度条 + Hero 文字/终端反向视差
- **骨架屏**：首页、项目、实验室、日志页加载时按真实布局占位，避免 CLS
- **降级策略**：`prefers-reduced-motion` 下动画停止；触摸设备关闭鼠标跟随类效果

### 工程与体验

- **路由级分包**：后台 15 个页面 `React.lazy()` 懒加载，访客不下载 admin 代码
- **HTML5 原生拖拽排序**：项目/实验室/日志/协作记录/空间模块/关于区块均支持，无需额外依赖
- **SEO**：每页独立 `<title>` / description、`robots.txt`、`sitemap.xml`、Open Graph、JSON-LD Person
- **环境感知日志**：开发环境输出 `console`，生产环境自动静默
- **优雅降级**：Supabase 未配置时回退本地静态数据，前端可独立演示
- **错误兜底**：上传前置类型/大小校验，编辑页加载守卫与“未找到”兜底

---

## 🛠️ 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | React 19 + TypeScript + Vite 6 |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite` 插件） |
| 路由 | React Router v7（嵌套路由 + 页面过渡动画） |
| 数据请求 | TanStack React Query v5（缓存、失效重取） |
| 表单校验 | React Hook Form + Zod |
| 动画 | Framer Motion（页面转场 / 入场动效）+ 原生 CSS 动画（跑马灯 / 光斑） |
| 图标 | Lucide React |
| 字体 | Space Grotesk（标题）、JetBrains Mono（终端/序号）、Inter + Noto Sans SC（正文） |
| 后端 | Supabase（PostgreSQL + Auth + Storage + RLS） |
| 部署 | Vercel（SPA 重写配置） |

---

## 🎨 设计系统

### 色彩

| Token | 值 | 用途 |
|---|---|---|
| `bg-primary` | `#0a0a0f` | 页面底色 |
| `bg-secondary` | `#111118` | 卡片 / 面板 |
| `border` | `#1f1f2e` | 边框 |
| `text-primary` | `#e2e2e8` | 主文字 |
| `text-secondary` | `#6b7280` | 次要文字 |
| `accent` | `#6366f1` | 主强调色 |
| `accent-light` | `#818cf8` | hover / 高光 |
| `accent-alt` | `#22d3ee` | 渐变第二色 / 状态 |

### 动效原则

- 只动画 `transform` / `opacity`，避免布局回流
- 指针跟随类效果仅在 `hover: hover and pointer: fine` 下启用
- 全部动效响应 `prefers-reduced-motion`
- 页面转场 0.3s；卡片 hover 上浮 4px；光斑按卡片尺寸分档（240 / 360 / 560px）

---

## 📁 项目结构

```
├── public/                     # favicon、头像、robots.txt、sitemap.xml
├── src/
│   ├── admin/                  # 后台（布局、认证、hooks、管理页）
│   ├── components/             # 通用组件
│   │   ├── Header / Footer / PageMeta
│   │   ├── ProjectCover / SpotlightCard
│   │   ├── TerminalCard / Marquee / ScrollProgress
│   │   ├── Skeleton / PersonalSpacePreview
│   │   └── README.md
│   ├── data/                   # 本地静态兜底数据
│   ├── hooks/                  # React Query hooks + useScrollProgress / useScrollToTop
│   ├── lib/                    # icons、featuredProjects、projectCover
│   ├── pages/                  # 前台页面（11 个路由）
│   ├── services/               # Supabase 数据访问层
│   ├── types/                  # TypeScript 类型（含数据库表结构）
│   ├── utils/                  # 环境感知 logger
│   ├── App.tsx                 # 路由、布局、页面转场
│   └── index.css               # Tailwind v4 主题与视觉工具类
├── supabase/migrations/        # 11 个数据库迁移脚本
├── docs/
│   ├── development-log/        # 56 篇开发记录（001–056）
│   ├── plans/                  # 各阶段方案、阶段11 执行标准
│   ├── archive/                # 归档素材与个人文件
│   ├── README.md               # 文档索引
│   └── 阶段11验收报告.md
├── vercel.json                 # SPA 重写
├── README.md
├── CORE.md / UI.md / RESOURCE.md / 开发规则.md
```

### 架构分层

```
页面（Page）→ Hooks（React Query）→ Services（Supabase 封装）→ 数据库
```

前台与后台复用同一套 Services / Hooks，通过 React Query 的 `queryKey` 区分数据作用域。

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装与启动

```bash
# 按 lockfile 安装依赖
npm ci

# 启动开发服务器
npm run dev

# 类型检查 + 生产构建
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

## 🌐 SEO 与可访问性

- 每页通过 `PageMeta` 设置独立 `<title>` 与 description
- `public/robots.txt` 开放前台、屏蔽 `/admin`
- `public/sitemap.xml` 覆盖 9 个静态路由
- `index.html` 包含 Open Graph、canonical、JSON-LD `Person` 结构化数据
- 键盘可完整操作，卡片 `:focus-visible` 显示清晰 focus ring
- 触摸设备与 reduced-motion 下自动降级指针跟随动效

---

## 📈 性能基线

| 指标 | 结果 |
|---|---|
| 主包体积 | 约 216 KB gzip（后台路由已分包） |
| CLS | Home / Projects 均 0.0001（Fast 3G + 4× CPU） |
| 长任务 | 3 秒滚动内无 >50ms long task |
| 首屏动效 | rAF 最大间隔约 6ms |
| 加载态 | 四页骨架屏，骨架与真实卡片尺寸误差 <5px |

---

## 🌐 部署

项目默认部署于 **Vercel**，已配置 `vercel.json` 的 SPA 重写：

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

部署步骤：

1. 推送代码到 GitHub 仓库 `dpx666888/dpxspace`
2. Vercel 中导入仓库，框架选 **Vite**
3. 配置环境变量 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`
4. 构建命令 `npm run build`，输出目录 `dist`
5. 部署完成后访问自定义域名，后台入口 `/admin`

---

## 🔐 后台管理

- 访问路径：`https://<你的域名>/admin`
- 登录方式：Supabase Auth 邮箱密码
- 保护机制：`ProtectedRoute` 路由守卫，未登录自动跳转登录页

---

## 📚 开发记录

56 篇开发记录覆盖从项目初始化到阶段 11 的全部建设过程：

- `docs/development-log/001` ~ `047` — 阶段 1 至阶段 10.7（基础建设、CMS、拖拽排序、内容结构）
- `docs/development-log/048` ~ `056` — 阶段 11（UI 动效优化、项目封面/Bento、光斑、终端、进度条/视差、骨架屏、首屏姓名渲染修复）
- `docs/plans/阶段11-UI动效优化执行标准.md` — 执行契约与验收口径
- `docs/阶段11验收报告.md` — 阶段 11 总体验收结果
- `docs/README.md` — 文档索引

---

## 🗺️ 后续计划

- 字体自托管，降低对 Google Fonts 外链的依赖
- 内容补全（首页定位、关于我、项目故事）
- Supabase 注册策略与 RLS 收紧
- 后台封面图片上传

---

## 📄 License

本项目为个人作品，源码归作者所有。欢迎参考与交流，请注明出处。
