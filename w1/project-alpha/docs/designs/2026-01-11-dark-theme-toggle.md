# 暗色模式切换功能

**日期：** 2026-01-11

## 背景

Project Alpha 是一个基于 React + TypeScript 的 Ticket 管理系统，目前仅支持亮色主题。用户希望为网页添加暗色模式支持，并提供一个便捷的切换按钮来切换主题，以提升用户体验和适应不同环境下的使用需求。

项目已经为暗色模式做好了技术准备：
- Tailwind CSS 配置中已启用暗色模式 (`darkMode: ['class']`)
- CSS 变量已定义 `:root`（亮色）和 `.dark`（暗色）两套主题
- 使用 Shadcn/ui 组件库，有完善的样式系统

## 讨论

在方案设计阶段，探索了三种实现方式并进行了对比：

### 探索的方案

1. **简单状态管理方案**
   - 使用 React Context 或 Zustand 存储主题状态
   - 优点：实现简单，性能好
   - 缺点：状态不持久，需要手动处理系统主题偏好

2. **完整主题管理系统**
   - 支持三种模式：light、dark、system
   - 使用 localStorage 持久化用户选择
   - 优点：功能完整，用户体验好
   - 缺点：实现复杂度较高

3. **使用现有 UI 库方案**
   - 检查 Shadcn/ui 是否有主题切换组件
   - 优点：保持 UI 一致性
   - 缺点：依赖外部组件

### 关键决策

**切换按钮位置：** 用户选择"顶部导航栏右侧"，这是最直观且符合现代应用设计模式的选择。

**实施方案：** 选择方案三（使用现有 UI 库方案），但结合方案一和方案二的优点，创建一个基于 Shadcn/ui 风格的完整主题切换系统。

## 方案

采用混合方案，结合了简单状态管理的易用性和完整主题系统的功能完整性：

1. **UI 风格一致性**：基于项目现有的 Button 组件创建 ThemeToggle 组件，使用太阳/月亮图标，保持与 Shadcn/ui 设计风格一致

2. **完整功能支持**：
   - 支持亮色/暗色主题切换
   - 主题状态持久化到 localStorage
   - 支持跟随系统主题（可选扩展）
   - 切换按钮位于顶部导航栏右侧

3. **用户体验优化**：
   - 点击按钮即时切换主题
   - 刷新页面保持用户选择
   - 平滑的视觉过渡效果
   - 错误处理和默认回退机制

## 架构

### 核心组件

1. **theme.store.ts** - 主题状态管理
   - 使用 Zustand（项目已有）
   - 支持三种模式：light、dark、system
   - 实现 localStorage 持久化
   - 监听系统主题变化（`prefers-color-scheme`）

2. **ThemeToggle.tsx** - 切换按钮组件
   - 基于现有 Button 组件风格
   - 使用 lucide-react 的太阳/月亮图标（项目已有）
   - 支持悬停和点击效果
   - 位于 `src/components/ui/` 目录

3. **Header.tsx** - 集成切换按钮
   - 在顶部导航栏右侧添加 ThemeToggle 组件

4. **main.tsx** - 初始化主题
   - 在应用启动时初始化主题状态
   - 应用主题 class 到 `<html>` 元素

### 数据流

```
用户点击切换按钮 → 更新 theme.store → 修改 <html> class → 触发 Tailwind 样式更新
```

### 样式切换机制

通过修改 `<html>` 元素的 `class` 属性来触发主题切换：
- 亮色模式：`<html>`（无 class 或移除 `dark`）
- 暗色模式：`<html class="dark">`

Tailwind CSS 配置的 `darkMode: ['class']` 会根据 class 自动应用对应的 CSS 变量。

### 错误处理

- 默认回退到亮色模式
- localStorage 错误静默处理
- 系统主题检测失败时使用默认主题

### 文件结构

```
frontend/src/
├── components/
│   ├── ui/
│   │   └── theme-toggle.tsx  # 新增
│   └── layout/
│       └── Header.tsx        # 修改
├── store/
│   └── theme.store.ts        # 新增
└── main.tsx                  # 修改
```

### 技术栈

- **状态管理**：Zustand（项目已有）
- **UI 组件**：基于现有 Button 组件
- **图标**：lucide-react（项目已有）
- **样式系统**：Tailwind CSS + CSS 变量（已配置）
- **持久化**：localStorage
- **系统主题检测**：`window.matchMedia('(prefers-color-scheme: dark)')`

### 测试策略

1. **组件测试**
   - ThemeToggle 组件渲染测试
   - 主题切换功能测试
   - 图标状态切换测试

2. **集成测试**
   - localStorage 持久化测试
   - 系统主题监听测试
   - 初始化逻辑测试

3. **视觉测试**
   - 验证暗色模式样式正确应用
   - 检查所有组件在暗色模式下的显示效果
