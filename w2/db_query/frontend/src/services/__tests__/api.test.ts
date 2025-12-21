/**
 * Tests for API service
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchDatabases,
  addDatabase,
  getDatabaseMetadata,
  executeQuery,
  executeNaturalLanguageQuery,
} from '../api';
import type {
  DatabaseInfo,
  DatabaseConnection,
  QueryRequest,
  NaturalLanguageQueryRequest,
} from '../../types/api-types';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchDatabases', () => {
    it('should fetch databases successfully', async () => {
      const mockDatabases: DatabaseInfo[] = [
        {
          name: 'test-db',
          url: 'mysql://localhost/test',
          createdAt: '2025-12-21T10:00:00Z',
          updatedAt: '2025-12-21T10:00:00Z',
        },
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ databases: mockDatabases }),
      });

      const result = await fetchDatabases();
      expect(result).toEqual(mockDatabases);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/dbs'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should throw error on API failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: 'Server error', code: 'SERVER_ERROR' },
        }),
      });

      await expect(fetchDatabases()).rejects.toThrow();
    });
  });

  describe('addDatabase', () => {
    it('should add database successfully', async () => {
      const mockDatabase: DatabaseInfo = {
        name: 'test-db',
        url: 'mysql://localhost/test',
        createdAt: '2025-12-21T10:00:00Z',
        updatedAt: '2025-12-21T10:00:00Z',
      };

      const connection: DatabaseConnection = {
        url: 'mysql://localhost/test',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDatabase,
      });

      const result = await addDatabase('test-db', connection);
      expect(result).toEqual(mockDatabase);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/dbs/test-db'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(connection),
        })
      );
    });
  });

  describe('getDatabaseMetadata', () => {
    it('should fetch metadata successfully', async () => {
      const mockMetadata = {
        name: 'test-db',
        tables: [],
        views: [],
        updatedAt: '2025-12-21T10:00:00Z',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMetadata,
      });

      const result = await getDatabaseMetadata('test-db');
      expect(result).toEqual(mockMetadata);
    });
  });

  describe('executeQuery', () => {
    it('should execute query successfully', async () => {
      const mockResult = {
        columns: ['id', 'name'],
        rows: [{ id: 1, name: 'test' }],
        rowCount: 1,
        executionTime: 10,
      };

      const queryRequest: QueryRequest = {
        sql: 'SELECT * FROM users',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResult,
      });

      const result = await executeQuery('test-db', queryRequest);
      expect(result).toEqual(mockResult);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/dbs/test-db/query'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(queryRequest),
        })
      );
    });
  });

  describe('executeNaturalLanguageQuery', () => {
    it('should execute natural language query successfully', async () => {
      const mockResponse = {
        sql: 'SELECT * FROM users',
        result: {
          columns: ['id', 'name'],
          rows: [{ id: 1, name: 'test' }],
          rowCount: 1,
          executionTime: 10,
        },
      };

      const queryRequest: NaturalLanguageQueryRequest = {
        prompt: '查询所有用户',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await executeNaturalLanguageQuery('test-db', queryRequest);
      expect(result).toEqual(mockResponse);
    });
  });
});
