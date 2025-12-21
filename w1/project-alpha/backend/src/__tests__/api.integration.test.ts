/**
 * Project Alpha - API 集成测试
 * 测试所有 API 端点的功能
 */
import request from 'supertest';
import app from '../app';

describe('API Integration Tests', () => {
  let createdTagId: number;
  let createdTicketId: number;

  // Tag API 测试
  describe('Tag API', () => {
    it('should create a new tag', async () => {
      const response = await request(app)
        .post('/api/tags')
        .send({
          name: `测试标签_${Date.now()}`,
          color: '#FF0000'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toContain('测试标签');
      expect(response.body.data.color).toBe('#FF0000');
      
      createdTagId = response.body.data.id;
    });

    it('should get all tags', async () => {
      const response = await request(app)
        .get('/api/tags')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should reject invalid color format', async () => {
      const response = await request(app)
        .post('/api/tags')
        .send({
          name: '无效颜色标签',
          color: 'invalid-color'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  // Ticket API 测试
  describe('Ticket API', () => {
    it('should create a new ticket', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .send({
          title: '集成测试 Ticket',
          description: '这是一个集成测试创建的 Ticket',
          tags: createdTagId ? [createdTagId] : []
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('集成测试 Ticket');
      expect(response.body.data.status).toBe('pending');
      
      createdTicketId = response.body.data.id;
    });

    it('should get all tickets', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get ticket by id', async () => {
      const response = await request(app)
        .get(`/api/tickets/${createdTicketId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdTicketId);
      expect(response.body.data.title).toBe('集成测试 Ticket');
    });

    it('should update ticket', async () => {
      const response = await request(app)
        .put(`/api/tickets/${createdTicketId}`)
        .send({
          title: '更新后的 Ticket 标题',
          description: '更新后的描述'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('更新后的 Ticket 标题');
    });

    it('should update ticket status', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${createdTicketId}/status`)
        .send({
          status: 'completed'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
    });

    it('should filter tickets by status', async () => {
      const response = await request(app)
        .get('/api/tickets?status=completed')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((ticket: any) => {
        expect(ticket.status).toBe('completed');
      });
    });

    it('should search tickets', async () => {
      const response = await request(app)
        .get('/api/tickets?search=更新后的')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should delete ticket', async () => {
      await request(app)
        .delete(`/api/tickets/${createdTicketId}`)
        .expect(200);

      // 验证 Ticket 已删除
      await request(app)
        .get(`/api/tickets/${createdTicketId}`)
        .expect(404);
    });

    it('should return 404 for non-existent ticket', async () => {
      const response = await request(app)
        .get('/api/tickets/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // 清理测试数据
  describe('Cleanup', () => {
    it('should delete test tag', async () => {
      if (createdTagId) {
        await request(app)
          .delete(`/api/tags/${createdTagId}`)
          .expect(200);
      }
    });
  });
});
