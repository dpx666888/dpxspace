# 个人内容管理系统数据库设计

## 一、数据库选型

采用 **Supabase PostgreSQL**。

理由：

- 与阶段9技术设计方案一致
- 自带认证系统 Supabase Auth
- 提供 REST/Realtime API
- 支持 Row Level Security（RLS）
- 支持文件存储（Storage）
- 免费额度适合个人项目

---

## 二、表结构总览

| 表名 | 用途 | 主要字段 |
|------|------|----------|
| `profiles` | 系统管理员基础信息 | id, email, full_name |
| `about` | 关于我页面内容 | id, intro, education, certificates, practice, tech_stack, growth_route, ai_collaboration, updated_at |
| `projects` | 项目档案 | id, title, slug, description, tags, tech_stack, github_url, live_url, cover_image, status, featured, story, ai_collaboration, created_at, updated_at |
| `project_timeline` | 项目时间线 | id, project_id, date, version, title, content, sort_order, created_at |
| `labs` | 实验室项目 | id, title, type, status, description, tech_stack, demo_url, github_url, cover_image, created_at, updated_at |
| `logs` | 成长日志 | id, title, date, category, content, tags, created_at, updated_at |
| `contacts` | 联系方式 | id, email, github, location, bio, socials, created_at, updated_at |

---

## 三、详细表设计

### 3.1 profiles

Supabase Auth 用户扩展表。用于关联认证用户与后台管理权限。

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

说明：

- `id` 与 `auth.users.id` 一对一
- `role` 支持后续扩展多管理员角色

---

### 3.2 about

关于我页面内容。单条记录（id=1）。

```sql
create table about (
  id bigint primary key generated always as identity,
  intro jsonb not null default '[]'::jsonb,            -- 简介段落数组
  education jsonb not null default '{}'::jsonb,       -- 教育经历
  certificates jsonb not null default '[]'::jsonb,    -- 证书列表
  practice jsonb not null default '[]'::jsonb,        -- 实践经历
  tech_stack jsonb not null default '[]'::jsonb,      -- 技术方向分类
  growth_route jsonb not null default '[]'::jsonb,    -- 成长路线时间线
  ai_collaboration jsonb not null default '{}'::jsonb,-- AI 协作介绍
  updated_at timestamptz default now()
);
```

JSONB 结构示例：

```json
{
  "intro": [
    "一个学生开发者...",
    "我热衷于动手落地...",
    "我也不知道我想成为..."
  ],
  "education": {
    "school": "中山职业技术学院",
    "major": "物联网应用技术",
    "period": "2024.09 - 至今",
    "courses": "C语言、单片机、模电、数电",
    "achievements": "专业排名前10%...",
    "competitions": "计算机设计大赛..."
  },
  "certificates": [
    { "name": "传感网应用开发职业技能等级证书（中级）", "icon": "Award" }
  ],
  "practice": [
    { "icon": "Wrench", "title": "螃蟹记账...", "role": "独立开发", "desc": "..." }
  ],
  "tech_stack": [
    { "title": "编程语言", "icon": "Code2", "skills": ["C++", "JavaScript", "TypeScript"] }
  ],
  "growth_route": [
    { "period": "2024.09", "title": "入学 中山职业技术学院", "desc": "..." }
  ],
  "ai_collaboration": {
    "intro": "...",
    "examples": "..."
  }
}
```

---

### 3.3 projects

项目主表。

```sql
create table projects (
  id bigint primary key generated always as identity,
  title text not null,
  slug text unique not null,
  description text not null default '',
  tags jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  github_url text,
  live_url text,
  cover_image text,
  status text default 'published' check (status in ('draft', 'published', 'archived')),
  featured boolean default false,
  story jsonb not null default '{}'::jsonb,
  ai_collaboration text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

`story` JSONB 结构：

```json
{
  "why": "为什么开始",
  "design": "设计过程",
  "development": "开发过程",
  "problems": [
    { "title": "问题标题", "desc": "问题描述" }
  ],
  "solutions": "解决方案",
  "result": "最终成果",
  "summary": "个人收获"
}
```

---

### 3.4 project_timeline

项目时间线，与 projects 一对多。

```sql
create table project_timeline (
  id bigint primary key generated always as identity,
  project_id bigint not null references projects(id) on delete cascade,
  date text not null,
  version text,
  title text not null default '',
  content text not null default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 索引
create index idx_project_timeline_project_id on project_timeline(project_id);
```

---

### 3.5 labs

实验室项目表。

```sql
create table labs (
  id bigint primary key generated always as identity,
  title text not null,
  type text not null check (type in ('工具', 'Demo', '实验')),
  status text default '已完成' check (status in ('进行中', '已完成')),
  description text not null default '',
  tech_stack jsonb not null default '[]'::jsonb,
  demo_url text,
  github_url text,
  cover_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

### 3.6 logs

成长日志表。

```sql
create table logs (
  id bigint primary key generated always as identity,
  title text not null,
  date text not null,
  category text not null check (category in ('学习', '项目复盘', '技术笔记')),
  content text not null default '',
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 索引
create index idx_logs_date on logs(date desc);
create index idx_logs_category on logs(category);
```

---

### 3.7 contacts

联系方式表。单条记录（id=1）。

```sql
create table contacts (
  id bigint primary key generated always as identity,
  email text not null default '',
  github text not null default '',
  location text not null default '',
  bio text not null default '',
  socials jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

`socials` JSONB 结构：

```json
[
  { "platform": "GitHub", "url": "https://github.com/dpx666888", "icon": "Github" },
  { "platform": "知乎", "url": "...", "icon": "ZhiHu" }
]
```

---

## 四、关系图

```
auth.users (1) ── (1) profiles

about (1条记录)
contacts (1条记录)

projects (1) ── (N) project_timeline

labs (独立表)

logs (独立表)
```

---

## 五、Row Level Security（RLS）策略

### 5.1 全局策略

所有业务表默认启用 RLS：

```sql
alter table about enable row level security;
alter table projects enable row level security;
alter table project_timeline enable row level security;
alter table labs enable row level security;
alter table logs enable row level security;
alter table contacts enable row level security;
```

### 5.2 匿名用户策略（前台只读）

```sql
-- 所有表对匿名用户开放 SELECT
create policy "Allow public read" on about for select using (true);
create policy "Allow public read" on projects for select using (true);
create policy "Allow public read" on project_timeline for select using (true);
create policy "Allow public read" on labs for select using (true);
create policy "Allow public read" on logs for select using (true);
create policy "Allow public read" on contacts for select using (true);
```

### 5.3 认证用户策略（后台管理）

```sql
-- about 表
create policy "Allow admin full access" on about
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- projects 表
create policy "Allow admin full access" on projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- project_timeline 表
create policy "Allow admin full access" on project_timeline
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- labs 表
create policy "Allow admin full access" on labs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- logs 表
create policy "Allow admin full access" on logs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- contacts 表
create policy "Allow admin full access" on contacts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
```

说明：

- 简单起见，所有认证用户都拥有全部管理权限
- 后续可通过 `profiles.role` 字段扩展更细粒度权限

---

## 六、索引设计

```sql
-- projects
create index idx_projects_slug on projects(slug);
create index idx_projects_featured on projects(featured);
create index idx_projects_status on projects(status);
create index idx_projects_created_at on projects(created_at desc);

-- project_timeline
create index idx_project_timeline_project_id on project_timeline(project_id);
create index idx_project_timeline_sort_order on project_timeline(sort_order);

-- labs
create index idx_labs_type on labs(type);
create index idx_labs_status on labs(status);

-- logs
create index idx_logs_date on logs(date desc);
create index idx_logs_category on logs(category);
```

---

## 七、触发器

### 7.1 自动更新 updated_at

```sql
-- 为所有含 updated_at 字段的表创建触发器
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_about_updated_at before update on about
  for each row execute function update_updated_at_column();

create trigger update_projects_updated_at before update on projects
  for each row execute function update_updated_at_column();

create trigger update_labs_updated_at before update on labs
  for each row execute function update_updated_at_column();

create trigger update_logs_updated_at before update on logs
  for each row execute function update_updated_at_column();

create trigger update_contacts_updated_at before update on contacts
  for each row execute function update_updated_at_column();
```

---

## 八、初始数据（Seed）

将现有静态数据导入数据库：

- `about`：1条记录，来自 `src/data/profile.ts`
- `projects`：3条记录，来自 `src/data/projects.ts`
- `project_timeline`：每条项目对应的时间线
- `labs`：2条记录，来自 `src/data/lab.ts`
- `logs`：4条记录，来自 `src/data/logs.ts`
- `contacts`：1条记录，来自 `src/pages/Contact.tsx` 和 `src/data/profile.ts`

Seed SQL 文件位置：`supabase/seed.sql`

---

## 九、与 TypeScript 类型的对应

将数据库表映射为 TypeScript 类型，存放在 `src/types/database.ts`：

```typescript
export interface Project {
  id: number
  title: string
  slug: string
  description: string
  tags: string[]
  tech_stack: string[]
  github_url: string | null
  live_url: string | null
  cover_image: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  story: ProjectStory
  ai_collaboration: string | null
  created_at: string
  updated_at: string
}

export interface Log {
  id: number
  title: string
  date: string
  category: '学习' | '项目复盘' | '技术笔记'
  content: string
  tags: string[]
  created_at: string
  updated_at: string
}

// ... 其他类型
```

---

## 十、验收标准

阶段9.1/9.2 数据库相关验收：

- [ ] 所有表在 Supabase 中成功创建
- [ ] RLS 策略正确配置
- [ ] 索引已创建
- [ ] Seed 数据导入成功
- [ ] 前台可以通过 Supabase client 读取数据
- [ ] 后台可以通过认证后写入数据
