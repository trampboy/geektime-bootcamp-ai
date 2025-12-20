// Project Alpha - TicketList Component
import React from 'react';
import { Ticket, TicketStatus } from '@/types';
import { useTicketStore } from '@/store/ticket.store';
import TicketCard from './TicketCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  loading: boolean;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, loading, onEdit, onDelete }) => {
  const { updateTicketStatus } = useTicketStore();

  const handleStatusChange = async (ticket: Ticket, status: TicketStatus) => {
    try {
      await updateTicketStatus(ticket.id, status);
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">暂无 Tickets</p>
          <p className="text-sm text-muted-foreground mt-2">创建你的第一个 Ticket 开始使用</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
};

export default TicketList;
