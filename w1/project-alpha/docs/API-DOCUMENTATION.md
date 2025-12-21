# Project Alpha - API 文档

## 概述

Project Alpha 是一个基于标签的 Ticket 管理系统的 RESTful API。

**Base URL:** `http://localhost:3000/api`

**Version:** 1.0.0

---

## 认证

当前版本不需要认证。未来版本将添加 JWT 认证。

---

## 错误处理

所有 API 响应遵循统一格式：

### 成功响应

```json
{
  "success": true,
  "data": { ... }
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  }
}
```

### 常见错误码

| 状态码 | 错误码 | 说明 |
|-------|--------|------|
| 400 | VALIDATION_ERROR | 请求参数验证失败 |
| 404 | TICKET_NOT_FOUND | Ticket 不存在 |
| 404 | TAG_NOT_FOUND | 标签不存在 |
| 409 | DUPLICATE_TAG | 标签名称重复 |
| 500 | DATABASE_ERROR | 数据库错误 |

---

## Ticket API

### 1. 获取所有 Tickets

获取 Ticket 列表，支持搜索和筛选。

**请求**

```
GET /api/tickets
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | 状态筛选：`pending` \| `completed` \| `all` |
| tags | string | 否 | 标签筛选（逗号分隔的标签 ID），如：`1,2,3` |
| search | string | 否 | 搜索关键词（匹配标题或描述） |

**示例请求**

```bash
# 获取所有 Tickets
GET /api/tickets

# 筛选进行中的 Tickets
GET /api/tickets?status=pending

# 搜索标题包含"登录"的 Tickets
GET /api/tickets?search=登录

# 筛选包含标签 1 或 2 的 Tickets
GET /api/tickets?tags=1,2
```

**成功响应 (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "实现用户登录功能",
      "description": "需要实现基本的用户登录流程",
      "status": "pending",
      "createdAt": "2025-12-21T10:00:00.000Z",
      "updatedAt": "2025-12-21T10:00:00.000Z",
      "tags": [
        {
          "id": 1,
          "name": "后端",
          "color": "#3B82F6",
          "createdAt": "2025-12-21T09:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

### 2. 获取单个 Ticket

根据 ID 获取 Ticket 详情。

**请求**

```
GET /api/tickets/:id
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | number | Ticket ID |

**示例请求**

```bash
GET /api/tickets/1
```

**成功响应 (200)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户登录功能",
    "description": "需要实现基本的用户登录流程",
    "status": "pending",
    "createdAt": "2025-12-21T10:00:00.000Z",
    "updatedAt": "2025-12-21T10:00:00.000Z",
    "tags": [...]
  }
}
```

**错误响应 (404)**

```json
{
  "success": false,
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Ticket 不存在"
  }
}
```

---

### 3. 创建 Ticket

创建新的 Ticket。

**请求**

```
POST /api/tickets
```

**请求体**

```json
{
  "title": "实现用户登录功能",
  "description": "需要实现基本的用户登录流程",
  "tags": [1, 2]  // 可选，标签 ID 数组
}
```

**字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 标题（最长 255 字符） |
| description | string | 否 | 描述 |
| tags | number[] | 否 | 标签 ID 数组 |

**成功响应 (201)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户登录功能",
    "description": "需要实现基本的用户登录流程",
    "status": "pending",
    "createdAt": "2025-12-21T10:00:00.000Z",
    "updatedAt": "2025-12-21T10:00:00.000Z",
    "tags": [...]
  }
}
```

**错误响应 (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "标题不能为空"
  }
}
```

---

### 4. 更新 Ticket

更新 Ticket 的标题或描述。

**请求**

```
PUT /api/tickets/:id
```

**请求体**

```json
{
  "title": "更新后的标题",
  "description": "更新后的描述"
}
```

**字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 否 | 新标题 |
| description | string | 否 | 新描述 |

**注意：** 至少需要提供一个字段。

**成功响应 (200)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "更新后的标题",
    "description": "更新后的描述",
    "status": "pending",
    "createdAt": "2025-12-21T10:00:00.000Z",
    "updatedAt": "2025-12-21T11:00:00.000Z",
    "tags": [...]
  }
}
```

---

### 5. 删除 Ticket

删除指定的 Ticket。

**请求**

```
DELETE /api/tickets/:id
```

**成功响应 (200)**

```json
{
  "success": true,
  "message": "Ticket 删除成功"
}
```

**错误响应 (404)**

```json
{
  "success": false,
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Ticket 不存在"
  }
}
```

---

### 6. 更新 Ticket 状态

单独更新 Ticket 的状态。

**请求**

```
PATCH /api/tickets/:id/status
```

**请求体**

```json
{
  "status": "completed"
}
```

**字段说明**

| 字段 | 类型 | 必填 | 可选值 |
|------|------|------|--------|
| status | string | 是 | `pending` \| `completed` |

**成功响应 (200)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户登录功能",
    "status": "completed",
    "createdAt": "2025-12-21T10:00:00.000Z",
    "updatedAt": "2025-12-21T12:00:00.000Z",
    "tags": [...]
  }
}
```

---

### 7. 批量设置 Ticket 标签

批量设置 Ticket 的标签（会覆盖现有标签）。

**请求**

```
PUT /api/tickets/:ticketId/tags
```

**请求体**

```json
{
  "tags": [1, 2, 3]
}
```

**字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| tags | number[] | 是 | 标签 ID 数组（可为空数组） |

**成功响应 (200)**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户登录功能",
    "tags": [
      { "id": 1, "name": "后端", "color": "#3B82F6" },
      { "id": 2, "name": "前端", "color": "#10B981" }
    ],
    ...
  }
}
```

---

### 8. 添加标签到 Ticket

为 Ticket 添加单个标签。

**请求**

```
POST /api/tickets/:ticketId/tags/:tagId
```

**成功响应 (200)**

```json
{
  "success": true,
  "data": { ... }
}
```

**错误响应 (409)**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_ASSOCIATION",
    "message": "标签已关联到此 Ticket"
  }
}
```

---

### 9. 从 Ticket 删除标签

从 Ticket 中移除指定标签。

**请求**

```
DELETE /api/tickets/:ticketId/tags/:tagId
```

**成功响应 (200)**

```json
{
  "success": true,
  "data": { ... }
}
```

---

## Tag API

### 1. 获取所有标签

获取所有标签列表。

**请求**

```
GET /api/tags
```

**成功响应 (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "后端",
      "color": "#3B82F6",
      "createdAt": "2025-12-21T09:00:00.000Z"
    },
    {
      "id": 2,
      "name": "前端",
      "color": "#10B981",
      "createdAt": "2025-12-21T09:00:00.000Z"
    }
  ]
}
```

---

### 2. 创建标签

创建新标签。

**请求**

```
POST /api/tags
```

**请求体**

```json
{
  "name": "Bug",
  "color": "#EF4444"
}
```

**字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 标签名称（最长 50 字符，唯一） |
| color | string | 否 | 颜色（#RRGGBB 格式，默认 #3B82F6） |

**成功响应 (201)**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Bug",
    "color": "#EF4444",
    "createdAt": "2025-12-21T10:00:00.000Z"
  }
}
```

**错误响应 (409)**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_TAG",
    "message": "标签名称已存在"
  }
}
```

**错误响应 (400)**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "颜色格式不正确，应为 #RRGGBB 格式"
  }
}
```

---

### 3. 删除标签

删除指定标签（级联删除关联关系）。

**请求**

```
DELETE /api/tags/:id
```

**成功响应 (200)**

```json
{
  "success": true,
  "message": "标签删除成功"
}
```

---

## 健康检查

### Health Check

检查 API 服务是否正常运行。

**请求**

```
GET /api/health
```

**成功响应 (200)**

```json
{
  "success": true,
  "message": "Project Alpha API is running",
  "timestamp": "2025-12-21T10:00:00.000Z"
}
```

---

## 限流

API 实施了限流保护：

- **限制：** 100 请求 / 15 分钟
- **超出限制响应：** 429 Too Many Requests

```json
{
  "error": "请求过于频繁，请稍后再试"
}
```

---

## 数据模型

### Ticket

```typescript
interface Ticket {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
}
```

### Tag

```typescript
interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt: Date;
  ticketCount?: number;  // 可选，某些接口返回
}
```

---

## Postman Collection

可以导入以下 Postman Collection 进行测试：

**文件位置：** `/docs/postman/Project-Alpha.postman_collection.json`

---

## 版本历史

### v1.0.0 (2025-12-21)
- 初始版本发布
- 完整的 Ticket CRUD 功能
- 标签管理功能
- 搜索和筛选功能

---

**文档版本：** v1.0.0  
**最后更新：** 2025-12-21  
**维护者：** Project Alpha Team
