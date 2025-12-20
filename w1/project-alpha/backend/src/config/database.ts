// Project Alpha - 数据库配置
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 确保使用 IPv4 地址，避免 localhost 解析为 IPv6
const getDbHost = (): string => {
  const host = process.env.DB_HOST || '127.0.0.1';
  // 如果设置为 localhost，强制使用 IPv4
  if (host === 'localhost') {
    return '127.0.0.1';
  }
  return host;
};

/**
 * 数据库连接池
 */
const pool = mysql.createPool({
  host: getDbHost(), // 强制使用 IPv4 地址避免 IPv6 连接问题
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ticket_manager',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * 测试数据库连接
 */
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`   Host: ${getDbHost()}`);
    console.log(`   Database: ${process.env.DB_NAME || 'ticket_manager'}`);
    connection.release();
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
    
    // 提供更友好的错误提示
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 提示：');
      console.error('   1. 请确保 MySQL 服务正在运行');
      console.error('   2. 检查数据库配置是否正确（host, port, user, password）');
      console.error('   3. 确认数据库已创建：', process.env.DB_NAME || 'ticket_manager');
      console.error('   4. 在 macOS 上，可以使用以下命令启动 MySQL：');
      console.error('      brew services start mysql');
      console.error('      或');
      console.error('      mysql.server start');
    }
    
    throw error;
  }
};

export default pool;
