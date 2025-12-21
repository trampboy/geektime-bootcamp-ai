/**
 * MySQL connection service
 * Connect, test connection, get metadata using INFORMATION_SCHEMA
 */
import mysql from 'mysql2/promise';
import { ConnectionConfig, parseConnectionUrl } from '../utils/connection-parser';

export class MysqlService {
  /**
   * Create MySQL connection from URL
   */
  async createConnection(url: string): Promise<mysql.Connection> {
    const config = parseConnectionUrl(url);
    // Convert localhost to 127.0.0.1 to force IPv4
    const host = config.host === 'localhost' ? '127.0.0.1' : config.host;
    return mysql.createConnection({
      host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    });
  }

  /**
   * Test MySQL connection
   */
  async testConnection(url: string): Promise<boolean> {
    let connection: mysql.Connection | null = null;
    try {
      connection = await this.createConnection(url);
      await connection.ping();
      return true;
    } catch (error) {
      return false;
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

  /**
   * Get connection config from URL
   */
  getConnectionConfig(url: string): ConnectionConfig {
    return parseConnectionUrl(url);
  }
}
