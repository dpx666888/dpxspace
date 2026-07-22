-- 个人内容管理系统初始数据库结构
-- 适用于 Supabase PostgreSQL

-- 扩展：自动更新 updated_at
-- Supabase 已默认启用，无需额外创建 extension

-- 1. profiles 表：认证用户扩展信息
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. about 表：关于我页面内容（单条记录）
create table if not exists about (
  id bigint primary key generated always as identity,
  intro jsonb not null default '[]'::jsonb,
  education jsonb not null default '{}'::jsonb,
  certificates jsonb not null default '[]'::jsonb,
  practice jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  growth_route jsonb not null default '[]'::jsonb,
  ai_collaboration jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- 3. projects 表：项目档案
create table if not exists projects (
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

-- 4. project_timeline 表：项目时间线
create table if not exists project_timeline (
  id bigint primary key generated always as identity,
  project_id bigint not null references projects(id) on delete cascade,
  date text not null,
  version text,
  title text not null default '',
  content text not null default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- 5. labs 表：实验室项目
create table if not exists labs (
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

-- 6. logs 表：成长日志
create table if not exists logs (
  id bigint primary key generated always as identity,
  title text not null,
  date text not null,
  category text not null check (category in ('学习', '项目复盘', '技术笔记')),
  content text not null default '',
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. contacts 表：联系方式（单条记录）
create table if not exists contacts (
  id bigint primary key generated always as identity,
  email text not null default '',
  github text not null default '',
  location text not null default '',
  bio text not null default '',
  socials jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 自动更新 updated_at 的函数与触发器
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

-- 索引
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_featured on projects(featured);
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_projects_created_at on projects(created_at desc);

create index if not exists idx_project_timeline_project_id on project_timeline(project_id);
create index if not exists idx_project_timeline_sort_order on project_timeline(sort_order);

create index if not exists idx_labs_type on labs(type);
create index if not exists idx_labs_status on labs(status);

create index if not exists idx_logs_date on logs(date desc);
create index if not exists idx_logs_category on logs(category);

-- 启用 RLS
alter table about enable row level security;
alter table projects enable row level security;
alter table project_timeline enable row level security;
alter table labs enable row level security;
alter table logs enable row level security;
alter table contacts enable row level security;
alter table profiles enable row level security;

-- 匿名用户只读策略
create policy "Allow public read about" on about for select using (true);
create policy "Allow public read projects" on projects for select using (true);
create policy "Allow public read project_timeline" on project_timeline for select using (true);
create policy "Allow public read labs" on labs for select using (true);
create policy "Allow public read logs" on logs for select using (true);
create policy "Allow public read contacts" on contacts for select using (true);

-- 认证用户可管理全部内容
-- 简单策略：所有登录用户都有完整权限，后续可按 role 扩展
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

CREATE POLICY "Allow authenticated read profiles" ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);
