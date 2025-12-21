/**
 * Tests for DatabaseList component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DatabaseList } from '../DatabaseList';
import type { DatabaseInfo } from '../../types/api-types';

describe('DatabaseList', () => {
  const mockDatabases: DatabaseInfo[] = [
    {
      name: 'test-db-1',
      url: 'mysql://localhost/test1',
      createdAt: '2025-12-21T10:00:00Z',
      updatedAt: '2025-12-21T10:00:00Z',
    },
    {
      name: 'test-db-2',
      url: 'mysql://localhost/test2',
      createdAt: '2025-12-21T11:00:00Z',
      updatedAt: '2025-12-21T11:00:00Z',
    },
  ];

  it('should render empty message when no databases', () => {
    const onSelectDatabase = vi.fn();
    render(
      <DatabaseList
        databases={[]}
        onSelectDatabase={onSelectDatabase}
      />
    );
    expect(screen.getByText(/No databases added yet/i)).toBeInTheDocument();
  });

  it('should render list of databases', () => {
    const onSelectDatabase = vi.fn();
    render(
      <DatabaseList
        databases={mockDatabases}
        onSelectDatabase={onSelectDatabase}
      />
    );
    expect(screen.getByText('test-db-1')).toBeInTheDocument();
    expect(screen.getByText('test-db-2')).toBeInTheDocument();
  });

  it('should highlight selected database', () => {
    const onSelectDatabase = vi.fn();
    const { container } = render(
      <DatabaseList
        databases={mockDatabases}
        onSelectDatabase={onSelectDatabase}
        selectedDatabase="test-db-1"
      />
    );
    // Find the database item container (parent of the text)
    const db1Text = screen.getByText('test-db-1');
    const db1Container = db1Text.closest('div[class*="border"]');
    expect(db1Container).toBeTruthy();
    expect(db1Container?.className).toContain('border-blue-500');
    expect(db1Container?.className).toContain('bg-blue-50');
  });

  it('should call onSelectDatabase when database is clicked', () => {
    const onSelectDatabase = vi.fn();
    render(
      <DatabaseList
        databases={mockDatabases}
        onSelectDatabase={onSelectDatabase}
      />
    );
    screen.getByText('test-db-1').click();
    expect(onSelectDatabase).toHaveBeenCalledWith('test-db-1');
  });
});
