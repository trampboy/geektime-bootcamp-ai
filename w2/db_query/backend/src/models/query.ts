/**
 * Query request and result type definitions
 */

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
