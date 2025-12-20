// Project Alpha - Tag Service
import mysql2 from 'mysql2';
import pool from '../config/database';
import { Tag, CreateTagDto } from '../types';
import { AppError } from '../middlewares/error.middleware';
import { logger } from '../utils/logger';

/**
 * Tag Service
 */
export class TagService {
  /**
   * 获取所有标签
   */
  async getAllTags(): Promise<Tag[]> {
    try {
      const [rows] = await pool.execute<mysql2.RowDataPacket[]>(
        'SELECT id, name, color, created_at as createdAt FROM tags ORDER BY created_at DESC'
      );
      
      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        createdAt: row.createdAt
      }));
    } catch (error) {
      logger.error('Failed to get all tags:', error);
      throw new AppError('获取标签列表失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 根据 ID 获取标签
   */
  async getTagById(id: number): Promise<Tag> {
    try {
      const [rows] = await pool.execute<mysql2.RowDataPacket[]>(
        'SELECT id, name, color, created_at as createdAt FROM tags WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new AppError('标签不存在', 404, 'TAG_NOT_FOUND');
      }

      const row = rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        color: row.color,
        createdAt: row.createdAt
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to get tag by id:', error);
      throw new AppError('获取标签失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 创建标签
   */
  async createTag(dto: CreateTagDto): Promise<Tag> {
    try {
      const { name, color = '#3B82F6' } = dto;

      // 验证颜色格式
      if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
        throw new AppError('颜色格式不正确，应为 #RRGGBB 格式', 400, 'VALIDATION_ERROR');
      }

      const [result] = await pool.execute<mysql2.ResultSetHeader>(
        'INSERT INTO tags (name, color) VALUES (?, ?)',
        [name.trim(), color]
      );

      const tagId = result.insertId;
      return await this.getTagById(tagId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      // MySQL 唯一约束错误
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new AppError('标签名称已存在', 409, 'DUPLICATE_TAG');
      }
      logger.error('Failed to create tag:', error);
      throw new AppError('创建标签失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 删除标签
   */
  async deleteTag(id: number): Promise<void> {
    try {
      // 先检查标签是否存在
      await this.getTagById(id);

      await pool.execute('DELETE FROM tags WHERE id = ?', [id]);
      logger.info(`Tag ${id} deleted successfully`);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Failed to delete tag:', error);
      throw new AppError('删除标签失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 获取标签关联的 Ticket 数量
   */
  async getTagTicketCount(tagId: number): Promise<number> {
    try {
      const [rows] = await pool.execute<mysql2.RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM ticket_tags WHERE tag_id = ?',
        [tagId]
      );

      return (rows[0] as any).count;
    } catch (error) {
      logger.error('Failed to get tag ticket count:', error);
      throw new AppError('获取标签关联数量失败', 500, 'DATABASE_ERROR');
    }
  }

  /**
   * 批量获取标签（根据 ID 列表）
   */
  async getTagsByIds(ids: number[]): Promise<Tag[]> {
    if (ids.length === 0) {
      return [];
    }

    try {
      const placeholders = ids.map(() => '?').join(',');
      const [rows] = await pool.execute<mysql2.RowDataPacket[]>(
        `SELECT id, name, color, created_at as createdAt FROM tags WHERE id IN (${placeholders})`,
        ids
      );

      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        createdAt: row.createdAt
      }));
    } catch (error) {
      logger.error('Failed to get tags by ids:', error);
      throw new AppError('批量获取标签失败', 500, 'DATABASE_ERROR');
    }
  }
}

export default new TagService();
