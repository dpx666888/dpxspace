# 个人内容管理系统 API 设计

## 一、设计原则

1. **服务层封装**：页面组件不直接调用 Supabase，所有数据操作通过 `services/*.service.ts`
2. **类型安全**：所有接口参数和返回值使用 TypeScript 类型
3. **错误处理**：统一捕获异常并返回标准化错误信息
4. **降级兼容**：Supabase 未配置时返回本地静态数据
5. **缓存友好**：与 React Query 配合，统一 query key

---

## 二、服务层目录结构

```
src/services/
├── supabase.ts              # Supabase 客户端初始化
├── projects.service.ts      # 项目 API
├── logs.service.ts          # 日志 API
├── about.service.ts         # 关于我 API
├── labs.service.ts          # 实验室 API
└── contact.service.ts       # 联系方式 API
```

---

## 三、Supabase 客户端初始化

### 3.1 `services/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null

export function isSupabaseConfigured() {
  return !!supabase
}
```

### 3.2 环境变量示例 `.env.example`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

说明：

- `VITE_` 前缀让 Vite 在客户端代码中暴露这些变量
- `.env.local` 用于本地开发，不提交到 Git

---

## 四、React Query 配置

### 4.1 Query Key 规范

| 资源 | Query Key |
|------|-----------|
| 关于我 | `['about']` |
| 项目列表 | `['projects']` |
| 单个项目 | `['projects', slug]` |
| 项目时间线 | `['projects', slug, 'timeline']` |
| 实验室列表 | `['labs']` |
| 日志列表 | `['logs']` |
| 联系方式 | `['contacts']` |

### 4.2 `main.tsx` 集成

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分钟
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
```

---

## 五、Projects API

### 5.1 类型定义

```typescript
export interface ProjectInput {
  title: string
  slug: string
  description: string
  tags: string[]
  tech_stack: string[]
  github_url?: string
  live_url?: string
  cover_image?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  story?: ProjectStory
  ai_collaboration?: string
}
```

### 5.2 API 列表

#### `getProjects()`

获取已发布项目列表。

```typescript
export async function getProjects(): Promise<Project[]> {
  if (!supabase) return fallbackProjects

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
```

#### `getProjectBySlug(slug: string)`

获取单个项目详情。

```typescript
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!supabase) return fallbackProjects.find(p => p.slug === slug) || null

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}
```

#### `getProjectTimeline(projectId: number)`

获取项目时间线。

```typescript
export async function getProjectTimeline(projectId: number): Promise<TimelineEvent[]> {
  if (!supabase) return fallbackTimeline.filter(t => t.project_id === projectId)

  const { data, error } = await supabase
    .from('project_timeline')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data || []
}
```

#### `createProject(project: ProjectInput)`

创建项目（后台）。

```typescript
export async function createProject(project: ProjectInput): Promise<Project> {
  if (!supabase) throw new Error('Supabase 未配置')

  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  return data
}
```

#### `updateProject(id: number, project: Partial<ProjectInput>)`

更新项目。

```typescript
export async function updateProject(id: number, project: Partial<ProjectInput>): Promise<Project> {
  if (!supabase) throw new Error('Supabase 未配置')

  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
```

#### `deleteProject(id: number)`

删除项目（级联删除时间线）。

```typescript
export async function deleteProject(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}
```

---

## 六、Logs API

### 6.1 类型定义

```typescript
export interface LogInput {
  title: string
  date: string
  category: '学习' | '项目复盘' | '技术笔记'
  content: string
  tags: string[]
}
```

### 6.2 API 列表

#### `getLogs()`

按时间倒序获取日志。

```typescript
export async function getLogs(): Promise<Log[]> {
  if (!supabase) return fallbackLogs

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}
```

#### `getLogsByCategory(category: string)`

按分类获取日志。

```typescript
export async function getLogsByCategory(category: string): Promise<Log[]> {
  if (!supabase) return fallbackLogs.filter(l => l.category === category)

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('category', category)
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}
```

#### `createLog(log: LogInput)` / `updateLog(id, log)` / `deleteLog(id)`

后台 CRUD，结构同 projects。

---

## 七、About API

### 7.1 API 列表

#### `getAbout()`

获取关于我内容。单条记录。

```typescript
export async function getAbout(): Promise<AboutData> {
  if (!supabase) return fallbackAbout

  const { data, error } = await supabase
    .from('about')
    .select('*')
    .single()

  if (error) throw error
  return data
}
```

#### `updateAbout(about: Partial<AboutData>)`

更新关于我内容。

```typescript
export async function updateAbout(about: Partial<AboutData>): Promise<AboutData> {
  if (!supabase) throw new Error('Supabase 未配置')

  const { data, error } = await supabase
    .from('about')
    .update(about)
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return data
}
```

---

## 八、Labs API

### 8.1 类型定义

```typescript
export interface LabInput {
  title: string
  type: '工具' | 'Demo' | '实验'
  status: '进行中' | '已完成'
  description: string
  tech_stack: string[]
  demo_url?: string
  github_url?: string
  cover_image?: string
}
```

### 8.2 API 列表

#### `getLabs()`

```typescript
export async function getLabs(): Promise<Lab[]> {
  if (!supabase) return fallbackLabs

  const { data, error } = await supabase
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
```

后台 CRUD 同 projects。

---

## 九、Contacts API

### 9.1 API 列表

#### `getContacts()`

```typescript
export async function getContacts(): Promise<ContactData> {
  if (!supabase) return fallbackContact

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .single()

  if (error) throw error
  return data
}
```

#### `updateContacts(contact: Partial<ContactData>)`

```typescript
export async function updateContacts(contact: Partial<ContactData>): Promise<ContactData> {
  if (!supabase) throw new Error('Supabase 未配置')

  const { data, error } = await supabase
    .from('contacts')
    .update(contact)
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return data
}
```

---

## 十、Auth API

### 10.1 `services/auth.service.ts`

```typescript
import { supabase } from './supabase'

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase 未配置')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase 未配置')
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!supabase) return { subscription: { unsubscribe: () => {} } }
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}
```

---

## 十一、错误处理规范

### 11.1 服务端错误

所有 service 函数：

- 正常返回数据
- 异常抛出 `Error` 对象

### 11.2 组件层处理

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: getProjects,
})

if (error) {
  return <ErrorMessage error={error} />
}
```

### 11.3 标准错误信息

- `Supabase 未配置`：说明环境变量缺失，使用 fallback 数据
- `未找到记录`：单条查询无结果
- 其他 Supabase 错误：显示原始错误 message

---

## 十二、前端 Hook 设计

### 12.1 前台读取 Hook

```typescript
// hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '../services/projects.service'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
}

// hooks/useProject.ts
export function useProject(slug: string) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
  })
}
```

### 12.2 后台修改 Hook

```typescript
// hooks/useCreateProject.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject } from '../services/projects.service'

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
```

---

## 十三、与现有静态数据的兼容

每个 service 文件都引入现有静态数据作为 fallback：

```typescript
import { projects as fallbackProjects } from '../data/projects'
import { logs as fallbackLogs } from '../data/logs'
import { labItems as fallbackLabs } from '../data/lab'
import { profile as fallbackAbout, ... } from '../data/profile'
```

当 Supabase 未配置或请求失败时，前台使用 fallback 数据保持展示。

---

## 十四、API 汇总表

| Service | 方法 | 用途 | 权限 |
|---------|------|------|------|
| `projects.service.ts` | `getProjects` | 获取项目列表 | 公开 |
| `projects.service.ts` | `getProjectBySlug` | 获取项目详情 | 公开 |
| `projects.service.ts` | `getProjectTimeline` | 获取项目时间线 | 公开 |
| `projects.service.ts` | `createProject` | 创建项目 | 认证 |
| `projects.service.ts` | `updateProject` | 更新项目 | 认证 |
| `projects.service.ts` | `deleteProject` | 删除项目 | 认证 |
| `logs.service.ts` | `getLogs` | 获取日志列表 | 公开 |
| `logs.service.ts` | `getLogsByCategory` | 按分类获取日志 | 公开 |
| `logs.service.ts` | `create/update/deleteLog` | 日志 CRUD | 认证 |
| `labs.service.ts` | `getLabs` | 获取实验室列表 | 公开 |
| `labs.service.ts` | `create/update/deleteLab` | 实验室 CRUD | 认证 |
| `about.service.ts` | `getAbout` | 获取关于我 | 公开 |
| `about.service.ts` | `updateAbout` | 更新关于我 | 认证 |
| `contact.service.ts` | `getContacts` | 获取联系方式 | 公开 |
| `contact.service.ts` | `updateContacts` | 更新联系方式 | 认证 |
| `auth.service.ts` | `signIn/signOut/getCurrentUser` | 认证 | - |

---

## 十五、验收标准

阶段9.1/9.5 API 相关验收：

- [ ] `services/supabase.ts` 正确初始化
- [ ] 环境变量配置完成
- [ ] 所有 service 文件创建完成
- [ ] 前台页面成功从数据库读取数据
- [ ] 后台页面成功通过 service 写入数据
- [ ] React Query 缓存刷新正常
- [ ] Supabase 未配置时自动降级到静态数据
