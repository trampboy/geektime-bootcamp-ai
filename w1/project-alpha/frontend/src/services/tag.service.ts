// Project Alpha - Tag Service
import api from './api';
import { Tag, CreateTagDto, ApiResponse } from '../types';

/**
 * Tag Service
 */
export class TagService {
  /**
   * 获取所有标签
   */
  async getAllTags(): Promise<Tag[]> {
    const response = await api.get<ApiResponse<Tag[]>>('/tags');
    return (response as ApiResponse<Tag[]>).data || [];
  }

  /**
   * 根据 ID 获取标签
   */
  async getTagById(id: number): Promise<Tag> {
    const response = await api.get<ApiResponse<Tag>>(`/tags/${id}`);
    return (response as ApiResponse<Tag>).data!;
  }

  /**
   * 创建标签
   */
  async createTag(dto: CreateTagDto): Promise<Tag> {
    const response = await api.post<ApiResponse<Tag>>('/tags', dto);
    return (response as ApiResponse<Tag>).data!;
  }

  /**
   * 删除标签
   */
  async deleteTag(id: number): Promise<void> {
    await api.delete<ApiResponse>(`/tags/${id}`);
  }

  /**
   * 获取标签关联的 Ticket 数量
   */
  async getTagTicketCount(tagId: number): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>(`/tags/${tagId}/ticket-count`);
    return (response as ApiResponse<{ count: number }>).data?.count || 0;
  }
}

export default new TagService();
