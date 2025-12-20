# Project Alpha - Ticket 管理系统需求与设计文档

## 1. 项目概述

### 1.1 项目简介
Project Alpha 是一个基于标签的 Ticket 管理工具，允许用户创建、管理和追踪任务。系统采用前后端分离架构，提供简洁直观的用户界面。

### 1.2 项目目标
- 提供简单高效的 Ticket 管理功能
- 通过标签系统实现灵活的任务分类
- 提供流畅的用户体验
- 支持快速搜索和筛选

### 1.3 技术栈

#### 后端
- **Node.js** + **Express.js**: Web 服务框架
- **TypeScript**: 类型安全的开发语言
- **MySQL**: 关系型数据库

#### 前端
- **TypeScript**: 类型安全的开发语言
- **Vite**: 快速的构建工具
- **React**: UI 框架
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Shadcn/ui**: 高质量的 React 组件库

## 2. 功能需求

### 2.1 Ticket 管理

#### 2.1.1 创建 Ticket
- 用户可以创建新的 Ticket
- 必填字段：
  - **标题** (title): 文本，最大长度 255 字符
  - **描述** (description): 文本，最大长度 5000 字符（可选）
- 自动生成字段：
  - **创建时间** (createdAt): 时间戳
  - **更新时间** (updatedAt): 时间戳
  - **状态** (status): 默认为 'pending'（进行中）

#### 2.1.2 编辑 Ticket
- 用户可以编辑 Ticket 的标题和描述
- 编辑后自动更新 updatedAt 时间戳

#### 2.1.3 删除 Ticket
- 用户可以删除 Ticket
- 删除 Ticket 时，自动删除关联的标签关系

#### 2.1.4 完成/取消完成 Ticket
- 用户可以标记 Ticket 为已完成
- 用户可以将已完成的 Ticket 重新标记为进行中
- 状态值：
  - `pending`: 进行中
  - `completed`: 已完成

### 2.2 标签管理

#### 2.2.1 添加标签
- 用户可以为 Ticket 添加一个或多个标签
- 标签属性：
  - **名称** (name): 文本，最大长度 50 字符
  - **颜色** (color): 十六进制颜色值（如 #FF5733）
- 如果标签不存在，自动创建新标签
- 一个 Ticket 可以有多个标签

#### 2.2.2 删除标签
- 用户可以从 Ticket 中移除标签
- 移除标签不会删除标签本身，只是解除关联

#### 2.2.3 标签自动管理
- 如果某个标签没有被任何 Ticket 使用，系统可以选择性清理

### 2.3 查看和筛选

#### 2.3.1 查看所有 Ticket
- 显示所有 Ticket 列表
- 按创建时间倒序排列
- 显示信息：
  - 标题
  - 状态（进行中/已完成）
  - 关联的标签
  - 创建时间

#### 2.3.2 按标签筛选
- 用户可以选择一个或多个标签进行筛选
- 显示包含所选标签的 Ticket
- 支持多标签 AND/OR 逻辑（建议使用 OR 逻辑）

#### 2.3.3 按标题搜索
- 用户可以输入关键词搜索 Ticket
- 搜索范围：Ticket 标题
- 支持模糊匹配（部分匹配）
- 实时搜索或输入后搜索

#### 2.3.4 按状态筛选
- 用户可以筛选进行中或已完成的 Ticket
- 支持显示所有状态

## 3. 数据库设计

### 3.1 数据库表结构

#### 3.1.1 tickets 表
存储 Ticket 的基本信息。

```sql
CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**字段说明：**
- `id`: 主键，自增
- `title`: Ticket 标题，必填
- `description`: Ticket 描述，可选
- `status`: Ticket 状态（pending/completed）
- `created_at`: 创建时间
- `updated_at`: 最后更新时间

#### 3.1.2 tags 表
存储标签信息。

```sql
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**字段说明：**
- `id`: 主键，自增
- `name`: 标签名称，唯一
- `color`: 标签颜色（十六进制格式）
- `created_at`: 创建时间

#### 3.1.3 ticket_tags 表
存储 Ticket 和标签的多对多关系。

```sql
CREATE TABLE ticket_tags (
  ticket_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ticket_id, tag_id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**字段说明：**
- `ticket_id`: Ticket ID（外键）
- `tag_id`: 标签 ID（外键）
- `created_at`: 关联创建时间
- 联合主键：(ticket_id, tag_id)

### 3.2 ER 图说明

```
tickets (1) ---- (N) ticket_tags (N) ---- (1) tags
```

- 一个 Ticket 可以有多个标签
- 一个标签可以被多个 Ticket 使用
- ticket_tags 作为中间表实现多对多关系

## 4. API 设计

### 4.1 API 规范
- **协议**: HTTP/HTTPS
- **数据格式**: JSON
- **基础路径**: `/api`

### 4.2 Ticket 相关 API

#### 4.2.1 获取所有 Tickets
```
GET /api/tickets
```

**查询参数：**
- `status` (可选): `pending` | `completed` | `all` (默认: all)
- `search` (可选): 搜索关键词（搜索标题）
- `tags` (可选): 标签 ID 列表，逗号分隔（如: `1,2,3`）

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "实现用户登录功能",
      "description": "需要实现基本的用户登录流程",
      "status": "pending",
      "createdAt": "2025-12-20T10:00:00.000Z",
      "updatedAt": "2025-12-20T10:00:00.000Z",
      "tags": [
        {
          "id": 1,
          "name": "后端",
          "color": "#3B82F6"
        },
        {
          "id": 2,
          "name": "高优先级",
          "color": "#EF4444"
        }
      ]
    }
  ]
}
```

#### 4.2.2 获取单个 Ticket
```
GET /api/tickets/:id
```

**路径参数：**
- `id`: Ticket ID

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户登录功能",
    "description": "需要实现基本的用户登录流程",
    "status": "pending",
    "createdAt": "2025-12-20T10:00:00.000Z",
    "updatedAt": "2025-12-20T10:00:00.000Z",
    "tags": [
      {
        "id": 1,
        "name": "后端",
        "color": "#3B82F6"
      }
    ]
  }
}
```

#### 4.2.3 创建 Ticket
```
POST /api/tickets
```

**请求体：**
```json
{
  "title": "实现用户登录功能",
  "description": "需要实现基本的用户登录流程",
  "tags": [1, 2]  // 可选：标签 ID 数组
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户登录功能",
    "description": "需要实现基本的用户登录流程",
    "status": "pending",
    "createdAt": "2025-12-20T10:00:00.000Z",
    "updatedAt": "2025-12-20T10:00:00.000Z",
    "tags": []
  }
}
```

#### 4.2.4 更新 Ticket
```
PUT /api/tickets/:id
```

**路径参数：**
- `id`: Ticket ID

**请求体：**
```json
{
  "title": "实现用户登录功能（更新）",
  "description": "更新后的描述"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "实现用户登录功能（更新）",
    "description": "更新后的描述",
    "status": "pending",
    "createdAt": "2025-12-20T10:00:00.000Z",
    "updatedAt": "2025-12-20T10:30:00.000Z",
    "tags": []
  }
}
```

#### 4.2.5 删除 Ticket
```
DELETE /api/tickets/:id
```

**路径参数：**
- `id`: Ticket ID

**响应示例：**
```json
{
  "success": true,
  "message": "Ticket deleted successfully"
}
```

#### 4.2.6 更新 Ticket 状态
```
PATCH /api/tickets/:id/status
```

**路径参数：**
- `id`: Ticket ID

**请求体：**
```json
{
  "status": "completed"  // 或 "pending"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "completed",
    "updatedAt": "2025-12-20T11:00:00.000Z"
  }
}
```

### 4.3 标签相关 API

#### 4.3.1 获取所有标签
```
GET /api/tags
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "后端",
      "color": "#3B82F6",
      "ticketCount": 5
    },
    {
      "id": 2,
      "name": "前端",
      "color": "#10B981",
      "ticketCount": 3
    }
  ]
}
```

#### 4.3.2 创建标签
```
POST /api/tags
```

**请求体：**
```json
{
  "name": "后端",
  "color": "#3B82F6"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "后端",
    "color": "#3B82F6",
    "createdAt": "2025-12-20T10:00:00.000Z"
  }
}
```

#### 4.3.3 为 Ticket 添加标签
```
POST /api/tickets/:ticketId/tags/:tagId
```

**路径参数：**
- `ticketId`: Ticket ID
- `tagId`: 标签 ID

**响应示例：**
```json
{
  "success": true,
  "message": "Tag added to ticket successfully"
}
```

#### 4.3.4 从 Ticket 删除标签
```
DELETE /api/tickets/:ticketId/tags/:tagId
```

**路径参数：**
- `ticketId`: Ticket ID
- `tagId`: 标签 ID

**响应示例：**
```json
{
  "success": true,
  "message": "Tag removed from ticket successfully"
}
```

#### 4.3.5 批量管理 Ticket 标签
```
PUT /api/tickets/:ticketId/tags
```

**路径参数：**
- `ticketId`: Ticket ID

**请求体：**
```json
{
  "tags": [1, 2, 3]  // 标签 ID 数组
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "ticketId": 1,
    "tags": [
      {
        "id": 1,
        "name": "后端",
        "color": "#3B82F6"
      },
      {
        "id": 2,
        "name": "前端",
        "color": "#10B981"
      }
    ]
  }
}
```

### 4.4 错误响应格式

所有错误响应遵循统一格式：

```json
{
  "success": false,
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

**常见错误码：**
- `TICKET_NOT_FOUND`: Ticket 不存在
- `TAG_NOT_FOUND`: 标签不存在
- `VALIDATION_ERROR`: 验证错误
- `DATABASE_ERROR`: 数据库错误
- `INTERNAL_SERVER_ERROR`: 服务器内部错误

## 5. 前端设计

### 5.1 页面结构

#### 5.1.1 主页面布局
```
┌─────────────────────────────────────────────────┐
│  Header: Ticket 管理系统                         │
├─────────────────────────────────────────────────┤
│  ┌──────────────────┬───────────────────────┐  │
│  │ 侧边栏            │  主内容区              │  │
│  │ - 所有 Tickets   │  ┌──────────────────┐ │  │
│  │ - 进行中         │  │ 搜索框 + 筛选器   │ │  │
│  │ - 已完成         │  └──────────────────┘ │  │
│  │                  │  ┌──────────────────┐ │  │
│  │ 标签列表:        │  │ Ticket 列表       │ │  │
│  │ □ 后端           │  │                  │ │  │
│  │ □ 前端           │  │ [Ticket Card 1]  │ │  │
│  │ □ Bug            │  │ [Ticket Card 2]  │ │  │
│  │                  │  │ [Ticket Card 3]  │ │  │
│  │ [+ 新建标签]     │  │ ...              │ │  │
│  └──────────────────┴───────────────────────┘  │
│                                                 │
│  [+ 新建 Ticket] (浮动按钮)                    │
└─────────────────────────────────────────────────┘
```

#### 5.1.2 Ticket 卡片设计
每个 Ticket 卡片显示：
- 标题（可点击查看详情）
- 状态标识（✓ 已完成 / ○ 进行中）
- 标签（彩色标签）
- 创建时间
- 操作按钮（编辑、删除、完成/取消完成）

### 5.2 组件设计

#### 5.2.1 核心组件列表

**布局组件：**
- `Layout`: 整体布局
- `Sidebar`: 侧边栏
- `Header`: 顶部导航栏

**Ticket 相关组件：**
- `TicketList`: Ticket 列表容器
- `TicketCard`: 单个 Ticket 卡片
- `TicketForm`: 创建/编辑 Ticket 表单
- `TicketDetail`: Ticket 详情模态框

**标签相关组件：**
- `TagList`: 标签列表（侧边栏）
- `Tag`: 单个标签显示
- `TagSelector`: 标签选择器
- `TagForm`: 创建标签表单

**通用组件：**
- `SearchBar`: 搜索栏
- `FilterBar`: 筛选栏
- `Button`: 按钮组件
- `Modal`: 模态框
- `Input`: 输入框
- `Checkbox`: 复选框

#### 5.2.2 状态管理

建议使用 React 的 Context API 或轻量级状态管理库（如 Zustand）：

**全局状态：**
- `tickets`: Ticket 列表
- `tags`: 标签列表
- `filters`: 筛选条件
  - `selectedTags`: 选中的标签
  - `status`: 状态筛选
  - `searchQuery`: 搜索关键词

**操作方法：**
- `fetchTickets()`: 获取 Ticket 列表
- `createTicket()`: 创建 Ticket
- `updateTicket()`: 更新 Ticket
- `deleteTicket()`: 删除 Ticket
- `toggleTicketStatus()`: 切换 Ticket 状态
- `fetchTags()`: 获取标签列表
- `createTag()`: 创建标签
- `addTagToTicket()`: 为 Ticket 添加标签
- `removeTagFromTicket()`: 从 Ticket 删除标签
- `setFilter()`: 设置筛选条件

### 5.3 UI/UX 设计要点

#### 5.3.1 视觉设计
- **配色方案**: 使用 Tailwind CSS 默认色板
  - 主色：Blue (蓝色系)
  - 成功：Green (绿色系)
  - 警告：Yellow (黄色系)
  - 危险：Red (红色系)
- **字体**: 系统默认字体栈
- **圆角**: 统一使用 `rounded-lg`
- **阴影**: 卡片使用 `shadow-sm` 或 `shadow-md`

#### 5.3.2 交互设计
- **即时反馈**: 所有操作提供即时视觉反馈
- **加载状态**: 使用 Skeleton 或 Spinner 显示加载状态
- **错误处理**: 使用 Toast 通知显示错误信息
- **确认操作**: 删除等危险操作需要二次确认
- **响应式设计**: 支持桌面和移动端

#### 5.3.3 用户体验优化
- **搜索防抖**: 搜索框输入防抖处理（300ms）
- **乐观更新**: 部分操作采用乐观更新策略
- **快捷键支持**: 
  - `Ctrl/Cmd + K`: 快速搜索
  - `N`: 新建 Ticket
  - `Esc`: 关闭模态框
- **拖拽排序**: 可选功能，支持拖拽调整 Ticket 顺序

### 5.4 核心页面流程

#### 5.4.1 创建 Ticket 流程
1. 用户点击「新建 Ticket」按钮
2. 打开创建 Ticket 模态框
3. 用户输入标题、描述
4. 用户选择标签（可选）
5. 用户点击「创建」按钮
6. 发送 POST 请求到 `/api/tickets`
7. 创建成功后，关闭模态框，刷新列表
8. 显示成功提示

#### 5.4.2 编辑 Ticket 流程
1. 用户点击 Ticket 卡片的「编辑」按钮
2. 打开编辑 Ticket 模态框，预填充现有数据
3. 用户修改标题、描述或标签
4. 用户点击「保存」按钮
5. 发送 PUT 请求到 `/api/tickets/:id`
6. 更新成功后，关闭模态框，刷新列表
7. 显示成功提示

#### 5.4.3 标签筛选流程
1. 用户在侧边栏点击标签复选框
2. 更新筛选条件状态
3. 发送 GET 请求到 `/api/tickets?tags=1,2,3`
4. 更新 Ticket 列表显示
5. 高亮显示已选标签

#### 5.4.4 搜索流程
1. 用户在搜索框输入关键词
2. 触发防抖函数（300ms）
3. 发送 GET 请求到 `/api/tickets?search=关键词`
4. 更新 Ticket 列表显示
5. 高亮匹配的关键词（可选）

## 6. 后端实现细节

### 6.1 项目结构

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # 数据库配置
│   ├── models/
│   │   ├── ticket.model.ts      # Ticket 模型
│   │   ├── tag.model.ts         # Tag 模型
│   │   └── ticketTag.model.ts   # TicketTag 模型
│   ├── controllers/
│   │   ├── ticket.controller.ts # Ticket 控制器
│   │   └── tag.controller.ts    # Tag 控制器
│   ├── services/
│   │   ├── ticket.service.ts    # Ticket 业务逻辑
│   │   └── tag.service.ts       # Tag 业务逻辑
│   ├── routes/
│   │   ├── ticket.routes.ts     # Ticket 路由
│   │   └── tag.routes.ts        # Tag 路由
│   ├── middlewares/
│   │   ├── error.middleware.ts  # 错误处理中间件
│   │   └── validate.middleware.ts # 验证中间件
│   ├── utils/
│   │   ├── logger.ts            # 日志工具
│   │   └── response.ts          # 统一响应格式
│   ├── types/
│   │   └── index.ts             # 类型定义
│   └── app.ts                   # Express 应用入口
├── package.json
├── tsconfig.json
└── .env                         # 环境变量
```

### 6.2 数据库连接

使用连接池管理数据库连接：

```typescript
// src/config/database.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ticket_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

### 6.3 Service 层设计

**TicketService 核心方法：**
- `getAllTickets(filters)`: 获取所有 Ticket（支持筛选）
- `getTicketById(id)`: 获取单个 Ticket
- `createTicket(data)`: 创建 Ticket
- `updateTicket(id, data)`: 更新 Ticket
- `deleteTicket(id)`: 删除 Ticket
- `updateTicketStatus(id, status)`: 更新 Ticket 状态
- `getTicketTags(ticketId)`: 获取 Ticket 的标签
- `addTagToTicket(ticketId, tagId)`: 为 Ticket 添加标签
- `removeTagFromTicket(ticketId, tagId)`: 从 Ticket 删除标签
- `setTicketTags(ticketId, tagIds)`: 批量设置 Ticket 标签

**TagService 核心方法：**
- `getAllTags()`: 获取所有标签
- `getTagById(id)`: 获取单个标签
- `createTag(data)`: 创建标签
- `deleteTag(id)`: 删除标签
- `getTagTicketCount(tagId)`: 获取标签的 Ticket 数量

### 6.4 数据验证

使用中间件进行数据验证（可使用 joi 或 zod）：

**Ticket 验证规则：**
- `title`: 必填，字符串，1-255 字符
- `description`: 可选，字符串，最大 5000 字符
- `status`: 可选，枚举值（pending/completed）

**Tag 验证规则：**
- `name`: 必填，字符串，1-50 字符
- `color`: 可选，字符串，十六进制颜色格式（#RRGGBB）

### 6.5 错误处理

统一错误处理中间件：

```typescript
// src/middlewares/error.middleware.ts
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: message
    }
  });
};
```

### 6.6 CORS 配置

允许前端跨域访问：

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

## 7. 前端实现细节

### 7.1 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── ticket/
│   │   │   ├── TicketList.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketForm.tsx
│   │   │   └── TicketDetail.tsx
│   │   ├── tag/
│   │   │   ├── TagList.tsx
│   │   │   ├── Tag.tsx
│   │   │   ├── TagSelector.tsx
│   │   │   └── TagForm.tsx
│   │   └── ui/              # Shadcn/ui 组件
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       ├── checkbox.tsx
│   │       └── ...
│   ├── hooks/
│   │   ├── useTickets.ts
│   │   ├── useTags.ts
│   │   └── useDebounce.ts
│   ├── services/
│   │   ├── api.ts           # Axios 配置
│   │   ├── ticket.service.ts
│   │   └── tag.service.ts
│   ├── store/               # 状态管理
│   │   ├── ticketStore.ts
│   │   └── tagStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── format.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 7.2 API 服务封装

使用 Axios 进行 API 调用：

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.error?.message || '请求失败';
    // 显示错误提示（使用 toast）
    return Promise.reject(error);
  }
);

export default api;
```

### 7.3 自定义 Hooks

**useTickets Hook:**
```typescript
export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTickets = async (filters?: TicketFilters) => {
    // 实现获取 tickets 逻辑
  };
  
  const createTicket = async (data: CreateTicketDto) => {
    // 实现创建 ticket 逻辑
  };
  
  // ... 其他方法
  
  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    // ... 其他方法
  };
};
```

### 7.4 Tailwind CSS 配置

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 可以自定义主题色
      },
    },
  },
  plugins: [],
}
```

### 7.5 Shadcn/ui 集成

安装和配置 Shadcn/ui 组件库：

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add checkbox
# ... 其他需要的组件
```

## 8. 开发流程

### 8.1 环境准备

**后端环境：**
1. 安装 Node.js (v18+)
2. 安装 MySQL (v8.0+)
3. 创建数据库
4. 配置环境变量 (.env)

**前端环境：**
1. 安装 Node.js (v18+)
2. 配置环境变量 (.env)

### 8.2 开发步骤

**第一阶段：数据库和后端 API**
1. 创建数据库和表结构
2. 搭建 Express.js 项目
3. 实现数据模型层
4. 实现 Service 层
5. 实现 Controller 层
6. 配置路由
7. 测试 API（使用 Postman 或 Thunder Client）

**第二阶段：前端界面**
1. 搭建 Vite + React 项目
2. 配置 Tailwind CSS 和 Shadcn/ui
3. 实现基础组件
4. 实现 API 服务层
5. 实现状态管理
6. 实现页面布局
7. 实现核心功能组件
8. 样式优化和响应式适配

**第三阶段：集成和测试**
1. 前后端联调
2. 功能测试
3. 边界情况处理
4. 性能优化
5. 用户体验优化

### 8.3 测试建议

**后端测试：**
- 单元测试：测试 Service 层方法
- 集成测试：测试 API 端点
- 数据库测试：测试数据库操作

**前端测试：**
- 组件测试：测试独立组件
- 集成测试：测试用户流程
- E2E 测试：测试完整用户场景（可选）

### 8.4 部署建议

**后端部署：**
- 使用 PM2 或 Docker 部署
- 配置反向代理（Nginx）
- 配置 HTTPS
- 配置数据库备份

**前端部署：**
- 构建生产版本（`npm run build`）
- 部署到静态托管服务（Vercel、Netlify 等）
- 配置环境变量
- 配置 CDN（可选）

## 9. 性能优化建议

### 9.1 后端优化
- 使用数据库索引优化查询
- 实现查询结果缓存（Redis）
- 使用连接池管理数据库连接
- 分页加载 Ticket 列表
- 压缩 API 响应（gzip）

### 9.2 前端优化
- 使用 React.memo 优化组件渲染
- 实现虚拟滚动（大量 Ticket 时）
- 懒加载组件
- 优化图片和资源加载
- 使用 Service Worker 缓存（PWA）

### 9.3 数据库优化
- 定期清理未使用的标签
- 使用数据库连接池
- 定期分析和优化查询
- 考虑数据归档策略（大量历史数据时）

## 10. 扩展功能建议

以下功能可在基础版本完成后考虑添加：

### 10.1 短期扩展
- **Ticket 优先级**: 添加优先级字段（高/中/低）
- **到期日期**: 为 Ticket 添加截止日期
- **评论功能**: 为 Ticket 添加评论
- **附件支持**: 支持上传附件
- **批量操作**: 批量完成、删除 Ticket

### 10.2 中期扩展
- **用户系统**: 添加用户认证和授权
- **团队协作**: 支持多用户协作
- **通知系统**: 邮件或站内通知
- **数据导出**: 导出为 CSV/JSON
- **统计报表**: Ticket 统计和可视化

### 10.3 长期扩展
- **移动应用**: 开发移动端 App
- **实时同步**: WebSocket 实时更新
- **自动化规则**: 自动标签、自动分配等
- **集成第三方**: GitHub、Jira 等集成
- **AI 辅助**: 智能标签建议、优先级评估

## 11. 技术选型说明

### 11.1 为什么选择 Express.js
- 轻量级、灵活、易于学习
- 丰富的中间件生态
- 良好的 TypeScript 支持
- 适合中小型项目快速开发

### 11.2 为什么选择 MySQL
- 成熟稳定的关系型数据库
- 适合结构化数据存储
- 良好的事务支持
- 丰富的工具和社区支持

### 11.3 为什么选择 Vite
- 极快的开发服务器启动速度
- 热模块替换（HMR）快速
- 优化的生产构建
- 现代化的工具链

### 11.4 为什么选择 Tailwind CSS
- 实用优先的设计理念
- 快速开发 UI
- 良好的可定制性
- 优秀的文档和社区

### 11.5 为什么选择 Shadcn/ui
- 高质量的 React 组件
- 完全可定制
- 基于 Radix UI 的可访问性
- 与 Tailwind CSS 完美集成

## 12. 总结

本文档详细描述了 Project Alpha Ticket 管理系统的需求、设计和实现方案。系统采用现代化的技术栈，提供简洁高效的用户体验，适合个人和小团队使用。

**核心特点：**
- 简单易用的界面
- 灵活的标签系统
- 快速的搜索和筛选
- 现代化的技术栈
- 良好的扩展性

**开发建议：**
1. 先实现核心功能（CRUD + 标签）
2. 逐步优化用户体验
3. 根据实际使用情况迭代改进
4. 保持代码质量和可维护性

祝开发顺利！🚀

