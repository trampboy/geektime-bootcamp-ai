// Project Alpha - Ticket Service
import mysql2 from 'mysql2';
import pool from '../config/database';
import { Ticket, CreateTicketDto, UpdateTicketDto, TicketFilters, TicketStatus } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { logger } from '../utils/logger';
import tagService from './tag.service';

/**
 * Ticket Service
 */
export class TicketService {
  /**
   * 获取所有 Tickets（支持筛选和搜索）
   */
  async getAllTickets(filters?: TicketFilters): Promise<Ticket[]> {
    try {
      let query = `
        SELECT 
          t.id,
          t.title,
          t.description,
          t.status,
          t.created_at as createdAt,
          t.updated_at as updatedAt
        FROM tickets t
      `;
      const conditions: string[] = [];
      const params: any[] = [];

      // 标签筛选
      if (filters?.tags) {
        const tagIds = filters.tags.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
        if (tagIds.length > 0) {
          query += `
            INNER JOIN ticket_tags tt ON t.id = tt.ticket_id
            INNER JOIN (
              SELECT DISTINCT ticket_id 
              FROM ticket_tags 
              WHERE tag_id IN (${tagIds.map(() => '?').join(',')})
            ) filtered ON t.id = filtered.ticket_id
          `;
          params.push(...tagIds);
        }
      }

      // 状态筛选
      if (filters?.status && filters.status !== 'all') {
        conditions.push('t.status = ?');
        params.push(filters.status);
      }

      // 搜索筛选（标题或描述）
      if (filters?.search && filters.search.trim()) {
        conditions.push('(t.title LIKE ? OR t.description LIKE ?)');
        const searchTerm = `%${filters.search.trim()}%`;
        params.push(searchTerm, searchTerm);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      // 去重（如果有标签筛选）
      if (filters?.tags) {
        query += ' GROUP BY t.id';
      }

      query += ' ORDER BY t.created_at DESC';

      const [rows] = await pool.execute<mysql2.RowDataPacket[]>(query, params);

      // 获取每个 Ticket 的标签
      const tickets = await Promise.all(
        rows.map(async (row: any) => {
          const ticket: Ticket = {
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status as TicketStatus,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
          };

          // 获取标签
          const [tagRows] = await pool.execute<mysql2.RowDataPacket[]>(
            `SELECT t.id, t.name, t.color, t.created_at as createdAt
             FROM tags t
             INNER JOIN ticket_tags tt ON t.id = tt.tag_id
             WHERE tt.ticket_id = ?
             ORDER BY t.created_at ASC`,
            [ticket.id]
          );

          ticket.tags = tagRows.map((tagRow: any) => ({
            id: tagRow.id,
            name: tagRow.name,
            color: tagRow.color,
            createdAt: tagRow.createdAt
          }));

          return ticket;
        })
      );

      return tickets;
    } catch (error) {
      logger.error('Failed to get all tickets:', error);
      throw new AppError('获取 Ticket 列表失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 根据 ID 获取 Ticket
   */
  async getTicketById(id: number): Promise<Ticket> {
    try {
      const [rows] = await pool.execute<mysql2.RowDataPacket[]>(
        `SELECT 
          id,
          title,
          description,
          status,
          created_at as createdAt,
          updated_at as updatedAt
        FROM tickets 
        WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('Ticket 不存在', 404, 'TICKET_NOT_FOUND');
      }

      const row = rows[0] as any;
      const ticket: Ticket = {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status as TicketStatus,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };

      // 获取标签
      const [tagRows] = await pool.execute<mysql2.RowDataPacket[]>(
        `SELECT t.id, t.name, t.color, t.created_at as createdAt
         FROM tags t
         INNER JOIN ticket_tags tt ON t.id = tt.tag_id
         WHERE tt.ticket_id = ?
         ORDER BY t.created_at ASC`,
        [id]
      );

      ticket.tags = tagRows.map((tagRow: any) => ({
        id: tagRow.id,
        name: tagRow.name,
        color: tagRow.color,
        createdAt: tagRow.createdAt
      }));

      return ticket;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to get ticket by id:', error);
      throw new AppError('获取 Ticket 失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 创建 Ticket
   */
  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 创建 Ticket
      const [result] = await connection.execute<mysql2.ResultSetHeader>(
        'INSERT INTO tickets (title, description) VALUES (?, ?)',
        [dto.title.trim(), dto.description?.trim() || null]
      );

      const ticketId = result.insertId;

      // 添加标签关联
      if (dto.tags && dto.tags.length > 0) {
        // 验证标签是否存在
        const existingTags = await tagService.getTagsByIds(dto.tags);
        if (existingTags.length !== dto.tags.length) {
          throw new AppError('部分标签不存在', 400, 'TAG_NOT_FOUND');
        }

        // 批量插入标签关联
        const values = dto.tags.map(tagId => [ticketId, tagId]);
        const placeholders = values.map(() => '(?, ?)').join(', ');
        const flatValues = values.flat();

        await connection.execute(
          `INSERT INTO ticket_tags (ticket_id, tag_id) VALUES ${placeholders}`,
          flatValues
        );
      }

      await connection.commit();

      // 返回完整的 Ticket（包含标签）
      return await this.getTicketById(ticketId);
    } catch (error) {
      await connection.rollback();
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to create ticket:', error);
      throw new AppError('创建 Ticket 失败', 500, 'DATABASE_ERROR');
    } finally {
      connection.release();
    }
  }

  /**
   * 更新 Ticket
   */
  async updateTicket(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    try {
      // 检查 Ticket 是否存在
      await this.getTicketById(id);

      const updates: string[] = [];
      const params: any[] = [];

      if (dto.title !== undefined) {
        updates.push('title = ?');
        params.push(dto.title.trim());
      }

      if (dto.description !== undefined) {
        updates.push('description = ?');
        params.push(dto.description?.trim() || null);
      }

      if (updates.length === 0) {
        throw new AppError('没有需要更新的字段', 400, 'VALIDATION_ERROR');
      }

      params.push(id);

      await pool.execute(
        `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      return await this.getTicketById(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to update ticket:', error);
      throw new AppError('更新 Ticket 失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 删除 Ticket
   */
  async deleteTicket(id: number): Promise<void> {
    try {
      // 检查 Ticket 是否存在
      await this.getTicketById(id);

      await pool.execute('DELETE FROM tickets WHERE id = ?', [id]);
      logger.info(`Ticket ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to delete ticket:', error);
      throw new AppError('删除 Ticket 失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 更新 Ticket 状态
   */
  async updateTicketStatus(id: number, status: TicketStatus): Promise<Ticket> {
    try {
      // 检查 Ticket 是否存在
      await this.getTicketById(id);

      await pool.execute('UPDATE tickets SET status = ? WHERE id = ?', [status, id]);

      return await this.getTicketById(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to update ticket status:', error);
      throw new AppError('更新 Ticket 状态失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 批量设置 Ticket 标签
   */
  async setTicketTags(ticketId: number, tagIds: number[]): Promise<Ticket> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 检查 Ticket 是否存在
      await this.getTicketById(ticketId);

      // 验证标签是否存在
      if (tagIds.length > 0) {
        const existingTags = await tagService.getTagsByIds(tagIds);
        if (existingTags.length !== tagIds.length) {
          throw new AppError('部分标签不存在', 400, 'TAG_NOT_FOUND');
        }
      }

      // 删除现有标签关联
      await connection.execute('DELETE FROM ticket_tags WHERE ticket_id = ?', [ticketId]);

      // 添加新标签关联
      if (tagIds.length > 0) {
        const values = tagIds.map(tagId => [ticketId, tagId]);
        const placeholders = values.map(() => '(?, ?)').join(', ');
        const flatValues = values.flat();

        await connection.execute(
          `INSERT INTO ticket_tags (ticket_id, tag_id) VALUES ${placeholders}`,
          flatValues
        );
      }

      await connection.commit();

      return await this.getTicketById(ticketId);
    } catch (error) {
      await connection.rollback();
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to set ticket tags:', error);
      throw new AppError('设置 Ticket 标签失败', 500, 'DATABASE_ERROR');
    } finally {
      connection.release();
    }
  }

  /**
   * 添加单个标签到 Ticket
   */
  async addTagToTicket(ticketId: number, tagId: number): Promise<Ticket> {
    try {
      // 检查 Ticket 和 Tag 是否存在
      await this.getTicketById(ticketId);
      await tagService.getTagById(tagId);

      // 检查是否已存在关联
      const [rows] = await pool.execute<mysql2.RowDataPacket[]>(
        'SELECT * FROM ticket_tags WHERE ticket_id = ? AND tag_id = ?',
        [ticketId, tagId]
      );

      if (rows.length > 0) {
        throw new AppError('标签已关联到此 Ticket', 409, 'DUPLICATE_ASSOCIATION');
      }

      await pool.execute('INSERT INTO ticket_tags (ticket_id, tag_id) VALUES (?, ?)', [ticketId, tagId]);

      return await this.getTicketById(ticketId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to add tag to ticket:', error);
      throw new AppError('添加标签失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 从 Ticket 删除标签
   */
  async removeTagFromTicket(ticketId: number, tagId: number): Promise<Ticket> {
    try {
      // 检查 Ticket 和 Tag 是否存在
      await this.getTicketById(ticketId);
      await tagService.getTagById(tagId);

      const [result] = await pool.execute<mysql2.ResultSetHeader>(
        'DELETE FROM ticket_tags WHERE ticket_id = ? AND tag_id = ?',
        [ticketId, tagId]
      );

      if (result.affectedRows === 0) {
        throw new AppError('标签未关联到此 Ticket', 404, 'ASSOCIATION_NOT_FOUND');
      }

      return await this.getTicketById(ticketId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to remove tag from ticket:', error);
      throw new AppError('删除标签失败', 500, 'DATABASE_ERROR');
    }
  }
}

export default new TicketService();
