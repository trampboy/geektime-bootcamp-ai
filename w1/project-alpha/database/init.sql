-- Project Alpha - 数据库初始化脚本
-- 创建日期: 2025-12-20

-- 创建数据库
CREATE DATABASE IF NOT EXISTS ticket_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ticket_manager;

-- 创建 tickets 表
CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建 tags 表
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建 ticket_tags 关联表
CREATE TABLE IF NOT EXISTS ticket_tags (
  ticket_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ticket_id, tag_id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例标签（可选）
INSERT INTO tags (name, color) VALUES
  ('后端', '#3B82F6'),
  ('前端', '#10B981'),
  ('Bug', '#EF4444'),
  ('功能', '#8B5CF6'),
  ('优化', '#F59E0B')
ON DUPLICATE KEY UPDATE name=name;

-- 插入示例 Ticket（可选）
INSERT INTO tickets (title, description, status) VALUES
  ('实现用户登录功能', '需要实现基本的用户登录流程，包括表单验证和错误处理', 'pending'),
  ('修复首页加载慢的问题', '首页加载时间超过3秒，需要优化', 'pending'),
  ('添加数据导出功能', '支持将数据导出为 CSV 格式', 'completed');

-- 为示例 Ticket 添加标签（可选）
INSERT INTO ticket_tags (ticket_id, tag_id) VALUES
  (1, 1),  -- 实现用户登录功能 -> 后端
  (2, 3),  -- 修复首页加载慢的问题 -> Bug
  (2, 5),  -- 修复首页加载慢的问题 -> 优化
  (3, 4);  -- 添加数据导出功能 -> 功能

-- 验证表结构
SHOW TABLES;
DESCRIBE tickets;
DESCRIBE tags;
DESCRIBE ticket_tags;
