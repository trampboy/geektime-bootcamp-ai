// Project Alpha - Ticket Store
import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo, ReactNode } from 'react';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketFilters, TicketStatus } from '../types';
import ticketService from '../services/ticket.service';

interface TicketContextType {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  filters: TicketFilters;
  setFilters: (filters: TicketFilters | ((prev: TicketFilters) => TicketFilters)) => void;
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
  const [filters, setFiltersState] = useState<TicketFilters>({
    status: 'all',
    search: '',
    tags: []
  });
  
  // 使用 useRef 存储最新的 filters，避免 fetchTickets 依赖 filters 导致循环
  const filtersRef = useRef<TicketFilters>(filters);
  
  // 更新 ref 当 filters 变化时
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // 稳定的 setFilters 函数
  const setFilters = useCallback((newFilters: TicketFilters | ((prev: TicketFilters) => TicketFilters)) => {
    setFiltersState((prev) => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      return updated;
    });
  }, []);

  // fetchTickets 不依赖 filters，而是使用 ref 获取最新值
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getAllTickets(filtersRef.current);
      setTickets(data);
    } catch (err: any) {
      setError(err.message || '获取 Tickets 失败');
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 使用 JSON.stringify 来比较 filters 的实际值是否变化，避免引用变化导致循环
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  // 当 filters 实际值变化时才重新获取数据
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]); // 只依赖 filtersKey，不依赖 fetchTickets

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
