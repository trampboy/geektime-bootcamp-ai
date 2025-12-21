# GitHub 仓库自动化配置总结

本文档总结了为本项目配置的所有 GitHub 自动化功能。

## 📑 配置文件清单

### Workflows (GitHub Actions)

| 文件 | 用途 | 触发条件 |
|------|------|---------|
| `ci.yml` | 持续集成 | Push/PR to main/develop |
| `codeql.yml` | 代码安全扫描 | Push/PR, 每周一 |
| `pr-checks.yml` | PR 自动检查 | 打开/更新 PR |
| `lint-pr-title.yml` | PR 标题验证 | 打开/编辑 PR |
| `release.yml` | 自动发布 | 推送 v*.*.* 标签 |
| `dependency-review.yml` | 依赖审查 | PR to main/develop |
| `auto-merge.yml` | Dependabot 自动合并 | Dependabot PR |
| `stale.yml` | 过期 issue/PR 管理 | 每天凌晨 1 点 |
| `link-check.yml` | 文档链接检查 | 修改 Markdown, 每周日 |
| `issue-metrics.yml` | 月度指标报告 | 每月 1 号 |
| `greetings.yml` | 欢迎新贡献者 | 首次 PR/Issue |

### 配置文件

| 文件 | 用途 |
|------|------|
| `dependabot.yml` | Dependabot 依赖更新配置 |
| `labeler.yml` | 自动标签规则 |
| `CODEOWNERS` | 代码审查责任人 |
| `AUTO_ASSIGN.yml` | 自动分配审查者 |
| `markdown-link-check-config.json` | 链接检查配置 |

### 模板文件

| 文件 | 用途 |
|------|------|
| `PULL_REQUEST_TEMPLATE.md` | PR 描述模板 |
| `ISSUE_TEMPLATE/bug_report.yml` | Bug 报告模板 |
| `ISSUE_TEMPLATE/feature_request.yml` | 功能请求模板 |

### 文档文件

| 文件 | 用途 |
|------|------|
| `CONTRIBUTING.md` | 贡献指南 |
| `CODE_OF_CONDUCT.md` | 行为准则 |
| `SECURITY.md` | 安全政策 |
| `SUPPORT.md` | 获取支持指南 |
| `SETUP.md` | GitHub 仓库设置指南 |
| `AUTOMATION_SUMMARY.md` | 本文档 |

### 其他配置

| 文件 | 用途 |
|------|------|
| `.gitattributes` | Git 文件属性配置 |
| `.editorconfig` | 编辑器配置 |
| `CHANGELOG.md` | 变更日志 |

## 🔄 自动化流程详解

### 1. CI/CD 流程

#### 持续集成 (ci.yml)

**触发时机**：
- Push 到 main/develop/feature/* 分支
- PR 到 main/develop 分支

**执行内容**：
1. **Backend 测试**
   - 安装依赖
   - ESLint 检查
   - Jest 单元测试
   - 生成代码覆盖率
   - 上传到 Codecov
   - TypeScript 构建验证

2. **Frontend 测试**
   - 安装依赖
   - ESLint 检查
   - Vitest 单元测试
   - 生成代码覆盖率
   - 上传到 Codecov
   - Vite 构建验证

3. **E2E 测试**
   - 安装所有依赖
   - 构建 Backend 和 Frontend
   - 启动服务
   - 运行 Playwright E2E 测试
   - 上传测试报告和截图

4. **状态汇总**
   - CI Success/Failure 汇总

**结果**：
- ✅ 所有检查通过才能合并 PR
- 📊 自动生成代码覆盖率报告
- 📸 E2E 测试失败时保存截图

#### 代码安全扫描 (codeql.yml)

**触发时机**：
- Push 到 main/develop
- PR 到 main/develop
- 每周一凌晨 2 点

**执行内容**：
- 使用 CodeQL 扫描 JavaScript/TypeScript 代码
- 检测安全漏洞和代码质量问题
- 生成安全报告

**结果**：
- 🔍 在 Security 标签页查看扫描结果
- ⚠️ 发现问题时创建 Security Advisory

### 2. PR 自动化

#### PR 检查 (pr-checks.yml)

**检查项目**：

1. **PR 标题检查**
   - 验证符合 Conventional Commits 规范
   - 格式：`type(scope): subject`
   - 类型：feat, fix, docs, style, refactor, perf, test, build, ci, chore

2. **PR 大小检查**
   - 计算代码变更行数
   - 自动添加大小标签（XS, S, M, L, XL）
   - 大 PR 建议拆分

3. **合并冲突检查**
   - 检测是否存在合并冲突
   - 有冲突时标记失败

4. **自动标签**
   - 根据文件变更自动添加标签
   - 标签：backend, frontend, e2e, docs, tests 等

5. **PR 描述检查**
   - 检查描述长度和质量
   - 提示添加 checklist

#### PR 标题验证 (lint-pr-title.yml)

**验证规则**：
- 必须符合语义化提交规范
- 主题不能以大写字母开头
- 可选的作用域

**失败时**：
- ❌ 阻止合并
- 💬 提供详细的格式说明

#### 欢迎新贡献者 (greetings.yml)

**功能**：
- 首次提交 Issue 时发送欢迎消息
- 首次提交 PR 时提供贡献指南链接
- 营造友好的社区氛围

### 3. 依赖管理

#### Dependabot (dependabot.yml)

**配置内容**：

1. **更新频率**
   - 每周一早上 9 点（北京时间）
   - 同时更新根目录、Backend、Frontend、GitHub Actions

2. **分组策略**
   - 生产依赖一组
   - 开发依赖一组
   - 减少 PR 数量

3. **自动化**
   - 自动创建 PR
   - 自动添加标签
   - 自动分配审查者

4. **提交消息**
   - 生产依赖：`chore(deps): update dependencies`
   - 开发依赖：`chore(deps-dev): update dev dependencies`

#### 依赖审查 (dependency-review.yml)

**审查内容**：
- 检查新增依赖的安全性
- 验证依赖的许可证
- 阻止中等及以上严重度的漏洞
- 在 PR 中显示审查报告

**许可证策略**：
- ✅ 允许：MIT, Apache-2.0, BSD, ISC
- ❌ 拒绝：GPL, LGPL

#### 自动合并 (auto-merge.yml)

**合并策略**：
- ✅ 自动批准和合并 patch/minor 更新
- ⚠️ major 更新需要人工审查
- 📝 major 更新时添加警告评论

**前提条件**：
- 所有 CI 检查通过
- 无合并冲突
- Dependabot 创建的 PR

### 4. 发布管理

#### 自动发布 (release.yml)

**触发方式**：
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

**执行流程**：
1. 运行所有测试
2. 构建 Backend 和 Frontend
3. 创建构建产物压缩包
4. 生成 CHANGELOG
5. 创建 GitHub Release
6. 上传构建产物

**发布内容**：
- 📦 Backend 构建文件 (tar.gz)
- 📦 Frontend 构建文件 (tar.gz)
- 📝 自动生成的变更日志
- 📋 安装说明

### 5. 维护自动化

#### 过期管理 (stale.yml)

**Issue 策略**：
- 30 天无活动 → 标记为 stale
- 再过 7 天 → 自动关闭
- 豁免标签：pinned, security, bug, enhancement

**PR 策略**：
- 14 天无活动 → 标记为 stale
- 再过 7 天 → 自动关闭
- 豁免标签：pinned, security, work-in-progress

**更新时**：
- 自动移除 stale 标签

#### 链接检查 (link-check.yml)

**检查时机**：
- 修改 Markdown 文件时
- 每周日凌晨 3 点
- 手动触发

**检查内容**：
- 所有 Markdown 文件中的链接
- 忽略本地链接

**失败时**：
- 自动创建 Issue 报告
- 添加 documentation 标签

#### 月度指标 (issue-metrics.yml)

**生成内容**：
- Issue 平均关闭时间
- PR 平均合并时间
- 活跃贡献者数量
- 月度活动统计

**输出**：
- 自动创建指标报告 Issue
- 添加 metrics 标签

## 🎯 使用场景

### 场景 1：提交代码变更

```bash
# 1. 创建特性分支
git checkout -b feature/new-feature

# 2. 提交代码
git add .
git commit -m "feat(backend): add new feature"

# 3. 推送到 GitHub
git push origin feature/new-feature

# 4. 创建 PR
# 标题：feat(backend): add new feature
# 使用 PR 模板填写描述

# 自动触发：
# ✅ CI 测试
# ✅ PR 标题验证
# ✅ PR 大小检查
# ✅ 自动标签
# ✅ CodeQL 扫描
# ✅ 依赖审查
```

### 场景 2：发布新版本

```bash
# 1. 确保所有测试通过
npm test

# 2. 更新 CHANGELOG.md
# 添加新版本的变更内容

# 3. 提交变更
git add .
git commit -m "chore: prepare for release v1.0.0"

# 4. 创建标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 5. 推送标签
git push origin v1.0.0

# 自动触发：
# ✅ 运行所有测试
# ✅ 构建产物
# ✅ 创建 GitHub Release
# ✅ 生成 CHANGELOG
# ✅ 上传构建文件
```

### 场景 3：依赖更新

```bash
# 无需手动操作！

# Dependabot 自动：
# 1️⃣ 每周一检查依赖更新
# 2️⃣ 创建更新 PR
# 3️⃣ 运行 CI 测试
# 4️⃣ patch/minor 自动合并
# 5️⃣ major 等待人工审查
```

### 场景 4：报告 Bug

```bash
# 1. 访问 Issues 页面
# 2. 点击 "New issue"
# 3. 选择 "Bug 报告" 模板
# 4. 填写详细信息
# 5. 提交

# 自动触发：
# ✅ 添加 needs-triage 标签
# ✅ 首次报告者收到欢迎消息
# 📊 记录到月度指标
```

## 📊 监控和报告

### 实时监控

1. **Actions 页面**
   - 查看所有 workflow 运行状态
   - 访问：`https://github.com/用户名/仓库名/actions`

2. **Security 页面**
   - CodeQL 扫描结果
   - Dependabot 警报
   - Secret scanning 结果

3. **Insights 页面**
   - 代码频率
   - 贡献者统计
   - 网络图

### 定期报告

1. **月度指标报告**
   - 自动生成并创建 Issue
   - 包含 Issue/PR 统计

2. **代码覆盖率**
   - Codecov 报告
   - PR 中显示覆盖率变化

3. **依赖审计**
   - 每周 Dependabot 检查
   - Security Advisory 通知

## 🔧 配置维护

### 定期检查项目

- [ ] 每月查看并更新 CODEOWNERS
- [ ] 每季度审查 workflow 配置
- [ ] 每季度检查和更新标签
- [ ] 每半年审查安全策略

### 优化建议

1. **性能优化**
   - 使用缓存加速 CI
   - 并行运行测试
   - 按需运行 workflow

2. **成本优化**
   - 控制 workflow 运行时间
   - 合理设置超时
   - 避免重复构建

3. **质量优化**
   - 定期更新依赖
   - 修复 CodeQL 发现的问题
   - 提高代码覆盖率

## 🎓 学习资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Dependabot 文档](https://docs.github.com/en/code-security/dependabot)
- [CodeQL 文档](https://codeql.github.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## 📝 更新日志

| 日期 | 变更内容 |
|------|---------|
| 2024-12-21 | 初始配置完成 |

---

如有问题或建议，请提交 [Issue](https://github.com/trampboy/geektime-bootcamp-ai/issues)。
