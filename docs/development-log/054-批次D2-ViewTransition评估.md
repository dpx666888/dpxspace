# 第 054 次开发记录 — 批次 D2 View Transition 可行性评估

## 开发时间

2026-10-18

## 本次目标

验证在项目现有声明式路由（`<BrowserRouter>`）下，React Router 7 的 `<Link viewTransition>` 是否能触发原生 View Transition，从而决定是否实施“项目卡片 → 详情页”的共享元素过渡。本批次为评估项，不进入主功能范围。

## 背景

阶段11方案中 D2 标注为“spike 后决定”。执行标准约定：若声明式路由不支持，则放弃共享元素过渡，不修改路由架构。

## 验证方式

1. 创建临时分支 `spike/view-transition`。
2. 给首页项目卡片封面与详情页封面添加同名 `view-transition-name`（`project-cover-<slug>`）。
3. 给卡片 `<Link>` 添加 `viewTransition` 属性。
4. 在 `index.css` 中用 `@supports (view-transition-name: none)` 包裹过渡样式。
5. 在页面加载前包装 `document.startViewTransition` 并计数：
   - 先手动调用一次，确认包装与 API 可用；
   - 再点击项目卡片，观察计数是否增加。
6. 截图保存导航后的详情页。

## 验证结果

| 检查项 | 结果 |
|---|---|
| `document.startViewTransition` 可用 | ✅ true |
| CSS `view-transition-name` 支持 | ✅ `CSS.supports` 为 true |
| 卡片与详情页共享元素名称 | ✅ 均为 `project-cover-demo-project-1` |
| 手动调用计数 | ✅ 1（包装生效） |
| 点击 `<Link viewTransition>` 后计数 | ❌ 仍为 1（未触发） |
| 导航结果 | ✅ 正常进入 `/projects/demo-project-1` |
| 控制台错误 | ✅ 无 |
| 主分支残留改动 | ✅ 无（spike 提交仅存在于已删除的临时分支） |

## 结论

**已评估，不实施。**

在项目的声明式 `BrowserRouter` 模式下，`useNavigate` 最终调用 history navigator，不会包裹 `document.startViewTransition`；View Transition 集成位于 data router（`createBrowserRouter` / `RouterProvider`）路径。因此 `<Link viewTransition>` 在当前架构下是空操作。

按执行标准与负责人确认的决策：放弃共享元素过渡，不改路由架构。D1 的视差与 B2 的封面已经提供足够的空间连续性。

## 当前状态

评估完成，不产生主分支代码改动。

## 下一步计划

批次 E：页面骨架屏。
