# Research: 数据库查询工具技术选型

**Date**: 2025-12-21  
**Feature**: 001-db-query-tool

## 1. SQL解析器选择

### Decision: 使用 `node-sql-parser`

**Rationale**:
- 支持MySQL语法解析
- 能够识别SQL语句类型（SELECT, INSERT, UPDATE, DELETE等）
- 提供AST（抽象语法树）用于分析和修改SQL
- TypeScript类型支持良好
- 活跃维护，社区支持良好

**Alternatives considered**:
- `sql-parser`: 功能较简单，不支持MySQL特定语法
- `@databases/sql`: 主要用于构建SQL，不适合解析
- 手动正则表达式: 不够可靠，难以处理复杂SQL

**Implementation Notes**:
- 使用 `node-sql-parser` 解析SQL语句
- 检查AST的 `type` 属性，确保仅为 `'select'`
- 检查是否存在 `limit` 子句，如不存在则添加 `LIMIT 1000`
- 解析错误时返回清晰的错误信息

## 2. MySQL连接库选择

### Decision: 使用 `mysql2`

**Rationale**:
- 官方推荐的MySQL客户端库
- 支持Promise和async/await
- 支持连接池
- TypeScript类型定义完善
- 性能优于 `mysql` 包
- 支持MySQL 8.0+特性

**Alternatives considered**:
- `mysql`: 较老的库，性能较差，不支持Promise
- `mariadb`: 主要针对MariaDB优化，对MySQL支持不如mysql2

**Implementation Notes**:
- 使用 `mysql2/promise` 获取Promise接口
- 从连接字符串解析连接参数（使用 `mysql://` URL格式）
- 实现连接池管理，支持多个数据库连接
- 连接失败时返回详细错误信息

## 3. SQLite库选择

### Decision: 使用 `better-sqlite3`

**Rationale**:
- 同步API，代码更简洁
- 性能优于 `sqlite3`
- TypeScript类型支持良好
- 适合单进程应用场景
- 无需异步处理，减少代码复杂度

**Alternatives considered**:
- `sqlite3`: 异步API，代码复杂度较高
- `sql.js`: 纯JavaScript实现，性能较差

**Implementation Notes**:
- 数据库文件路径: `./w2/db_query/data/db_query.db`
- 需要确保 `data` 目录存在
- 存储数据库连接信息和元数据
- 使用事务确保数据一致性

## 4. OpenAI SDK选择

### Decision: 使用官方 `openai` SDK

**Rationale**:
- 官方维护，API更新及时
- TypeScript类型定义完整
- 支持流式响应
- 文档完善，社区支持好

**Implementation Notes**:
- API Key从环境变量 `OPENAI_API_KEY` 读取
- 使用 `gpt-4` 或 `gpt-3.5-turbo` 模型
- 构建prompt包含数据库元数据作为context
- 设置合理的temperature和max_tokens
- 处理API错误和超时情况

## 5. Express CORS配置

### Decision: 使用 `cors` 中间件，允许所有origin

**Rationale**:
- 简单易用，符合需求
- 支持配置选项
- 标准Express中间件

**Implementation Notes**:
- 使用 `cors` 包
- 配置 `origin: '*'` 允许所有来源
- 允许常用HTTP方法（GET, POST, PUT等）
- 允许JSON内容类型

## 6. MySQL元数据查询方法

### Decision: 使用MySQL INFORMATION_SCHEMA查询

**Rationale**:
- MySQL标准方法
- 支持表和视图
- 提供完整的列信息
- 性能良好

**Implementation Notes**:
- 查询 `INFORMATION_SCHEMA.TABLES` 获取表和视图列表
- 查询 `INFORMATION_SCHEMA.COLUMNS` 获取列详细信息
- 查询 `INFORMATION_SCHEMA.KEY_COLUMN_USAGE` 获取主键和外键信息
- 将结果转换为JSON格式存储到SQLite

**SQL查询示例**:
```sql
-- 获取所有表和视图
SELECT TABLE_NAME, TABLE_TYPE 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = ?;

-- 获取列信息
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?;
```

## 7. 连接字符串解析

### Decision: 使用 `mysql` URL格式解析

**Rationale**:
- 标准格式: `mysql://user:password@host:port/database`
- 易于解析和使用
- 用户友好

**Implementation Notes**:
- 使用正则表达式或URL解析库解析连接字符串
- 提取用户名、密码、主机、端口、数据库名
- 验证必需字段存在
- 处理特殊字符编码

## 8. Monaco Editor集成

### Decision: 使用 `@monaco-editor/react`

**Rationale**:
- React官方Monaco Editor封装
- TypeScript支持良好
- 易于集成到React应用
- 支持SQL语法高亮（需要配置语言）

**Implementation Notes**:
- 安装 `@monaco-editor/react` 和 `monaco-editor`
- 配置SQL语言支持
- 实现代码补全和语法高亮
- 处理编辑器大小和响应式布局

## 9. 错误处理策略

### Decision: 统一错误响应格式

**Rationale**:
- 提供一致的API错误格式
- 便于前端错误处理
- 符合RESTful最佳实践

**Implementation Notes**:
- 使用Express错误处理中间件
- 错误响应格式: `{ error: { message: string, code?: string } }`
- HTTP状态码: 400 (客户端错误), 500 (服务器错误)
- 记录错误日志用于调试

## 10. 数据模型存储设计

### Decision: SQLite表结构设计

**Rationale**:
- 简单高效
- 支持JSON存储
- 易于查询和维护

**Implementation Notes**:
- `databases` 表: 存储数据库连接信息
  - id (主键)
  - name (唯一标识)
  - url (连接字符串)
  - createdAt, updatedAt
- `metadata` 表: 存储数据库元数据
  - id (主键)
  - databaseId (外键)
  - metadata (JSON格式，包含表和视图信息)
  - updatedAt

## 11. LIMIT子句自动添加策略

### Decision: 在SQL解析后修改AST添加LIMIT

**Rationale**:
- 使用AST修改比字符串操作更可靠
- 避免破坏原有SQL结构
- 可以正确处理复杂查询

**Implementation Notes**:
- 解析SQL获取AST
- 检查是否存在 `limit` 节点
- 如不存在，在AST中添加 `limit: { value: [1000] }`
- 将修改后的AST转换回SQL字符串
- 如果用户已指定LIMIT，保持不变

## 12. 自然语言SQL生成Prompt设计

### Decision: 使用结构化Prompt包含元数据context

**Rationale**:
- 提供上下文信息提高准确性
- 明确指定输出格式
- 包含示例提高生成质量

**Implementation Notes**:
- Prompt结构:
  1. 系统角色定义（SQL专家）
  2. 数据库元数据（表和视图信息）
  3. 用户查询需求
  4. 输出要求（仅SELECT语句，格式要求）
- 使用few-shot示例提高准确性
- 设置合理的token限制
- 验证生成的SQL语法正确性

## 总结

所有技术选型均基于以下原则：
1. TypeScript类型支持良好
2. 社区活跃，文档完善
3. 性能满足需求
4. 易于集成和维护
5. 符合项目宪法要求（严格类型、camelCase JSON）
