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
