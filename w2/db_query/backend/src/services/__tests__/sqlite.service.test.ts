/**
 * Tests for SQLite service
 */
import { SqliteService } from '../sqlite.service';
import { initializeDatabase } from '../../db/init';

describe('SqliteService', () => {
  let service: SqliteService;

  beforeAll(() => {
    // Use test database
    process.env.DB_PATH = './data/test_db_query.db';
    initializeDatabase();
    service = new SqliteService();
  });

  beforeEach(() => {
    // Clean up before each test
    const allDbs = service.getAllDatabases();
    allDbs.forEach((db) => {
      service.deleteDatabase(db.name);
    });
  });

  describe('upsertDatabase', () => {
    it('should create a new database', () => {
      const dbInfo = service.upsertDatabase('test-db', 'mysql://localhost/test');
      expect(dbInfo.name).toBe('test-db');
      expect(dbInfo.url).toBe('mysql://localhost/test');
      expect(dbInfo.createdAt).toBeDefined();
      expect(dbInfo.updatedAt).toBeDefined();
    });

    it('should update existing database', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test1');
      const dbInfo = service.upsertDatabase('test-db', 'mysql://localhost/test2');
      expect(dbInfo.url).toBe('mysql://localhost/test2');
    });
  });

  describe('getDatabaseByName', () => {
    it('should return database if exists', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test');
      const dbInfo = service.getDatabaseByName('test-db');
      expect(dbInfo).not.toBeNull();
      expect(dbInfo?.name).toBe('test-db');
    });

    it('should return null if database does not exist', () => {
      const dbInfo = service.getDatabaseByName('non-existent');
      expect(dbInfo).toBeNull();
    });
  });

  describe('getAllDatabases', () => {
    it('should return empty array when no databases', () => {
      const dbs = service.getAllDatabases();
      expect(dbs).toEqual([]);
    });

    it('should return all databases', () => {
      service.upsertDatabase('db1', 'mysql://localhost/db1');
      service.upsertDatabase('db2', 'mysql://localhost/db2');
      const dbs = service.getAllDatabases();
      expect(dbs.length).toBe(2);
    });
  });

  describe('deleteDatabase', () => {
    it('should delete existing database', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test');
      const deleted = service.deleteDatabase('test-db');
      expect(deleted).toBe(true);
      expect(service.getDatabaseByName('test-db')).toBeNull();
    });

    it('should return false if database does not exist', () => {
      const deleted = service.deleteDatabase('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('getDatabaseId', () => {
    it('should return database ID', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test');
      const id = service.getDatabaseId('test-db');
      expect(id).not.toBeNull();
      expect(typeof id).toBe('number');
    });

    it('should return null if database does not exist', () => {
      const id = service.getDatabaseId('non-existent');
      expect(id).toBeNull();
    });
  });

  describe('saveMetadata and getLatestMetadata', () => {
    it('should save and retrieve metadata', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test');
      const dbId = service.getDatabaseId('test-db');
      expect(dbId).not.toBeNull();

      const metadata = {
        tables: [
          {
            name: 'users',
            type: 'BASE TABLE' as const,
            columns: [
              {
                name: 'id',
                type: 'int',
                nullable: false,
                default: null,
                key: 'PRI',
              },
            ],
          },
        ],
        views: [],
      };

      service.saveMetadata(dbId!, metadata);
      const retrieved = service.getLatestMetadata(dbId!);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.tables.length).toBe(1);
      expect(retrieved?.tables[0].name).toBe('users');
    });

    it('should return null if no metadata exists', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test');
      const dbId = service.getDatabaseId('test-db');
      const metadata = service.getLatestMetadata(dbId!);
      expect(metadata).toBeNull();
    });
  });

  describe('getLatestMetadataUpdatedAt', () => {
    it('should return updatedAt timestamp', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test');
      const dbId = service.getDatabaseId('test-db');
      const metadata = {
        tables: [],
        views: [],
      };
      service.saveMetadata(dbId!, metadata);
      const updatedAt = service.getLatestMetadataUpdatedAt(dbId!);
      expect(updatedAt).not.toBeNull();
      expect(typeof updatedAt).toBe('string');
    });

    it('should return null if no metadata exists', () => {
      service.upsertDatabase('test-db', 'mysql://localhost/test');
      const dbId = service.getDatabaseId('test-db');
      const updatedAt = service.getLatestMetadataUpdatedAt(dbId!);
      expect(updatedAt).toBeNull();
    });
  });
});
