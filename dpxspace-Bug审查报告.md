# dpxspace-Bug审查报告

**审查日期**: 2026-07-24
**审查范围**: src/ 全部代码、supabase/ 迁移文件
**TypeScript编译**: 0错误 ✅

---

# 🔴 严重问题（Critical）

## BUG-001: 图片上传无文件类型和大小校验
- **严重程度**: 🔴 Critical
- **位置**: `src/services/gallery.service.ts:55-62`
- **问题**: `uploadImage()` 函数未校验文件类型、大小，仅清理了文件名特殊字符
- **影响**: 用户可上传任意文件类型（exe/pdf等），造成Storage存储浪费，无上传失败的用户提示
- **原因**: 上传函数直接传递File对象到Supabase，无前端校验层
- **建议**: 添加文件类型白名单（image/jpeg, image/png, image/webp），大小限制（如5MB），上传前弹窗校验

## BUG-002: 空section_order可能导致About页白屏
- **严重程度**: 🔴 Critical
- **位置**: `src/pages/About.tsx:266`
- **问题**: `const order = about.section_order?.length ? about.section_order : DEFAULT_ORDER` — 如果Supabase返回的section_order为null/undefined，fallback到DEFAULT_ORDER正常。但如果数据库中有旧记录section_order包含不存在的key（如'legacy'），renderSection落入default返回null，导致该section空白但不报错
- **影响**: 后台修改section_order时输入错误key会导致前端渲染空洞
- **原因**: renderSection的default返回null，无错误提示
- **建议**: filter只渲染sectionLabels中存在的key，忽略未知key

## BUG-003: CoffeeDetail展开状态在拖拽排序后丢失
- **严重程度**: 🔴 Critical
- **位置**: `src/pages/Coffee.tsx:25-28`（CoffeeDetail内部useState）
- **问题**: CoffeeDetail组件的`open`状态存储在每个item内部，当后台拖拽排序改变数组顺序后，React reconciliation可能将展开状态映射到错误的item上
- **影响**: 用户展开某条记录查看参数后，后台排序操作会导致展开内容和卡片错位
- **原因**: key使用item.id，排序后id不变但数组顺序变了，React会复用component实例
- **建议**: 排序变更后重置所有展开状态，或使用更稳定的状态管理

---

# 🟡 中等问题（Medium）

## BUG-004: 删除项目不级联清理AI协作记录
- **严重程度**: 🟡 Medium
- **位置**: `src/services/projects.service.ts:99-111`（deleteProject）、`src/admin/hooks/useProjectMutations.ts`
- **问题**: `deleteProject()` 只删除projects表记录，不清理关联的ai_collabs记录（project_id关联）、project_timeline记录
- **影响**: 删除项目后，ai_collabs和timeline表中产生孤儿记录
- **原因**: 无级联删除逻辑，数据库层也无ON DELETE CASCADE
- **建议**: 在deleteProject中先删除关联的ai_collabs和timeline，或者数据库添加外键CASCADE

## BUG-005: 图片删除失败静默吞错
- **严重程度**: 🟡 Medium
- **位置**: `src/services/gallery.service.ts:66-69`
- **问题**: `deleteImage()` 使用 `console.warn` 吞掉错误，不抛出异常。调用方无法感知Storage删除失败
- **影响**: 数据库记录已删除但Storage中的图片文件残留，长期积累Storage空间浪费
- **原因**: 删除函数catch后仅console.warn不向上传递
- **建议**: 至少返回boolean表示成功/失败，或在调用层记录失败日志

## BUG-006: LabEdit/LogEdit/ProjectEdit找不到记录时无限loading
- **严重程度**: 🟡 Medium
- **位置**: `src/admin/pages/LabEdit.tsx:87`、`LogEdit.tsx`、`ProjectEdit.tsx`
- **问题**: 当URL中的id无效（如`/admin/labs/99999/edit`），`labs?.find()`返回undefined，而loading条件`(!isNew && !lab && labs)`中labs已加载完成 —— 条件变为`true && true && [...有数据]`，永远为真，显示无限loading spinner
- **影响**: 用户访问不存在的编辑页面时看到永久loading，无错误提示
- **原因**: 缺少"未找到"的判断分支
- **建议**: 数据加载完成后若lab仍为undefined，显示"记录不存在"提示并提供返回按钮

## BUG-007: sectionLabels和iconMap不同步
- **严重程度**: 🟡 Medium
- **位置**: `src/admin/pages/AboutManage.tsx:28`、`src/pages/About.tsx:18`
- **问题**: 两个文件中各自维护sectionLabels常量，About.tsx的renderSection仅处理6个case，如果admin端sectionLabels或section_order出现不一致，前后台展示脱节
- **影响**: 后台可添加sectionLabels但前台renderSection无对应case，导致渲染空白
- **原因**: section配置分散在3个文件中（AboutManage labels + About labels + About renderSection switch）
- **建议**: 抽取共享的section配置到独立常量文件，renderSection动态渲染

## BUG-008: 首页加载等待PersonalSpacePreview独立加载
- **严重程度**: 🟡 Medium
- **位置**: `src/pages/Home.tsx:12`
- **问题**: Home页的`loading`判断不包含`useSpaceModules`的加载状态。首页主体已渲染但PersonalSpacePreview区域仍在loading，造成页面布局跳动
- **影响**: 页面先渲染上半部分，下半部分Personal Space区域延迟出现，用户体验差
- **原因**: PersonalSpacePreview使用独立hook，loading未提升到Home页层级
- **建议**: 在Home页也加载spaceModules，将loading统一控制

---

# 🟢 优化问题（Low）

## BUG-009: 生产环境大量console日志
- **严重程度**: 🟢 Low
- **位置**: `src/services/*.service.ts`（共约35处console.warn/error）
- **问题**: 所有service层在Supabase未配置和错误时输出console，生产环境会暴露内部错误信息
- **影响**: 浏览器控制台大量日志，用户体验差，可能暴露API内部细节
- **建议**: 使用环境变量控制日志输出（仅开发环境），或使用统一的logger模块

## BUG-010: 图片上传无压缩
- **严重程度**: 🟢 Low
- **位置**: `src/services/gallery.service.ts:55-62`、`src/admin/pages/GalleryManage.tsx:44-50`、`CoffeeManage.tsx:44-50`
- **问题**: 原始图片直接上传，无前端压缩。手机拍摄照片通常3-8MB，影响加载速度
- **影响**: 首页/画廊页面加载慢，移动端流量消耗大
- **建议**: 上传前使用Canvas API压缩为WebP格式，限制最大尺寸（如1920px宽）

## BUG-011: 使用alert()提示上传错误
- **严重程度**: 🟢 Low
- **位置**: `src/admin/pages/GalleryManage.tsx:51`、`CoffeeManage.tsx:48`
- **问题**: 图片上传失败使用原生`alert()`弹窗提示，体验差
- **影响**: UI与网站风格不统一，移动端alert体验更差
- **建议**: 使用toast/notification组件替代alert

## BUG-012: About页头像和姓名未纳入CMS
- **严重程度**: 🟢 Low
- **位置**: `src/pages/About.tsx:5`（`import { profile } from '../data/profile'`）
- **问题**: 头像URL和姓名仍从静态文件`data/profile.ts`读取，无法通过后台修改
- **影响**: 违反"所有内容后台可管理"的原则
- **建议**: 将profile数据纳入site_config或about表

## BUG-013: 空状态文案不统一
- **严重程度**: 🟢 Low
- **位置**: 各前台页面
- **问题**: 
  - Gallery: "暂无图片" ✅
  - Coffee: "暂无咖啡记录" + "开始记录你的第一杯咖啡" ✅
  - Space: "暂无启用的模块" ✅
  - Home: 无空状态处理（projects/logs为undefined时页面空白）
- **建议**: Home页项目区和日志区添加空状态提示

---

# 📊 审查统计

| 严重程度 | 数量 |
|----------|------|
| 🔴 Critical | 3 |
| 🟡 Medium | 5 |
| 🟢 Low | 5 |
| **总计** | **13** |

---

# 🔒 安全检查（全部通过）

| 检查项 | 状态 |
|--------|------|
| 环境变量未硬编码 | ✅ import.meta.env读取 |
| API Key无泄露 | ✅ 无明文key |
| RLS策略覆盖 | ✅ 所有表有RLS |
| 未登录无法访问后台 | ✅ ProtectedRoute |
| 前端无法越权修改 | ✅ RLS + auth.uid() |

---

# 📐 架构检查

| 检查项 | 状态 |
|--------|------|
| Page → Hook → Service → DB分层 | ✅ |
| 无Page直接调用Supabase | ✅ |
| React Query管理服务端状态 | ✅ |
| Zod表单校验 | ✅ |
| TypeScript编译0错误 | ✅ |
