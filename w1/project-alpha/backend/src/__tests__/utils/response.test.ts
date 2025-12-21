/**
 * Project Alpha - Response Utils 单元测试
 */
import { Response } from 'express';
import { successResponse, successMessageResponse, errorResponse } from '../../utils/response';

describe('Response Utils', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('successResponse', () => {
    it('应该返回成功响应', () => {
      const data = { id: 1, name: 'Test' };
      const response = mockResponse as Response;

      successResponse(response, data);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data
      });
    });

    it('应该支持自定义状态码', () => {
      const data = { id: 1, name: 'Test' };
      const response = mockResponse as Response;

      successResponse(response, data, 201);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data
      });
    });

    it('应该支持数组数据', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const response = mockResponse as Response;

      successResponse(response, data);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data
      });
    });
  });

  describe('successMessageResponse', () => {
    it('应该返回成功消息响应', () => {
      const response = mockResponse as Response;

      successMessageResponse(response, '操作成功');

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: '操作成功'
      });
    });

    it('应该支持自定义状态码', () => {
      const response = mockResponse as Response;

      successMessageResponse(response, '创建成功', 201);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('errorResponse', () => {
    it('应该返回错误响应', () => {
      const response = mockResponse as Response;

      errorResponse(response, 'ERROR_CODE', '错误消息', 400);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'ERROR_CODE',
          message: '错误消息'
        }
      });
    });

    it('应该使用默认状态码 500', () => {
      const response = mockResponse as Response;

      errorResponse(response, 'ERROR_CODE', '错误消息');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
