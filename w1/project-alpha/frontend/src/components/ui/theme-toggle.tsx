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
