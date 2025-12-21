<!--
Sync Impact Report:
Version change: N/A → 1.0.0 (Initial creation)
Modified principles: N/A (new document)
Added sections: Core Principles (TypeScript Development, Strict Type Annotations, JSON Naming Convention, No Authentication)
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section will reference these principles
  ✅ spec-template.md - Requirements section aligns with TypeScript and naming conventions
  ✅ tasks-template.md - Task categorization reflects TypeScript development requirements
Follow-up TODOs: None
-->

# Geektime Bootcamp AI Constitution

## Core Principles

### I. TypeScript Development (NON-NEGOTIABLE)

前后端都使用 TypeScript 进行开发。所有源代码文件必须使用 TypeScript 编写，不允许使用纯 JavaScript。TypeScript 配置必须启用严格模式（strict mode），确保类型安全。

**Rationale**: TypeScript 提供编译时类型检查，能够提前发现错误，提高代码质量和可维护性。

### II. Strict Type Annotations (NON-NEGOTIABLE)

前后端都要有严格的类型标注。所有函数参数、返回值、变量、接口、类型定义都必须明确标注类型。禁止使用 `any` 类型，除非有明确的理由并添加注释说明。

**Rationale**: 严格的类型标注确保代码的可读性、可维护性，并充分利用 TypeScript 的类型系统优势。

### III. JSON Naming Convention

所有后端生成的 JSON 数据，使用 camelCase 进行命名。API 响应、请求体、数据库查询结果等所有 JSON 格式的数据都必须遵循 camelCase 命名规范。

**Rationale**: 统一的命名规范确保前后端数据交互的一致性，符合 JavaScript/TypeScript 社区的标准实践。

### IV. No Authentication System

不需要认证系统，任何用户都可以使用。系统不实现用户认证、授权或权限控制机制。所有功能对所有用户开放访问。

**Rationale**: 简化系统架构，降低开发复杂度，适用于内部工具或演示项目场景。

## Technology Stack Requirements

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: SQLite (用于存储元数据), MySQL (用于查询目标数据库)
- **AI SDK**: OpenAI SDK

### Frontend
- **Framework**: React
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Code Editor**: Monaco Editor

## Development Workflow

### Code Quality Standards
- 所有代码必须通过 TypeScript 编译检查，无类型错误
- 所有 API 响应必须使用 camelCase 命名
- 代码提交前必须确保类型标注完整

### API Design
- 所有 API 端点必须遵循 RESTful 规范
- API 响应格式统一为 JSON
- 错误响应必须包含明确的错误信息

## Governance

本宪法优先于所有其他开发实践和规范。任何违反宪法原则的代码变更都必须经过审查和批准。修改宪法需要：
1. 更新版本号（遵循语义化版本规范）
2. 记录修改原因和影响范围
3. 更新相关模板和文档

所有代码审查必须验证是否符合宪法原则。任何复杂性增加都必须有明确的理由。

**Version**: 1.0.0 | **Ratified**: 2025-12-21 | **Last Amended**: 2025-12-21
