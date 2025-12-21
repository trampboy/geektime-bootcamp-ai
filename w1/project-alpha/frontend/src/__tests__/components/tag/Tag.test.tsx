import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tag from '@/components/tag/Tag';
import { Tag as TagType } from '@/types';

describe('Tag', () => {
  const mockTag: TagType = {
    id: 1,
    name: 'Test Tag',
    color: '#ff0000',
  };

  it('应该渲染标签名称', () => {
    render(<Tag tag={mockTag} />);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  it('应该显示标签颜色', () => {
    const { container } = render(<Tag tag={mockTag} />);
    const badge = container.querySelector('[style*="background-color"]');
    expect(badge).toBeInTheDocument();
  });

  it('应该显示 ticket 数量当 showCount 为 true', () => {
    const tagWithCount: TagType = {
      ...mockTag,
      ticketCount: 5,
    };

    render(<Tag tag={tagWithCount} showCount={true} />);
    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  it('不应该显示 ticket 数量当 showCount 为 false', () => {
    const tagWithCount: TagType = {
      ...mockTag,
      ticketCount: 5,
    };

    render(<Tag tag={tagWithCount} showCount={false} />);
    expect(screen.queryByText('(5)')).not.toBeInTheDocument();
  });

  it('不应该显示 ticket 数量当 ticketCount 为 undefined', () => {
    render(<Tag tag={mockTag} showCount={true} />);
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('应该支持不同的 variant', () => {
    const { rerender } = render(<Tag tag={mockTag} variant="default" />);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();

    rerender(<Tag tag={mockTag} variant="secondary" />);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();

    rerender(<Tag tag={mockTag} variant="outline" />);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });
});
