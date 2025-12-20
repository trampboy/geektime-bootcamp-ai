// Project Alpha - TypeScript 类型定义

/**
 * Ticket 状态枚举
 */
export enum TicketStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

/**
 * Ticket 接口
 */
export interface Ticket {
  id: number;
  title: string;
  description?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

/**
 * 创建 Ticket DTO
 */
export interface CreateTicketDto {
  title: string;
  description?: string;
  tags?: number[];
}

/**
 * 更新 Ticket DTO
 */
export interface UpdateTicketDto {
  title?: string;
  description?: string;
}

/**
 * Tag 接口
 */
export interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt?: string;
  ticketCount?: number;
}

/**
 * 创建 Tag DTO
 */
export interface CreateTagDto {
  name: string;
  color?: string;
}

/**
 * Ticket 筛选参数
 */
export interface TicketFilters {
  status?: 'pending' | 'completed' | 'all';
  search?: string;
  tags?: number[];
}

/**
 * API 响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}
