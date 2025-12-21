# Data Model: 数据库查询工具

**Date**: 2025-12-21  
**Feature**: 001-db-query-tool

## 概述

本文档定义数据库查询工具的数据模型，包括SQLite存储结构和API数据传输对象。

## SQLite数据库模型

### 数据库文件
- **路径**: `./w2/db_query/data/db_query.db`
- **类型**: SQLite 3

### 表结构

#### 1. databases 表

存储数据库连接信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主键 |
| name | TEXT | UNIQUE NOT NULL | 数据库标识名称 |
| url | TEXT | NOT NULL | MySQL连接字符串 |
| createdAt | TEXT | NOT NULL | 创建时间 (ISO 8601) |
| updatedAt | TEXT | NOT NULL | 更新时间 (ISO 8601) |

**索引**:
- `CREATE UNIQUE INDEX idx_databases_name ON databases(name);`

#### 2. metadata 表

存储数据库元数据（表和视图信息）。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 主键 |
| databaseId | INTEGER | NOT NULL REFERENCES databases(id) | 外键关联databases表 |
| metadata | TEXT | NOT NULL | JSON格式的元数据 |
| updatedAt | TEXT | NOT NULL | 更新时间 (ISO 8601) |

**索引**:
- `CREATE INDEX idx_metadata_databaseId ON metadata(databaseId);`

**metadata字段JSON结构**:
```json
{
  "tables": [
    {
      "name": "users",
      "type": "BASE TABLE",
      "columns": [
        {
          "name": "id",
          "type": "int",
          "nullable": false,
          "default": null,
          "key": "PRI"
        },
        {
          "name": "username",
          "type": "varchar(255)",
          "nullable": false,
          "default": null,
          "key": ""
        }
      ]
    }
  ],
  "views": [
    {
      "name": "user_summary",
      "type": "VIEW",
      "columns": [...]
    }
  ]
}
```

## API数据传输对象

### 1. DatabaseConnection (数据库连接)

**用途**: 添加数据库连接时的请求体

```typescript
interface DatabaseConnection {
  url: string; // MySQL连接字符串，格式: mysql://user:password@host:port/database
}
```

### 2. DatabaseInfo (数据库信息)

**用途**: 返回数据库连接列表项

```typescript
interface DatabaseInfo {
  name: string;           // 数据库标识名称
  url: string;           // 连接字符串（可脱敏显示）
  createdAt: string;     // ISO 8601格式
  updatedAt: string;     // ISO 8601格式
}
```

### 3. ColumnMetadata (列元数据)

**用途**: 描述数据库表的列信息

```typescript
interface ColumnMetadata {
  name: string;          // 列名
  type: string;          // 数据类型（如: int, varchar(255)）
  nullable: boolean;     // 是否可为空
  default: string | null; // 默认值
  key: string;           // 键类型: PRI(主键), UNI(唯一), MUL(外键/索引), ""(无)
}
```

### 4. TableMetadata (表元数据)

**用途**: 描述数据库表或视图信息

```typescript
interface TableMetadata {
  name: string;                    // 表/视图名
  type: "BASE TABLE" | "VIEW";     // 类型
  columns: ColumnMetadata[];       // 列信息数组
}
```

### 5. DatabaseMetadata (数据库元数据)

**用途**: 返回完整的数据库元数据

```typescript
interface DatabaseMetadata {
  name: string;                    // 数据库标识名称
  tables: TableMetadata[];         // 表列表
  views: TableMetadata[];          // 视图列表
  updatedAt: string;               // 元数据更新时间
}
```

### 6. QueryRequest (查询请求)

**用途**: SQL查询请求体

```typescript
interface QueryRequest {
  sql: string;  // SQL查询语句（必须是SELECT语句）
}
```

### 7. NaturalLanguageQueryRequest (自然语言查询请求)

**用途**: 自然语言查询请求体

```typescript
interface NaturalLanguageQueryRequest {
  prompt: string;  // 自然语言查询描述
}
```

### 8. QueryResult (查询结果)

**用途**: SQL查询结果响应

```typescript
interface QueryResult {
  columns: string[];        // 列名数组
  rows: Record<string, any>[]; // 数据行数组，每行为对象，key为列名
  rowCount: number;         // 返回行数
  executionTime: number;   // 执行时间（毫秒）
}
```

### 9. ErrorResponse (错误响应)

**用途**: API错误响应

```typescript
interface ErrorResponse {
  error: {
    message: string;    // 错误消息
    code?: string;      // 错误代码（可选）
  };
}
```

**错误代码定义**:
- `INVALID_CONNECTION`: 数据库连接失败
- `INVALID_SQL`: SQL语法错误
- `NOT_SELECT`: 非SELECT语句
- `QUERY_FAILED`: 查询执行失败
- `METADATA_FETCH_FAILED`: 元数据获取失败
- `DATABASE_NOT_FOUND`: 数据库不存在
- `LLM_GENERATION_FAILED`: LLM生成SQL失败

## 数据验证规则

### 数据库连接字符串验证
- 格式: `mysql://[user[:password]@]host[:port][/database]`
- 必需字段: host
- 可选字段: user, password, port (默认3306), database

### SQL查询验证
- 必须是有效的SQL语法
- 仅允许SELECT语句
- 不允许包含多个语句（使用分号分隔）
- 不允许包含注释中的危险操作

### 数据库名称验证
- 长度: 1-100字符
- 字符集: 字母、数字、下划线、连字符
- 不能为空或仅包含空格

## 数据关系

```
databases (1) ──< (N) metadata
```

- 一个数据库连接可以有多个元数据记录（历史版本）
- 通常只使用最新的元数据记录
- 可以通过 `updatedAt` 字段判断是否需要刷新元数据

## 数据迁移策略

### 初始化脚本
1. 创建 `databases` 表
2. 创建 `metadata` 表
3. 创建索引
4. 确保 `data` 目录存在

### 元数据刷新策略
- 首次添加数据库时获取元数据
- 提供手动刷新元数据的API端点（可选，未来扩展）
- 元数据变更检测（可选，未来扩展）

## 性能考虑

### 索引优化
- `databases.name` 唯一索引：快速查找数据库
- `metadata.databaseId` 索引：快速查找元数据

### 查询优化
- 元数据JSON字段较大，仅在需要时查询
- 考虑元数据缓存策略（内存缓存）

### 存储优化
- 元数据JSON压缩（可选）
- 定期清理旧元数据版本（可选）
