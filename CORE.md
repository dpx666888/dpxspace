# CORE.md

## 功能设计

### 页面结构

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | / | 首屏展示、个人定位、精选项目 |
| 关于我 | /about | 个人介绍、技术方向、成长路线、AI协作 |
| 项目 | /projects | 项目列表、项目档案详情 |
| 实验室 | /lab | 小工具、Demo、技术实验 |
| 成长日志 | /log | 学习记录、项目复盘、技术笔记 |
| 联系方式 | /contact | 联系信息、社交链接 |

### 核心功能模块

1. **导航系统**：顶部固定导航栏，支持页面跳转
2. **项目展示系统**：项目列表 + 项目档案详情页
3. **成长日志系统**：按时间倒序展示，支持分类标签
4. **实验室系统**：展示小工具和Demo
5. **响应式适配**：PC端和移动端正常显示

---

## 数据结构

### 个人信息 (Profile)

```typescript
interface Profile {
  name: string;           // 姓名
  title: string;          // 头衔/定位
  bio: string;            // 简介
  avatar: string;         // 头像
  email: string;          // 邮箱
  github: string;         // GitHub
  socials: Social[];      // 社交链接
  skills: Skill[];        // 技术栈
}
```

### 项目 (Project)

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  techStack: string[];
  links: { label: string; url: string }[];
  // 项目档案详情
  story: {
    why: string;          // 为什么开始
    design: string;       // 设计过程
    development: string;  // 开发过程
    problems: Problem[];  // 遇到的问题
    solutions: string;    // 解决方案
    result: string;       // 最终成果
    summary: string;      // 个人收获
  };
  timeline: TimelineEvent[];
  aiCollaboration?: string; // AI协作记录
}
```

### 成长日志 (Log)

```typescript
interface Log {
  id: string;
  date: string;
  title: string;
  category: '学习' | '项目复盘' | '技术笔记';
  content: string;
  tags: string[];
}
```

### 实验室项目 (LabItem)

```typescript
interface LabItem {
  id: string;
  title: string;
  description: string;
  type: '工具' | 'Demo' | '实验';
  thumbnail?: string;
  link?: string;
  techStack: string[];
}
```

---

## 业务逻辑

### 路由逻辑

- 使用 React Router 实现客户端路由
- 6个顶级路由对应6个页面
- 项目详情使用动态路由 `/projects/:id`

### 数据管理

- 个人资料、项目列表、日志数据以静态 JSON 形式存储
- 数据文件存放在 `src/data/` 目录下
- 便于后续迁移到 CMS 或后端 API

### 项目档案展示逻辑

- 项目列表页展示所有项目的卡片概览
- 点击进入项目详情页，展示完整的项目档案
- 档案按固定结构展示：为什么开始 → 设计过程 → 开发过程 → 遇到的问题 → 解决方案 → 最终成果 → 个人收获

---

## 技术方案

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 框架 | React 19 | UI库 |
| 构建工具 | Vite 6 | 快速开发和构建 |
| 路由 | React Router v7 | 客户端路由 |
| 样式 | Tailwind CSS v4 | 原子化CSS |
| 动画 | Framer Motion | 组件动画和页面过渡 |
| 图标 | Lucide React | 轻量级图标库 |
| 部署 | Vercel / GitHub Pages | 静态站点托管 |

### 目录结构

```
├── public/              # 静态资源
├── src/
│   ├── components/      # 公共组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NavLink.tsx
│   │   └── ProjectCard.tsx
│   ├── pages/           # 页面组件
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Lab.tsx
│   │   ├── Log.tsx
│   │   └── Contact.tsx
│   ├── data/            # 数据文件
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── logs.ts
│   │   └── lab.ts
│   ├── hooks/           # 自定义Hook
│   ├── types/           # TypeScript类型
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   └── development-log/ # 开发记录
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 模块关系

```
App (路由入口)
├── Header (全局导航)
├── Router Outlet
│   ├── Home (首页)
│   │   └── Hero + FeaturedProjects
│   ├── About (关于我)
│   │   └── Profile + Skills + Timeline
│   ├── Projects (项目列表)
│   │   └── ProjectCard[] → ProjectDetail
│   ├── Lab (实验室)
│   │   └── LabItem[]
│   ├── Log (成长日志)
│   │   └── LogItem[]
│   └── Contact (联系方式)
│       └── ContactForm + SocialLinks
└── Footer (全局页脚)
```

所有页面共享 Header 和 Footer，数据层统一在 `src/data/` 中管理。
