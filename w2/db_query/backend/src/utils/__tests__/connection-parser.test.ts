/**
 * Tests for connection parser utility
 */
import { parseConnectionUrl, validateDatabaseName } from '../connection-parser';

describe('Connection Parser', () => {
  describe('parseConnectionUrl', () => {
    it('should parse full connection URL', () => {
      const config = parseConnectionUrl(
        'mysql://user:password@localhost:3306/database'
      );
      expect(config.host).toBe('localhost');
      expect(config.port).toBe(3306);
      expect(config.user).toBe('user');
      expect(config.password).toBe('password');
      expect(config.database).toBe('database');
    });

    it('should parse URL without password', () => {
      const config = parseConnectionUrl('mysql://user@localhost:3306/database');
      expect(config.user).toBe('user');
      expect(config.password).toBeUndefined();
    });

    it('should parse URL without user and password', () => {
      const config = parseConnectionUrl('mysql://localhost:3306/database');
      expect(config.user).toBeUndefined();
      expect(config.password).toBeUndefined();
      expect(config.database).toBe('database');
    });

    it('should use default port 3306 when not specified', () => {
      const config = parseConnectionUrl('mysql://localhost/database');
      expect(config.port).toBe(3306);
    });

    it('should parse URL without database', () => {
      const config = parseConnectionUrl('mysql://user:password@localhost:3306');
      expect(config.database).toBeUndefined();
    });

    it('should handle URL-encoded credentials', () => {
      const config = parseConnectionUrl(
        'mysql://user%40domain:pass%20word@localhost:3306/database'
      );
      expect(config.user).toBe('user@domain');
      expect(config.password).toBe('pass word');
    });

    it('should reject non-mysql protocol', () => {
      expect(() => parseConnectionUrl('postgresql://localhost/database')).toThrow(
        'Invalid protocol. Expected mysql://'
      );
      expect(() => parseConnectionUrl('http://localhost/database')).toThrow(
        'Invalid protocol. Expected mysql://'
      );
    });

    it('should reject invalid URL format', () => {
      expect(() => parseConnectionUrl('not-a-url')).toThrow('Invalid connection URL');
      expect(() => parseConnectionUrl('')).toThrow('Invalid connection URL');
    });

    it('should require host', () => {
      expect(() => parseConnectionUrl('mysql://')).toThrow('Invalid connection URL');
    });
  });

  describe('validateDatabaseName', () => {
    it('should accept valid database names', () => {
      expect(validateDatabaseName('my-database')).toBe(true);
      expect(validateDatabaseName('my_database')).toBe(true);
      expect(validateDatabaseName('database123')).toBe(true);
      expect(validateDatabaseName('a')).toBe(true);
      expect(validateDatabaseName('a'.repeat(100))).toBe(true);
    });

    it('should reject empty or whitespace-only names', () => {
      expect(validateDatabaseName('')).toBe(false);
      expect(validateDatabaseName('   ')).toBe(false);
      expect(validateDatabaseName('\t\n')).toBe(false);
    });

    it('should reject names longer than 100 characters', () => {
      expect(validateDatabaseName('a'.repeat(101))).toBe(false);
    });

    it('should reject names with invalid characters', () => {
      expect(validateDatabaseName('my database')).toBe(false);
      expect(validateDatabaseName('my.database')).toBe(false);
      expect(validateDatabaseName('my@database')).toBe(false);
      expect(validateDatabaseName('my#database')).toBe(false);
      expect(validateDatabaseName('my$database')).toBe(false);
    });
  });
});
