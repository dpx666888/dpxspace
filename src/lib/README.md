# lib

## 作用

存放跨页面/跨组件复用的纯逻辑工具与常量映射，不包含 React 组件与副作用。

## 文件说明

| 文件 | 说明 |
|------|------|
| icons.ts | 个人空间模块的图标名 → Lucide 组件映射表，导出 `iconMap`、`getIcon(name)`、`IconComponent` 类型 |

## 依赖关系

被前台组件与页面引用（如 `pages/Space.tsx`、`components/PersonalSpacePreview.tsx`）。不依赖 `admin/`、`services/`。

## 注意事项

- 禁止存放 React 组件（组件放 `src/components/`）
- 禁止存放业务请求逻辑（放 `src/services/`）
- 新增图标只需在此处注册一次
