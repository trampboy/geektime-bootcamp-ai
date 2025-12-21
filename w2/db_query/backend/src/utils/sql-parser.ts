/**
 * SQL parser utility for validating and modifying SQL queries
 */
import { Parser } from 'node-sql-parser';

// Create parser with MySQL dialect
const parser = new Parser();

export interface ParsedSQL {
  sql: string;
  hasLimit: boolean;
}

/**
 * Parse and validate SQL query
 * @param sql SQL query string
 * @returns Parsed SQL with limit information
 * @throws Error if SQL is invalid or not a SELECT statement
 */
export function parseAndValidateSQL(sql: string): ParsedSQL {
  if (!sql || typeof sql !== 'string') {
    throw new Error('SQL query is required');
  }

  // Trim whitespace
  const trimmedSQL = sql.trim();

  if (!trimmedSQL) {
    throw new Error('SQL query cannot be empty');
  }

  // Check for multiple statements (semicolon-separated)
  if (trimmedSQL.split(';').filter((s) => s.trim()).length > 1) {
    throw new Error('Multiple SQL statements are not allowed');
  }

  try {
    // Parse SQL to validate syntax
    // Note: astify returns an object for single statement, array for multiple statements
    // Specify MySQL dialect for accurate parsing
    const ast = parser.astify(trimmedSQL, { database: 'MySQL' });

    // Handle both single statement (object) and multiple statements (array)
    let statement: { type: string; limit?: unknown };
    if (Array.isArray(ast)) {
      if (ast.length === 0) {
        throw new Error('Invalid SQL statement');
      }
      if (ast.length > 1) {
        throw new Error('Multiple SQL statements are not allowed');
      }
      statement = ast[0] as { type: string; limit?: unknown };
    } else if (ast && typeof ast === 'object') {
      statement = ast as { type: string; limit?: unknown };
    } else {
      throw new Error('Invalid SQL statement');
    }

    // Check if it's a SELECT statement
    if (statement.type !== 'select') {
      throw new Error('Only SELECT statements are allowed');
    }

    // Check if LIMIT clause exists
    const hasLimit = Boolean(statement.limit);

    // If no LIMIT, add one (default: 1000 rows)
    let finalSQL = trimmedSQL;
    if (!hasLimit) {
      // Add LIMIT clause
      // Handle case where SQL ends with semicolon
      const sqlWithoutSemicolon = trimmedSQL.replace(/;?\s*$/, '');
      finalSQL = `${sqlWithoutSemicolon} LIMIT 1000`;
    }

    return {
      sql: finalSQL,
      hasLimit,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid SQL syntax: ${error.message}`);
    }
    throw new Error('Invalid SQL syntax');
  }
}

/**
 * Validate that SQL is a SELECT statement only
 * @param sql SQL query string
 * @returns true if valid SELECT statement
 */
export function isValidSelectStatement(sql: string): boolean {
  try {
    parseAndValidateSQL(sql);
    return true;
  } catch {
    return false;
  }
}
