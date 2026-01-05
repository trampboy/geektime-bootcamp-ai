# GitHub Workflows 完整使用指南

本文档详细介绍项目中所有 GitHub Actions workflows 的作用、配置和使用方法。

---

## 📑 目录

- [Workflows 概览](#workflows-概览)
- [1. ci.yml - 持续集成](#1-ciyml---持续集成)
- [2. pr-checks.yml - PR 质量检查](#2-pr-checksyml---pr-质量检查)
- [3. release.yml - 自动发布](#3-releaseyml---自动发布)
- [4. codeql.yml - 安全扫描](#4-codeqlyml---安全扫描)
- [5. dependency-review.yml - 依赖审查](#5-dependency-reviewyml---依赖审查)
- [6. link-check.yml - 文档链接检查](#6-link-checkyml---文档链接检查)
- [7. claude.yml - Claude AI 助手](#7-claudeyml---claude-ai-助手)
- [8. claude-code-review.yml - AI 代码审查](#8-claude-code-reviewyml---ai-代码审查)
- [9. auto-merge.yml - 自动合并](#9-auto-mergeyml---自动合并)
- [配置清单](#配置清单)
- [最佳实践](#最佳实践)

---

## Workflows 概览

| Workflow | 触发方式 | 自动/手动 | 需要配置 | 重要性 |
|----------|---------|----------|---------|--------|
| ci.yml | Push/PR | 自动 | CODECOV_TOKEN (可选) | ⭐⭐⭐⭐⭐ |
| pr-checks.yml | PR 创建/更新 | 自动 | labeler.yml (可选) | ⭐⭐⭐⭐ |
| release.yml | 推送 tag | 自动 | 无 | ⭐⭐⭐⭐ |
| codeql.yml | Push/PR/定时 | 自动 | 无 | ⭐⭐⭐⭐ |
| dependency-review.yml | PR | 自动 | 无 | ⭐⭐⭐⭐ |
| link-check.yml | MD文件/定时 | 自动 | config.json | ⭐⭐⭐ |
| claude.yml | @claude | 手动 | CLAUDE_TOKEN | ⭐⭐⭐ |
| claude-code-review.yml | PR | 自动 | CLAUDE_TOKEN | ⭐⭐ |
| auto-merge.yml | Dependabot PR | 自动 | dependabot.yml | ⭐⭐⭐ |

---

## 1. ci.yml - 持续集成

### 🎯 作用
自动测试和构建前后端代码，确保每次提交都不会破坏项目。

### ⚡ 触发时机
```yaml
on:
  push:
    branches: [main, develop, 'feature/**']  # 推送到这些分支
  pull_request:
    branches: [main, develop]  # 创建 PR 到这些分支
```

### 📋 执行流程

#### Job 1: backend-test
1. ✅ 安装 Node.js 20 和依赖（使用 npm ci）
2. 🔍 运行 ESLint 检查代码规范
3. 🧪 运行测试并生成覆盖率报告
4. 📊 上传覆盖率到 Codecov
5. 🏗️ 构建项目

#### Job 2: frontend-test
与 backend 相同流程，针对前端代码。

#### Job 3: e2e-test
1. 🚀 启动后端服务（端口 3000）
2. 🌐 启动前端服务（端口 4173）
3. 等待服务就绪
4. 🎭 运行 Playwright E2E 测试
5. 📸 保存测试截图和报告
6. 🧹 清理服务

#### Job 4 & 5: ci-success / ci-failure
汇总所有测试结果，显示 CI 状态。

### 💡 使用方法

#### 自动运行
只要你推送代码就会自动触发：

```bash
git push origin main
# CI 会自动运行所有测试
```

#### 查看结果
1. 去 GitHub 仓库 → **Actions** 标签
2. 找到你的 commit 对应的 workflow run
3. 查看每个 job 的日志和测试结果

#### 本地验证（推送前测试）
```bash
# Backend 测试
cd w2/db_query/backend
npm run lint        # 检查代码规范
npm run test        # 运行测试
npm run build       # 构建

# Frontend 测试
cd ../frontend
npm run lint
npm run test
npm run build

# E2E 测试
cd ../../..
npm run test:e2e
```

### 🔧 配置

#### 必需
- 无（开箱即用）

#### 可选
- **CODECOV_TOKEN**: 用于上传代码覆盖率报告
  - 去 https://codecov.io 注册
  - 添加仓库并获取 token
  - 在 GitHub Settings → Secrets 中添加

### 🐛 常见问题

**Q: CI 失败了怎么办？**
```bash
# 1. 查看失败的 job 日志
# 2. 本地复现问题
# 3. 修复后重新推送
git add .
git commit -m "fix: resolve CI issues"
git push
```

**Q: 测试覆盖率不足？**
- 为新功能添加单元测试
- 确保覆盖率 > 80%

---

## 2. pr-checks.yml - PR 质量检查

### 🎯 作用
在 PR 中自动检查标题格式、大小、冲突和描述质量，确保代码审查效率。

### ⚡ 触发时机
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened, edited]
```

### 📋 检查项目

#### 1. PR 标题检查
必须符合 **Conventional Commits** 格式：

**正确格式示例**：
```bash
✅ feat: add user login
✅ fix(backend): resolve database connection
✅ docs: update README
✅ refactor(frontend): optimize rendering
```

**错误格式示例**：
```bash
❌ Add user login         # 缺少类型
❌ Feat: add login       # 首字母不应大写
❌ feat: Add login.      # 描述首字母不应大写，不应有句号
```

**允许的类型**：
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档更新
- `style` - 代码格式（不影响功能）
- `refactor` - 代码重构
- `perf` - 性能优化
- `test` - 测试相关
- `build` - 构建系统
- `ci` - CI 配置
- `chore` - 其他改动

**允许的作用域（可选）**：
- `backend` - Backend 相关
- `frontend` - Frontend 相关
- `e2e` - E2E 测试
- `deps` - 依赖更新
- `ci` - CI/CD

#### 2. PR 大小检查
自动计算变更行数并添加标签：

- 🟢 `size/XS` - < 100 行：非常小的 PR，易于审查
- 🟢 `size/S` - < 300 行：小型 PR，易于审查
- 🟡 `size/M` - < 600 行：中等大小的 PR
- 🟠 `size/L` - < 1000 行：较大的 PR，建议拆分
- 🔴 `size/XL` - ≥ 1000 行：非常大的 PR，强烈建议拆分

会自动在 PR 中添加评论显示变更统计。

#### 3. 合并冲突检查
检测 PR 是否与目标分支存在合并冲突：
- ✅ 无冲突：继续
- ❌ 有冲突：提示解决冲突

#### 4. 自动标签
根据修改的文件自动添加标签（需要配置 `.github/labeler.yml`）。

#### 5. PR 描述检查
确保 PR 描述至少 30 字符，如果过短会提示添加：
- 🎯 改动目的
- 📝 主要变更
- ✅ 测试计划
- 📸 截图（如适用）

### 💡 使用方法

#### 创建符合规范的 PR

**1. 创建特性分支**
```bash
# 根据变更类型命名分支
git checkout -b feat/add-user-auth
git checkout -b fix/database-connection
git checkout -b docs/update-readme
```

**2. 提交代码**
```bash
# 使用规范的 commit message
git commit -m "feat: add user authentication system"
git commit -m "fix(backend): resolve null pointer in query"
```

**3. 推送并创建 PR**
```bash
git push origin feat/add-user-auth
```

**4. 在 GitHub 上创建 PR**

**PR 标题**：
```
feat: add user authentication system
```

**PR 描述模板**：
```markdown
## 🎯 改动目的
添加基于 JWT 的用户认证系统，支持登录、注销和 token 刷新功能。

## 📝 主要变更
- [x] 添加 JWT token 生成和验证
- [x] 实现登录/注销接口
- [x] 添加认证中间件
- [x] 更新 API 文档

## ✅ 测试计划
- 单元测试覆盖率 > 80%
- E2E 测试通过
- 手动测试登录流程

## 📸 截图
![Login Page](screenshots/login.png)
```

### 🔧 配置

#### 可选：自动标签配置
创建 `.github/labeler.yml`：

```yaml
backend:
  - 'w2/db_query/backend/**/*'

frontend:
  - 'w2/db_query/frontend/**/*'

e2e:
  - 'e2e/**/*'

documentation:
  - '**/*.md'

ci:
  - '.github/**/*'
```

### 🐛 常见问题

**Q: PR 标题格式不对？**
```bash
# 修改 PR 标题，使用正确的格式
# 在 GitHub PR 页面点击标题编辑
```

**Q: PR 太大怎么办？**
```bash
# 1. 将大 PR 拆分成多个小 PR
# 2. 每个 PR 只做一件事
# 3. 按功能模块拆分
```

---

## 3. release.yml - 自动发布

### 🎯 作用
当你打 tag 时，自动构建项目、生成 changelog 并创建 GitHub Release。

### ⚡ 触发时机
```yaml
on:
  push:
    tags:
      - 'v*.*.*'  # 例如: v1.0.0, v2.1.3
```

### 📋 执行流程
1. 📦 获取版本号（从 tag 中提取）
2. 🏗️ 构建 backend 和 frontend
3. 🗜️ 创建 tar.gz 归档文件
4. 📝 自动生成 changelog（从 git commits）
5. 🚀 创建 GitHub Release
6. 📤 上传构建产物

### 💡 使用方法

#### 发布新版本完整流程

**1. 准备发布**
```bash
# 确保在 main/master 分支
git checkout main
git pull origin main

# 确保所有测试通过
npm test
```

**2. 更新版本号（可选）**
```bash
# 如果项目有 package.json，更新版本号
# 编辑 w2/db_query/backend/package.json
# 编辑 w2/db_query/frontend/package.json
```

**3. 创建版本 commit**
```bash
git add .
git commit -m "chore: bump version to 1.2.0"
git push origin main
```

**4. 创建并推送 tag**
```bash
# 创建 tag（附带说明）
git tag -a v1.2.0 -m "Release version 1.2.0"

# 推送 tag
git push origin v1.2.0

# 或推送所有 tags
git push origin --tags
```

**5. 等待自动发布**
- workflow 会自动运行（约 5-10 分钟）
- 构建完成后会创建 Release
- 查看：GitHub 仓库 → **Releases** 标签

#### 版本号规范（语义化版本 Semantic Versioning）

格式：`vMAJOR.MINOR.PATCH`

- **主版本号 (MAJOR)**: `v1.0.0` → `v2.0.0`
  - 破坏性更新
  - 不兼容的 API 变更
  
- **次版本号 (MINOR)**: `v1.0.0` → `v1.1.0`
  - 新增功能
  - 向后兼容
  
- **补丁版本号 (PATCH)**: `v1.0.0` → `v1.0.1`
  - Bug 修复
  - 向后兼容

**预发布版本**：
- `v1.0.0-alpha.1` - 内部测试版本
- `v1.0.0-beta.1` - 公开测试版本
- `v1.0.0-rc.1` - 发布候选版本

### 📦 生成的产物

Release 中包含：
- `backend-{version}.tar.gz` - Backend 构建文件
- `frontend-{version}.tar.gz` - Frontend 构建文件
- 自动生成的 changelog
- 安装说明

### 🔍 查看和下载 Release

1. GitHub 仓库 → **Releases** 标签
2. 找到对应版本
3. 下载构建产物
4. 查看变更日志

### 🚀 部署 Release

#### Backend 部署
```bash
# 下载并解压
wget https://github.com/user/repo/releases/download/v1.2.0/backend-1.2.0.tar.gz
tar -xzf backend-1.2.0.tar.gz

# 安装依赖
npm install --production

# 启动服务
npm start
```

#### Frontend 部署
```bash
# 下载并解压
wget https://github.com/user/repo/releases/download/v1.2.0/frontend-1.2.0.tar.gz
tar -xzf frontend-1.2.0.tar.gz

# 将 dist 目录部署到 web 服务器
cp -r dist/* /var/www/html/
```

### 🐛 常见问题

**Q: Tag 已经推送但没有触发 release？**
- 检查 tag 格式是否为 `v*.*.*`
- 查看 Actions 标签是否有错误

**Q: 如何删除错误的 release？**
```bash
# 删除 GitHub release（在网页上操作）
# 删除本地 tag
git tag -d v1.2.0

# 删除远程 tag
git push origin :refs/tags/v1.2.0
```

**Q: 如何修改已发布的 release？**
- 在 GitHub Releases 页面点击 "Edit release"
- 可以修改描述、上传新文件

---

## 4. codeql.yml - 安全扫描

### 🎯 作用
使用 GitHub 的 CodeQL 引擎自动扫描代码中的安全漏洞和质量问题。

### ⚡ 触发时机
```yaml
on:
  push:
    branches: [main, develop]       # 推送时扫描
  pull_request:
    branches: [main, develop]       # PR 时扫描
  schedule:
    - cron: '0 2 * * 1'            # 每周一凌晨 2 点定期扫描
```

### 📋 扫描内容

#### 安全漏洞检测
- 🔒 **SQL 注入**: 检测不安全的数据库查询
- 🛡️ **XSS 跨站脚本**: 检测未转义的用户输入
- 💉 **代码注入**: 检测 eval、exec 等危险函数
- 🔑 **硬编码密钥**: 检测代码中的密码、API key
- 📝 **路径遍历**: 检测文件路径注入
- 🌐 **SSRF**: 检测服务器端请求伪造
- 🚨 **其他漏洞**: 根据 OWASP Top 10

#### 代码质量检测
- 📊 代码复杂度
- 🔄 死代码检测
- ⚠️ 潜在的逻辑错误
- 🎯 最佳实践建议

### 💡 使用方法

#### 自动扫描
推送代码或创建 PR 时自动运行，无需手动操作。

```bash
git push origin main
# CodeQL 会自动扫描
```

#### 查看扫描结果

**1. 在 Actions 中查看**
- GitHub 仓库 → **Actions** 标签
- 找到 "CodeQL Security Scan" workflow
- 查看运行日志

**2. 在 Security 中查看（推荐）**
- GitHub 仓库 → **Security** 标签
- 点击 **Code scanning alerts**
- 查看所有发现的安全问题

#### 手动触发扫描
- GitHub 仓库 → Actions
- 选择 "CodeQL Security Scan"
- 点击 "Run workflow"

### 🔧 修复安全漏洞

#### SQL 注入修复示例

**❌ 不安全的代码**：
```javascript
// 直接拼接 SQL
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);
```

**✅ 修复后**：
```javascript
// 使用参数化查询
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

#### XSS 修复示例

**❌ 不安全的代码**：
```javascript
// 直接插入用户输入
element.innerHTML = userInput;
```

**✅ 修复后**：
```javascript
// 使用 textContent 或转义
element.textContent = userInput;
// 或使用 DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);
```

#### 硬编码密钥修复示例

**❌ 不安全的代码**：
```javascript
const apiKey = 'sk_live_abc123xyz';
const dbPassword = 'mypassword123';
```

**✅ 修复后**：
```javascript
// 使用环境变量
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;
```

### 📊 扫描级别

CodeQL 使用两种查询集：
- `security-extended`: 安全相关查询
- `security-and-quality`: 安全 + 代码质量

当前配置使用两者，提供最全面的检测。

### 🔧 配置

#### 当前配置
- 语言：JavaScript, TypeScript
- 查询：security-extended, security-and-quality
- 无需额外配置，开箱即用

#### 自定义配置（可选）
可以创建 `.github/codeql/codeql-config.yml` 自定义扫描规则：

```yaml
name: "Custom CodeQL Config"

queries:
  - uses: security-and-quality

paths-ignore:
  - 'node_modules'
  - 'dist'
  - 'coverage'
```

### 🐛 常见问题

**Q: 误报怎么办？**
- 在 Security → Code scanning alerts 中
- 点击具体的 alert
- 点击 "Dismiss alert" → 选择原因

**Q: 如何抑制特定规则？**
```javascript
// 在代码中添加注释
// lgtm[js/sql-injection]
const query = buildQuery(userInput);
```

---

## 5. dependency-review.yml - 依赖审查

### 🎯 作用
在 PR 中自动检查新增依赖的安全漏洞和许可证合规性，防止引入有问题的依赖。

### ⚡ 触发时机
```yaml
on:
  pull_request:
    branches: [main, develop]
```

### 📋 检查内容

#### 1. 安全漏洞检测
- 检查新增依赖是否有已知的 CVE 漏洞
- 失败阈值：`moderate` 及以上（中等、高危、严重）
- 数据源：GitHub Advisory Database

#### 2. 许可证合规性检查

**✅ 允许的许可证**：
- MIT
- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- ISC
- 0BSD

**❌ 禁止的许可证**：
- GPL-2.0（传染性开源许可证）
- GPL-3.0
- LGPL-2.0
- LGPL-3.0

#### 3. 依赖变更摘要
在 PR 中自动显示：
- 新增的依赖
- 更新的依赖
- 移除的依赖
- 每个依赖的许可证信息

### 💡 使用方法

#### 添加新依赖时自动检查

**1. 添加依赖**
```bash
cd w2/db_query/backend
npm install express

# 或
npm install --save-dev jest
```

**2. 提交并创建 PR**
```bash
git add package.json package-lock.json
git commit -m "feat(deps): add express"
git push origin feat/add-express
```

**3. 在 GitHub 创建 PR**
- Dependency Review 会自动运行
- 在 PR 的 "Files changed" 标签中可以看到依赖变更
- 在 Checks 中查看审查结果

#### 查看审查结果

**通过的情况**：
```
✅ Dependency Review
No vulnerabilities found
All licenses are compliant
```

**失败的情况**：
```
❌ Dependency Review
Found 2 vulnerabilities:
- express@4.16.0 has moderate severity vulnerability
- lodash@4.17.15 has high severity vulnerability

License issues:
- some-package@1.0.0 uses GPL-3.0 (not allowed)
```

### 🔧 处理审查失败

#### 场景 1: 发现安全漏洞

**方案 A: 升级到安全版本**
```bash
# 查看可用版本
npm view express versions

# 升级到安全版本
npm install express@latest

# 或使用 npm audit 修复
npm audit fix
```

**方案 B: 寻找替代包**
```bash
# 移除有漏洞的包
npm uninstall vulnerable-package

# 安装替代方案
npm install secure-alternative
```

#### 场景 2: 许可证不合规

**方案 A: 寻找许可证兼容的替代包**
```bash
# 移除不合规的包
npm uninstall gpl-licensed-package

# 查找 MIT 或 Apache 许可的替代方案
npm install mit-licensed-alternative
```

**方案 B: 申请豁免（需要团队决策）**
- 在 PR 中说明为何需要使用该依赖
- 评估法律风险
- 更新许可证白名单（谨慎）

### 📊 依赖审查报告示例

PR 中会自动添加评论：

```markdown
## Dependency Changes

### Added
- `express@4.18.2` (MIT) ✅
- `dotenv@16.0.3` (BSD-2-Clause) ✅

### Updated
- `typescript`: 4.9.5 → 5.0.0 (Apache-2.0) ✅

### Removed
- `old-package@1.0.0`

### Security
✅ No vulnerabilities found

### License Compliance
✅ All licenses are compliant
```

### 🔧 配置

#### 当前配置
```yaml
fail-on-severity: moderate                    # 中等及以上漏洞会失败
allow-licenses: MIT, Apache-2.0, ...         # 白名单
deny-licenses: GPL-2.0, GPL-3.0, ...         # 黑名单
comment-summary-in-pr: always                 # 总是添加评论
```

#### 自定义配置
如需调整，编辑 `.github/workflows/dependency-review.yml`：

```yaml
- name: Dependency Review
  uses: actions/dependency-review-action@v4
  with:
    fail-on-severity: high           # 只有高危及以上才失败
    allow-licenses: MIT, Apache-2.0  # 只允许这两个许可证
    comment-summary-in-pr: on-failure # 只在失败时评论
```

### 🐛 常见问题

**Q: 如何查看包的许可证？**
```bash
npm view package-name license
# 或
npm ls --depth=0 --json | jq '.dependencies."package-name".license'
```

**Q: 如何处理传递依赖的漏洞？**
```bash
# 查看依赖树
npm ls vulnerable-package

# 尝试升级父依赖
npm update parent-package

# 或使用 overrides (npm 8.3+)
# 在 package.json 中添加：
{
  "overrides": {
    "vulnerable-package": "^safe-version"
  }
}
```

---

## 6. link-check.yml - 文档链接检查

### 🎯 作用
自动检查 Markdown 文档中的链接是否有效，防止文档中出现失效链接。

### ⚡ 触发时机
```yaml
on:
  push:
    branches: [main, develop]
    paths: ['**/*.md']              # 只有 .md 文件变更时
  pull_request:
    paths: ['**/*.md']
  schedule:
    - cron: '0 3 * * 0'             # 每周日凌晨 3 点
  workflow_dispatch:                 # 支持手动触发
```

### 📋 检查内容

- 🔗 **外部链接**: 检查 HTTP/HTTPS 链接是否可访问（200 状态码）
- 📄 **内部文件链接**: 检查相对路径文件是否存在
- 🖼️ **图片链接**: 检查图片 URL 是否有效
- ⚓ **锚点链接**: 检查页内锚点是否存在

### 💡 使用方法

#### 自动检查

修改 Markdown 文件时自动运行：
```bash
# 编辑文档
vim README.md

# 提交
git add README.md
git commit -m "docs: update README"
git push

# link-check 会自动运行
```

#### 手动触发

在 GitHub 上手动运行：
1. 仓库 → **Actions** 标签
2. 选择 **Link Check**
3. 点击 **Run workflow**
4. 选择分支并运行

或使用 GitHub CLI：
```bash
gh workflow run link-check.yml
```

#### 本地检查（推荐）

安装并运行 markdown-link-check：
```bash
# 全局安装
npm install -g markdown-link-check

# 检查单个文件
markdown-link-check README.md

# 检查所有 Markdown 文件
find . -name "*.md" -exec markdown-link-check {} \;
```

### 🔧 配置

#### 配置文件位置
`.github/markdown-link-check-config.json`

#### 当前配置示例
```json
{
  "ignorePatterns": [
    {
      "pattern": "^http://localhost"
    },
    {
      "pattern": "^http://127.0.0.1"
    },
    {
      "pattern": "^https://code.claude.com"
    }
  ],
  "timeout": "20s",
  "retryOn429": true,
  "retryCount": 3,
  "fallbackRetryDelay": "30s",
  "aliveStatusCodes": [200, 206]
}
```

#### 配置说明

**ignorePatterns**: 忽略特定模式的链接
```json
{
  "ignorePatterns": [
    {"pattern": "^http://localhost"},      // 忽略本地链接
    {"pattern": "^https://example.com"},   // 忽略特定域名
    {"pattern": "\\.pdf$"}                 // 忽略 PDF 链接
  ]
}
```

**timeout**: 请求超时时间
```json
{
  "timeout": "20s"  // 20 秒超时
}
```

**retryOn429**: 遇到 429 (Too Many Requests) 时重试
```json
{
  "retryOn429": true,
  "retryCount": 3,
  "fallbackRetryDelay": "30s"
}
```

**aliveStatusCodes**: 认为链接有效的 HTTP 状态码
```json
{
  "aliveStatusCodes": [200, 206, 301, 302]
}
```

### 🔧 处理失效链接

#### 查看检查结果

**成功的情况**：
```
✅ Link Check
All links are valid
```

**失败的情况**：
```
❌ Link Check
Found broken links:
- README.md: https://example.com/dead-link [404]
- docs/API.md: ./nonexistent-file.md [File not found]
```

#### 修复失效链接

**场景 1: 外部链接 404**
```markdown
<!-- 更新为新的 URL -->
- [Old Link](https://old-url.com/page)
+ [New Link](https://new-url.com/page)

<!-- 或使用 Web Archive -->
+ [Archived Link](https://web.archive.org/web/*/old-url.com/page)
```

**场景 2: 内部文件不存在**
```markdown
<!-- 修正文件路径 -->
- [Documentation](./docs/old-name.md)
+ [Documentation](./docs/new-name.md)
```

**场景 3: 临时失效**
```json
// 在配置文件中暂时忽略
{
  "ignorePatterns": [
    {"pattern": "^https://temporarily-down.com"}
  ]
}
```

### 📊 自动创建 Issue

如果链接检查失败，workflow 会自动创建 issue：

```markdown
Title: 📎 发现失效的文档链接

Body:
在文档中发现失效的链接。

请查看 [workflow run](https://github.com/user/repo/actions/runs/12345) 获取详细信息。

Labels: documentation, bug, automated
```

### 🐛 常见问题

**Q: 链接是有效的，但检查失败？**

可能原因：
1. 网站限制爬虫访问
2. 需要认证
3. 网站不稳定

解决方案：
```json
// 添加到 ignorePatterns
{
  "ignorePatterns": [
    {"pattern": "^https://problematic-site.com"}
  ]
}
```

**Q: 如何忽略某个文件中的所有链接？**
```yaml
# 在 workflow 中修改
- name: Check links in Markdown files
  uses: gaurav-nelson/github-action-markdown-link-check@v1
  with:
    exclude-path: |
      node_modules/
      vendor/
      legacy-docs/
```

**Q: 检查太慢怎么办？**
```json
// 减少超时时间和重试次数
{
  "timeout": "10s",
  "retryCount": 1
}
```

---

## 7. claude.yml - Claude AI 助手

### 🎯 作用
在 GitHub Issue 和 PR 中使用 `@claude` 标记来召唤 Claude AI 助手，帮助分析问题、审查代码、生成代码等。

### ⚡ 触发时机
```yaml
on:
  issue_comment:                      # Issue 评论
  pull_request_review_comment:        # PR 代码审查评论
  issues:                             # Issue 创建或分配
  pull_request_review:                # PR 审查
```

**触发条件**: 评论或内容中包含 `@claude`

### 📋 功能特性

- 💬 **理解自然语言**: 用中文或英文与 Claude 对话
- 📖 **访问代码**: 可以读取仓库中的所有代码
- 🔍 **查看 CI 结果**: 可以分析测试失败的原因
- 📝 **生成代码**: 可以直接提交代码更改
- 🛠️ **执行命令**: 可以运行 GitHub CLI 命令
- 📚 **遵循规范**: 会参考项目中的 `CLAUDE.md` 文件

### 💡 使用场景

#### 场景 1: 在 Issue 中请求帮助

```markdown
@claude 请帮我分析这个 bug 的原因并提供修复方案

**错误信息**:
```
TypeError: Cannot read property 'name' of undefined
  at UserService.getUser (user.service.ts:42)
```

**复现步骤**:
1. 访问 /api/users/123
2. 服务器返回 500 错误

**预期行为**:
应该返回用户信息或 404
```

Claude 会：
1. 分析错误堆栈
2. 查看相关代码
3. 找出问题原因
4. 提供修复建议

#### 场景 2: 在 PR 评论中请求代码审查

```markdown
@claude 请审查这段代码，特别关注：
1. 性能问题
2. 安全漏洞
3. 最佳实践

```typescript
export async function processUsers(ids: number[]) {
  for (const id of ids) {
    const user = await db.query('SELECT * FROM users WHERE id = ' + id);
    await sendEmail(user.email);
  }
}
```
```

Claude 会：
1. 发现 SQL 注入漏洞
2. 指出性能问题（N+1 查询）
3. 建议使用批量操作

#### 场景 3: 请求生成代码

```markdown
@claude 请帮我实现一个 JWT 认证中间件

**需求**:
- 验证 Authorization header
- 解析 JWT token
- 将用户信息添加到 request 对象
- 返回 401 如果 token 无效
```

Claude 会：
1. 生成完整的中间件代码
2. 包含错误处理
3. 添加类型定义
4. 提供使用示例

#### 场景 4: 分析测试失败

```markdown
@claude CI 测试失败了，请帮我分析原因

[Actions 链接](https://github.com/user/repo/actions/runs/12345)
```

Claude 会：
1. 查看 CI 日志
2. 分析失败的测试
3. 查看相关代码
4. 提供修复建议

#### 场景 5: 代码重构建议

```markdown
@claude 这个函数太复杂了，能帮我重构一下吗？

```typescript
function processData(data: any) {
  if (data) {
    if (data.users) {
      for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].active) {
          // ... 100 lines of code
        }
      }
    }
  }
}
```
```

### 🔐 权限说明

Claude 拥有以下权限：
- ✅ **读取代码**: 可以查看所有文件
- ✅ **读取 PR**: 可以查看 PR 的 diff 和评论
- ✅ **读取 Issue**: 可以查看 issue 内容
- ✅ **读取 CI 结果**: 可以查看测试结果和日志
- ❌ **不能直接推送代码**: 需要通过 PR

### 🔧 配置

#### 必需配置

**1. 获取 Claude Code OAuth Token**

访问 https://code.claude.com 并注册：
1. 创建账号
2. 连接你的 GitHub 账号
3. 生成 OAuth Token

**2. 添加 GitHub Secret**

在仓库设置中添加 secret：
1. GitHub 仓库 → **Settings**
2. **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. Name: `CLAUDE_CODE_OAUTH_TOKEN`
5. Value: 粘贴你的 token
6. 点击 **Add secret**

#### 可选配置

**自定义提示词**（在 workflow 中配置）：
```yaml
- name: Run Claude Code
  uses: anthropics/claude-code-action@v1
  with:
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
    prompt: '请用中文回复，并遵循项目的代码规范'
```

**限制工具使用**：
```yaml
claude_args: '--allowed-tools "Bash(gh pr:*),Bash(gh issue:*)"'
```

### 💰 费用说明

- Claude Code 使用 Claude API
- 可能产生 API 使用费用
- 建议监控使用量

### 🐛 常见问题

**Q: @claude 没有响应？**

检查清单：
1. ✅ 是否配置了 `CLAUDE_CODE_OAUTH_TOKEN`
2. ✅ Token 是否有效
3. ✅ 是否在 Issue 或 PR 中使用
4. ✅ 是否正确拼写 `@claude`（不是 @Claude）

**Q: Claude 的回复不准确？**

改进建议：
1. 提供更详细的上下文
2. 指定你想要什么
3. 提供错误信息和日志
4. 说明已尝试的解决方案

**Q: 如何让 Claude 遵循项目规范？**

在项目根目录创建 `CLAUDE.md`：
```markdown
# 项目开发规范

## 代码风格
- 使用 TypeScript strict 模式
- 遵循 Airbnb 代码规范
- 优先使用函数式编程

## 命名规范
- 变量使用 camelCase
- 类使用 PascalCase
- 常量使用 UPPER_SNAKE_CASE

## 测试要求
- 单元测试覆盖率 > 80%
- 所有 API 需要集成测试
```

---

## 8. claude-code-review.yml - AI 代码审查

### 🎯 作用
每当创建或更新 PR 时，自动触发 Claude AI 进行全面的代码审查。

### ⚡ 触发时机
```yaml
on:
  pull_request:
    types: [opened, synchronize]
```

**当前状态**: 默认对所有 PR 触发（可配置）

### 📋 审查内容

Claude 会检查以下方面：

1. **代码质量和最佳实践** 🎯
   - 代码结构和组织
   - 命名规范
   - 代码复用
   - 设计模式使用

2. **潜在 Bug** 🐛
   - 空指针引用
   - 边界条件
   - 错误处理
   - 竞态条件

3. **性能考虑** ⚡
   - 算法效率
   - 数据库查询优化
   - 内存使用
   - 缓存策略

4. **安全隐患** 🔒
   - 输入验证
   - SQL 注入
   - XSS 漏洞
   - 敏感信息泄露

5. **测试覆盖率** 🧪
   - 是否有测试
   - 测试是否充分
   - 边界情况测试

### 💡 使用方法

#### 自动审查

创建 PR 时自动触发：
```bash
git checkout -b feat/add-feature
# ... 编写代码 ...
git commit -m "feat: add new feature"
git push origin feat/add-feature

# 在 GitHub 创建 PR
# Claude 会自动审查并在 PR 中添加评论
```

#### 审查结果示例

Claude 会在 PR 中添加类似这样的评论：

```markdown
## 🤖 Claude 代码审查

### ✅ 做得好的地方
1. 代码结构清晰，职责分离良好
2. 添加了完整的类型定义
3. 错误处理得当

### ⚠️ 需要注意的问题

#### 1. 潜在的性能问题
**文件**: `src/services/user.service.ts:42`

```typescript
// 当前代码
for (const id of userIds) {
  const user = await db.users.findOne({ id });
  results.push(user);
}
```

**建议**: 使用批量查询避免 N+1 问题
```typescript
const users = await db.users.findMany({ 
  id: { in: userIds } 
});
```

#### 2. 缺少输入验证
**文件**: `src/controllers/user.controller.ts:18`

```typescript
async createUser(req: Request) {
  const { email, name } = req.body;
  return userService.create({ email, name });
}
```

**建议**: 添加输入验证
```typescript
async createUser(req: Request) {
  const { email, name } = req.body;
  
  if (!email || !isValidEmail(email)) {
    throw new BadRequestError('Invalid email');
  }
  
  return userService.create({ email, name });
}
```

### 📊 测试覆盖率
- 建议添加针对边界情况的测试
- 缺少对错误处理的测试

### 总体评分
代码质量: ⭐⭐⭐⭐ (4/5)
```

### 🔧 配置

#### 可选：只审查特定作者的 PR

```yaml
jobs:
  claude-review:
    if: |
      github.event.pull_request.user.login == 'external-contributor' ||
      github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'
```

#### 可选：只审查特定文件

```yaml
on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - "src/**/*.ts"
      - "src/**/*.tsx"
```

#### 可选：自定义审查提示

编辑 workflow 中的 prompt：
```yaml
prompt: |
  请审查这个 PR 并关注：
  1. TypeScript 类型安全
  2. React Hooks 使用是否正确
  3. 是否遵循项目的代码规范（参考 CLAUDE.md）
  
  请用中文回复。
```

### 🔧 需要配置

**必需**: `CLAUDE_CODE_OAUTH_TOKEN` secret（与 claude.yml 相同）

配置步骤参考 [claude.yml 配置](#配置-6)

### ⚠️ 注意事项

#### 1. 评论数量
- 可能产生较多评论
- 建议只对重要的 PR 启用
- 或配置过滤条件

#### 2. API 费用
- 每次 PR 都会调用 Claude API
- 大型 PR 可能消耗较多 tokens
- 建议监控使用量

#### 3. 审查时间
- 通常需要 1-3 分钟
- 大型 PR 可能需要更长时间

### 🎛️ 最佳实践

#### 1. 与人工审查结合

```markdown
## 审查流程
1. ✅ Claude 自动审查（初步检查）
2. ✅ 人工审查（深度检查）
3. ✅ 讨论和改进
4. ✅ 批准合并
```

#### 2. 过滤小型 PR

```yaml
jobs:
  claude-review:
    if: |
      github.event.pull_request.additions + 
      github.event.pull_request.deletions > 50
```

#### 3. 只审查核心代码

```yaml
on:
  pull_request:
    paths:
      - "src/**/*.ts"
      - "src/**/*.tsx"
      - "!src/**/*.test.ts"
      - "!src/**/*.spec.ts"
```

### 🐛 常见问题

**Q: 如何禁用自动审查？**

方案 1: 删除或重命名文件
```bash
mv .github/workflows/claude-code-review.yml \
   .github/workflows/claude-code-review.yml.disabled
```

方案 2: 添加条件
```yaml
jobs:
  claude-review:
    if: false  # 完全禁用
```

**Q: 如何只对特定 PR 标签启用？**
```yaml
jobs:
  claude-review:
    if: contains(github.event.pull_request.labels.*.name, 'need-review')
```

**Q: Claude 的建议不适用怎么办？**
- 在 PR 评论中说明原因
- 与团队讨论是否需要调整审查标准
- 更新 `CLAUDE.md` 补充项目特殊规范

---

## 9. auto-merge.yml - 自动合并

### 🎯 作用
自动批准和合并 Dependabot 创建的依赖更新 PR，减少维护工作量。

### ⚡ 触发时机
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened, labeled]
  check_suite:
    types: [completed]
  pull_request_review:
    types: [submitted]
```

**条件**: 只对 `dependabot[bot]` 创建的 PR 生效

### 📋 自动合并规则

#### ✅ 自动批准并合并

**补丁更新 (Patch)**:
```
v1.0.0 → v1.0.1
v2.3.4 → v2.3.5
```

**次要更新 (Minor)**:
```
v1.0.0 → v1.1.0
v2.3.0 → v2.4.0
```

**流程**:
1. ✅ 自动批准 PR
2. ⏳ 等待 CI 测试通过
3. 🚀 自动合并（使用 squash merge）

#### ⚠️ 需要人工审查

**主要更新 (Major)**:
```
v1.9.0 → v2.0.0
v2.x.x → v3.0.0
```

**流程**:
1. 🤖 添加评论提醒
2. 👤 需要人工审查
3. 📝 检查破坏性变更
4. ✋ 手动批准和合并

### 💡 使用方法

#### 1. 启用 Dependabot

创建 `.github/dependabot.yml`：

```yaml
version: 2
updates:
  # Backend 依赖
  - package-ecosystem: "npm"
    directory: "/w2/db_query/backend"
    schedule:
      interval: "weekly"      # 每周检查
      day: "monday"           # 周一
      time: "09:00"          # 上午 9 点
      timezone: "Asia/Shanghai"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "backend"
    reviewers:
      - "your-github-username"
    commit-message:
      prefix: "chore(deps)"

  # Frontend 依赖
  - package-ecosystem: "npm"
    directory: "/w2/db_query/frontend"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Shanghai"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "frontend"
    reviewers:
      - "your-github-username"
    commit-message:
      prefix: "chore(deps)"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"     # 每月检查
    labels:
      - "dependencies"
      - "ci"
    commit-message:
      prefix: "ci(deps)"

  # Docker (如果使用)
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

#### 2. 工作流程

**自动更新流程**:

1. 📅 **每周一上午 9 点**
   - Dependabot 检查依赖更新
   
2. 🤖 **创建 PR**
   - 为每个更新创建独立的 PR
   - PR 标题: `chore(deps): bump package-name from 1.0.0 to 1.1.0`
   
3. ✅ **自动批准**（patch & minor）
   - `auto-merge.yml` 自动批准
   - 添加评论: "✅ 自动批准此依赖更新"
   
4. 🧪 **运行 CI**
   - `ci.yml` 运行所有测试
   - 确保更新不会破坏代码
   
5. 🚀 **自动合并**
   - CI 通过后自动合并
   - 使用 squash merge（保持历史整洁）

6. 🧹 **清理**
   - 删除源分支
   - 关闭 PR

#### 3. 处理主版本更新

当收到主版本更新 PR 时：

**Step 1: 查看 PR**
```markdown
⚠️ 这是一个主版本更新 (major update)，需要人工审查。
请检查破坏性变更。

变更日志: [链接]
迁移指南: [链接]
```

**Step 2: 检查破坏性变更**
```bash
# 本地测试
git checkout dependabot/npm_and_yarn/package-name-2.0.0
npm install
npm test
npm run build
```

**Step 3: 审查代码**
- 查看 CHANGELOG
- 查看 Migration Guide
- 搜索使用该包的地方: `grep -r "package-name" src/`

**Step 4: 更新代码**
```bash
# 根据破坏性变更更新代码
# 更新测试
git add .
git commit -m "chore: adapt to package-name@2.0.0"
git push
```

**Step 5: 批准合并**
- 确认 CI 通过
- 批准 PR
- 合并

### 🔧 高级配置

#### 分组依赖更新

在 `dependabot.yml` 中：
```yaml
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    groups:
      # 将所有 patch 更新分组
      patch-updates:
        update-types:
          - "patch"
      
      # 将测试相关依赖分组
      test-dependencies:
        patterns:
          - "jest*"
          - "@types/jest"
          - "vitest*"
```

#### 自定义合并策略

在 `auto-merge.yml` 中：
```yaml
- name: Enable auto-merge
  run: |
    # 使用 rebase 而不是 squash
    gh pr merge --auto --rebase "$PR_URL"
```

#### 只合并特定包

```yaml
- name: Auto-approve
  if: |
    (steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
     steps.metadata.outputs.update-type == 'version-update:semver-minor') &&
    (steps.metadata.outputs.dependency-names == 'lodash' ||
     steps.metadata.outputs.dependency-names == 'express')
```

### 📊 监控依赖更新

#### 查看 Dependabot 活动

1. GitHub 仓库 → **Insights**
2. **Dependency graph**
3. **Dependabot**
4. 查看所有更新历史

#### 查看安全警报

1. GitHub 仓库 → **Security**
2. **Dependabot alerts**
3. 查看所有安全漏洞

#### 使用 CLI 查看

```bash
# 列出所有依赖更新 PR
gh pr list --label dependencies

# 查看 Dependabot 状态
gh api repos/:owner/:repo/dependabot/alerts
```

### 🐛 常见问题

**Q: Dependabot PR 没有自动合并？**

检查清单:
1. ✅ CI 是否通过？
2. ✅ 是否是 patch/minor 更新？
3. ✅ 是否有合并冲突？
4. ✅ 分支保护规则是否允许自动合并？

**Q: 如何临时禁用 Dependabot？**

```yaml
# 在 .github/dependabot.yml 中
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    open-pull-requests-limit: 0  # 设为 0 暂停
```

**Q: 如何忽略特定依赖？**

```yaml
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    ignore:
      - dependency-name: "package-name"
        # 忽略所有更新
      - dependency-name: "another-package"
        # 只忽略主版本更新
        update-types: ["version-update:semver-major"]
```

**Q: 如何手动触发 Dependabot？**

使用 GitHub CLI:
```bash
# 手动触发依赖检查
gh api -X POST repos/:owner/:repo/dependabot/updates
```

或在 GitHub 网页上:
1. 仓库 → **Insights** → **Dependency graph** → **Dependabot**
2. 点击 **Check for updates**

---

## 配置清单

### ✅ 立即可用（无需配置）

- [x] **ci.yml** - 持续集成
- [x] **pr-checks.yml** - PR 质量检查
- [x] **codeql.yml** - 安全扫描
- [x] **dependency-review.yml** - 依赖审查
- [x] **release.yml** - 自动发布

### 🔧 需要简单配置

#### link-check.yml
- [ ] 确认 `.github/markdown-link-check-config.json` 已存在
- [ ] 根据需要调整忽略规则

#### pr-checks.yml (可选)
- [ ] 创建 `.github/labeler.yml` 用于自动标签

#### auto-merge.yml
- [ ] 创建 `.github/dependabot.yml` 启用 Dependabot
- [ ] 配置更新频率和范围

### 🔑 需要 Token

#### claude.yml & claude-code-review.yml
- [ ] 访问 https://code.claude.com 注册
- [ ] 生成 OAuth Token
- [ ] 在 GitHub 添加 `CLAUDE_CODE_OAUTH_TOKEN` secret

#### ci.yml (可选)
- [ ] 访问 https://codecov.io 注册
- [ ] 添加仓库
- [ ] 在 GitHub 添加 `CODECOV_TOKEN` secret

---

## 最佳实践

### 1. 开发流程

```bash
# 1. 创建特性分支
git checkout -b feat/new-feature

# 2. 开发功能
# ... 编写代码 ...

# 3. 本地测试
npm run lint
npm run test
npm run build

# 4. 提交（使用规范格式）
git commit -m "feat: add new feature"

# 5. 推送并创建 PR
git push origin feat/new-feature

# 6. CI 自动运行
# - 代码检查
# - 测试
# - 构建

# 7. PR 质量检查
# - 标题格式检查
# - 大小检查
# - 冲突检查

# 8. 代码审查
# - Claude 自动审查（可选）
# - 人工审查

# 9. 合并
# - CI 通过
# - 审查通过
# - 合并到 main

# 10. 自动部署（如配置）
```

### 2. 发布流程

```bash
# 1. 确保 main 分支稳定
git checkout main
git pull

# 2. 创建版本 tag
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin v1.2.0

# 3. 自动发布
# - 构建
# - 创建 Release
# - 上传产物

# 4. 部署生产环境
# - 下载 Release 产物
# - 部署到服务器
```

### 3. 依赖管理

```bash
# 1. Dependabot 自动检查（每周）
# 2. 自动创建更新 PR
# 3. 小版本更新自动合并
# 4. 主版本更新人工审查
# 5. 定期检查安全警报
```

### 4. 代码质量保障

```
┌─────────────────┐
│   开发者提交     │
└────────┬────────┘
         ↓
┌─────────────────┐
│   CI 自动测试   │  ← ci.yml
│  - Lint         │
│  - Unit Tests   │
│  - Build        │
└────────┬────────┘
         ↓
┌─────────────────┐
│  PR 质量检查    │  ← pr-checks.yml
│  - 标题格式     │
│  - 大小检查     │
└────────┬────────┘
         ↓
┌─────────────────┐
│  安全扫描       │  ← codeql.yml
│  - 漏洞检测     │
│  - 依赖审查     │  ← dependency-review.yml
└────────┬────────┘
         ↓
┌─────────────────┐
│  代码审查       │
│  - AI 审查      │  ← claude-code-review.yml
│  - 人工审查     │
└────────┬────────┘
         ↓
┌─────────────────┐
│   合并到 main   │
└─────────────────┘
```

### 5. 监控和维护

**每日**:
- 检查失败的 CI builds
- 处理 Dependabot PRs

**每周**:
- 审查 CodeQL 安全警报
- 检查文档链接有效性

**每月**:
- 审查 GitHub Actions 更新
- 检查 workflow 配置是否需要优化
- 审查自动化效果

---

## 快速参考

### Commit Message 格式
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
Scopes: backend, frontend, e2e, deps, ci, docs (可选)

示例:
feat: add user authentication
fix(backend): resolve database connection
docs: update API documentation
```

### PR 标题格式
```
<type>(<scope>): <description>

示例:
feat: add user login page
fix(frontend): resolve rendering issue
```

### 版本号格式
```
vMAJOR.MINOR.PATCH

示例:
v1.0.0    - 初始版本
v1.1.0    - 添加新功能
v1.1.1    - 修复 bug
v2.0.0    - 破坏性更新
```

---

## 相关资源

### 官方文档
- [GitHub Actions 文档](https://docs.github.com/actions)
- [Dependabot 文档](https://docs.github.com/code-security/dependabot)
- [CodeQL 文档](https://codeql.github.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

### 工具
- [GitHub CLI](https://cli.github.com/)
- [Act - 本地运行 Actions](https://github.com/nektos/act)
- [Markdown Link Check](https://github.com/tcort/markdown-link-check)

### 社区
- [GitHub Community](https://github.com/community)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

---

## 更新日志

- **2025-01-05**: 初始版本，包含 9 个 workflows 的完整说明

---

## 贡献

如果发现文档有误或需要补充，请：
1. 创建 Issue 说明问题
2. 或直接提交 PR 更新文档

---

**最后更新**: 2025-01-05
**维护者**: @trampboy
