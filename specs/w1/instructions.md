# Instructions

## Project alpha 需求和设计文档
创建一个简单的，使用标签分类和管理的 ticket 的工具。它基于 MySQL 数据库，使用 Express.js 作为后端，使用 TypeScript/Vite/Tailwind/Shadcn 作为前端。无需用户系统，当前用户可以:

- 创建/编辑/删除/完成/取消完成 ticket
- 添加/删除 ticket 的标签
- 按照不同的标签查看 ticket 列表
- 按 title 搜索 ticket

按照这个想法，帮我生成详细的需求和设计文档，放在 ./specs/w1/0001-specs.md 文件中,输出为中文。

## Implementation plan
按照 ./specs/w1/0001-specs.md 中的需求和设计文档，帮我生成实现计划，放在 ./specs/w1/0002-implementation-plan.md 文件中,输出为中文。

## phased development
按照 ./specs/w1/0002-implementation-plan.md 完整实现这个项目的 phase 1 代码。

## seed sql
添加一个 seed.sql 里面放 50个 meaningful 的 ticket 和几十个tags（包含platform tag，如 ios，project tag 如 viking，功能性 tag 如 autocomplete，等等）。要求 seed 文件正确可以通过 mysql 执行。

## 测试
目前只有集成测试，帮我根据项目再补上单测。
