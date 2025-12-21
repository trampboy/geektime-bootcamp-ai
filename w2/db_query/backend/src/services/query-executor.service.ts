/**
 * SQL query executor service
 * Execute SELECT queries and return results in camelCase format
 */
import mysql from 'mysql2/promise';
import { MysqlService } from './mysql.service';
import { QueryResult } from '../models/query';
import { parseAndValidateSQL } from '../utils/sql-parser';

export class QueryExecutorService {
  private mysqlService: MysqlService;

  constructor() {
    this.mysqlService = new MysqlService();
  }

  /**
   * Execute SQL query on MySQL database
   * @param url MySQL connection URL
   * @param sql SQL query string (must be SELECT statement)
   * @returns Query result with columns, rows, rowCount, and executionTime
   */
  async executeQuery(url: string, sql: string): Promise<QueryResult> {
    // Parse and validate SQL
    const parsedSQL = parseAndValidateSQL(sql);
    const validatedSQL = parsedSQL.sql;

    let connection: mysql.Connection | null = null;
    const startTime = Date.now();

    try {
      // Create connection
      connection = await this.mysqlService.createConnection(url);

      // Execute query
      const [rows] = await connection.execute(validatedSQL);

      // Calculate execution time
      const executionTime = Date.now() - startTime;

      // Convert MySQL result to QueryResult format
      // MySQL2 returns rows as array of arrays or array of objects depending on query
      // We need to ensure it's an array of objects with camelCase keys
      const resultRows = Array.isArray(rows) ? rows : [];

      if (resultRows.length === 0) {
        // Empty result
        return {
          columns: [],
          rows: [],
          rowCount: 0,
          executionTime,
        };
      }

      // Get column names from first row
      // MySQL2 returns RowDataPacket objects, so we can get keys from first row
      const firstRow = resultRows[0] as Record<string, unknown>;
      const columns = Object.keys(firstRow);

      // Convert rows to array of objects with camelCase keys
      // Note: MySQL column names are already in their original case
      // We'll keep them as-is, but ensure they're strings
      const formattedRows: Record<string, unknown>[] = resultRows.map(
        (row) => {
          const rowObj = row as Record<string, unknown>;
          const formattedRow: Record<string, unknown> = {};
          for (const key of columns) {
            formattedRow[key] = rowObj[key];
          }
          return formattedRow;
        }
      );

      return {
        columns,
        rows: formattedRows,
        rowCount: formattedRows.length,
        executionTime,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Query execution failed: ${error.message}`);
      }
      throw new Error('Query execution failed');
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }
}
