# 数据库性能分析报告

## 执行时间：2025-12-20

## 1. 索引检查结果 ✅

### 当前索引配置
- **tickets 表**：
  - `PRIMARY` (id) - 主键索引
  - `idx_status` (status) - 状态索引 ✅
  - `idx_created_at` (created_at) - 创建时间索引 ✅
  - `idx_title` (title) - 标题索引 ✅

- **tags 表**：
  - `PRIMARY` (id) - 主键索引
  - `idx_name` (name) - 名称索引 ✅
  - `name` (name) - UNIQUE 索引 ✅

- **ticket_tags 表**：
  - `PRIMARY` (ticket_id, tag_id) - 复合主键 ✅
  - `idx_tag_id` (tag_id) - 标签ID索引 ✅

**结论**：索引配置合理，覆盖了主要查询字段。

## 2. 表大小分析 ✅

| 表名 | 行数 | 数据大小(MB) | 索引大小(MB) | 总大小(MB) |
|------|------|--------------|--------------|------------|
| tickets | 56 | 0.02 | 0.05 | 0.06 |
| tags | 46 | 0.02 | 0.03 | 0.05 |
| ticket_tags | 151 | 0.02 | 0.02 | 0.03 |

**结论**：数据量很小，当前规模下性能问题不明显。但随着数据增长，需要注意优化。

## 3. 查询性能分析 ⚠️

### EXPLAIN 结果分析

```sql
EXPLAIN SELECT 
    t.id, t.title, t.status, t.created_at,
    GROUP_CONCAT(tag.name) as tags
FROM tickets t
LEFT JOIN ticket_tags tt ON t.id = tt.ticket_id
LEFT JOIN tags tag ON tt.tag_id = tag.id
WHERE t.status = 'pending'
GROUP BY t.id
ORDER BY t.created_at DESC
LIMIT 20;
```

**执行计划**：
- ✅ 使用了 `idx_status` 索引（type: ref）
- ⚠️ **Using temporary** - 需要创建临时表来处理 GROUP BY
- ⚠️ **Using filesort** - 需要文件排序来处理 ORDER BY

### 性能问题

1. **Using temporary + Using filesort**
   - 原因：`GROUP BY t.id` + `ORDER BY t.created_at DESC` 的组合
   - 影响：数据量大时会产生临时表和磁盘排序，性能下降
   - 当前影响：数据量小（56行），影响不明显

2. **优化建议**：
   - 考虑添加复合索引：`(status, created_at)` 或 `(status, created_at, id)`
   - 或者使用子查询先排序再分组

## 4. 优化建议

### 4.1 添加复合索引（推荐）

```sql
-- 优化 status + created_at 的查询
ALTER TABLE tickets ADD INDEX idx_status_created_at (status, created_at DESC);

-- 如果经常按 status + title 搜索
ALTER TABLE tickets ADD INDEX idx_status_title (status, title);
```

### 4.2 优化查询语句

**方案 A：使用子查询先排序**
```sql
SELECT 
    t.id,
    t.title,
    t.status,
    t.created_at,
    GROUP_CONCAT(tag.name) as tags
FROM (
    SELECT id, title, status, created_at
    FROM tickets
    WHERE status = 'pending'
    ORDER BY created_at DESC
    LIMIT 20
) t
LEFT JOIN ticket_tags tt ON t.id = tt.ticket_id
LEFT JOIN tags tag ON tt.tag_id = tag.id
GROUP BY t.id, t.title, t.status, t.created_at
ORDER BY t.created_at DESC;
```

**方案 B：使用窗口函数（MySQL 8.0+）**
```sql
SELECT 
    id, title, status, created_at,
    GROUP_CONCAT(tag_name) as tags
FROM (
    SELECT 
        t.id,
        t.title,
        t.status,
        t.created_at,
        tag.name as tag_name,
        ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY t.created_at DESC) as rn
    FROM tickets t
    LEFT JOIN ticket_tags tt ON t.id = tt.ticket_id
    LEFT JOIN tags tag ON tt.tag_id = tag.id
    WHERE t.status = 'pending'
) ranked
WHERE rn <= 20
GROUP BY id, title, status, created_at
ORDER BY created_at DESC;
```

### 4.3 后端代码优化建议

当前后端代码存在 **N+1 查询问题**：
- 先查询所有 tickets
- 然后为每个 ticket 单独查询标签

**优化方案**：使用 JOIN + GROUP_CONCAT 一次性获取所有数据

```typescript
// 优化后的查询
const query = `
  SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.created_at as createdAt,
    t.updated_at as updatedAt,
    GROUP_CONCAT(
      CONCAT(tag.id, ':', tag.name, ':', tag.color) 
      SEPARATOR '||'
    ) as tags_data
  FROM tickets t
  LEFT JOIN ticket_tags tt ON t.id = tt.ticket_id
  LEFT JOIN tags tag ON tt.tag_id = tag.id
  WHERE ${conditions}
  GROUP BY t.id
  ORDER BY t.created_at DESC
`;
```

## 5. 外键约束检查 ✅

- `ticket_tags_ibfk_1`: ticket_tags → tickets ✅
- `ticket_tags_ibfk_2`: ticket_tags → tags ✅

**结论**：外键约束正常，数据完整性有保障。

## 6. 表优化结果 ✅

- ✅ tickets 表已优化
- ✅ tags 表已优化
- ✅ ticket_tags 表已优化

## 7. 总结

### 当前状态
- ✅ **索引配置合理**：主要查询字段都有索引
- ✅ **数据量小**：当前性能问题不明显
- ⚠️ **查询计划有优化空间**：存在 Using temporary 和 Using filesort
- ⚠️ **后端代码存在 N+1 问题**：建议优化查询方式

### 优先级建议

1. **高优先级**（数据量增长后必须优化）：
   - 添加复合索引 `(status, created_at)`
   - 优化后端查询，避免 N+1 问题

2. **中优先级**（性能监控）：
   - 启用慢查询日志
   - 定期执行 ANALYZE TABLE 更新统计信息

3. **低优先级**（当前不需要）：
   - 数据量很小，OPTIMIZE TABLE 效果不明显
   - 存储过程可以保留，但当前查询方式已足够

### 性能监控建议

```sql
-- 启用慢查询日志（可选）
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- 记录超过1秒的查询

-- 定期更新统计信息
ANALYZE TABLE tickets, tags, ticket_tags;
```
