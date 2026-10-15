# 第 047 次开发记录 — /new 路由修正

## 开发时间

2026-07-30

## 本次目标

修正「新建」页面依赖 `:id/edit` 通配匹配的隐式行为，改用显式的 `/new` 路由，消除路由歧义。

## 背景

此前「新建」按钮链接指向 `/admin/projects/new/edit`，该 URL 实际由 `projects/:id/edit` 匹配（`id='new'`），靠 `isNew = id === 'new'` 判断生效。而 `App.tsx` 中已注册的 `projects/new` 路由形同虚设——能用，但语义绕、易误读。

## 修改文件

新增：无

修改：

- `src/admin/pages/ProjectsManage.tsx`、`LabsManage.tsx`、`LogsManage.tsx` — 「新建」链接 `/new/edit` → `/new`
- `src/admin/pages/ProjectEdit.tsx`、`LabEdit.tsx`、`LogEdit.tsx` — `isNew = id === 'new'` → `isNew = !id`

删除：无

## 完成内容

1. 三个管理页的「新建」链接改为 `/admin/{projects,labs,logs}/new`，与已注册的 `/new` 路由对齐
2. 三个编辑页的 `isNew` 判断改为从 `useParams().id` 是否存在派生：`/new` 路由无 `:id` 参数 → `id` 为 `undefined` → `isNew = true`；`/:id/edit` → `isNew = false`
3. `App.tsx` 无需改动（`/new` 与 `/:id/edit` 路由均已存在，且段数不同不存在歧义）
4. `npx tsc --noEmit` 0 错误；`npm run build` 通过

## 遇到的问题

无。

## 解决方案

无。

## 当前状态

完成（代码层面）；「新建」与「编辑」跳转待部署后回归验证

## 下一步计划

7 个批次全部完成。汇总本轮收尾优化，输出总体验收报告。
