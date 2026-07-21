# UI.md

## 页面结构

### 全局布局

- **Header**：固定在顶部，包含 Logo + 导航链接
- **Main**：页面主体内容区
- **Footer**：底部，包含版权信息和社交链接

### 各页面结构

#### 首页 / Home

1. **Hero 首屏**：全屏高度，左侧文字（姓名+定位+简介），右侧装饰元素
2. **精选项目**：3个精选项目卡片横向排列
3. **技术栈概览**：图标展示主要技术方向
4. **最新日志**：最近3条成长日志摘要

#### 关于我 / About

1. **个人简介**：头像 + 文字介绍
2. **技术方向**：技能标签云
3. **成长路线**：时间线展示学习和成长历程
4. **AI协作**：简述与AI协作开发的经历

#### 项目 / Projects

1. **项目列表**：网格布局的项目卡片
2. **项目详情页**：
   - 项目标题和概述
   - 技术栈标签
   - 为什么开始（故事）
   - 设计过程
   - 开发过程
   - 遇到的问题列表
   - 解决方案
   - 最终成果
   - 个人收获
   - 开发时间线

#### 实验室 / Lab

1. **实验室入口**：简短介绍
2. **作品展示**：小工具/Demo/实验卡片网格

#### 成长日志 / Log

1. **日志列表**：按时间倒序排列
2. **分类筛选**：学习 / 项目复盘 / 技术笔记
3. **日志详情**：标题 + 日期 + 标签 + 正文

#### 联系方式 / Contact

1. **联系信息**：邮箱 + 社交链接
2. **简介**：一句话说明欢迎交流

---

## 组件规划

### 公共组件

| 组件 | 用途 | 位置 |
|------|------|------|
| Header | 顶部导航 | components/Header.tsx |
| Footer | 底部信息 | components/Footer.tsx |
| NavLink | 导航链接（激活状态样式） | components/NavLink.tsx |
| ProjectCard | 项目卡片 | components/ProjectCard.tsx |
| LabCard | 实验室卡片 | components/LabCard.tsx |
| LogCard | 日志卡片 | components/LogCard.tsx |
| SkillTag | 技能标签 | components/SkillTag.tsx |
| Timeline | 时间线组件 | components/Timeline.tsx |
| SectionTitle | 区块标题 | components/SectionTitle.tsx |

### 页面组件

| 页面 | 组件 | 说明 |
|------|------|------|
| Home | Hero | 首屏大标题区 |
| Home | FeaturedProjects | 精选项目展示 |
| About | ProfileSection | 个人简介 |
| About | SkillsSection | 技能展示 |
| About | TimelineSection | 成长时间线 |
| Projects | ProjectList | 项目列表 |
| Projects | ProjectDetail | 项目详情 |
| Lab | LabGrid | 实验室网格 |
| Log | LogList | 日志列表 |
| Log | LogFilter | 分类筛选 |
| Contact | ContactInfo | 联系信息 |

---

## 交互设计

### 导航

- Header 固定在顶部，滚动时背景变为半透明毛玻璃效果
- 当前页面导航项高亮
- 移动端：汉堡菜单展开全屏导航

### 项目卡片

- Hover 时卡片轻微上浮 + 阴影加深
- 点击跳转项目详情

### 页面过渡

- 页面切换使用淡入淡出动画
- 时长 300ms，缓动 ease-in-out

### 滚动动画

- 元素进入视口时触发入场动画
- 使用 Framer Motion 的 `whileInView`
- 动画：从下方淡入上移，偏移 30px

---

## 动画设计

### 首屏动画

- 标题文字逐个字符淡入，间隔 50ms
- 副标题延迟 300ms 后淡入
- 装饰元素延迟 600ms 后淡入

### 页面过渡

```typescript
// 页面切换动画
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.3 }}
```

### 滚动入场动画

```typescript
// 通用滚动入场
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ duration: 0.5, ease: "easeOut" }}
```

### Hover 效果

- 卡片：translateY(-4px) + box-shadow 增强
- 按钮：背景色过渡，时长 200ms
- 链接：下划线展开动画

---

## 样式规范

### 色彩方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 主背景 | #0a0a0f | 极深蓝黑色 |
| 次背景 | #111118 | 卡片背景 |
| 主文字 | #e2e2e8 | 主标题和正文 |
| 次文字 | #6b7280 | 辅助说明文字 |
| 强调色 | #6366f1 | 靛蓝色，用于高亮和交互 |
| 强调色浅 | #818cf8 | Hover状态 |
| 边框 | #1f1f2e | 分割线、卡片边框 |

### 字体规范

| 层级 | 大小 | 字重 | 行高 |
|------|------|------|------|
| H1 (Hero) | 48-64px | 700 | 1.1 |
| H2 (区块标题) | 28-36px | 600 | 1.2 |
| H3 (卡片标题) | 18-20px | 600 | 1.3 |
| Body | 16px | 400 | 1.6 |
| Caption | 14px | 400 | 1.5 |

字体栈：`"Inter", "Noto Sans SC", system-ui, sans-serif`

### 间距规范

| 名称 | 值 |
|------|-----|
| 页面内边距 | px-4 md:px-8 lg:px-16 |
| 区块间距 | py-16 md:py-24 |
| 卡片内边距 | p-6 |
| 卡片间隙 | gap-6 |
| 元素间隙 | space-y-4 |

### 圆角规范

| 用途 | 值 |
|------|-----|
| 卡片 | rounded-xl (12px) |
| 按钮 | rounded-lg (8px) |
| 标签 | rounded-full |
| 输入框 | rounded-lg (8px) |

### 阴影规范

```css
/* 卡片默认 */
shadow: 0 1px 3px rgba(0,0,0,0.3)

/* 卡片 Hover */
shadow-lg: 0 10px 25px rgba(0,0,0,0.5)
```
