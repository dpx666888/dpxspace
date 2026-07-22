# services 目录

## 作用

统一封装所有与 Supabase 数据库的交互逻辑。页面组件不直接调用数据库，而是通过 service 层访问数据。

## 文件说明

- `supabase.ts`：Supabase 客户端初始化、配置检测、环境变量读取
- `auth.service.ts`：登录、退出、获取当前用户/会话、订阅认证状态变化
- `projects.service.ts`：项目相关 CRUD + 时间线读取
- `logs.service.ts`：成长日志相关 CRUD
- `labs.service.ts`：实验室项目相关 CRUD
- `about.service.ts`：关于我内容读取与更新
- `contact.service.ts`：联系方式读取与更新

## 依赖关系

- 依赖 `src/types/database.ts` 中的类型定义
- 依赖 `src/data/fallbackData.ts` 中的本地降级数据
- 被 `src/hooks/` 和 `src/admin/hooks/` 中的数据 hooks 调用
- 被前台页面和后台管理页面调用

## 设计原则

1. **统一入口**：所有数据库操作必须通过 service 层
2. **类型安全**：返回值和参数都使用 TypeScript 类型
3. **降级兼容**：Supabase 未配置时自动返回 fallback 数据
4. **错误处理**：统一捕获异常并抛出标准化错误
5. **环境变量**：通过 `import.meta.env` 读取 Supabase 配置

## 注意事项

- 不要在 service 文件中硬编码任何密钥
- 写入操作（create/update/delete）在 Supabase 未配置时会抛出错误
- 读取操作（get）在 Supabase 未配置时返回本地 fallback 数据
