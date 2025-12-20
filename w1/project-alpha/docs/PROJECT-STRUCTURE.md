# Project Alpha - 项目结构说明

## 完整的目录结构

```
project-alpha/
├── .gitignore                    # Git 忽略文件配置
├── README.md                     # 项目主文档
│
├── backend/                      # 后端服务
│   ├── .env.example              # 环境变量模板
│   ├── .gitignore                # 后端 Git 忽略配置
│   ├── README.md                 # 后端文档
│   ├── package.json              # 后端依赖配置
│   ├── tsconfig.json             # TypeScript 配置
│   └── src/                      # 后端源代码
│       ├── app.ts                # Express 应用入口
│       ├── config/               # 配置文件目录
│       │   └── database.ts       # 数据库连接配置
│       ├── controllers/          # 控制器目录（Phase 2）
│       ├── middlewares/          # 中间件目录（Phase 2）
│       ├── models/               # 数据模型目录（Phase 2）
│       ├── routes/               # 路由目录（Phase 2）
│       ├── services/             # 业务逻辑目录（Phase 2）
│       ├── types/                # TypeScript 类型定义
│       │   └── index.ts          # 核心类型定义
│       └── utils/                # 工具函数目录
│           └── response.ts       # API 响应工具
│
├── frontend/                     # 前端应用
│   ├── .gitignore                # 前端 Git 忽略配置
│   ├── README.md                 # 前端文档
│   ├── components.json           # Shadcn/ui 配置
│   ├── index.html                # HTML 入口
│   ├── package.json              # 前端依赖配置
│   ├── postcss.config.js         # PostCSS 配置
│   ├── tailwind.config.js        # Tailwind CSS 配置
│   ├── tsconfig.json             # TypeScript 配置
│   ├── tsconfig.node.json        # Node 环境 TS 配置
│   ├── vite.config.ts            # Vite 配置
│   └── src/                      # 前端源代码
│       ├── App.tsx               # 应用主组件
│       ├── main.tsx              # React 入口
│       ├── index.css             # 全局样式
│       ├── components/           # React 组件目录
│       │   ├── layout/           # 布局组件（Phase 3）
│       │   ├── ticket/           # Ticket 组件（Phase 4）
│       │   ├── tag/              # Tag 组件（Phase 4）
│       │   └── ui/               # Shadcn/ui 组件（Phase 3）
│       ├── hooks/                # 自定义 Hooks（Phase 3）
│       ├── services/             # API 服务层
│       │   └── api.ts            # Axios 配置
│       ├── store/                # 状态管理（Phase 3）
│       ├── types/                # TypeScript 类型定义
│       │   └── index.ts          # 核心类型定义
│       └── utils/                # 工具函数目录
│           ├── cn.ts             # 类名合并工具
│           ├── constants.ts      # 常量定义
│           └── format.ts         # 格式化工具
│
├── database/                     # 数据库脚本
│   └── init.sql                  # 数据库初始化脚本
│
└── docs/                         # 项目文档
    ├── PHASE1-COMPLETED.md       # Phase 1 完成报告
    ├── PROJECT-STRUCTURE.md      # 项目结构说明（本文档）
    └── QUICK-START.md            # 快速开始指南
```

## 文件说明

### 根目录

| 文件 | 说明 |
|------|------|
| `.gitignore` | 项目级别的 Git 忽略配置 |
| `README.md` | 项目主文档，包含项目简介、技术栈、快速开始等 |

### Backend（后端）

#### 配置文件

| 文件 | 说明 | Phase |
|------|------|-------|
| `.env.example` | 环境变量模板 | 1 ✅ |
| `.gitignore` | 后端 Git 忽略规则 | 1 ✅ |
| `package.json` | 依赖包配置和脚本 | 1 ✅ |
| `tsconfig.json` | TypeScript 编译配置 | 1 ✅ |
| `README.md` | 后端详细文档 | 1 ✅ |

#### 源代码

| 文件/目录 | 说明 | Phase |
|----------|------|-------|
| `src/app.ts` | Express 应用入口，包含基础中间件 | 1 ✅ |
| `src/config/database.ts` | 数据库连接池配置 | 1 ✅ |
| `src/types/index.ts` | 核心类型定义 | 1 ✅ |
| `src/utils/response.ts` | API 统一响应格式工具 | 1 ✅ |
| `src/controllers/` | 控制器层（待实现） | 2 ⏳ |
| `src/services/` | 业务逻辑层（待实现） | 2 ⏳ |
| `src/routes/` | 路由配置（待实现） | 2 ⏳ |
| `src/middlewares/` | 中间件（待实现） | 2 ⏳ |
| `src/models/` | 数据模型（待实现） | 2 ⏳ |

#### 依赖包

**生产依赖：**
- `express` - Web 框架
- `mysql2` - MySQL 客户端
- `cors` - CORS 中间件
- `dotenv` - 环境变量加载

**开发依赖：**
- `typescript` - TypeScript 编译器
- `@types/node` - Node.js 类型定义
- `@types/express` - Express 类型定义
- `@types/cors` - CORS 类型定义
- `ts-node` - TypeScript 执行器
- `nodemon` - 开发服务器热重载

### Frontend（前端）

#### 配置文件

| 文件 | 说明 | Phase |
|------|------|-------|
| `.gitignore` | 前端 Git 忽略规则 | 1 ✅ |
| `components.json` | Shadcn/ui 配置 | 1 ✅ |
| `index.html` | HTML 入口模板 | 1 ✅ |
| `package.json` | 依赖包配置和脚本 | 1 ✅ |
| `postcss.config.js` | PostCSS 配置 | 1 ✅ |
| `tailwind.config.js` | Tailwind CSS 主题配置 | 1 ✅ |
| `tsconfig.json` | TypeScript 编译配置 | 1 ✅ |
| `tsconfig.node.json` | Node 环境 TS 配置 | 1 ✅ |
| `vite.config.ts` | Vite 构建配置 | 1 ✅ |
| `README.md` | 前端详细文档 | 1 ✅ |

#### 源代码

| 文件/目录 | 说明 | Phase |
|----------|------|-------|
| `src/App.tsx` | 应用主组件 | 1 ✅ |
| `src/main.tsx` | React 渲染入口 | 1 ✅ |
| `src/index.css` | 全局样式和 Tailwind 导入 | 1 ✅ |
| `src/types/index.ts` | 核心类型定义 | 1 ✅ |
| `src/services/api.ts` | Axios 实例和拦截器 | 1 ✅ |
| `src/utils/cn.ts` | Tailwind 类名合并工具 | 1 ✅ |
| `src/utils/constants.ts` | 常量定义 | 1 ✅ |
| `src/utils/format.ts` | 日期格式化工具 | 1 ✅ |
| `src/components/layout/` | 布局组件（待实现） | 3 ⏳ |
| `src/components/ticket/` | Ticket 组件（待实现） | 4 ⏳ |
| `src/components/tag/` | Tag 组件（待实现） | 4 ⏳ |
| `src/components/ui/` | Shadcn/ui 组件（待实现） | 3 ⏳ |
| `src/hooks/` | 自定义 Hooks（待实现） | 3 ⏳ |
| `src/store/` | 状态管理（待实现） | 3 ⏳ |

#### 依赖包

**生产依赖：**
- `react` - React 框架
- `react-dom` - React DOM 渲染器
- `axios` - HTTP 客户端
- `lucide-react` - 图标库
- `class-variance-authority` - 类变体工具
- `clsx` - 类名合并
- `tailwind-merge` - Tailwind 类名合并

**开发依赖：**
- `typescript` - TypeScript 编译器
- `vite` - 构建工具
- `@vitejs/plugin-react` - React 插件
- `@types/react` - React 类型定义
- `@types/react-dom` - React DOM 类型定义
- `tailwindcss` - CSS 框架
- `tailwindcss-animate` - Tailwind 动画插件
- `autoprefixer` - CSS 前缀自动添加
- `postcss` - CSS 处理器
- `eslint` - 代码检查
- `@typescript-eslint/*` - TypeScript ESLint 插件

### Database（数据库）

| 文件 | 说明 | Phase |
|------|------|-------|
| `init.sql` | 数据库初始化脚本 | 1 ✅ |

**包含内容：**
- 数据库创建语句
- `tickets` 表结构
- `tags` 表结构
- `ticket_tags` 关联表结构
- 索引定义
- 外键约束
- 示例测试数据

### Docs（文档）

| 文件 | 说明 | Phase |
|------|------|-------|
| `PHASE1-COMPLETED.md` | Phase 1 完成报告 | 1 ✅ |
| `PROJECT-STRUCTURE.md` | 项目结构说明（本文档） | 1 ✅ |
| `QUICK-START.md` | 快速开始指南 | 1 ✅ |

## 开发阶段进度

### Phase 1: 环境搭建与数据库设计 ✅

**状态：** 已完成  
**完成时间：** 2025-12-20

**交付物：**
- ✅ 完整的项目目录结构
- ✅ 数据库设计和初始化脚本
- ✅ 后端项目配置（TypeScript, Express, MySQL）
- ✅ 前端项目配置（React, TypeScript, Vite, Tailwind）
- ✅ 基础工具函数和类型定义
- ✅ 完整的项目文档

### Phase 2: 后端 API 开发 ⏳

**状态：** 待开始  
**预计时间：** 3-4 天

**主要任务：**
- Service 层实现（TicketService, TagService）
- Controller 层实现（TicketController, TagController）
- 路由配置
- 中间件实现（验证、错误处理）
- API 测试

### Phase 3: 前端基础架构 ⏳

**状态：** 待开始  
**预计时间：** 2-3 天

**主要任务：**
- Shadcn/ui 组件安装
- 布局组件开发
- 状态管理实现
- 自定义 Hooks
- API 服务层完善

### Phase 4: 前端功能实现 ⏳

**状态：** 待开始  
**预计时间：** 4-5 天

**主要任务：**
- Ticket 管理界面
- Tag 管理界面
- 搜索和筛选功能
- 用户交互优化
- 响应式设计

### Phase 5: 集成测试与优化 ⏳

**状态：** 待开始  
**预计时间：** 2-3 天

**主要任务：**
- 前后端联调
- 功能测试
- 性能优化
- 用户体验优化
- 文档完善

## 技术架构

### 后端架构

```
┌─────────────────────────────────────┐
│          Express.js App              │
├─────────────────────────────────────┤
│  Routes → Controllers → Services     │
│                ↓                     │
│           MySQL Pool                 │
└─────────────────────────────────────┘
```

**层次说明：**
- **Routes 层：** 定义 API 端点和路由规则
- **Controllers 层：** 处理请求和响应
- **Services 层：** 业务逻辑和数据库操作
- **Middlewares：** 请求拦截和处理

### 前端架构

```
┌─────────────────────────────────────┐
│         React Components             │
├─────────────────────────────────────┤
│  Components → Hooks → Services       │
│                ↓                     │
│            Axios API                 │
└─────────────────────────────────────┘
```

**层次说明：**
- **Components 层：** UI 组件
- **Hooks 层：** 自定义业务逻辑 Hooks
- **Services 层：** API 调用封装
- **Store：** 全局状态管理

## 代码规范

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名（组件） | PascalCase | `TicketCard.tsx` |
| 文件名（工具） | camelCase | `formatDate.ts` |
| 变量/函数 | camelCase | `getUserData()` |
| 类/组件 | PascalCase | `TicketService` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 接口/类型 | PascalCase | `Ticket`, `ApiResponse` |

### TypeScript 规范

- ✅ 使用严格模式 (`strict: true`)
- ✅ 避免使用 `any` 类型
- ✅ 为函数添加返回类型
- ✅ 为对象使用 interface 定义
- ✅ 使用可选链 (`?.`) 和空值合并 (`??`)

### 样式规范

- ✅ 使用 Tailwind CSS 工具类
- ✅ 遵循响应式设计原则
- ✅ 使用 Shadcn/ui 组件保持一致性
- ✅ 避免内联样式

## 下一步行动

1. **安装依赖**
   ```bash
   # 后端
   cd backend && npm install
   
   # 前端
   cd frontend && npm install
   ```

2. **配置环境**
   - 初始化数据库（执行 `database/init.sql`）
   - 配置 `.env` 文件

3. **启动开发**
   ```bash
   # 后端
   cd backend && npm run dev
   
   # 前端
   cd frontend && npm run dev
   ```

4. **开始 Phase 2 开发**
   - 实现 Service 层
   - 实现 Controller 层
   - 配置路由

## 相关文档

- [项目主文档](../README.md)
- [后端文档](../backend/README.md)
- [前端文档](../frontend/README.md)
- [快速开始指南](./QUICK-START.md)
- [Phase 1 完成报告](./PHASE1-COMPLETED.md)
- [需求文档](../../../specs/w1/0001-specs.md)
- [实施计划](../../../specs/w1/0002-implementation-plan.md)

---

**最后更新：** 2025-12-20  
**当前阶段：** Phase 1 已完成 ✅
