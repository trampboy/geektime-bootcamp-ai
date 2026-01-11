// Project Alpha - Header Component
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
