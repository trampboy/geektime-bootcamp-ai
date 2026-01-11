import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useThemeStore } from '@/store/theme.store';

describe('Theme Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('默认主题为 light', () => {
    localStorage.clear();
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
