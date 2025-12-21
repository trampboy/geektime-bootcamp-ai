/**
 * Frontend TypeScript type definitions
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

export interface ColumnMetadata {
  name: string; // 列名
  type: string; // 数据类型（如: int, varchar(255)）
  nullable: boolean; // 是否可为空
  default: string | null; // 默认值
  key: string; // 键类型: PRI(主键), UNI(唯一), MUL(外键/索引), ""(无)
}

export interface TableMetadata {
  name: string; // 表/视图名
  type: 'BASE TABLE' | 'VIEW'; // 类型
  columns: ColumnMetadata[]; // 列信息数组
}

export interface DatabaseMetadata {
  name: string; // 数据库标识名称
  tables: TableMetadata[]; // 表列表
  views: TableMetadata[]; // 视图列表
  updatedAt: string; // 元数据更新时间
}

export interface ErrorResponse {
  error: {
    message: string; // 错误消息
    code?: string; // 错误代码（可选）
  };
}

export interface DatabasesResponse {
  databases: DatabaseInfo[];
}

export interface QueryRequest {
  sql: string; // SQL查询语句（必须是SELECT语句）
}

export interface NaturalLanguageQueryRequest {
  prompt: string; // 自然语言查询描述
}

export interface QueryResult {
  columns: string[]; // 列名数组
  rows: Record<string, unknown>[]; // 数据行数组，每行为对象，key为列名
  rowCount: number; // 返回行数
  executionTime: number; // 执行时间（毫秒）
}

export interface NaturalLanguageQueryResponse {
  sql: string; // 生成的SQL查询语句
  result: QueryResult; // 查询结果
}
