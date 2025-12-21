/**
 * Tests for QueryResultTable component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryResultTable } from '../QueryResultTable';
import type { QueryResult } from '../../types/api-types';

describe('QueryResultTable', () => {
  const mockResult: QueryResult = {
    columns: ['id', 'name', 'email'],
    rows: [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' },
    ],
    rowCount: 2,
    executionTime: 15.5,
  };

  it('should show loading state', () => {
    render(<QueryResultTable result={null} isLoading={true} />);
    expect(screen.getByText(/执行查询中/i)).toBeInTheDocument();
  });

  it('should show error message', () => {
    render(
      <QueryResultTable result={null} isLoading={false} error="Test error" />
    );
    expect(screen.getByText(/查询错误/i)).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should show empty state when no result', () => {
    render(<QueryResultTable result={null} isLoading={false} />);
    expect(screen.getByText(/暂无查询结果/i)).toBeInTheDocument();
  });

  it('should show empty result message', () => {
    const emptyResult: QueryResult = {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTime: 10,
    };
    render(<QueryResultTable result={emptyResult} isLoading={false} />);
    expect(screen.getByText(/查询成功，但没有返回数据/i)).toBeInTheDocument();
  });

  it('should render query results table', () => {
    render(<QueryResultTable result={mockResult} isLoading={false} />);
    expect(screen.getByText('查询结果')).toBeInTheDocument();
    expect(screen.getByText(/共 2 行/i)).toBeInTheDocument();
    expect(screen.getByText(/执行时间: 15.5ms/i)).toBeInTheDocument();
    
    // Check column headers
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    
    // Check data rows
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  it('should handle NULL values', () => {
    const resultWithNull: QueryResult = {
      columns: ['id', 'name'],
      rows: [{ id: 1, name: null }],
      rowCount: 1,
      executionTime: 10,
    };
    render(<QueryResultTable result={resultWithNull} isLoading={false} />);
    expect(screen.getByText('NULL')).toBeInTheDocument();
  });
});
