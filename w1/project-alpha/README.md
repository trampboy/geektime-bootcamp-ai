# Project Alpha - Ticket 管理系统

一个基于标签的简单高效的 Ticket 管理工具。

## 项目简介

Project Alpha 是一个全栈应用，提供完整的 Ticket 管理功能，包括创建、编辑、删除 Ticket，以及基于标签的分类和筛选功能。

## 技术栈

### 后端
- **Node.js** v18+
- **Express.js** - Web 框架
- **TypeScript** - 类型安全
- **MySQL** v8.0+ - 关系型数据库
- **mysql2** - MySQL 客户端

### 前端
- **React** v18 - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - CSS 框架
- **Shadcn/ui** - UI 组件库

## 项目结构

```
project-alpha/
├── backend/             # 后端服务
│   ├── src/
│   │   ├── config/      # 配置文件
│   │   ├── models/      # 数据模型
│   │   ├── services/    # 业务逻辑
│   │   ├── controllers/ # 控制器
│   │   ├── routes/      # 路由
│   │   ├── middlewares/ # 中间件
│   │   ├── utils/       # 工具函数
│   │   ├── types/       # 类型定义
│   │   └── app.ts       # 应用入口
│   └── package.json
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── components/  # React 组件
│   │   ├── hooks/       # 自定义 Hooks
│   │   ├── services/    # API 服务
│   │   ├── types/       # 类型定义
│   │   ├── utils/       # 工具函数
│   │   └── App.tsx      # 应用入口
│   └── package.json
├── database/            # 数据库脚本
│   └── init.sql         # 初始化脚本
└── docs/                # 项目文档
```

## 快速开始

### 前置要求

- Node.js v18+
- MySQL v8.0+
- npm 或 yarn

### 1. 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行初始化脚本
source database/init.sql
```

或者直接执行：

```bash
mysql -u root -p < database/init.sql
```

### 2. 启动后端

```bash
cd backend
npm install
cp .env.example .env
# 编辑 .env 文件，配置数据库密码等信息
npm run dev
```

后端服务将在 http://localhost:3000 启动。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端应用将在 http://localhost:5173 启动。

## 核心功能

### Ticket 管理
- ✅ 创建 Ticket
- ✅ 编辑 Ticket
- ✅ 删除 Ticket
- ✅ 标记完成/取消完成
- ✅ 查看 Ticket 列表

### 标签管理
- ✅ 创建标签
- ✅ 为 Ticket 添加标签
- ✅ 从 Ticket 删除标签
- ✅ 按标签筛选 Ticket

### 搜索和筛选
- ✅ 按标题搜索
- ✅ 按状态筛选
- ✅ 按标签筛选
- ✅ 组合筛选

## 开发阶段

### Phase 1：环境搭建与数据库设计 ✅
- ✅ 数据库设计和初始化脚本
- ✅ 后端项目初始化
- ✅ 前端项目初始化
- ✅ 项目目录结构

### Phase 2：后端 API 开发（进行中）
- ⏳ Service 层实现
- ⏳ Controller 层实现
- ⏳ 路由配置
- ⏳ 中间件配置

### Phase 3：前端基础架构
- ⏳ 基础组件开发
- ⏳ API 服务层
- ⏳ 状态管理

### Phase 4：前端功能实现
- ⏳ Ticket 管理界面
- ⏳ 标签管理界面
- ⏳ 搜索和筛选功能

### Phase 5：测试与优化
- ⏳ 集成测试
- ⏳ 性能优化
- ⏳ 用户体验优化

## API 文档

### Ticket API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/tickets` | 获取所有 Tickets |
| GET | `/api/tickets/:id` | 获取单个 Ticket |
| POST | `/api/tickets` | 创建 Ticket |
| PUT | `/api/tickets/:id` | 更新 Ticket |
| DELETE | `/api/tickets/:id` | 删除 Ticket |
| PATCH | `/api/tickets/:id/status` | 更新状态 |
| PUT | `/api/tickets/:ticketId/tags` | 批量设置标签 |

### Tag API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/tags` | 获取所有标签 |
| POST | `/api/tags` | 创建标签 |
| POST | `/api/tickets/:ticketId/tags/:tagId` | 添加标签 |
| DELETE | `/api/tickets/:ticketId/tags/:tagId` | 删除标签 |

详细的 API 文档请参考 [specs/w1/0001-specs.md](../../specs/w1/0001-specs.md)。

## 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 开发规范

- 遵循 TypeScript 严格模式
- 使用 ESLint 进行代码检查
- 遵循 Git Commit 规范
- 为复杂功能添加注释

## License

MIT

## 作者

Project Alpha Team

---

**当前进度：** Phase 1 已完成 ✅  
**最后更新：** 2025-12-20
