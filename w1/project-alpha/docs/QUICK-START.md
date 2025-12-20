# Project Alpha - 快速开始指南

本指南将帮助您快速设置和运行 Project Alpha 项目。

## 前置要求

在开始之前，请确保您的系统已安装以下软件：

- **Node.js** v18.0.0 或更高版本
- **MySQL** v8.0 或更高版本
- **npm** 或 **yarn** 包管理器
- **Git**

## 安装步骤

### 1. 克隆或下载项目

如果您还没有项目代码，请先获取：

```bash
cd w1/project-alpha
```

### 2. 安装 MySQL 并启动服务

#### macOS（使用 Homebrew）
```bash
brew install mysql
brew services start mysql
```

#### Linux（Ubuntu/Debian）
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

#### Windows
下载并安装 [MySQL Installer](https://dev.mysql.com/downloads/installer/)

### 3. 初始化数据库

#### 方法 1：直接执行 SQL 脚本

```bash
# 登录 MySQL（会提示输入密码）
mysql -u root -p

# 在 MySQL 命令行中执行
source database/init.sql

# 或者退出 MySQL 后直接执行
mysql -u root -p < database/init.sql
```

#### 方法 2：手动创建

```bash
# 登录 MySQL
mysql -u root -p

# 复制 database/init.sql 中的 SQL 语句并执行
```

验证数据库创建成功：

```sql
USE ticket_manager;
SHOW TABLES;
-- 应该看到: tickets, tags, ticket_tags
```

### 4. 配置后端

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填写您的数据库密码
# 使用任意文本编辑器打开 .env
nano .env  # 或 vim .env 或 code .env
```

编辑 `.env` 文件，修改以下内容：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # 修改为您的 MySQL 密码
DB_NAME=ticket_manager
DB_PORT=3306

PORT=3000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

### 5. 启动后端服务

```bash
# 在 backend 目录下
npm run dev
```

您应该看到类似的输出：

```
🚀 Server is running on http://localhost:3000
📝 Environment: development
🔗 Frontend URL: http://localhost:5173
✅ Database connected successfully
```

测试后端是否正常运行：

```bash
# 在新的终端窗口中
curl http://localhost:3000/api/health
```

应该返回：

```json
{
  "success": true,
  "message": "Project Alpha API is running",
  "timestamp": "2025-12-20T..."
}
```

### 6. 配置前端

```bash
# 打开新的终端窗口
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

（可选）如果 API 地址不是默认的 localhost:3000，创建 `.env` 文件：

```bash
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### 7. 启动前端应用

```bash
# 在 frontend 目录下
npm run dev
```

您应该看到类似的输出：

```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 8. 访问应用

打开浏览器，访问：

```
http://localhost:5173
```

您应该看到 Project Alpha 的欢迎页面。

## 验证安装

### 检查后端

1. 访问健康检查端点：
   ```bash
   curl http://localhost:3000/api/health
   ```

2. 检查数据库连接：
   - 后端启动时应该显示 "✅ Database connected successfully"

### 检查前端

1. 浏览器访问 http://localhost:5173
2. 应该看到没有 console 错误
3. 页面正常显示

### 检查数据库

```bash
mysql -u root -p

USE ticket_manager;
SELECT * FROM tickets;
SELECT * FROM tags;
```

应该能看到示例数据。

## 常见问题

### 问题 1：数据库连接失败

**错误信息：** `❌ Database connection failed: Access denied for user 'root'@'localhost'`

**解决方案：**
1. 检查 `.env` 文件中的数据库密码是否正确
2. 确认 MySQL 服务是否正在运行
3. 尝试使用 MySQL 命令行登录验证密码

### 问题 2：端口被占用

**错误信息：** `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案：**
1. 更改后端端口：在 `.env` 中修改 `PORT=3001`
2. 或者停止占用该端口的进程：
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### 问题 3：前端无法连接后端

**错误信息：** 浏览器 Console 显示 CORS 错误或网络错误

**解决方案：**
1. 确认后端正在运行（访问 http://localhost:3000/api/health）
2. 检查 Vite 代理配置（vite.config.ts）
3. 检查后端 CORS 配置（src/app.ts）

### 问题 4：npm install 失败

**解决方案：**
1. 清除 npm 缓存：
   ```bash
   npm cache clean --force
   ```
2. 删除 node_modules 和重新安装：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. 尝试使用镜像源：
   ```bash
   npm install --registry=https://registry.npmmirror.com
   ```

### 问题 5：TypeScript 编译错误

**解决方案：**
1. 确认 Node.js 版本 >= 18
2. 清理并重新构建：
   ```bash
   # 后端
   rm -rf dist
   npm run build
   
   # 前端
   rm -rf dist
   npm run build
   ```

## 开发工具推荐

### IDE / 编辑器
- **VS Code**（推荐）
  - 插件：ESLint, Prettier, TypeScript, Tailwind CSS IntelliSense

### API 测试工具
- **Thunder Client**（VS Code 插件）
- **Postman**
- **Insomnia**

### 数据库管理工具
- **DBeaver**（推荐，免费）
- **MySQL Workbench**
- **TablePlus**
- **Sequel Pro**（仅 macOS）

## 下一步

现在您已经成功运行了 Project Alpha！

### Phase 1 已完成 ✅
- 项目结构搭建完成
- 数据库初始化完成
- 后端基础配置完成
- 前端基础配置完成

### 接下来：Phase 2（后端 API 开发）
Phase 2 将实现完整的后端 API，包括：
- Ticket CRUD 操作
- Tag 管理
- 搜索和筛选功能

查看实施计划了解更多：`../../specs/w1/0002-implementation-plan.md`

## 获取帮助

- **项目文档：** 查看 `README.md`
- **实施计划：** 查看 `../../specs/w1/0002-implementation-plan.md`
- **需求文档：** 查看 `../../specs/w1/0001-specs.md`
- **Phase 1 完成报告：** 查看 `docs/PHASE1-COMPLETED.md`

## 停止服务

### 停止后端
在后端终端按 `Ctrl + C`

### 停止前端
在前端终端按 `Ctrl + C`

### 停止 MySQL
```bash
# macOS
brew services stop mysql

# Linux
sudo systemctl stop mysql
```

---

祝您开发愉快！🚀
