# 暗色模式切换功能实现计划

**目标：** 为 Project Alpha 添加暗色模式主题切换功能，支持亮色/暗色主题切换、状态持久化和系统主题跟随。

**架构：** 使用 React Context 管理主题状态，通过修改 `<html>` 元素的 class 属性触发 Tailwind CSS 的暗色模式样式，使用 localStorage 持久化用户选择，监听系统主题变化。

**技术栈：** React Context、localStorage、Tailwind CSS（darkMode: class）、lucide-react 图标

---

## Task 1: 创建主题状态管理 Store

**Files:**
- Create: `frontend/src/store/theme.store.tsx`
- Test: `frontend/src/__tests__/store/theme.store.test.tsx`

**Step 1: 创建测试文件**

```typescript
// frontend/src/__tests__/store/theme.store.test.tsx
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useThemeStore } from '@/store/theme.store';

describe('Theme Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('默认主题为 light', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useThemeStore(), { wrapper });

    expect(result.current.theme).toBe('light');
  });

  it('可以从 localStorage 恢复主题', () => {
    localStorage.setItem('theme', 'dark');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useThemeStore(), { wrapper });

    expect(result.current.theme).toBe('dark');
  });

  it('可以切换主题为 dark', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useThemeStore(), { wrapper });

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('可以切换主题为 light', () => {
    localStorage.setItem('theme', 'dark');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useThemeStore(), { wrapper });

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('可以切换主题为 system', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useThemeStore(), { wrapper });

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('system');
    expect(localStorage.getItem('theme')).toBe('system');
  });

  it('system 模式下根据系统主题返回 resolvedTheme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useThemeStore(), { wrapper });

    act(() => {
      result.current.setTheme('system');
    });

    expect(['light', 'dark']).toContain(result.current.resolvedTheme);
  });
});
```

**Step 2: 运行测试**

```bash
cd frontend
yarn test store/theme.store.test.tsx
```

**预期输出：** FAIL，文件不存在

**Step 3: 创建主题 Store**

```typescript
// frontend/src/store/theme.store.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme';

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch (e) {
    console.error('Failed to read theme from localStorage:', e);
  }
  return 'system';
};

const applyTheme = (theme: Theme, resolvedTheme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolvedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeStore must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const initial = getInitialTheme();
    return initial === 'system' ? getSystemTheme() : initial;
  });

  const updateResolvedTheme = (currentTheme: Theme) => {
    const resolved = currentTheme === 'system' ? getSystemTheme() : currentTheme;
    setResolvedTheme(resolved);
    applyTheme(currentTheme, resolved);
  };

  useEffect(() => {
    updateResolvedTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
      applyTheme('system', getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.error('Failed to save theme to localStorage:', e);
    }
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
```

**Step 4: 运行测试验证通过**

```bash
cd frontend
yarn test store/theme.store.test.tsx
```

**预期输出：** PASS

---

## Task 2: 创建主题切换按钮组件

**Files:**
- Create: `frontend/src/components/ui/theme-toggle.tsx`
- Test: `frontend/src/__tests__/components/ui/theme-toggle.test.tsx`

**Step 1: 创建测试文件**

```typescript
// frontend/src/__tests__/components/ui/theme-toggle.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/store/theme.store';
import ThemeToggle from '@/components/ui/theme-toggle';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('渲染按钮', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('显示太阳图标（light 主题）', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', '切换到暗色模式');
  });

  it('点击按钮切换到 dark 主题', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', '切换到亮色模式');
  });

  it('再次点击按钮切换回 light 主题', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', '切换到暗色模式');
  });
});
```

**Step 2: 运行测试**

```bash
cd frontend
yarn test components/ui/theme-toggle.test.tsx
```

**预期输出：** FAIL，文件不存在

**Step 3: 创建 ThemeToggle 组件**

```typescript
// frontend/src/components/ui/theme-toggle.tsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { useThemeStore } from '@/store/theme.store';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
```

**Step 4: 运行测试验证通过**

```bash
cd frontend
yarn test components/ui/theme-toggle.test.tsx
```

**预期输出：** PASS

---

## Task 3: 在 Header 中集成 ThemeToggle 组件

**Files:**
- Modify: `frontend/src/components/layout/Header.tsx`
- Test: `frontend/src/__tests__/components/layout/header.test.tsx`

**Step 1: 创建测试文件**

```typescript
// frontend/src/__tests__/components/layout/header.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/store/theme.store';
import Header from '@/components/layout/header';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Header', () => {
  it('渲染标题', () => {
    renderWithTheme(<Header />);
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
  });

  it('渲染副标题', () => {
    renderWithTheme(<Header />);
    expect(screen.getByText('Ticket 管理系统')).toBeInTheDocument();
  });

  it('渲染主题切换按钮', () => {
    renderWithTheme(<Header />);
    const toggleButton = screen.getByRole('button', {
      name: /切换到暗色模式|切换到亮色模式/
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it('渲染 Ticket 图标', () => {
    renderWithTheme(<Header />);
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });
});
```

**Step 2: 运行测试**

```bash
cd frontend
yarn test components/layout/header.test.tsx
```

**预期输出：** FAIL，主题切换按钮不存在

**Step 3: 修改 Header 组件**

```typescript
// frontend/src/components/layout/Header.tsx
import React from 'react';
import { Ticket } from 'lucide-react';
import ThemeToggle from '../ui/theme-toggle';

const Header: React.FC = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Ticket className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Project Alpha</h1>
            <span className="text-sm text-muted-foreground ml-2">Ticket 管理系统</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
```

**Step 4: 运行测试验证通过**

```bash
cd frontend
yarn test components/layout/header.test.tsx
```

**预期输出：** PASS

---

## Task 4: 在应用入口初始化 ThemeProvider

**Files:**
- Modify: `frontend/src/main.tsx`
- Test: `frontend/src/__tests__/main.test.tsx`

**Step 1: 创建测试文件**

```typescript
// frontend/src/__tests__/main.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

describe('App 初始化', () => {
  it('应用可以渲染', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
```

**Step 2: 运行测试**

```bash
cd frontend
yarn test main.test.tsx
```

**预期输出：** PASS（如果 App 已经可以渲染）

**Step 3: 修改 main.tsx**

```typescript
// frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TicketProvider } from './store/ticket.store'
import { TagProvider } from './store/tag.store'
import { ThemeProvider } from './store/theme.store'
import ErrorBoundary from './components/ui/error-boundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <TagProvider>
          <TicketProvider>
            <App />
          </TicketProvider>
        </TagProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
```

**Step 4: 运行测试验证通过**

```bash
cd frontend
yarn test main.test.tsx
```

**预期输出：** PASS

---

## Task 5: 添加过渡动画样式

**Files:**
- Modify: `frontend/src/index.css`

**Step 1: 查看当前 CSS**

```bash
cat frontend/src/index.css
```

**Step 2: 修改 index.css 添加过渡效果**

```css
/* 在文件末尾添加 */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

**Step 3: 验证样式**

```bash
cd frontend
yarn build
```

**预期输出：** 构建成功

---

## Task 6: 手动测试

**Step 1: 启动开发服务器**

```bash
cd frontend
yarn dev
```

**Step 2: 打开浏览器**

访问 http://localhost:5173

**Step 3: 测试功能**

1. 点击主题切换按钮，观察图标从太阳变为月亮
2. 验证页面背景变为暗色
3. 刷新页面，验证主题保持暗色
4. 再次点击切换回亮色主题
5. 验证 localStorage 中存储了主题选择

**Step 4: 验证存储**

在浏览器控制台执行：

```javascript
localStorage.getItem('theme')
```

**预期输出：** `'light'` 或 `'dark'`

---

## Task 7: 运行所有测试

**Step 1: 运行完整测试套件**

```bash
cd frontend
yarn test
```

**预期输出：** 所有测试通过

**Step 2: 运行 lint**

```bash
cd frontend
yarn lint
```

**预期输出：** 无错误

---

## Task 8: 类型检查

**Step 1: 运行 TypeScript 编译**

```bash
cd frontend
npx tsc --noEmit
```

**预期输出：** 无类型错误

---

## 验收标准

完成所有任务后，应满足以下标准：

1. ✅ 顶部导航栏右侧显示主题切换按钮
2. ✅ 点击按钮可以在亮色和暗色主题之间切换
3. ✅ 主题选择持久化到 localStorage
4. ✅ 刷新页面后保持用户选择的主题
5. ✅ 暗色模式下所有组件样式正确显示
6. ✅ 主题切换有平滑的过渡动画
7. ✅ 所有单元测试通过
8. ✅ 代码通过 lint 检查
9. ✅ 无 TypeScript 类型错误

---

## 需要检查的文档

- `docs/designs/2026-01-11-dark-theme-toggle.md` - 功能设计文档
- `docs/agent/architecture.md` - 项目架构说明
- `docs/agent/testing.md` - 测试规范
- `frontend/tailwind.config.js` - Tailwind CSS 配置（确认 darkMode: class）
