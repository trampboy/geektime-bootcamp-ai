// Project Alpha - Ticket Store
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketFilters, TicketStatus } from '../types';
import ticketService from '../services/ticket.service';

interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  filters: TicketFilters;
  setFilters: (filters: TicketFilters) => void;
  fetchTickets: () => Promise<void>;
  getTicketById: (id: number) => Promise<Ticket | null>;
  createTicket: (dto: CreateTicketDto) => Promise<Ticket>;
  updateTicket: (id: number, dto: UpdateTicketDto) => Promise<Ticket>;
  deleteTicket: (id: number) => Promise<void>;
  updateTicketStatus: (id: number, status: TicketStatus) => Promise<Ticket>;
  setTicketTags: (ticketId: number, tagIds: number[]) => Promise<Ticket>;
  addTagToTicket: (ticketId: number, tagId: number) => Promise<Ticket>;
  removeTagFromTicket: (ticketId: number, tagId: number) => Promise<Ticket>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTicketStore = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketStore must be used within TicketProvider');
  }
  return context;
};

interface TicketProviderProps {
  children: ReactNode;
}

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TicketFilters>({
    status: 'all',
    search: '',
    tags: []
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getAllTickets(filters);
      setTickets(data);
    } catch (err: any) {
      setError(err.message || '获取 Tickets 失败');
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // 当 filters 变化时自动重新获取数据
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const getTicketById = useCallback(async (id: number): Promise<Ticket | null> => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.getTicketById(id);
      return ticket;
    } catch (err: any) {
      setError(err.message || '获取 Ticket 失败');
      console.error('Failed to get ticket:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTicket = useCallback(async (dto: CreateTicketDto): Promise<Ticket> => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.createTicket(dto);
      await fetchTickets(); // 刷新列表
      return ticket;
    } catch (err: any) {
      setError(err.message || '创建 Ticket 失败');
      console.error('Failed to create ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  const updateTicket = useCallback(async (id: number, dto: UpdateTicketDto): Promise<Ticket> => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.updateTicket(id, dto);
      await fetchTickets(); // 刷新列表
      return ticket;
    } catch (err: any) {
      setError(err.message || '更新 Ticket 失败');
      console.error('Failed to update ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  const deleteTicket = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await ticketService.deleteTicket(id);
      await fetchTickets(); // 刷新列表
    } catch (err: any) {
      setError(err.message || '删除 Ticket 失败');
      console.error('Failed to delete ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  const updateTicketStatus = useCallback(async (id: number, status: TicketStatus): Promise<Ticket> => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.updateTicketStatus(id, status);
      await fetchTickets(); // 刷新列表
      return ticket;
    } catch (err: any) {
      setError(err.message || '更新 Ticket 状态失败');
      console.error('Failed to update ticket status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  const setTicketTags = useCallback(async (ticketId: number, tagIds: number[]): Promise<Ticket> => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.setTicketTags(ticketId, tagIds);
      await fetchTickets(); // 刷新列表
      return ticket;
    } catch (err: any) {
      setError(err.message || '设置 Ticket 标签失败');
      console.error('Failed to set ticket tags:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  const addTagToTicket = useCallback(async (ticketId: number, tagId: number): Promise<Ticket> => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.addTagToTicket(ticketId, tagId);
      await fetchTickets(); // 刷新列表
      return ticket;
    } catch (err: any) {
      setError(err.message || '添加标签失败');
      console.error('Failed to add tag to ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  const removeTagFromTicket = useCallback(async (ticketId: number, tagId: number): Promise<Ticket> => {
    try {
      setLoading(true);
      setError(null);
      const ticket = await ticketService.removeTagFromTicket(ticketId, tagId);
      await fetchTickets(); // 刷新列表
      return ticket;
    } catch (err: any) {
      setError(err.message || '删除标签失败');
      console.error('Failed to remove tag from ticket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTickets]);

  const value: TicketContextType = {
    tickets,
    loading,
    error,
    filters,
    setFilters,
    fetchTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    updateTicketStatus,
    setTicketTags,
    addTagToTicket,
    removeTagFromTicket
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};
