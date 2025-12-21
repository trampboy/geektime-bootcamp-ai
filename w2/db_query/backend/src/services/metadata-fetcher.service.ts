/**
 * Metadata fetcher service
 * Fetch tables, views, columns from MySQL using INFORMATION_SCHEMA
 */
import mysql from 'mysql2/promise';
import { MysqlService } from './mysql.service';
import { TableMetadata, ColumnMetadata, MetadataJson } from '../models/metadata';

export class MetadataFetcherService {
  private mysqlService: MysqlService;

  constructor() {
    this.mysqlService = new MysqlService();
  }

  /**
   * Fetch metadata from MySQL database
   */
  async fetchMetadata(url: string): Promise<MetadataJson> {
    const connection = await this.mysqlService.createConnection(url);
    try {
      const [tables, views] = await Promise.all([
        this.fetchTables(connection),
        this.fetchViews(connection),
      ]);

      return {
        tables,
        views,
      };
    } finally {
      await connection.end();
    }
  }

  /**
   * Fetch tables metadata
   */
  private async fetchTables(
    connection: mysql.Connection
  ): Promise<TableMetadata[]> {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT TABLE_NAME 
       FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`
    );

    const tables: TableMetadata[] = [];
    for (const row of rows) {
      const tableName = row.TABLE_NAME as string;
      const columns = await this.fetchColumns(connection, tableName, 'BASE TABLE');
      tables.push({
        name: tableName,
        type: 'BASE TABLE',
        columns,
      });
    }

    return tables;
  }

  /**
   * Fetch views metadata
   */
  private async fetchViews(connection: mysql.Connection): Promise<TableMetadata[]> {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT TABLE_NAME 
       FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_TYPE = 'VIEW'
       ORDER BY TABLE_NAME`
    );

    const views: TableMetadata[] = [];
    for (const row of rows) {
      const viewName = row.TABLE_NAME as string;
      const columns = await this.fetchColumns(connection, viewName, 'VIEW');
      views.push({
        name: viewName,
        type: 'VIEW',
        columns,
      });
    }

    return views;
  }

  /**
   * Fetch columns metadata for a table or view
   */
  private async fetchColumns(
    connection: mysql.Connection,
    tableName: string,
    tableType: 'BASE TABLE' | 'VIEW'
  ): Promise<ColumnMetadata[]> {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        COLUMN_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        COLUMN_KEY
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       ORDER BY ORDINAL_POSITION`,
      [tableName]
    );

    return rows.map((row) => {
      const columnType = (row.COLUMN_TYPE as string) || row.DATA_TYPE || '';
      const isNullable = (row.IS_NULLABLE as string) === 'YES';
      const columnDefault = row.COLUMN_DEFAULT as string | null;
      const columnKey = (row.COLUMN_KEY as string) || '';

      return {
        name: row.COLUMN_NAME as string,
        type: columnType,
        nullable: isNullable,
        default: columnDefault,
        key: columnKey,
      };
    });
  }
}
