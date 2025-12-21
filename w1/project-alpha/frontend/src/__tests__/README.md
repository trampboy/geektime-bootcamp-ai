# 前端测试文档

## 测试框架

本项目使用以下测试工具：
- **Vitest**: 测试运行器和断言库
- **React Testing Library**: React 组件测试工具
- **@testing-library/user-event**: 用户交互模拟
- **jsdom**: DOM 环境模拟

## 运行测试

```bash
# 运行所有测试
npm test

# 运行测试（监听模式）
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行测试 UI（可视化界面）
npm run test:ui
```

## 测试结构

```
src/__tests__/
├── setup.ts                    # 测试环境配置
├── components/                 # 组件测试
│   ├── ticket/
│   │   └── TicketCard.test.tsx
│   └── tag/
│       └── Tag.test.tsx
├── hooks/                      # Hook 测试
│   └── useDebounce.test.tsx
├── services/                   # Service 测试
│   ├── ticket.service.test.ts
│   └── tag.service.test.ts
└── utils/                      # 工具函数测试
    ├── format.test.ts
    └── cn.test.ts
```

## 测试覆盖范围

### 工具函数测试
- ✅ `format.ts`: 日期格式化函数测试
- ✅ `cn.ts`: 类名合并工具测试

### Hook 测试
- ✅ `useDebounce.ts`: 防抖 Hook 测试

### Service 测试
- ✅ `ticket.service.ts`: Ticket 服务所有方法测试
- ✅ `tag.service.test.ts`: Tag 服务所有方法测试

### 组件测试
- ✅ `TicketCard.tsx`: Ticket 卡片组件测试
- ✅ `Tag.tsx`: Tag 组件测试

## 编写测试指南

### 组件测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('应该正确渲染', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Service 测试示例

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MyService } from '@/services/my.service';
import api from '@/services/api';

vi.mock('@/services/api');

describe('MyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该调用正确的 API', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });
    const service = new MyService();
    await service.getAll();
    expect(api.get).toHaveBeenCalledWith('/endpoint');
  });
});
```

## 注意事项

1. 所有测试文件应放在 `src/__tests__` 目录下，保持与源代码相同的目录结构
2. 使用 `vi.mock()` 来模拟外部依赖（如 API 调用）
3. 使用 `@testing-library/user-event` 来模拟用户交互
4. 每个测试应该独立，使用 `beforeEach` 清理状态
5. 测试应该关注组件的行为，而不是实现细节
