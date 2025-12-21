# 获取支持

感谢使用本项目！如果你需要帮助，以下是获取支持的几种方式：

## 📚 文档

在寻求帮助之前，请先查看以下文档：

- [README.md](../README.md) - 项目概述和快速开始
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [SETUP.md](SETUP.md) - GitHub 仓库设置指南
- [Week 2 项目文档](../w2/db_query/README.md) - 数据库查询工具详细文档

## 🔍 搜索现有问题

你遇到的问题可能已经有人报告过了：

1. 搜索 [已有的 Issues](https://github.com/trampboy/geektime-bootcamp-ai/issues)
2. 查看 [已关闭的 Issues](https://github.com/trampboy/geektime-bootcamp-ai/issues?q=is%3Aissue+is%3Aclosed)
3. 浏览 [Discussions](https://github.com/trampboy/geektime-bootcamp-ai/discussions)

## 💬 提问方式

### 一般性问题

对于一般性问题、讨论和想法：

1. 访问 [Discussions](https://github.com/trampboy/geektime-bootcamp-ai/discussions)
2. 选择合适的分类：
   - **Q&A** - 提问和解答
   - **Ideas** - 功能建议和讨论
   - **Show and tell** - 分享你的使用经验
   - **General** - 一般性讨论

### Bug 报告

如果你发现了 bug：

1. 确认这是一个真正的 bug，而不是使用问题
2. 搜索现有 issues 确认未被报告
3. 使用 [Bug 报告模板](https://github.com/trampboy/geektime-bootcamp-ai/issues/new?template=bug_report.yml) 创建新 issue
4. 提供尽可能详细的信息：
   - 重现步骤
   - 期望行为
   - 实际行为
   - 环境信息
   - 错误日志

### 功能请求

如果你有新功能的想法：

1. 搜索现有 issues 确认未被提出
2. 使用 [功能请求模板](https://github.com/trampboy/geektime-bootcamp-ai/issues/new?template=feature_request.yml) 创建新 issue
3. 清楚描述：
   - 使用场景
   - 期望的功能
   - 为什么需要这个功能
   - 可能的实现方案

### 安全问题

**重要：请勿在公开 issue 中报告安全漏洞！**

请查看 [SECURITY.md](SECURITY.md) 了解如何安全地报告安全问题。

## 🚀 快速开始帮助

### 安装问题

**问题：依赖安装失败**

```bash
# 清理缓存后重试
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**问题：Node.js 版本不兼容**

```bash
# 确认使用 Node.js 20+
node --version

# 如需安装或切换版本，推荐使用 nvm
nvm install 20
nvm use 20
```

### 运行问题

**问题：Backend 无法启动**

1. 检查环境变量配置
   ```bash
   cd w2/db_query/backend
   cp .env.example .env
   # 编辑 .env 文件
   ```

2. 检查端口占用
   ```bash
   # macOS/Linux
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

**问题：Frontend 无法连接 Backend**

1. 确认 Backend 正在运行
2. 检查 Frontend 的 API 配置
3. 检查 CORS 设置

### 测试问题

**问题：E2E 测试失败**

1. 确保 Backend 和 Frontend 都在运行
2. 安装 Playwright 浏览器
   ```bash
   npx playwright install
   ```

3. 清理之前的测试结果
   ```bash
   rm -rf test-results playwright-report
   ```

## 📧 联系方式

### 优先级顺序

1. **Discussions** - 一般性问题和讨论（推荐）
2. **Issues** - Bug 报告和功能请求
3. **Email** - 私密或敏感问题（如果提供了邮箱）

### 响应时间

我们会尽力及时响应，但请注意：

- 这是一个学习项目，维护者可能有其他工作
- 一般会在 **2-5 个工作日**内回复
- 复杂问题可能需要更长时间
- 周末和节假日可能响应较慢

## 🤝 贡献支持

如果你愿意帮助其他用户：

1. 回答 Discussions 中的问题
2. 帮助验证和重现 bug
3. 完善文档
4. 提交 PR 修复问题

详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📖 学习资源

### 项目相关

- [Node.js 文档](https://nodejs.org/docs/)
- [Express.js 文档](https://expressjs.com/)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Playwright 文档](https://playwright.dev/)

### AI/LLM 相关

- [OpenAI API 文档](https://platform.openai.com/docs)
- [Prompt Engineering 指南](https://www.promptingguide.ai/)

### 数据库相关

- [SQLite 文档](https://www.sqlite.org/docs.html)
- [MySQL 文档](https://dev.mysql.com/doc/)
- [SQL 教程](https://www.sqltutorial.org/)

## ✅ 提问清单

在提问前，请确认：

- [ ] 我已经阅读了相关文档
- [ ] 我已经搜索了现有的 issues 和 discussions
- [ ] 我已经尝试了基本的故障排查步骤
- [ ] 我准备好了详细的问题描述和重现步骤
- [ ] 我已经收集了相关的错误日志和环境信息

## 🎓 常见问题 (FAQ)

### Q: 这个项目支持哪些数据库？

A: 目前支持 SQLite 和 MySQL。更多数据库支持正在计划中。

### Q: 如何配置 OpenAI API？

A: 在 `w2/db_query/backend/.env` 文件中设置 `OPENAI_API_KEY`。参考 `.env.example`。

### Q: E2E 测试必须运行吗？

A: 如果你只是开发单个组件，可以只运行相关的单元测试。但提交 PR 前建议运行完整测试。

### Q: 如何贡献代码？

A: 请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献流程。

### Q: 项目的许可证是什么？

A: ISC License。详见 LICENSE 文件。

---

## 其他资源

- [项目仓库](https://github.com/trampboy/geektime-bootcamp-ai)
- [问题追踪](https://github.com/trampboy/geektime-bootcamp-ai/issues)
- [讨论区](https://github.com/trampboy/geektime-bootcamp-ai/discussions)
- [变更日志](../CHANGELOG.md)

感谢你的耐心！我们很高兴能帮助你。❤️
