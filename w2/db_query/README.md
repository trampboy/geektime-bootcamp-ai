# 数据库查询工具

数据库查询工具，支持 MySQL 数据库连接管理、元数据查看、SQL 查询执行和自然语言 SQL 生成。

## 项目结构

```
w2/db_query/
├── backend/          # 后端服务 (Express + TypeScript)
├── frontend/         # 前端应用 (React + Vite + TypeScript)
├── data/            # SQLite 数据库存储目录
└── Makefile         # 构建和测试脚本
```

## 快速开始

### 安装依赖

```bash
# 安装所有依赖（后端 + 前端）
make install

# 或分别安装
make install-backend
make install-frontend
```

### 开发模式

```bash
# 同时启动后端和前端开发服务器
make dev

# 或分别启动
make dev-backend    # 后端运行在 http://localhost:3000
make dev-frontend   # 前端运行在 http://localhost:5173
```

### 构建

```bash
# 构建所有项目
make build

# 或分别构建
make build-backend
make build-frontend
```

### 运行测试

```bash
# 运行所有测试
make test

# 运行后端测试
make test-backend

# 运行前端测试
make test-frontend

# 生成测试覆盖率报告
make test-coverage
```

### 代码检查

```bash
# 检查所有代码
make lint

# 或分别检查
make lint-backend
make lint-frontend
```

### 生产环境

```bash
# 启动生产服务器
make start

# 或分别启动
make start-backend
make start-frontend
```

## Makefile 命令参考

| 命令 | 说明 |
|------|------|
| `make help` | 显示所有可用命令 |
| `make install` | 安装所有依赖 |
| `make build` | 构建所有项目 |
| `make dev` | 启动开发服务器 |
| `make test` | 运行所有测试 |
| `make test-coverage` | 生成测试覆盖率报告 |
| `make lint` | 代码检查 |
| `make clean` | 清理构建产物 |
| `make start` | 启动生产服务器 |

## 环境配置

### 后端环境变量

创建 `backend/.env` 文件：

```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
DB_PATH=./data/db_query.db
```

### 前端环境变量

创建 `frontend/.env` 文件（可选）：

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 测试覆盖率

项目包含完整的测试套件，覆盖：

### 后端测试覆盖
- ✅ SQL 解析器工具 (`sql-parser.ts`)
- ✅ 连接字符串解析器 (`connection-parser.ts`)
- ✅ SQLite 服务 (`sqlite.service.ts`)
- ✅ 错误处理中间件 (`error-handler.ts`)
- ✅ API 控制器 (`databases.controller.ts`)

### 前端测试覆盖
- ✅ API 服务 (`api.ts`)
- ✅ 数据库列表组件 (`DatabaseList.tsx`)
- ✅ 查询结果表格组件 (`QueryResultTable.tsx`)

## 技术栈

### 后端
- **运行时**: Node.js LTS
- **框架**: Express.js
- **语言**: TypeScript (strict mode)
- **数据库**: SQLite3 (better-sqlite3), MySQL2
- **测试**: Jest + Supertest
- **SQL 解析**: node-sql-parser
- **AI**: OpenAI SDK

### 前端
- **框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS
- **编辑器**: Monaco Editor
- **测试**: Vitest + React Testing Library

## 开发指南

### 添加新功能

1. 在对应的目录创建文件
2. 编写代码和类型定义
3. 添加单元测试
4. 运行测试确保通过
5. 更新文档

### 代码规范

- 所有代码必须使用 TypeScript strict 模式
- API 响应使用 camelCase 命名
- 使用 ESLint 和 Prettier 格式化代码
- 测试覆盖率目标：> 80%

## 故障排除

### 测试数据库问题

如果测试失败，可能是测试数据库文件被锁定。运行：

```bash
make clean
make test
```

### 端口冲突

如果端口被占用，修改：
- 后端: `backend/.env` 中的 `PORT`
- 前端: `frontend/vite.config.ts` 中的端口配置

## 许可证

ISC
