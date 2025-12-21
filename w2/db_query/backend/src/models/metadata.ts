/**
 * Metadata model type definitions
 */

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

export interface MetadataRow {
  id: number;
  databaseId: number;
  metadata: string; // JSON格式的元数据
  updatedAt: string;
}

export interface MetadataJson {
  tables: TableMetadata[];
  views: TableMetadata[];
}
