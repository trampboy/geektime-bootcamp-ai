# Quick Start Guide: 数据库查询工具

**Date**: 2025-12-21  
**Feature**: 001-db-query-tool

## 概述

本文档提供数据库查询工具的快速开始指南，包括环境设置、API使用示例和测试场景。

## 前置要求

### 环境要求
- Node.js LTS 版本
- MySQL 数据库（本地或远程）
- OpenAI API Key（用于自然语言SQL生成功能）

### 环境变量
```bash
export OPENAI_API_KEY=your-openai-api-key
```

## 项目结构

```
w2/db_query/
├── backend/          # 后端服务
├── frontend/         # 前端应用
└── data/            # SQLite数据库存储目录
    └── db_query.db  # SQLite数据库文件
```

## API端点

基础URL: `http://localhost:3000`

### 1. 获取所有数据库
```bash
GET /api/v1/dbs
```

**响应示例**:
```json
{
  "databases": [
    {
      "name": "test-db",
      "url": "mysql://root:***@localhost:3306/test",
      "createdAt": "2025-12-21T10:00:00Z",
      "updatedAt": "2025-12-21T10:00:00Z"
    }
  ]
}
```

### 2. 添加数据库连接
```bash
PUT /api/v1/dbs/test-db
Content-Type: application/json

{
  "url": "mysql://root:123456@localhost:3306/test"
}
```

**响应示例**:
```json
{
  "name": "test-db",
  "url": "mysql://root:***@localhost:3306/test",
  "createdAt": "2025-12-21T10:00:00Z",
  "updatedAt": "2025-12-21T10:00:00Z"
}
```

### 3. 获取数据库元数据
```bash
GET /api/v1/dbs/test-db
```

**响应示例**:
```json
{
  "name": "test-db",
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
  "views": [],
  "updatedAt": "2025-12-21T10:00:00Z"
}
```

### 4. 执行SQL查询
```bash
POST /api/v1/dbs/test-db/query
Content-Type: application/json

{
  "sql": "SELECT * FROM users LIMIT 10"
}
```

**响应示例**:
```json
{
  "columns": ["id", "username", "email"],
  "rows": [
    {
      "id": 1,
      "username": "john",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "username": "jane",
      "email": "jane@example.com"
    }
  ],
  "rowCount": 2,
  "executionTime": 15.5
}
```

### 5. 自然语言生成SQL查询
```bash
POST /api/v1/dbs/test-db/query/natural
Content-Type: application/json

{
  "prompt": "查询用户表的所有信息"
}
```

**响应示例**:
```json
{
  "sql": "SELECT * FROM users",
  "result": {
    "columns": ["id", "username", "email"],
    "rows": [...],
    "rowCount": 10,
    "executionTime": 20.3
  }
}
```

## 测试场景

### 场景1: 添加数据库并查看元数据（P1）

**目标**: 验证数据库连接和元数据获取功能

**步骤**:
1. 准备一个测试MySQL数据库
2. 调用 `PUT /api/v1/dbs/test-db` 添加数据库连接
3. 验证响应状态码为200
4. 调用 `GET /api/v1/dbs/test-db` 获取元数据
5. 验证返回的表和视图信息正确

**预期结果**:
- 数据库连接成功
- 元数据正确返回，包含所有表和视图
- 列信息完整（名称、类型、约束等）

### 场景2: 执行有效SQL查询（P2）

**目标**: 验证SQL查询执行功能

**步骤**:
1. 确保已添加数据库连接
2. 调用 `POST /api/v1/dbs/test-db/query` 执行查询
3. 测试以下SQL:
   - `SELECT * FROM users`
   - `SELECT id, username FROM users WHERE id = 1`
   - `SELECT COUNT(*) as count FROM users`

**预期结果**:
- 查询成功执行
- 返回正确的列名和数据
- 执行时间合理（<3秒）

### 场景3: SQL语法验证（P2）

**目标**: 验证SQL语法检查和安全性

**步骤**:
1. 测试无效SQL: `SELECT * FRM users` (语法错误)
2. 测试非SELECT语句: `INSERT INTO users VALUES (1, 'test')`
3. 测试多语句: `SELECT * FROM users; DELETE FROM users`

**预期结果**:
- 语法错误返回400状态码和错误信息
- 非SELECT语句被拒绝
- 多语句查询被拒绝

### 场景4: LIMIT自动添加（P2）

**目标**: 验证LIMIT子句自动添加功能

**步骤**:
1. 执行无LIMIT的查询: `SELECT * FROM users`
2. 执行有LIMIT的查询: `SELECT * FROM users LIMIT 5`
3. 验证返回的行数

**预期结果**:
- 无LIMIT查询自动添加LIMIT 1000
- 有LIMIT查询使用用户指定的值
- 返回行数符合预期

### 场景5: 自然语言SQL生成（P3）

**目标**: 验证自然语言转SQL功能

**步骤**:
1. 确保已添加数据库并获取元数据
2. 调用 `POST /api/v1/dbs/test-db/query/natural`
3. 测试以下自然语言查询:
   - "查询用户表的所有信息"
   - "查询id为1的用户"
   - "统计用户总数"

**预期结果**:
- 成功生成有效的SQL查询
- 生成的SQL语法正确
- 查询结果符合预期
- 准确率达到80%以上

### 场景6: 错误处理

**目标**: 验证错误处理机制

**步骤**:
1. 测试不存在的数据库: `GET /api/v1/dbs/non-existent`
2. 测试无效连接字符串: `PUT /api/v1/dbs/test` (无效URL)
3. 测试数据库连接失败: 使用错误的凭据

**预期结果**:
- 返回适当的HTTP状态码（404, 400等）
- 错误消息清晰明确
- 错误响应格式统一

## 使用curl测试

### 完整测试流程

```bash
# 1. 添加数据库
curl -X PUT http://localhost:3000/api/v1/dbs/test-db \
  -H "Content-Type: application/json" \
  -d '{"url": "mysql://root:123456@localhost:3306/test"}'

# 2. 获取数据库列表
curl http://localhost:3000/api/v1/dbs

# 3. 获取元数据
curl http://localhost:3000/api/v1/dbs/test-db

# 4. 执行SQL查询
curl -X POST http://localhost:3000/api/v1/dbs/test-db/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM users LIMIT 10"}'

# 5. 自然语言查询
curl -X POST http://localhost:3000/api/v1/dbs/test-db/query/natural \
  -H "Content-Type: application/json" \
  -d '{"prompt": "查询用户表的所有信息"}'
```

## 前端集成示例

### React组件示例

```typescript
// 获取数据库列表
const fetchDatabases = async () => {
  const response = await fetch('http://localhost:3000/api/v1/dbs');
  const data = await response.json();
  return data.databases;
};

// 执行SQL查询
const executeQuery = async (dbName: string, sql: string) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/dbs/${dbName}/query`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    }
  );
  return await response.json();
};
```

## 性能基准

### 预期性能指标

- **数据库连接**: < 2秒
- **元数据获取**: < 3秒（50个表以内）
- **SQL查询执行**: < 3秒（1000行以内）
- **自然语言SQL生成**: < 10秒

### 负载测试

- 支持至少10个并发数据库连接
- 支持至少10个并发查询请求
- SQLite数据库操作响应时间 < 50ms

## 故障排查

### 常见问题

1. **数据库连接失败**
   - 检查MySQL服务是否运行
   - 验证连接字符串格式
   - 检查网络连接和防火墙设置

2. **SQLite数据库文件不存在**
   - 确保 `data` 目录存在
   - 检查文件权限

3. **OpenAI API错误**
   - 验证API Key是否正确
   - 检查API配额和限制
   - 查看API错误响应

4. **CORS错误**
   - 确认后端CORS配置允许前端origin
   - 检查请求头设置

## 下一步

完成快速开始后，可以：
1. 查看 [data-model.md](./data-model.md) 了解数据模型
2. 查看 [contracts/openapi.yaml](./contracts/openapi.yaml) 了解完整API规范
3. 查看 [research.md](./research.md) 了解技术选型
4. 开始实现功能（参考 tasks.md，由 `/speckit.tasks` 生成）
