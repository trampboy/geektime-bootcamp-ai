# 贡献指南

感谢你考虑为本项目做出贡献！

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试要求](#测试要求)

## 行为准则

请确保在参与本项目时保持友好和尊重的态度。

## 如何贡献

### 报告 Bug

1. 在提交新 issue 前，请先搜索现有的 issues
2. 使用 Bug 报告模板创建新 issue
3. 提供详细的复现步骤和环境信息

### 提出功能请求

1. 使用功能请求模板创建新 issue
2. 清晰描述功能的使用场景和价值
3. 如有可能，提供设计稿或原型

### 提交代码

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 开发流程

### 1. 环境准备

```bash
# 安装 Node.js 20+
node --version

# 安装根目录依赖
npm install

# 安装 Backend 依赖
cd w2/db_query/backend
npm install

# 安装 Frontend 依赖
cd ../frontend
npm install
```

### 2. 本地开发

```bash
# 启动 Backend (端口 3000)
cd w2/db_query/backend
npm run dev

# 启动 Frontend (端口 5173)
cd w2/db_query/frontend
npm run dev
```

### 3. 运行测试

```bash
# Backend 测试
cd w2/db_query/backend
npm test
npm run test:coverage

# Frontend 测试
cd w2/db_query/frontend
npm test
npm run test:coverage

# E2E 测试
cd <项目根目录>
npm run test:e2e
```

### 4. 代码检查

```bash
# Backend Lint
cd w2/db_query/backend
npm run lint

# Frontend Lint
cd w2/db_query/frontend
npm run lint
```

## 代码规范

### TypeScript

- 使用 TypeScript 编写所有代码
- 避免使用 `any` 类型
- 为公共 API 提供类型定义
- 使用接口 (interface) 定义对象结构

### 命名规范

- 文件名：kebab-case（如 `user-service.ts`）
- 类名：PascalCase（如 `UserService`）
- 函数/变量：camelCase（如 `getUserById`）
- 常量：UPPER_SNAKE_CASE（如 `MAX_RETRY_COUNT`）

### 代码风格

- 使用 2 空格缩进
- 使用单引号
- 行末不加分号
- 使用 ESLint 和 Prettier 保持代码风格一致

## 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统或依赖更新
- `ci`: CI 配置更新
- `chore`: 其他改动

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 示例

```bash
# 简单提交
git commit -m "feat: add user authentication"

# 带作用域
git commit -m "fix(backend): resolve database connection issue"

# 多行提交
git commit -m "feat(frontend): add dark mode

- Add theme toggle button
- Update color scheme
- Save preference to localStorage

Closes #123"
```

### 作用域

- `backend`: Backend 相关
- `frontend`: Frontend 相关
- `e2e`: E2E 测试
- `deps`: 依赖更新
- `ci`: CI/CD 相关

## 测试要求

### 单元测试

- 所有新功能必须包含单元测试
- 测试覆盖率应保持在 80% 以上
- 测试文件放在 `__tests__` 目录或与源文件同目录

### E2E 测试

- 关键用户流程需要 E2E 测试
- 使用 Playwright 编写测试
- 测试文件放在项目根目录的 `e2e` 目录

### 测试命名

```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when user exists', async () => {
      // 测试代码
    })

    it('should throw error when user not found', async () => {
      // 测试代码
    })
  })
})
```

## Pull Request 流程

### 1. PR 标题

PR 标题必须符合 Conventional Commits 规范：

```
feat(backend): add user authentication
fix(frontend): resolve routing issue
docs: update API documentation
```

### 2. PR 描述

使用 PR 模板填写以下信息：
- 变更说明
- 变更类型
- 相关 Issue
- 测试清单
- 代码检查清单

### 3. CI 检查

PR 必须通过以下检查：
- ✅ Backend 测试和 Lint
- ✅ Frontend 测试和 Lint
- ✅ E2E 测试
- ✅ 代码质量扫描
- ✅ 依赖安全检查

### 4. Code Review

- 至少需要 1 个 reviewer 批准
- 及时响应 review 意见
- 保持 PR 小而专注

### 5. 合并策略

- 使用 Squash and Merge
- 确保提交消息符合规范
- 删除已合并的分支

## 分支策略

### 主要分支

- `main`: 生产环境代码
- `develop`: 开发环境代码

### 特性分支

从 `develop` 创建：
- `feature/功能名`: 新功能开发
- `fix/问题描述`: Bug 修复
- `docs/文档主题`: 文档更新

### 命名规范

```bash
# 功能分支
feature/add-user-authentication
feature/implement-dark-mode

# Bug 修复
fix/resolve-login-error
fix/database-connection-timeout

# 文档更新
docs/update-api-documentation
docs/add-contributing-guide
```

## 发布流程

### 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

- MAJOR: 不兼容的 API 修改
- MINOR: 向后兼容的功能新增
- PATCH: 向后兼容的问题修正

### 发布步骤

1. 更新版本号
2. 更新 CHANGELOG
3. 创建 Git 标签
4. 推送标签触发自动发布

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# GitHub Actions 会自动：
# - 运行所有测试
# - 构建 Backend 和 Frontend
# - 创建 GitHub Release
# - 上传构建产物
```

## 获取帮助

- 📖 阅读项目文档
- 💬 在 Discussions 中提问
- 🐛 在 Issues 中报告问题
- 📧 联系维护者

## 许可证

通过贡献代码，你同意你的贡献将在与本项目相同的许可证下授权。

---

再次感谢你的贡献！ 🎉
