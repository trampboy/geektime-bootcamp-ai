# geektime-bootcamp-ai

AI 编程实战课练习

[![CI](https://github.com/trampboy/geektime-bootcamp-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/trampboy/geektime-bootcamp-ai/actions/workflows/ci.yml)
[![CodeQL](https://github.com/trampboy/geektime-bootcamp-ai/actions/workflows/codeql.yml/badge.svg)](https://github.com/trampboy/geektime-bootcamp-ai/actions/workflows/codeql.yml)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

## 📋 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [测试](#测试)
- [CI/CD](#cicd)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 项目简介

这是极客时间 AI 编程实战课的练习项目，包含多个学习模块和实战项目。

主要项目：
- **Week 2: 数据库查询工具** - 一个支持自然语言转 SQL 的数据库查询工具

## 技术栈

### Backend
- Node.js 20+
- TypeScript
- Express.js
- SQLite & MySQL
- OpenAI API

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Monaco Editor

### 测试
- Jest (Backend)
- Vitest (Frontend)
- Playwright (E2E)

### CI/CD
- GitHub Actions
- Dependabot
- CodeQL

## 快速开始

### 前置要求

- Node.js 20.x 或更高版本
- npm 10.x 或更高版本

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/trampboy/geektime-bootcamp-ai.git
cd geektime-bootcamp-ai

# 安装根目录依赖（用于 E2E 测试）
npm install

# 安装 Backend 依赖
cd w2/db_query/backend
npm install

# 安装 Frontend 依赖
cd ../frontend
npm install
```

### 配置环境变量

```bash
# Backend 环境变量
cd w2/db_query/backend
cp .env.example .env
# 编辑 .env 文件，填入必要的配置（如 OPENAI_API_KEY）
```

### 启动开发服务器

```bash
# 启动 Backend（在 w2/db_query/backend 目录）
npm run dev
# Backend 运行在 http://localhost:3000

# 启动 Frontend（在 w2/db_query/frontend 目录）
npm run dev
# Frontend 运行在 http://localhost:5173
```

## 项目结构

```
geektime-bootcamp-ai/
├── .github/                    # GitHub 配置
│   ├── workflows/              # GitHub Actions workflows
│   │   ├── ci.yml             # 持续集成
│   │   ├── codeql.yml         # 代码安全扫描
│   │   ├── pr-checks.yml      # PR 检查
│   │   ├── release.yml        # 自动发布
│   │   ├── dependency-review.yml  # 依赖审查
│   │   ├── auto-merge.yml     # Dependabot 自动合并
│   │   ├── stale.yml          # 过期 issue/PR 管理
│   │   ├── link-check.yml     # 文档链接检查
│   │   └── issue-metrics.yml  # 月度指标报告
│   ├── ISSUE_TEMPLATE/        # Issue 模板
│   │   ├── bug_report.yml     # Bug 报告模板
│   │   └── feature_request.yml # 功能请求模板
│   ├── PULL_REQUEST_TEMPLATE.md  # PR 模板
│   ├── CONTRIBUTING.md        # 贡献指南
│   ├── dependabot.yml         # Dependabot 配置
│   ├── labeler.yml            # 自动标签配置
│   └── markdown-link-check-config.json  # 链接检查配置
├── e2e/                       # E2E 测试
│   ├── add-database.spec.ts
│   ├── main-page.spec.ts
│   ├── navigation.spec.ts
│   └── query-page.spec.ts
├── w2/db_query/               # Week 2 项目：数据库查询工具
│   ├── backend/               # Backend 服务
│   │   ├── src/
│   │   │   ├── api/          # API 控制器
│   │   │   ├── services/     # 业务逻辑
│   │   │   ├── models/       # 数据模型
│   │   │   ├── utils/        # 工具函数
│   │   │   └── __tests__/    # 测试文件
│   │   └── package.json
│   └── frontend/              # Frontend 应用
│       ├── src/
│       │   ├── components/   # React 组件
│       │   ├── pages/        # 页面
│       │   ├── services/     # API 服务
│       │   └── __tests__/    # 测试文件
│       └── package.json
├── playwright.config.ts       # Playwright 配置
└── package.json               # 根项目配置
```

## 开发指南

### 代码规范

本项目使用 ESLint 和 Prettier 进行代码格式化和规范检查：

```bash
# Backend Lint
cd w2/db_query/backend
npm run lint

# Frontend Lint
cd w2/db_query/frontend
npm run lint
```

### 提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 格式
<type>(<scope>): <subject>

# 示例
feat(backend): add user authentication
fix(frontend): resolve routing issue
docs: update API documentation
```

类型说明：
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

## 测试

### Backend 测试

```bash
cd w2/db_query/backend

# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### Frontend 测试

```bash
cd w2/db_query/frontend

# 运行所有测试
npm test

# UI 模式
npm run test:ui

# 生成覆盖率报告
npm run test:coverage
```

### E2E 测试

```bash
# 在项目根目录运行

# 运行所有 E2E 测试
npm run test:e2e

# UI 模式
npm run test:e2e:ui

# 调试模式
npm run test:e2e:debug

# 查看测试报告
npm run test:e2e:report
```

## CI/CD

### 自动化流程

本项目配置了完善的 CI/CD 流程：

#### 1. 持续集成 (CI)
- ✅ **Backend 测试和 Lint** - 自动运行 Jest 测试和 ESLint 检查
- ✅ **Frontend 测试和 Lint** - 自动运行 Vitest 测试和 ESLint 检查
- ✅ **E2E 测试** - 使用 Playwright 运行端到端测试
- ✅ **构建验证** - 验证 Backend 和 Frontend 可以成功构建
- ✅ **代码覆盖率** - 自动上传到 Codecov

#### 2. 代码质量
- 🔍 **CodeQL 扫描** - 自动检测安全漏洞和代码质量问题
- 🔍 **依赖审查** - PR 中自动审查依赖变更和许可证
- 🔍 **链接检查** - 定期检查文档中的失效链接

#### 3. PR 自动化
- 📊 **PR 大小检查** - 自动标记 PR 大小
- 📊 **PR 标题验证** - 验证提交消息符合规范
- 📊 **自动标签** - 根据文件变更自动添加标签
- 📊 **冲突检测** - 检测合并冲突
- 📊 **描述检查** - 确保 PR 描述足够详细

#### 4. 依赖管理
- 🤖 **Dependabot** - 自动创建依赖更新 PR
- 🤖 **自动合并** - 自动批准和合并小版本更新
- 🤖 **分组更新** - 按生产和开发依赖分组

#### 5. 维护自动化
- 🧹 **过期 Issue/PR 管理** - 自动标记和关闭长期未活动的 issue 和 PR
- 📈 **月度指标报告** - 自动生成项目健康度指标

#### 6. 自动发布
- 🚀 **自动构建** - 当推送版本标签时自动构建
- 🚀 **创建 Release** - 自动创建 GitHub Release
- 🚀 **生成变更日志** - 自动生成版本变更说明
- 🚀 **上传产物** - 自动上传构建产物

### 触发条件

| Workflow | 触发条件 | 说明 |
|----------|---------|------|
| CI | Push/PR to main/develop | 运行所有测试和检查 |
| CodeQL | Push/PR to main/develop, 每周一 | 安全扫描 |
| PR Checks | 打开 PR, 更新 PR | PR 验证 |
| Dependency Review | PR to main/develop | 依赖审查 |
| Auto Merge | Dependabot PR | 自动合并小更新 |
| Release | 推送 v*.*.* 标签 | 自动发布 |
| Link Check | 修改 Markdown 文件, 每周日 | 检查链接 |
| Stale | 每天 | 管理过期 issue/PR |
| Issue Metrics | 每月 1 号 | 生成指标报告 |

### 创建新版本发布

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "chore: prepare for release v1.0.0"

# 2. 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 3. 推送标签
git push origin v1.0.0

# 4. GitHub Actions 会自动：
#    - 运行所有测试
#    - 构建 Backend 和 Frontend
#    - 创建 GitHub Release
#    - 生成变更日志
#    - 上传构建产物
```

### 状态检查

你可以在 [Actions 页面](https://github.com/trampboy/geektime-bootcamp-ai/actions) 查看所有 workflow 的运行状态。

## GitHub 自动化

本项目配置了完善的 GitHub 自动化流程，包括 CI/CD、代码质量检查、依赖管理等。

### 🚀 快速开始

- [快速开始指南](.github/QUICK_START.md) - 5 分钟配置指南
- [自动化总结](.github/AUTOMATION_SUMMARY.md) - 完整的自动化配置说明
- [仓库设置](.github/SETUP.md) - 详细的 GitHub 设置指南

### 🔧 验证配置

```bash
# 运行验证脚本
./scripts/setup-github.sh
```

### 📊 已配置的自动化

- ✅ 持续集成 (CI)
- ✅ 代码安全扫描 (CodeQL)
- ✅ PR 自动化检查
- ✅ 依赖自动更新 (Dependabot)
- ✅ 自动发布流程
- ✅ 代码覆盖率报告
- ✅ 文档链接检查
- ✅ 月度指标报告

详见 [.github](.github/) 目录。

## 贡献指南

我们欢迎所有形式的贡献！请阅读 [CONTRIBUTING.md](.github/CONTRIBUTING.md) 了解详细的贡献指南。

### 快速开始

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交改动 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### PR 要求

- ✅ 通过所有 CI 检查
- ✅ 包含适当的测试
- ✅ 更新相关文档
- ✅ 遵循代码规范
- ✅ 提交消息符合规范

## 许可证

ISC License

---

## 相关链接

- [GitHub Repository](https://github.com/trampboy/geektime-bootcamp-ai)
- [贡献指南](.github/CONTRIBUTING.md)
- [变更日志](CHANGELOG.md)
- [问题反馈](https://github.com/trampboy/geektime-bootcamp-ai/issues)

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/trampboy/geektime-bootcamp-ai/issues)
- 参与 [Discussions](https://github.com/trampboy/geektime-bootcamp-ai/discussions)
