import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketCard from '@/components/ticket/TicketCard';
import { Ticket, TicketStatus } from '@/types';

// Mock formatDate
vi.mock('@/utils/format', () => ({
  formatDate: vi.fn((date: string) => `formatted-${date}`),
}));

describe('TicketCard', () => {
  const mockTicket: Ticket = {
    id: 1,
    title: 'Test Ticket',
    description: 'Test Description',
    status: TicketStatus.PENDING,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    tags: [
      {
        id: 1,
        name: 'Tag 1',
        color: '#ff0000',
      },
    ],
  };

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onStatusChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该渲染 ticket 信息', () => {
    render(
      <TicketCard
        ticket={mockTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('进行中')).toBeInTheDocument();
  });

  it('应该显示标签', () => {
    render(
      <TicketCard
        ticket={mockTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    expect(screen.getByText('Tag 1')).toBeInTheDocument();
  });

  it('应该显示已完成状态', () => {
    const completedTicket: Ticket = {
      ...mockTicket,
      status: TicketStatus.COMPLETED,
    };

    render(
      <TicketCard
        ticket={completedTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    expect(screen.getByText('已完成')).toBeInTheDocument();
  });

  it('应该在点击编辑按钮时调用 onEdit', async () => {
    const user = userEvent.setup();
    render(
      <TicketCard
        ticket={mockTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    const editButton = screen.getByTitle('编辑');
    await user.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTicket);
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
  });

  it('应该在点击删除按钮时调用 onDelete', async () => {
    const user = userEvent.setup();
    render(
      <TicketCard
        ticket={mockTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    const deleteButton = screen.getByTitle('删除');
    await user.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTicket);
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it('应该在点击状态切换按钮时调用 onStatusChange', async () => {
    const user = userEvent.setup();
    render(
      <TicketCard
        ticket={mockTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    const statusButton = screen.getByTitle('标记为已完成');
    await user.click(statusButton);

    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith(
      mockTicket,
      TicketStatus.COMPLETED
    );
    expect(mockHandlers.onStatusChange).toHaveBeenCalledTimes(1);
  });

  it('应该在已完成状态下切换为进行中', async () => {
    const user = userEvent.setup();
    const completedTicket: Ticket = {
      ...mockTicket,
      status: TicketStatus.COMPLETED,
    };

    render(
      <TicketCard
        ticket={completedTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    const statusButton = screen.getByTitle('标记为进行中');
    await user.click(statusButton);

    expect(mockHandlers.onStatusChange).toHaveBeenCalledWith(
      completedTicket,
      TicketStatus.PENDING
    );
  });

  it('应该在没有描述时不显示描述', () => {
    const ticketWithoutDescription: Ticket = {
      ...mockTicket,
      description: undefined,
    };

    render(
      <TicketCard
        ticket={ticketWithoutDescription}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('应该在没有标签时不显示标签区域', () => {
    const ticketWithoutTags: Ticket = {
      ...mockTicket,
      tags: [],
    };

    render(
      <TicketCard
        ticket={ticketWithoutTags}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    expect(screen.queryByText('Tag 1')).not.toBeInTheDocument();
  });

  it('应该显示创建和更新时间', () => {
    render(
      <TicketCard
        ticket={mockTicket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    expect(screen.getByText(/创建:/)).toBeInTheDocument();
  });

  it('应该在 updatedAt 等于 createdAt 时不显示更新时间', () => {
    const ticket: Ticket = {
      ...mockTicket,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    render(
      <TicketCard
        ticket={ticket}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onStatusChange={mockHandlers.onStatusChange}
      />
    );

    expect(screen.queryByText(/更新:/)).not.toBeInTheDocument();
  });
});
