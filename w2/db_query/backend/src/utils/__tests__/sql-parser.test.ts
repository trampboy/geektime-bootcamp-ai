/**
 * Tests for SQL parser utility
 */
import { parseAndValidateSQL, isValidSelectStatement } from '../sql-parser';

describe('SQL Parser', () => {
  describe('parseAndValidateSQL', () => {
    it('should parse valid SELECT statement', () => {
      const result = parseAndValidateSQL('SELECT * FROM users');
      expect(result).toHaveProperty('sql');
      expect(result).toHaveProperty('hasLimit');
      expect(result.hasLimit).toBe(false);
      expect(result.sql).toContain('LIMIT 1000');
    });

    it('should preserve existing LIMIT clause', () => {
      const result = parseAndValidateSQL('SELECT * FROM users LIMIT 10');
      expect(result.hasLimit).toBe(true);
      expect(result.sql).toBe('SELECT * FROM users LIMIT 10');
    });

    it('should handle SELECT with WHERE clause', () => {
      const result = parseAndValidateSQL('SELECT * FROM users WHERE id = 1');
      expect(result.sql).toContain('WHERE id = 1');
      expect(result.sql).toContain('LIMIT 1000');
    });

    it('should handle SELECT with JOIN', () => {
      const result = parseAndValidateSQL(
        'SELECT u.id, u.name FROM users u JOIN orders o ON u.id = o.user_id'
      );
      expect(result.sql).toContain('JOIN');
      expect(result.sql).toContain('LIMIT 1000');
    });

    it('should reject non-SELECT statements', () => {
      expect(() => parseAndValidateSQL('INSERT INTO users VALUES (1)')).toThrow(
        'Only SELECT statements are allowed'
      );
      expect(() => parseAndValidateSQL('UPDATE users SET name = "test"')).toThrow(
        'Only SELECT statements are allowed'
      );
      expect(() => parseAndValidateSQL('DELETE FROM users')).toThrow(
        'Only SELECT statements are allowed'
      );
    });

    it('should reject empty SQL', () => {
      // Empty string is caught by the first check
      expect(() => parseAndValidateSQL('')).toThrow('SQL query is required');
      // Whitespace-only string is caught after trim
      expect(() => parseAndValidateSQL('   ')).toThrow('SQL query cannot be empty');
    });

    it('should reject null or undefined SQL', () => {
      expect(() => parseAndValidateSQL(null as unknown as string)).toThrow(
        'SQL query is required'
      );
      expect(() => parseAndValidateSQL(undefined as unknown as string)).toThrow(
        'SQL query is required'
      );
    });

    it('should reject multiple statements', () => {
      expect(() => parseAndValidateSQL('SELECT * FROM users; SELECT * FROM orders')).toThrow(
        'Multiple SQL statements are not allowed'
      );
    });

    it('should handle SQL with semicolon at end', () => {
      const result = parseAndValidateSQL('SELECT * FROM users;');
      expect(result.sql).toContain('LIMIT 1000');
      expect(result.sql).not.toContain(';');
    });

    it('should handle complex SELECT with ORDER BY', () => {
      const result = parseAndValidateSQL(
        'SELECT * FROM users ORDER BY name DESC LIMIT 50'
      );
      expect(result.hasLimit).toBe(true);
      expect(result.sql).toBe('SELECT * FROM users ORDER BY name DESC LIMIT 50');
    });
  });

  describe('isValidSelectStatement', () => {
    it('should return true for valid SELECT statements', () => {
      expect(isValidSelectStatement('SELECT * FROM users')).toBe(true);
      expect(isValidSelectStatement('SELECT id, name FROM users WHERE id = 1')).toBe(true);
    });

    it('should return false for invalid SQL', () => {
      expect(isValidSelectStatement('INSERT INTO users VALUES (1)')).toBe(false);
      expect(isValidSelectStatement('')).toBe(false);
      expect(isValidSelectStatement('INVALID SQL')).toBe(false);
    });
  });
});
