-- Project Alpha - 数据库性能检查和优化脚本

USE ticket_manager;

-- 1. 检查当前索引使用情况
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'ticket_manager'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 2. 分析表大小和行数
SELECT 
    TABLE_NAME,
    TABLE_ROWS as '行数',
    ROUND(DATA_LENGTH / 1024 / 1024, 2) as '数据大小(MB)',
    ROUND(INDEX_LENGTH / 1024 / 1024, 2) as '索引大小(MB)',
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as '总大小(MB)'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'ticket_manager'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;

-- 3. 优化表（重建索引和统计信息）
OPTIMIZE TABLE tickets;
OPTIMIZE TABLE tags;
OPTIMIZE TABLE ticket_tags;

-- 4. 分析表（更新统计信息以优化查询计划）
ANALYZE TABLE tickets;
ANALYZE TABLE tags;
ANALYZE TABLE ticket_tags;

-- 5. 检查慢查询（需要启用慢查询日志）
-- SET GLOBAL slow_query_log = 'ON';
-- SET GLOBAL long_query_time = 2;

-- 6. 验证外键约束
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    REFERENCED_TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'ticket_manager'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 7. 示例：测试复杂查询的执行计划
EXPLAIN SELECT 
    t.id,
    t.title,
    t.status,
    t.created_at,
    GROUP_CONCAT(tag.name) as tags
FROM tickets t
LEFT JOIN ticket_tags tt ON t.id = tt.ticket_id
LEFT JOIN tags tag ON tt.tag_id = tag.id
WHERE t.status = 'pending'
GROUP BY t.id
ORDER BY t.created_at DESC
LIMIT 20;

-- 8. 创建性能优化的存储过程（可选）
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS GetTicketsWithTags(
    IN p_status VARCHAR(20),
    IN p_search VARCHAR(255),
    IN p_limit INT
)
BEGIN
    -- 动态构建查询
    SET @sql = 'SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.created_at,
        t.updated_at
    FROM tickets t';
    
    SET @where_clause = '';
    
    IF p_status IS NOT NULL AND p_status != 'all' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND t.status = "', p_status, '"');
    END IF;
    
    IF p_search IS NOT NULL AND p_search != '' THEN
        SET @where_clause = CONCAT(@where_clause, ' AND (t.title LIKE "%', p_search, '%" OR t.description LIKE "%', p_search, '%")');
    END IF;
    
    IF LENGTH(@where_clause) > 0 THEN
        SET @where_clause = CONCAT(' WHERE ', SUBSTRING(@where_clause, 6));
    END IF;
    
    SET @sql = CONCAT(@sql, @where_clause, ' ORDER BY t.created_at DESC');
    
    IF p_limit IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' LIMIT ', p_limit);
    END IF;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

-- 9. 创建统计信息视图
CREATE OR REPLACE VIEW ticket_statistics AS
SELECT 
    COUNT(*) as total_tickets,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
    (SELECT COUNT(*) FROM tags) as total_tags,
    (SELECT COUNT(DISTINCT ticket_id) FROM ticket_tags) as tickets_with_tags
FROM tickets;

-- 10. 查看统计信息
SELECT * FROM ticket_statistics;
