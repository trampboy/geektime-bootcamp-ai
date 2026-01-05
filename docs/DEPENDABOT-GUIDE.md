# Dependabot 完全指南

本文档详细介绍 GitHub Dependabot 的工作原理、配置方法和最佳实践。

---

## 📑 目录

- [什么是 Dependabot](#什么是-dependabot)
- [为什么需要 Dependabot](#为什么需要-dependabot)
- [Dependabot 与 GitHub Actions 的区别](#dependabot-与-github-actions-的区别)
- [配置文件位置](#配置文件位置)
- [工作原理](#工作原理)
- [配置详解](#配置详解)
- [实战示例](#实战示例)
- [Dependabot PR 处理流程](#dependabot-pr-处理流程)
- [与 auto-merge.yml 的配合](#与-auto-mergeyml-的配合)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)
- [命令参考](#命令参考)

---

## 什么是 Dependabot

**Dependabot** 是 GitHub 提供的自动化依赖管理服务，它可以：

- 🔍 **自动扫描**项目依赖
- 📊 **检测更新**并评估版本变更
- 🔒 **发现安全漏洞**并提供修复建议
- 🤖 **自动创建 PR**更新依赖
- 📝 **生成详细说明**包括 changelog 和 release notes

### 核心特点

| 特性 | 说明 |
|-----|------|
| **完全自动化** | 无需手动检查依赖更新 |
| **安全优先** | 优先处理安全漏洞 |
| **智能分组** | 可以将相关依赖合并到一个 PR |
| **兼容性评分** | 显示更新的风险等级 |
| **免费使用** | 公开和私有仓库都可用 |

---

## 为什么需要 Dependabot

### 问题场景

**没有 Dependabot 时**：

```bash
# 手动检查依赖
npm outdated

# 输出一堆过期的包
Package      Current  Wanted  Latest
express      4.17.1   4.18.2  4.18.3
typescript   4.9.5    4.9.5   5.3.3
jest         28.1.0   28.1.3  29.7.0
...

# 然后你需要：
1. 逐个检查 changelog
2. 评估破坏性变更
3. 手动更新 package.json
4. 运行测试
5. 提交 PR
6. 重复以上步骤...

# 问题：
- ⏰ 耗时（可能每周需要几小时）
- 🐛 容易遗漏安全更新
- 😰 依赖积压越来越多
- 🔥 最后不得不做大规模升级（风险很高）
```

**有 Dependabot 后**：

```bash
# 每周一早上 9 点，你收到邮件：

📬 [Project] Dependabot created 5 pull requests

PR #123: chore(deps): bump express from 4.17.1 to 4.17.3
PR #124: chore(deps): bump typescript from 4.9.5 to 4.9.7  
PR #125: chore(deps-dev): bump jest from 28.1.0 to 28.1.3
PR #126: chore(deps): bump lodash from 4.17.20 to 4.17.21 [SECURITY]
PR #127: chore(deps): bump axios from 0.21.1 to 1.6.0

# 你只需要：
1. 查看 PR（Dependabot 已经写好了 changelog）
2. 等待 CI 通过（自动运行）
3. 小版本更新自动合并（auto-merge.yml）
4. 大版本更新手动审查
5. 完成！只需几分钟

# 优势：
- ✅ 自动化（节省 90% 时间）
- ✅ 安全警报立即处理
- ✅ 小步迭代（风险低）
- ✅ 依赖始终保持最新
```

### 实际收益

根据 GitHub 统计：

- 📉 **减少 85% 的依赖管理时间**
- 🔒 **安全漏洞平均修复时间从 30 天降到 2 天**
- 📈 **依赖更新频率提高 10 倍**
- 😌 **开发者满意度显著提升**

---

## Dependabot 与 GitHub Actions 的区别

### 架构对比

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Platform                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────┐    ┌─────────────────────┐  │
│  │   GitHub Actions      │    │    Dependabot       │  │
│  │   (通用自动化平台)     │    │   (专用依赖管理)     │  │
│  ├───────────────────────┤    ├─────────────────────┤  │
│  │ • 事件触发            │    │ • 内置调度器         │  │
│  │ • 运行在 Runner 上    │    │ • GitHub 后端运行    │  │
│  │ • 消耗 Actions 时间   │    │ • 不消耗配额         │  │
│  │ • 可执行任意代码      │    │ • 专注依赖管理       │  │
│  │ • 配置在 workflows/   │    │ • 配置在根目录       │  │
│  └───────────────────────┘    └─────────────────────┘  │
│           ↓                              ↓             │
│    执行 CI/CD 任务              创建依赖更新 PR          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 详细对比

| 维度 | GitHub Actions | Dependabot |
|-----|----------------|------------|
| **本质** | 通用自动化平台 | 专用依赖管理服务 |
| **配置位置** | `.github/workflows/*.yml` | `.github/dependabot.yml` |
| **触发方式** | 事件驱动（push, PR, schedule） | 内置定时调度 |
| **运行环境** | GitHub-hosted 或 Self-hosted Runner | GitHub 内部服务 |
| **执行内容** | 任意 shell 命令、脚本 | 扫描依赖、创建 PR |
| **配额消耗** | 消耗 Actions minutes | 免费，不消耗配额 |
| **灵活性** | 高（可做任何事） | 低（专注依赖） |
| **学习曲线** | 中等 | 低 |
| **使用场景** | CI/CD、测试、部署、自动化 | 依赖更新、安全修复 |

### 为什么配置文件位置不同？

```bash
# ❌ 错误的理解
"Dependabot 应该放在 workflows/ 里，因为它也是自动化"

# ✅ 正确的理解
"Dependabot 是独立服务，不是 workflow，所以有自己的配置位置"
```

**原因**：

1. **技术架构不同**
   ```
   GitHub Actions: 基于 YAML workflow + Runner 执行
   Dependabot:     独立的微服务 + 专用调度器
   ```

2. **GitHub 官方约定**
   ```yaml
   # GitHub 只会在这个位置读取 Dependabot 配置
   .github/dependabot.yml
   
   # 如果放在这里，GitHub 不会识别
   .github/workflows/dependabot.yml  ❌
   ```

3. **职责分离**
   ```
   workflows/  → 做事情（构建、测试、部署）
   dependabot.yml → 管理依赖（扫描、更新、创建 PR）
   ```

### 协同工作

虽然是独立系统，但它们可以配合：

```
┌─────────────────────────────────────────────────────────┐
│ 1. Dependabot 每周一检查依赖                              │
│    (根据 .github/dependabot.yml)                         │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 发现更新，创建 PR                                      │
│    - 更新 package.json                                   │
│    - 生成 changelog                                      │
│    - 推送到仓库                                          │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 触发 GitHub Actions workflows                         │
│    ├─ ci.yml: 运行测试                                   │
│    ├─ pr-checks.yml: 检查 PR 质量                        │
│    ├─ codeql.yml: 安全扫描                               │
│    └─ auto-merge.yml: 自动批准和合并                     │
└─────────────────────────────────────────────────────────┘
```

**类比**：

```
Dependabot = 采购部门（发现需要买什么）
              ↓
           创建采购订单 (PR)
              ↓
GitHub Actions = 质检部门（检查货物质量）
              ↓
           批准和入库（合并）
```

---

## 配置文件位置

### 文件结构

```bash
.github/
├── workflows/                # GitHub Actions workflows
│   ├── ci.yml
│   ├── release.yml
│   └── auto-merge.yml
│
├── dependabot.yml           # ← Dependabot 配置（固定位置）
│
├── ISSUE_TEMPLATE/
├── PULL_REQUEST_TEMPLATE.md
└── ...
```

### 为什么在 `.github/` 根目录？

1. **GitHub 规范**：这是 GitHub 官方规定的位置
2. **全局配置**：管理整个仓库的依赖策略
3. **易于查找**：与其他仓库级配置放在一起
4. **历史原因**：Dependabot 被 GitHub 收购前就是这个位置

### 不能放在其他位置吗？

```bash
# ✅ 唯一正确的位置
.github/dependabot.yml

# ❌ 以下位置都不会生效
.github/workflows/dependabot.yml
dependabot.yml
.dependabot/config.yml
config/dependabot.yml
```

---

## 工作原理

### 完整流程图

```
┌─────────────────────────────────────────────────────┐
│ 1. 定时触发 (Scheduler)                              │
│    - 每周一 09:00 (Asia/Shanghai)                    │
│    - 或手动触发                                       │
│    - 或配置文件更新后                                 │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 2. 读取配置 (Config Parser)                          │
│    - 读取 .github/dependabot.yml                     │
│    - 解析 package-ecosystem, directory, schedule 等  │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 3. 扫描依赖文件 (Dependency Scanner)                 │
│    - npm: package.json, package-lock.json            │
│    - pip: requirements.txt                           │
│    - bundler: Gemfile, Gemfile.lock                  │
│    - github-actions: .github/workflows/*.yml         │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 4. 检查更新 (Update Checker)                         │
│    - 查询 npm registry / PyPI / RubyGems 等          │
│    - 对比当前版本与最新版本                           │
│    - 检查 GitHub Advisory Database 安全漏洞          │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 5. 生成更新计划 (Update Planner)                     │
│    - 识别 patch / minor / major 更新                 │
│    - 应用 ignore 规则                                │
│    - 应用 groups 配置（合并相关更新）                 │
│    - 检查 open-pull-requests-limit                   │
└──────────────────┬──────────────────────────────────┘
                   ↓
        ┌──────────┴─────────┐
        ↓                    ↓
┌──────────────────┐  ┌────────────────────┐
│ 6a. 安全更新     │  │ 6b. 版本更新       │
│  (高优先级)      │  │  (按计划)          │
└────────┬─────────┘  └──────────┬─────────┘
         └──────────┬─────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ 7. 创建 PR (PR Creator)                              │
│    - 创建新分支: dependabot/npm_and_yarn/...         │
│    - 更新依赖文件                                     │
│    - 运行 package manager (npm install/update)       │
│    - 生成 PR 描述 (changelog, release notes)         │
│    - 添加标签 (labels)                               │
│    - 指定审查人 (reviewers)                          │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│ 8. 推送 PR 到 GitHub                                 │
│    - 触发 GitHub Actions workflows                   │
│    - 运行 CI 测试                                    │
│    - 等待审查                                        │
└─────────────────────────────────────────────────────┘
```

### 关键组件

#### 1. 调度器 (Scheduler)

```yaml
schedule:
  interval: "weekly"    # 每周
  day: "monday"         # 周一
  time: "09:00"         # 上午 9 点
  timezone: "Asia/Shanghai"
```

- 精确控制检查时间
- 避免高峰时段
- 可设置为 daily, weekly, monthly

#### 2. 依赖扫描器 (Scanner)

支持的 ecosystem：

```yaml
- package-ecosystem: "npm"           # Node.js
- package-ecosystem: "pip"           # Python
- package-ecosystem: "bundler"       # Ruby
- package-ecosystem: "maven"         # Java
- package-ecosystem: "gradle"        # Java/Kotlin
- package-ecosystem: "cargo"         # Rust
- package-ecosystem: "composer"      # PHP
- package-ecosystem: "nuget"         # .NET
- package-ecosystem: "docker"        # Docker
- package-ecosystem: "github-actions" # GitHub Actions
- package-ecosystem: "terraform"     # Terraform
```

#### 3. 版本解析器 (Version Resolver)

识别版本类型：

```
v1.0.0 → v1.0.1  = Patch update  (补丁)
v1.0.0 → v1.1.0  = Minor update  (次要)
v1.0.0 → v2.0.0  = Major update  (主要)
```

#### 4. PR 生成器 (PR Generator)

生成的 PR 包含：

```markdown
## PR 标题
chore(deps): bump express from 4.17.1 to 4.18.2 in /backend

## PR 内容
- 📦 Package: express
- 🔼 Update: 4.17.1 → 4.18.2
- 📝 Changelog: [链接]
- 📄 Release notes: [链接]
- 🔐 Security: No vulnerabilities
- ✅ Compatibility: High confidence
- 📊 Commits: 25 commits

## 自动化命令
可以在评论中使用：
- @dependabot rebase
- @dependabot merge
- @dependabot ignore this major version
```

---

## 配置详解

### 基础配置

```yaml
version: 2
updates:
  - package-ecosystem: "npm"     # 必需：依赖类型
    directory: "/"               # 必需：扫描目录
    schedule:                    # 必需：检查频率
      interval: "weekly"
```

### 完整配置示例

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    
    # ============ 调度配置 ============
    schedule:
      interval: "weekly"         # daily, weekly, monthly
      day: "monday"              # 仅 weekly: monday-sunday
      time: "09:00"              # HH:MM 格式
      timezone: "Asia/Shanghai"  # IANA 时区
    
    # ============ PR 限制 ============
    open-pull-requests-limit: 5  # 最多同时打开的 PR 数
    
    # ============ 标签和审查 ============
    labels:
      - "dependencies"           # PR 标签
      - "automated"
    reviewers:
      - "username"               # 审查人
    assignees:
      - "username"               # 指派人
    milestone: 1                 # 里程碑 ID
    
    # ============ Commit 消息 ============
    commit-message:
      prefix: "chore(deps)"           # 生产依赖前缀
      prefix-development: "chore(dev)" # 开发依赖前缀
      include: "scope"                # 包含作用域
    
    # ============ 版本策略 ============
    versioning-strategy: increase  # increase, widen, lockfile-only, auto
    
    # ============ 忽略规则 ============
    ignore:
      - dependency-name: "express"
        # 忽略所有更新
      - dependency-name: "lodash"
        versions: ["4.x"]              # 忽略 4.x 版本
      - dependency-name: "react"
        update-types: ["version-update:semver-major"]  # 只忽略主版本
    
    # ============ 允许规则 ============
    allow:
      - dependency-type: "direct"      # 只更新直接依赖
      - dependency-type: "production"  # 只更新生产依赖
      - dependency-name: "specific-*"  # 只更新特定包
    
    # ============ 分组配置 ============
    groups:
      production-dependencies:
        patterns:
          - "*"                        # 所有包
        exclude-patterns:
          - "@types/*"                 # 排除类型定义
        dependency-type: "production"  # 只包含生产依赖
        update-types:
          - "minor"                    # 只包含次要更新
          - "patch"                    # 和补丁更新
      
      development-dependencies:
        patterns:
          - "@types/*"
          - "eslint*"
        dependency-type: "development"
    
    # ============ 其他配置 ============
    pull-request-branch-name:
      separator: "-"                   # 分支名分隔符
    
    rebase-strategy: "disabled"        # disabled, auto
    
    target-branch: "develop"           # 目标分支（默认为默认分支）
    
    vendor: true                       # 是否 vendor 依赖
    
    insecure-external-code-execution: allow  # allow, deny
```

### 配置字段详解

#### interval - 检查频率

```yaml
schedule:
  interval: "daily"    # 每天检查（适合活跃项目）
  interval: "weekly"   # 每周检查（推荐）
  interval: "monthly"  # 每月检查（低频维护项目）
```

**建议**：
- 生产项目：weekly
- 开发项目：daily
- 维护项目：monthly

#### versioning-strategy - 版本策略

```yaml
versioning-strategy: increase      # 增加版本号
# package.json: "express": "^4.17.1"
# 更新后:      "express": "^4.18.2"

versioning-strategy: widen        # 扩大版本范围
# package.json: "express": "^4.17.1"
# 更新后:      "express": "^4.17.1 || ^4.18.2"

versioning-strategy: lockfile-only # 只更新 lock 文件
# package.json: "express": "^4.17.1"  (不变)
# package-lock.json: 更新到 4.18.2

versioning-strategy: auto         # 自动选择（默认）
```

#### groups - 分组配置

将相关依赖合并到一个 PR：

```yaml
groups:
  # 所有 patch 更新合并
  patch-updates:
    update-types:
      - "patch"
  
  # 测试相关依赖合并
  test-dependencies:
    patterns:
      - "jest"
      - "@testing-library/*"
      - "vitest"
  
  # 前端框架相关
  react-ecosystem:
    patterns:
      - "react"
      - "react-dom"
      - "@types/react*"
```

**优势**：
- 减少 PR 数量
- 相关依赖一起测试
- 减少审查负担

---

## 实战示例

### 示例 1: 简单项目

```yaml
version: 2
updates:
  # 单个 Node.js 项目
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
```

### 示例 2: Monorepo 项目

```yaml
version: 2
updates:
  # 根目录
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  
  # Backend
  - package-ecosystem: "npm"
    directory: "/packages/backend"
    schedule:
      interval: "weekly"
    labels:
      - "backend"
  
  # Frontend
  - package-ecosystem: "npm"
    directory: "/packages/frontend"
    schedule:
      interval: "weekly"
    labels:
      - "frontend"
  
  # Mobile App
  - package-ecosystem: "npm"
    directory: "/packages/mobile"
    schedule:
      interval: "weekly"
    labels:
      - "mobile"
```

### 示例 3: 多语言项目

```yaml
version: 2
updates:
  # Node.js Backend
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    labels:
      - "backend"
      - "nodejs"
  
  # Python API
  - package-ecosystem: "pip"
    directory: "/api"
    schedule:
      interval: "weekly"
    labels:
      - "api"
      - "python"
  
  # Docker
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "monthly"
    labels:
      - "infrastructure"
  
  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    labels:
      - "ci"
```

### 示例 4: 分组优化（减少 PR）

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    
    # 将小更新合并，减少 PR 数量
    groups:
      # 所有 patch 更新合并到一个 PR
      patch-updates:
        update-types:
          - "patch"
      
      # 所有开发依赖合并
      dev-dependencies:
        dependency-type: "development"
        update-types:
          - "minor"
          - "patch"
      
      # TypeScript 相关
      typescript-ecosystem:
        patterns:
          - "typescript"
          - "@types/*"
          - "ts-*"
```

### 示例 5: 严格控制（大型项目）

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "02:00"  # 凌晨运行，避免干扰工作
    
    open-pull-requests-limit: 3  # 限制 PR 数量
    
    # 只更新直接依赖的 patch 版本
    allow:
      - dependency-type: "direct"
        update-types: ["patch"]
    
    # 忽略容易出问题的包
    ignore:
      - dependency-name: "webpack"
        # 主版本更新需要手动处理
        update-types: ["version-update:semver-major"]
      
      - dependency-name: "babel-*"
        # Babel 全家桶一起升级
    
    # 只有高优先级人员审查
    reviewers:
      - "tech-lead"
      - "senior-dev"
    
    labels:
      - "dependencies"
      - "requires-review"
```

---

## Dependabot PR 处理流程

### PR 生命周期

```
┌──────────────────────────────────────┐
│ 1. Dependabot 创建 PR                │
│    - 分支: dependabot/npm/express-4.18.2 │
│    - 标签: dependencies, backend     │
│    - 审查人: 自动指派                 │
└──────────────┬───────────────────────┘
               ↓
┌──────────────────────────────────────┐
│ 2. 触发 CI workflows                 │
│    ├─ ci.yml: 运行测试                │
│    ├─ pr-checks.yml: 检查 PR 格式     │
│    ├─ codeql.yml: 安全扫描            │
│    └─ dependency-review.yml: 依赖审查 │
└──────────────┬───────────────────────┘
               ↓
        ┌──────┴──────┐
        ↓             ↓
┌──────────────┐ ┌─────────────────┐
│ 3a. Patch/   │ │ 3b. Major       │
│     Minor    │ │     Update      │
│              │ │                 │
│ auto-merge   │ │ 需要人工审查     │
│ .yml 自动    │ │                 │
│ 批准和合并    │ │ 手动批准        │
└──────┬───────┘ └────────┬────────┘
       │                  │
       └────────┬─────────┘
                ↓
┌──────────────────────────────────────┐
│ 4. CI 通过后合并                      │
│    - Squash merge (保持历史整洁)      │
│    - 删除分支                         │
│    - 关闭 PR                          │
└──────────────────────────────────────┘
```

### PR 内容详解

#### 标题格式

```
chore(deps): bump [package] from [old] to [new] in [directory]

示例:
chore(deps): bump express from 4.17.1 to 4.18.2 in /backend
chore(deps-dev): bump @types/node from 18.0.0 to 20.0.0
chore(deps): [security] bump lodash from 4.17.20 to 4.17.21
```

#### PR 描述结构

```markdown
Bumps [package](link) from [old] to [new].

**Release notes**
*Sourced from [package's releases].*

> ## [new version]
> - Feature: Added X
> - Fix: Resolved Y
> - Breaking: Changed Z

**Changelog**
*Sourced from [package's changelog].*

> # [new version]
> - Added new API
> - Fixed security issue

**Commits**
- [`abc1234`](link) Release notes
- [`def5678`](link) Bug fixes
- See full diff in [compare view](link)

---

**Dependabot compatibility score**
Dependabot will resolve any conflicts with this PR as long as you don't alter it yourself.

Merge confidence: 95% ✅

**Dependabot commands and options**
<details>
<summary>Instructions</summary>

You can trigger Dependabot actions by commenting on this PR:
- `@dependabot rebase` will rebase this PR
- `@dependabot recreate` will recreate this PR
- `@dependabot merge` will merge this PR after your CI passes
- `@dependabot squash and merge` will squash and merge this PR
- `@dependabot cancel merge` will cancel a previously requested merge
- `@dependabot reopen` will reopen this PR if it is closed
- `@dependabot close` will close this PR and stop Dependabot
- `@dependabot ignore this major version` will close this PR and stop Dependabot creating any more for this major version
- `@dependabot ignore this minor version` will close this PR and stop Dependabot creating any more for this minor version
- `@dependabot ignore this dependency` will close this PR and stop Dependabot creating any more for this dependency

</details>
```

### 审查清单

#### Patch 更新 (1.0.0 → 1.0.1)

```markdown
- [ ] 查看 PR 描述中的 changelog
- [ ] 确认 CI 全部通过
- [ ] （可选）本地测试
- [ ] 批准合并
```

**通常很安全**，多数情况自动合并即可。

#### Minor 更新 (1.0.0 → 1.1.0)

```markdown
- [ ] 查看新功能说明
- [ ] 确认没有破坏性变更
- [ ] CI 全部通过
- [ ] 关键功能快速测试
- [ ] 批准合并
```

**一般安全**，但建议快速检查。

#### Major 更新 (1.0.0 → 2.0.0)

```markdown
- [ ] 仔细阅读 CHANGELOG 和 Migration Guide
- [ ] 识别所有破坏性变更
- [ ] 搜索代码中使用该包的地方
- [ ] 本地完整测试
- [ ] 更新相关代码和测试
- [ ] CI 全部通过
- [ ] Code review
- [ ] 批准合并
```

**需要谨慎**，必须充分测试。

---

## 与 auto-merge.yml 的配合

### 完整自动化流程

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "dependencies"
      - "automerge"  # ← 标记可以自动合并
```

```yaml
# .github/workflows/auto-merge.yml
name: Auto Merge
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  auto-merge:
    if: github.actor == 'dependabot[bot]'  # ← 只处理 Dependabot PR
    runs-on: ubuntu-latest
    steps:
      - name: Get metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1
      
      - name: Auto-approve patch & minor
        if: |
          steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
          steps.metadata.outputs.update-type == 'version-update:semver-minor'
        run: gh pr review --approve "$PR_URL"
      
      - name: Enable auto-merge
        run: gh pr merge --auto --squash "$PR_URL"
```

### 工作流程图

```
Dependabot 创建 PR
        ↓
  添加标签: dependencies
        ↓
触发 auto-merge.yml
        ↓
    检查更新类型
        ↓
    ┌───┴───┐
    ↓       ↓
  patch   major
  minor    ↓
    ↓    需要人工
  自动批准   审查
    ↓       ↓
  等待 CI   手动批准
    ↓       ↓
  CI 通过   CI 通过
    ↓       ↓
  自动合并  手动合并
```

### dependabot/fetch-metadata 使用

这个 Action 可以获取 PR 的元数据：

```yaml
- name: Fetch Dependabot metadata
  id: metadata
  uses: dependabot/fetch-metadata@v1
  with:
    github-token: "${{ secrets.GITHUB_TOKEN }}"

# 可用的输出：
# ${{ steps.metadata.outputs.dependency-names }}
# ${{ steps.metadata.outputs.update-type }}
# ${{ steps.metadata.outputs.directory }}
# ${{ steps.metadata.outputs.package-ecosystem }}
# ${{ steps.metadata.outputs.target-branch }}
# ${{ steps.metadata.outputs.previous-version }}
# ${{ steps.metadata.outputs.new-version }}
```

**update-type 值**：
- `version-update:semver-patch` - 补丁更新
- `version-update:semver-minor` - 次要更新
- `version-update:semver-major` - 主要更新

### 高级自动合并策略

#### 策略 1: 只合并特定包

```yaml
- name: Auto-merge specific packages
  if: |
    contains(steps.metadata.outputs.dependency-names, 'lodash') ||
    contains(steps.metadata.outputs.dependency-names, '@types/')
  run: gh pr merge --auto --squash "$PR_URL"
```

#### 策略 2: 工作时间才合并

```yaml
- name: Check time
  id: check-time
  run: |
    hour=$(date +%H)
    if [ $hour -ge 9 ] && [ $hour -le 18 ]; then
      echo "merge=true" >> $GITHUB_OUTPUT
    fi

- name: Auto-merge
  if: steps.check-time.outputs.merge == 'true'
  run: gh pr merge --auto --squash "$PR_URL"
```

#### 策略 3: 需要多个审查

```yaml
- name: Auto-approve (need 2 approvals)
  run: gh pr review --approve "$PR_URL"

# 在仓库设置中配置 branch protection:
# - Require 2 approvals before merging
```

---

## 最佳实践

### 1. 合理设置检查频率

```yaml
# ✅ 推荐：不同类型不同频率
updates:
  # 生产依赖：每周
  - package-ecosystem: "npm"
    directory: "/src"
    schedule:
      interval: "weekly"
  
  # GitHub Actions：每月（变化不频繁）
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
  
  # 开发依赖：可以更频繁
  - package-ecosystem: "npm"
    directory: "/tools"
    schedule:
      interval: "daily"
```

### 2. 使用分组减少 PR 数量

```yaml
groups:
  # 将所有小更新合并
  minor-and-patch:
    update-types:
      - "minor"
      - "patch"
  
  # 相关生态系统合并
  react-ecosystem:
    patterns:
      - "react"
      - "react-dom"
      - "@types/react*"
```

### 3. 安全更新优先

```yaml
# Dependabot 会自动优先处理安全更新
# 无需特殊配置

# 可以在 GitHub Security 标签查看：
# Settings → Security → Dependabot alerts
```

### 4. 合理使用 ignore

```yaml
ignore:
  # 忽略已知有问题的版本
  - dependency-name: "problematic-package"
    versions: ["2.0.0", "2.0.1"]
  
  # 暂时不升级主版本（计划中）
  - dependency-name: "webpack"
    update-types: ["version-update:semver-major"]
  
  # 完全忽略（由其他依赖管理）
  - dependency-name: "internal-package"
```

### 5. 设置合理的 PR 限制

```yaml
# 避免一次性打开太多 PR
open-pull-requests-limit: 5  # 推荐 3-10

# 如果设置太高：
# - 审查负担重
# - CI 队列拥堵

# 如果设置太低：
# - 更新速度慢
# - 安全更新可能延迟
```

### 6. 配置审查人员

```yaml
reviewers:
  - "tech-lead"      # 技术负责人
  - "senior-dev"     # 高级开发

assignees:
  - "devops-team"    # 指派给 DevOps

# 好处：
# - 确保有人关注
# - 责任明确
# - 及时处理
```

### 7. 利用标签组织

```yaml
labels:
  - "dependencies"   # 基础标签
  - "backend"        # 项目标签
  - "automated"      # 自动化标记
  - "priority-low"   # 优先级

# 然后可以按标签筛选：
# gh pr list --label "dependencies,priority-high"
```

### 8. 定期清理过时的 PR

```bash
# 关闭已过时的 Dependabot PR
gh pr list \
  --author "dependabot[bot]" \
  --state open \
  --json number \
  --jq '.[].number' | \
  xargs -I {} gh pr close {}

# 让 Dependabot 重新创建最新的 PR
@dependabot recreate
```

### 9. 监控和维护

```bash
# 每周检查
- [ ] 查看未合并的 Dependabot PR
- [ ] 处理有冲突的 PR
- [ ] 审查主版本更新
- [ ] 检查 Security alerts

# 每月检查
- [ ] 审查 dependabot.yml 配置
- [ ] 优化分组策略
- [ ] 更新 ignore 规则
- [ ] 评估自动合并效果
```

### 10. 文档化决策

```yaml
# 在配置中添加注释说明
ignore:
  # webpack 5 升级需要大规模重构
  # 计划在 Q2 进行，暂时忽略
  # Issue: #123
  - dependency-name: "webpack"
    update-types: ["version-update:semver-major"]
```

---

## 常见问题

### Q1: Dependabot PR 创建后没有触发 CI？

**可能原因**：

1. **默认 GITHUB_TOKEN 限制**

```yaml
# 问题：GITHUB_TOKEN 创建的 PR 不触发 workflow
# 解决：使用 PAT (Personal Access Token)

# 在仓库 Settings → Secrets 添加 PAT
# 然后在 dependabot.yml 中使用（不推荐，复杂）

# 更好的方案：让 Dependabot 使用默认 token，
# 但在 workflow 中使用 pull_request_target
```

2. **Workflow 触发条件问题**

```yaml
# ❌ 可能不触发
on:
  pull_request:
    branches: [main]

# ✅ 应该触发
on:
  pull_request:
    types: [opened, synchronize]
```

### Q2: 如何手动触发 Dependabot？

**方法 1: GitHub 网页**
1. 仓库 → Insights
2. Dependency graph → Dependabot
3. 点击 "Check for updates"

**方法 2: GitHub CLI**
```bash
gh api \
  -X POST \
  repos/:owner/:repo/dependabot/updates
```

**方法 3: 在 PR 评论中**
```
@dependabot rebase
@dependabot recreate
```

### Q3: 如何临时禁用 Dependabot？

```yaml
# 方法 1: 设置 PR 限制为 0
open-pull-requests-limit: 0

# 方法 2: 注释掉整个配置
# updates:
#   - package-ecosystem: "npm"
#     ...

# 方法 3: 在 GitHub 网页禁用
# Settings → Security → Dependabot → Disable
```

### Q4: Dependabot PR 有合并冲突怎么办？

```bash
# 方法 1: 让 Dependabot 重建（推荐）
@dependabot recreate

# 方法 2: 手动 rebase
@dependabot rebase

# 方法 3: 关闭让其重新创建
@dependabot close
# 等待下次检查时会重新创建
```

### Q5: 如何查看 Dependabot 的运行日志？

```bash
# 方法 1: GitHub 网页
# Insights → Dependency graph → Dependabot → Last checked

# 方法 2: GitHub API
gh api repos/:owner/:repo/dependabot/alerts

# 方法 3: 查看 PR 时间线
# PR 中会显示 Dependabot 的操作历史
```

### Q6: 为什么某些依赖没有被更新？

**检查清单**：

```yaml
# 1. 是否被 ignore 了？
ignore:
  - dependency-name: "package-name"

# 2. 是否超过 PR 限制？
open-pull-requests-limit: 5  # 已有 5 个 PR，不会创建新的

# 3. 是否在 allow 范围内？
allow:
  - dependency-type: "direct"  # 间接依赖不会更新

# 4. 版本范围是否允许？
# package.json: "express": "4.17.1"  # 精确版本，Dependabot 会更新
# package.json: "express": "^4.17.1" # 范围版本，可能不更新
```

### Q7: 如何处理频繁更新的包？

```yaml
# 方法 1: 忽略小版本
ignore:
  - dependency-name: "frequently-updated-package"
    update-types: ["version-update:semver-patch"]

# 方法 2: 分组更新
groups:
  frequent-updates:
    patterns:
      - "frequently-updated-*"
    update-types:
      - "patch"

# 方法 3: 降低检查频率
schedule:
  interval: "monthly"  # 而不是 weekly
```

### Q8: Dependabot 与 Renovate Bot 如何选择？

| 特性 | Dependabot | Renovate Bot |
|------|------------|--------------|
| **提供商** | GitHub 原生 | 第三方 |
| **配置复杂度** | 简单 | 复杂（更灵活） |
| **功能** | 基础 | 高级 |
| **免费使用** | ✅ | ✅ |
| **学习曲线** | 低 | 中 |
| **社区支持** | GitHub | Renovate |

**建议**：
- 中小型项目：Dependabot（简单够用）
- 大型项目、复杂需求：Renovate（功能更强）
- 已经在用 GitHub：Dependabot（集成更好）

---

## 命令参考

### Dependabot 评论命令

在 Dependabot PR 的评论中可以使用：

```bash
# 重新 rebase PR
@dependabot rebase

# 重新创建 PR（解决冲突）
@dependabot recreate

# CI 通过后合并
@dependabot merge

# CI 通过后 squash 合并
@dependabot squash and merge

# 取消之前的自动合并请求
@dependabot cancel merge

# 重新打开已关闭的 PR
@dependabot reopen

# 关闭 PR
@dependabot close

# 忽略此主版本
@dependabot ignore this major version

# 忽略此次版本
@dependabot ignore this minor version

# 忽略此依赖的所有更新
@dependabot ignore this dependency
```

### GitHub CLI 命令

```bash
# 列出所有 Dependabot PR
gh pr list --author "dependabot[bot]"

# 列出待审查的 Dependabot PR
gh pr list --author "dependabot[bot]" --label "dependencies"

# 批量合并 Dependabot PR
gh pr list --author "dependabot[bot]" --json number --jq '.[].number' | \
  xargs -I {} gh pr merge {} --auto --squash

# 查看 Dependabot alerts
gh api repos/:owner/:repo/dependabot/alerts

# 手动触发 Dependabot
gh api -X POST repos/:owner/:repo/dependabot/updates
```

### npm 命令

```bash
# 查看过期的包
npm outdated

# 查看安全漏洞
npm audit

# 自动修复安全问题
npm audit fix

# 更新所有包到最新（小心！）
npm update

# 更新特定包
npm update express

# 查看包信息
npm view express versions
npm view express dist-tags
```

---

## 相关资源

### 官方文档

- [Dependabot 官方文档](https://docs.github.com/en/code-security/dependabot)
- [dependabot.yml 配置参考](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

### 相关工具

- [Renovate Bot](https://github.com/renovatebot/renovate) - Dependabot 替代品
- [dependabot/fetch-metadata](https://github.com/dependabot/fetch-metadata) - 获取 PR 元数据
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates) - 手动检查更新
- [Snyk](https://snyk.io/) - 安全漏洞扫描

### 延伸阅读

- [语义化版本规范](https://semver.org/)
- [如何编写好的 CHANGELOG](https://keepachangelog.com/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/securing-your-organization)

---

## 总结

### 关键要点

1. **Dependabot 是独立服务**，不是 GitHub Actions workflow
2. **配置文件位置固定**：`.github/dependabot.yml`
3. **自动化 = Dependabot + auto-merge.yml**
4. **安全优先**：安全更新自动优先处理
5. **小步迭代**：每周小更新 > 每月大更新

### 快速开始清单

- [ ] 创建 `.github/dependabot.yml`
- [ ] 配置 package-ecosystem 和 directory
- [ ] 设置合理的 schedule
- [ ] 添加标签和审查人
- [ ] 配置分组减少 PR
- [ ] 设置 auto-merge.yml（可选）
- [ ] 测试：等待第一批 PR
- [ ] 优化：根据实际情况调整

### 下一步

1. 阅读 [GITHUB-WORKFLOWS.md](./GITHUB-WORKFLOWS.md) 了解完整的 CI/CD 流程
2. 配置 `auto-merge.yml` 实现自动合并
3. 设置 GitHub Security alerts
4. 定期审查和优化配置

---

**最后更新**: 2025-01-05  
**维护者**: @trampboy
