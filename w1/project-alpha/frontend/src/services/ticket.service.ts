// Project Alpha - Ticket Service
import api from './api';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketFilters, TicketStatus, ApiResponse } from '../types';

/**
 * Ticket Service
 */
export class TicketService {
  /**
   * 获取所有 Tickets（支持筛选）
   */
  async getAllTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const params: Record<string, string> = {};
    
    if (filters?.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    
    if (filters?.search) {
      params.search = filters.search;
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      params.tags = filters.tags.join(',');
    }

    const response = await api.get<ApiResponse<Ticket[]>>('/tickets', { params });
    return (response as ApiResponse<Ticket[]>).data || [];
  }

  /**
   * 根据 ID 获取 Ticket
   */
  async getTicketById(id: number): Promise<Ticket> {
    const response = await api.get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return (response as ApiResponse<Ticket>).data!;
  }

  /**
   * 创建 Ticket
   */
  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const response = await api.post<ApiResponse<Ticket>>('/tickets', dto);
    return (response as ApiResponse<Ticket>).data!;
  }

  /**
   * 更新 Ticket
   */
  async updateTicket(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    const response = await api.put<ApiResponse<Ticket>>(`/tickets/${id}`, dto);
    return (response as ApiResponse<Ticket>).data!;
  }

  /**
   * 删除 Ticket
   */
  async deleteTicket(id: number): Promise<void> {
    await api.delete<ApiResponse>(`/tickets/${id}`);
  }

  /**
   * 更新 Ticket 状态
   */
  async updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
    const response = await api.patch<ApiResponse<Ticket>>(`/tickets/${id}/status`, { status });
    return (response as ApiResponse<Ticket>).data!;
  }

  /**
   * 批量设置 Ticket 标签
   */
  async setTicketTags(ticketId: number, tagIds: number[]): Promise<Ticket> {
    const response = await api.put<ApiResponse<Ticket>>(`/tickets/${ticketId}/tags`, { tags: tagIds });
    return (response as ApiResponse<Ticket>).data!;
  }

  /**
   * 添加标签到 Ticket
   */
  async addTagToTicket(ticketId: number, tagId: number): Promise<Ticket> {
    const response = await api.post<ApiResponse<Ticket>>(`/tickets/${ticketId}/tags/${tagId}`);
    return (response as ApiResponse<Ticket>).data!;
  }

  /**
   * 从 Ticket 删除标签
   */
  async removeTagFromTicket(ticketId: number, tagId: number): Promise<Ticket> {
    const response = await api.delete<ApiResponse<Ticket>>(`/tickets/${ticketId}/tags/${tagId}`);
    return (response as ApiResponse<Ticket>).data!;
  }
}

export default new TicketService();
