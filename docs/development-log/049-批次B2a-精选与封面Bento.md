# 第 049 次开发记录 — 批次 B2a 精选取数、项目封面与 Bento 布局

## 开发时间

2026-10-18

## 本次目标

让后台 `featured` 字段真正参与首页展示；为项目卡片增加视觉封面；将首页精选区改为 Bento 布局；修复首页项目卡片死链（BUG-04）。执行依据：`docs/plans/阶段11-UI动效优化执行标准.md` 批次 B2a。

## 背景

此前 `Home.tsx` 直接 `projects.slice(0, 3)`，未使用 `featured`；项目卡片为纯文字且跳转外部 GitHub，无链接时不可点击。`cover_image` 字段在数据库中存在但前台从未渲染。

## 修改文件

新增：

- `src/lib/featuredProjects.ts` — 精选项目取数单点：`filter(featured)`，无精选回退全部，`slice(0, 3)`；保留 `useProjects` 的 `sort_order` 升序
- `src/lib/projectCover.ts` — 由 slug 哈希出确定性双色渐变配置
- `src/components/ProjectCover.tsx` — 封面组件：有 `cover_image` 渲染图片，否则渲染渐变封面 + 序号 + 技术栈水印；导出 `COVER_ASPECT`

修改：

- `src/pages/Home.tsx` — 精选区接入 `getFeaturedProjects`；按 n 切换布局；卡片改为站内详情链接；新增 `HomeProjectCard`
- `src/pages/Projects.tsx` — 列表卡片顶部接入封面，内容区改为独立容器

删除：无

## 完成内容

1. 精选取数统一走 `getFeaturedProjects`，后台“设为精选”在前台生效；无精选时回退到全部项目；最多展示 3 个。
2. 封面组件支持两种来源：真实 `cover_image`（16:9、`object-cover`）与确定性渐变封面（同一 slug 每次配色一致）。
3. 首页精选区按 n 切换布局：
   - n=0：单一空状态文案
   - n=1：`max-w-5xl` 单卡，md 及以上横排（封面左 45%）
   - n=2：容器切换为 `md:grid-cols-2`，两列等高
   - n≥3：md 首卡 `col-span-2` 横排；lg 首卡 `col-span-2 row-span-2` 纵排，其余两卡堆在第三列
4. 首页项目卡片由外部 GitHub 跳转改为站内 `/projects/:slug`，修复 BUG-04；卡片内新增 Featured 标识、封面、技术栈摘要与 hover 详情提示。
5. Projects 列表页同步接入封面，保持 3 列网格。

## 遇到的问题

1. 临时安装 Playwright 时使用 `npm install --no-save --no-package-lock`，npm 忽略 lockfile 并将依赖升级到新版本，导致构建体积虚增（JS gzip +12KB），一度误判为超出单批限制。
2. 首次 n=3 验收数据中有一个项目未标记 `featured`，被取数逻辑过滤，实际只测到 n=2。
3. n=1 在 lg 下封面占满整行：`lg:w-full` 被错误应用到了所有非默认布局。
4. lg Bento 大卡在 16:9 封面下文字区留白过大；改为封面填满后标题又被推到首屏之外。

## 解决方案

1. 执行 `npm ci` 恢复 lockfile 依赖（需先结束残留的 vite preview 与 esbuild 进程，否则 `lightningcss` 原生模块被占用导致 EPERM）；Playwright 改为隔离安装到 `.artifacts/tools/pw/`，不再触碰项目 `node_modules`。
2. 验收数据改为 3 个项目全部 `featured`，其中第 2 个使用 `/avatar.jpg` 作为真实封面，同时覆盖图片与渐变两条路径。
3. 封面宽度按布局区分：hero 在 lg 使用 `lg:w-full`，single 保持 `md:w-[45%]`。
4. 最终采用 16:9 封面 + 大卡文字区 `lg:justify-center`，标题在 900px 视口内可见，文字块上下留白均衡。

## 验收结果

| 项 | 标准 | 结果 |
|---|---|---|
| tsc | 0 错误 | ✅ |
| build | 成功 | ✅ |
| JS 体积 | 单批 ≤ 3KB gzip | ✅ 211.94 → 213.23 KB gzip（+1.29KB） |
| CSS 体积 | 单批 ≤ 3KB gzip | ✅ 7588 → 8075 B gzip（+487B） |
| n=0 | 单一空状态 | ✅ 三档断点均只显示“暂无项目，去后台添加第一个项目” |
| n=1 | 单卡、md 横排、lg 同 md | ✅ lg 封面 460/1024（45%）；md 375/836（45%） |
| n=2 | 两列等高 | ✅ lg 564+564；md 406+406；移动端堆叠 |
| n≥3 | Bento 矩阵 | ✅ lg 大卡 760×831 + 两卡 368×403；md 首卡 836×218 横排 + 两卡 406×425；移动端 358 单列 |
| 精选优先 | 只展示 featured，按 sort_order | ✅ 5 个项目中 2 个精选，仅渲染这 2 个且顺序正确 |
| 回退 | 无精选时展示全部前 3 | ✅ 逻辑内置于 `getFeaturedProjects` |
| 封面确定性 | 刷新一致、项目间不同 | ✅ sameAcrossReload=true；distinctPerProject=true |
| 真实封面 | cover_image 渲染 img | ✅ 首页与 Projects 各检出 1 张图片封面 |
| BUG-04 | 卡片跳转站内详情 | ✅ href 均为 `/projects/:slug` |
| 溢出 | 无横向滚动 | ✅ 12 个场景均无 |
| 控制台 | 无新增 error | ✅ 无 |

**验收产物**：

- `.artifacts/阶段11/批次B2a/n{0,1,2,3}-{lg,md,mobile}.png`（12 张）
- `.artifacts/阶段11/批次B2a/featured-precedence.png`
- `.artifacts/阶段11/批次B2a/projects-lg.png`、`projects-mobile.png`

## 当前状态

完成。

## 下一步计划

批次 B2b：项目详情页封面横幅、后台精选提示文案。
