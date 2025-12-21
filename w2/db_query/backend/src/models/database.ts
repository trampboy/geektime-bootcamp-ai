/**
 * Database model type definitions
 */

export interface DatabaseConnection {
  url: string; // MySQL连接字符串，格式: mysql://user:password@host:port/database
}

export interface DatabaseInfo {
  name: string; // 数据库标识名称
  url: string; // 连接字符串（可脱敏显示）
  createdAt: string; // ISO 8601格式
  updatedAt: string; // ISO 8601格式
}

export interface DatabaseRow {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
