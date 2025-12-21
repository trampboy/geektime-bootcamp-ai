# 🚀 GitHub 自动化快速开始

欢迎！本指南将帮助你快速开始使用本仓库的 GitHub 自动化功能。

## ⏱️ 5 分钟快速上手

### 1. 启用功能（2 分钟）

访问仓库的 **Settings** 页面：

#### Features 部分
- ✅ Issues
- ✅ Discussions（推荐）

#### Pull Requests 部分
- ✅ Allow squash merging
- ✅ Allow auto-merge
- ✅ Automatically delete head branches

#### Actions 部分
进入 **Settings** → **Actions** → **General**
- ✅ Allow all actions and reusable workflows
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

### 2. 配置分支保护（2 分钟）

进入 **Settings** → **Branches** → **Add branch protection rule**

**Branch name pattern**: `main`

必需配置：
- ✅ Require a pull request before merging
  - Required approvals: 1
- ✅ Require status checks to pass before merging
  - 选择: `Backend Tests`, `Frontend Tests`, `E2E Tests`, `CI Success`
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

### 3. 启用安全功能（1 分钟）

进入 **Settings** → **Security** → **Code security and analysis**

- ✅ Dependency graph
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Secret scanning（如果可用）

完成！🎉

## 📝 可选配置（5-10 分钟）

### 配置 Codecov（可选）

如果你想要代码覆盖率报告：

1. 访问 [Codecov.io](https://about.codecov.io/)
2. 使用 GitHub 登录
3. 添加你的仓库
4. 复制 token
5. 在 GitHub 仓库的 **Settings** → **Secrets** → **New repository secret**
   - Name: `CODECOV_TOKEN`
   - Value: [your-token]

### 配置 Discussions（推荐）

1. 进入 **Settings** → **Features**
2. 启用 **Discussions**
3. 访问 **Discussions** 标签页
4. 创建分类：
   - 📣 Announcements
   - 💡 Ideas
   - 🙏 Q&A
   - 📚 Show and tell

### 创建标签（推荐）

进入 **Issues** → **Labels**，创建以下标签：

**类型标签**：
- `bug` 🐛
- `enhancement` ✨
- `documentation` 📝
- `question` ❓

**优先级标签**：
- `priority: critical` 🔴
- `priority: high` 🟠
- `priority: medium` 🟡
- `priority: low` 🟢

**状态标签**：
- `status: needs-triage` 🏷️
- `status: in-progress` 🚧
- `status: blocked` 🚫

**组件标签**：
- `backend`
- `frontend`
- `e2e`
- `ci`

## ✅ 验证配置

### 方法 1: 使用验证脚本

```bash
# 在项目根目录运行
./scripts/setup-github.sh
```

### 方法 2: 手动验证

1. **验证 Actions**
   - 访问 **Actions** 标签页
   - 应该能看到所有 workflows

2. **验证 Dependabot**
   - 等待 24 小时
   - 检查是否有依赖更新 PR

3. **测试 CI**
   ```bash
   # 创建测试分支
   git checkout -b test/ci-check
   
   # 做一个小改动
   echo "# Test" >> test.md
   
   # 提交并推送
   git add test.md
   git commit -m "test: verify CI setup"
   git push origin test/ci-check
   
   # 在 GitHub 创建 PR
   # 观察 CI 是否运行
   ```

## 📚 下一步

### 学习更多

- 📖 [完整自动化说明](.github/AUTOMATION_SUMMARY.md)
- ⚙️ [详细设置指南](.github/SETUP.md)
- 🤝 [贡献指南](.github/CONTRIBUTING.md)

### 开始使用

1. **克隆仓库并安装依赖**
   ```bash
   git clone [仓库地址]
   cd geektime-bootcamp-ai
   npm install
   cd w2/db_query/backend && npm install
   cd ../frontend && npm install
   ```

2. **开始开发**
   ```bash
   # 启动 Backend
   cd w2/db_query/backend
   npm run dev
   
   # 启动 Frontend（新终端）
   cd w2/db_query/frontend
   npm run dev
   ```

3. **运行测试**
   ```bash
   # Backend 测试
   cd w2/db_query/backend
   npm test
   
   # Frontend 测试
   cd w2/db_query/frontend
   npm test
   
   # E2E 测试
   cd <项目根目录>
   npm run test:e2e
   ```

4. **提交代码**
   ```bash
   git checkout -b feature/my-feature
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   # 创建 PR
   ```

## 🆘 常见问题

### Q: CI 检查失败怎么办？

**A**: 
1. 点击失败的检查查看详细日志
2. 在本地复现问题
3. 修复后推送新提交

### Q: Dependabot PR 什么时候会创建？

**A**: Dependabot 每周一早上 9 点（北京时间）检查更新，首次可能需要等待 24 小时。

### Q: 如何跳过某些 CI 检查？

**A**: 一般不建议跳过。如果确实需要，可以在提交消息中添加 `[skip ci]`。

### Q: PR 无法合并？

**A**: 检查：
1. 所有 CI 检查是否通过
2. 是否有合并冲突
3. 是否有足够的审查批准
4. PR 标题是否符合规范

## 🎯 最佳实践

### 提交规范

```bash
# 好的提交消息
feat(backend): add user authentication
fix(frontend): resolve routing issue
docs: update API documentation

# 不好的提交消息
update code
fix bug
changes
```

### PR 规范

- ✅ 使用描述性的标题
- ✅ 填写完整的 PR 描述
- ✅ 包含相关的 Issue 编号
- ✅ 添加测试
- ✅ 更新文档
- ✅ 保持 PR 小而专注

### 分支命名

```bash
# 推荐
feature/add-user-auth
fix/resolve-login-bug
docs/update-readme

# 不推荐
my-branch
test
new-feature
```

## 📞 需要帮助？

- 📖 查看 [SUPPORT.md](.github/SUPPORT.md)
- 💬 在 [Discussions](../../discussions) 提问
- 🐛 在 [Issues](../../issues) 报告问题

---

祝你使用愉快！如有问题，随时提问。🚀
