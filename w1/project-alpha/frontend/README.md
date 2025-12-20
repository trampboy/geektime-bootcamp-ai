# Project Alpha - Frontend

基于 React + TypeScript + Vite + Tailwind CSS 的 Ticket 管理系统前端。

## 技术栈

- **React** v18 - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - CSS 框架
- **Shadcn/ui** - UI 组件库
- **Axios** - HTTP 客户端

## 项目结构

```
frontend/
├── src/
│   ├── components/          # React 组件
│   │   ├── layout/          # 布局组件
│   │   ├── ticket/          # Ticket 相关组件
│   │   ├── tag/             # Tag 相关组件
│   │   └── ui/              # Shadcn/ui 组件
│   ├── hooks/               # 自定义 Hooks
│   ├── services/            # API 服务层
│   ├── store/               # 状态管理
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 应用入口组件
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量（可选）

创建 `.env` 文件：

```bash
VITE_API_URL=http://localhost:3000/api
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建输出在 `dist/` 目录。

### 5. 预览生产构建

```bash
npm run preview
```

## 安装 Shadcn/ui 组件

本项目使用 Shadcn/ui 组件库。安装所需组件：

```bash
# 安装 Button 组件
npx shadcn-ui@latest add button

# 安装 Input 组件
npx shadcn-ui@latest add input

# 安装 Dialog 组件
npx shadcn-ui@latest add dialog

# 安装 Checkbox 组件
npx shadcn-ui@latest add checkbox

# 安装 Badge 组件
npx shadcn-ui@latest add badge

# 安装 Card 组件
npx shadcn-ui@latest add card

# 安装其他需要的组件...
```

## 功能特性

### Phase 1 已完成
- ✅ 项目初始化
- ✅ Tailwind CSS 配置
- ✅ TypeScript 配置
- ✅ Vite 配置
- ✅ API 服务层基础
- ✅ 工具函数库

### Phase 2 & 3（待实现）
- Ticket CRUD 功能
- Tag 管理功能
- 搜索和筛选功能
- UI 组件库

### Phase 4（待实现）
- 完整的用户界面
- 响应式设计
- 交互优化

## 开发规范

- 组件使用 PascalCase 命名
- 文件名使用 PascalCase
- 使用函数式组件和 Hooks
- 遵循 TypeScript 严格模式
- 使用 Tailwind CSS 进行样式开发

## License

MIT
