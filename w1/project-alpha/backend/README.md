# Project Alpha - Backend

基于 Node.js + Express.js + TypeScript + MySQL 的 Ticket 管理系统后端。

## 技术栈

- **Node.js** v18+
- **Express.js** - Web 框架
- **TypeScript** - 类型安全
- **MySQL** v8.0+ - 数据库
- **mysql2** - MySQL 客户端

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件（数据库等）
│   ├── models/          # 数据模型
│   ├── services/        # 业务逻辑层
│   ├── controllers/     # 控制器层
│   ├── routes/          # 路由配置
│   ├── middlewares/     # 中间件
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript 类型定义
│   └── app.ts           # 应用入口
├── dist/                # 编译输出
├── package.json
├── tsconfig.json
└── .env                 # 环境变量（不提交到 Git）
```

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写数据库密码等信息。

### 3. 初始化数据库

执行数据库初始化脚本：

```bash
mysql -u root -p < ../database/init.sql
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

### 5. 构建生产版本

```bash
npm run build
npm start
```

## API 端点

### Ticket API

- `GET /api/tickets` - 获取所有 Tickets
- `GET /api/tickets/:id` - 获取单个 Ticket
- `POST /api/tickets` - 创建 Ticket
- `PUT /api/tickets/:id` - 更新 Ticket
- `DELETE /api/tickets/:id` - 删除 Ticket
- `PATCH /api/tickets/:id/status` - 更新状态
- `PUT /api/tickets/:ticketId/tags` - 批量设置标签

### Tag API

- `GET /api/tags` - 获取所有标签
- `POST /api/tags` - 创建标签
- `POST /api/tickets/:ticketId/tags/:tagId` - 添加标签
- `DELETE /api/tickets/:ticketId/tags/:tagId` - 删除标签

## 开发规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规范
- 为所有 API 添加错误处理
- 使用预处理语句防止 SQL 注入

## License

MIT
