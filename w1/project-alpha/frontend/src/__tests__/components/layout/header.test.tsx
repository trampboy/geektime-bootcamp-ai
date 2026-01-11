import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/store/theme.store';
import Header from '@/components/layout/Header';
import { vi } from 'vitest';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Ticket: ({ className }: { className: string }) => (
    <svg className={className} data-testid="ticket-icon" />
  ),
  Moon: ({ className }: { className: string }) => (
    <svg className={className} data-testid="moon-icon" />
  ),
  Sun: ({ className }: { className: string }) => (
    <svg className={className} data-testid="sun-icon" />
  ),
}));

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
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-label');
  });

  it('渲染 Ticket 图标', () => {
    renderWithTheme(<Header />);
    const icon = screen.getByTestId('ticket-icon');
    expect(icon).toBeInTheDocument();
  });
});
