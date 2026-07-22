# supabase 目录

## 作用

存放 Supabase 相关的数据库迁移脚本、种子数据和配置说明。

## 文件说明

- `migrations/001_initial_schema.sql`：初始数据库结构脚本，包含所有表、索引、触发器、RLS 策略
- `seed.sql`：初始数据脚本，将现有静态数据导入数据库
- `README.md`：本说明文件

## 依赖关系

- 与 `src/services/supabase.ts` 配合使用
- 与 `src/types/database.ts` 中的类型定义对应
- 与 `docs/admin-design/DATABASE_SCHEMA.md` 设计文档一致

## 使用方式

### 在 Supabase Dashboard 中执行

1. 打开 Supabase 项目 → SQL Editor
2. 新建查询，粘贴 `migrations/001_initial_schema.sql` 内容并执行
3. 再新建查询，粘贴 `seed.sql` 内容并执行
4. 检查 Tables 中是否已生成 about/projects/project_timeline/labs/logs/contacts/profiles 表

### 验证数据

执行以下查询：

```sql
select * from projects;
select * from logs;
select * from contacts;
```

## 注意事项

- 不要在迁移脚本中写入真实管理员密码
- 管理员账号通过 Supabase Auth 界面手动创建
- RLS 策略默认对所有认证用户开放完整权限，后续可按需细化
- `.env.local` 中的密钥不要提交到 Git
