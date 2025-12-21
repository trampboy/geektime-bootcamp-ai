# GitHub 仓库设置指南

本文档说明如何配置 GitHub 仓库以充分利用已配置的自动化功能。

## 📋 目录

- [仓库设置](#仓库设置)
- [分支保护规则](#分支保护规则)
- [Secrets 配置](#secrets-配置)
- [Webhooks 设置](#webhooks-设置)
- [可选配置](#可选配置)

## 仓库设置

### 1. 基础设置

进入 **Settings** → **General**：

#### Features
- ✅ Wikis（可选）
- ✅ Issues
- ✅ Projects（可选）
- ✅ Discussions（推荐）

#### Pull Requests
- ✅ Allow squash merging
  - 默认提交消息：`Pull request title`
- ✅ Allow auto-merge
- ✅ Automatically delete head branches
- ❌ Allow merge commits（建议关闭）
- ❌ Allow rebase merging（建议关闭）

### 2. 分支设置

进入 **Settings** → **Branches**：

#### Default branch
- 设置为 `main`

## 分支保护规则

### 保护 main 分支

进入 **Settings** → **Branches** → **Add branch protection rule**

#### Branch name pattern
```
main
```

#### 保护规则配置

**Require a pull request before merging**
- ✅ Enable
- Required number of approvals: `1`
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners（如果有 CODEOWNERS 文件）

**Require status checks to pass before merging**
- ✅ Enable
- ✅ Require branches to be up to date before merging

必需的状态检查：
- ✅ `Backend Tests`
- ✅ `Frontend Tests`
- ✅ `E2E Tests`
- ✅ `CI Success`
- ✅ `Validate PR Title`

**Require conversation resolution before merging**
- ✅ Enable

**Require signed commits**（可选，推荐）
- ✅ Enable

**Require linear history**（可选）
- ✅ Enable

**Do not allow bypassing the above settings**
- ✅ Enable（推荐管理员也遵守规则）

**Restrict who can push to matching branches**（可选）
- 仅限维护者

### 保护 develop 分支

使用类似的规则，但可以适当放宽：
- Required approvals: `1`
- 必需的状态检查：同 main

## Secrets 配置

进入 **Settings** → **Secrets and variables** → **Actions**

### Repository secrets

#### 必需的 Secrets

**CODECOV_TOKEN**（可选，推荐）
1. 访问 [Codecov](https://about.codecov.io/)
2. 添加你的仓库
3. 复制 token
4. 添加到 GitHub Secrets

#### 可选的 Secrets

**OPENAI_API_KEY**（如需在 CI 中运行完整测试）
- 用于测试 OpenAI 集成功能

### 配置步骤

```bash
# 添加 Secret
Settings → Secrets and variables → Actions → New repository secret

Name: CODECOV_TOKEN
Secret: [your-codecov-token]
```

## Webhooks 设置

### Slack 通知（可选）

如果想接收构建通知到 Slack：

1. 在 Slack 中创建 Incoming Webhook
2. 修改 `.github/workflows/ci.yml`，添加通知步骤：

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

3. 在 GitHub Secrets 中添加 `SLACK_WEBHOOK_URL`

## 可选配置

### 1. Code Owners

创建 `.github/CODEOWNERS` 文件：

```bash
# 默认所有文件的审查者
* @trampboy

# Backend 代码
/w2/db_query/backend/ @trampboy

# Frontend 代码
/w2/db_query/frontend/ @trampboy

# CI/CD 配置
/.github/ @trampboy

# 文档
*.md @trampboy
```

### 2. 议题和 PR 标签

进入 **Issues** → **Labels**，创建以下标签：

#### 类型标签
- `bug` 🐛 - Bug 报告
- `enhancement` ✨ - 功能增强
- `documentation` 📝 - 文档相关
- `question` ❓ - 问题咨询

#### 优先级标签
- `priority: critical` 🔴 - 严重问题
- `priority: high` 🟠 - 高优先级
- `priority: medium` 🟡 - 中优先级
- `priority: low` 🟢 - 低优先级

#### 状态标签
- `status: needs-triage` 🏷️ - 需要分类
- `status: in-progress` 🚧 - 进行中
- `status: blocked` 🚫 - 被阻塞
- `status: ready-for-review` 👀 - 待审查

#### 组件标签
- `backend` - Backend 相关
- `frontend` - Frontend 相关
- `e2e` - E2E 测试
- `ci` - CI/CD 相关

#### 其他标签
- `good first issue` 👶 - 适合新手
- `help wanted` 🙋 - 需要帮助
- `dependencies` 📦 - 依赖更新
- `automated` 🤖 - 自动生成

### 3. Projects（可选）

创建 GitHub Project 来跟踪工作：

1. 进入 **Projects** → **New project**
2. 选择 Board 或 Table 视图
3. 添加以下列：
   - Todo
   - In Progress
   - In Review
   - Done

### 4. Discussions（推荐）

启用 Discussions 进行社区交流：

1. 进入 **Settings** → **Features**
2. 启用 **Discussions**
3. 创建分类：
   - 📣 Announcements
   - 💡 Ideas
   - 🙏 Q&A
   - 📚 Show and tell

### 5. Actions 权限

进入 **Settings** → **Actions** → **General**：

**Actions permissions**
- ✅ Allow all actions and reusable workflows

**Workflow permissions**
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

### 6. 安全设置

进入 **Settings** → **Security** → **Code security and analysis**：

**Dependency graph**
- ✅ Enable

**Dependabot alerts**
- ✅ Enable

**Dependabot security updates**
- ✅ Enable

**Secret scanning**
- ✅ Enable（私有仓库需要 GitHub Advanced Security）

**Push protection**
- ✅ Enable

## 验证配置

### 1. 测试 CI 流程

```bash
# 创建测试分支
git checkout -b test/ci-setup

# 做一个小改动
echo "# CI Test" >> test.md
git add test.md
git commit -m "test(ci): verify CI setup"

# 推送并创建 PR
git push origin test/ci-setup

# 在 GitHub 上创建 PR 到 main 分支
# 观察 CI 是否正常运行
```

### 2. 测试 Dependabot

等待 Dependabot 自动创建依赖更新 PR（通常在配置后 24 小时内）。

### 3. 测试自动发布

```bash
# 创建版本标签
git tag -a v0.1.0 -m "Test release"
git push origin v0.1.0

# 检查 Actions 页面，确认 Release workflow 运行
# 检查 Releases 页面，确认 Release 创建成功
```

## 故障排查

### CI 失败

1. 检查 Actions 页面的详细日志
2. 确认所有依赖已正确安装
3. 验证环境变量配置

### Dependabot PR 未创建

1. 检查 `.github/dependabot.yml` 配置
2. 确认 Dependabot 已启用
3. 检查是否有依赖需要更新

### 自动合并不工作

1. 确认 auto-merge 已在仓库设置中启用
2. 检查分支保护规则
3. 确认 GitHub Actions 有足够的权限

## 维护建议

### 定期检查

- ✅ 每周查看 Actions 运行状态
- ✅ 每月查看 Dependabot PR 并合并
- ✅ 每月查看 CodeQL 扫描结果
- ✅ 每月查看项目指标报告

### 监控指标

- CI 通过率
- 平均 PR 合并时间
- Issue 和 PR 关闭率
- 代码覆盖率趋势
- 依赖更新频率

## 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Dependabot 文档](https://docs.github.com/en/code-security/dependabot)
- [分支保护规则](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [CODEOWNERS 文档](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

---

如有问题，请提交 [Issue](https://github.com/trampboy/geektime-bootcamp-ai/issues)。
