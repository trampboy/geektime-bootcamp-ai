-- Project Alpha - 数据库种子数据脚本
-- 用于填充测试数据：50个 tickets 和多个 tags
-- 执行方式: mysql -u username -p ticket_manager < seed.sql
-- 或者: mysql -u username -p ticket_manager -e "source seed.sql"
-- 注意：确保表已经通过 init.sql 创建

-- 清空现有数据（可选，根据需要取消注释）
-- TRUNCATE TABLE ticket_tags;
-- TRUNCATE TABLE tickets;
-- TRUNCATE TABLE tags;

-- ============================================
-- 插入 Tags
-- ============================================

-- Platform Tags (平台标签)
INSERT INTO tags (name, color) VALUES
  ('ios', '#007AFF'),
  ('android', '#3DDC84'),
  ('web', '#4285F4'),
  ('windows', '#0078D4'),
  ('macos', '#000000'),
  ('linux', '#FCC624')
ON DUPLICATE KEY UPDATE name=name;

-- Project Tags (项目标签)
INSERT INTO tags (name, color) VALUES
  ('viking', '#8B4513'),
  ('alpha', '#FF6B6B'),
  ('beta', '#4ECDC4'),
  ('gamma', '#95E1D3'),
  ('production', '#2ECC71'),
  ('staging', '#F39C12')
ON DUPLICATE KEY UPDATE name=name;

-- Functional Tags (功能性标签)
INSERT INTO tags (name, color) VALUES
  ('autocomplete', '#9B59B6'),
  ('search', '#3498DB'),
  ('notification', '#E74C3C'),
  ('analytics', '#1ABC9C'),
  ('authentication', '#E67E22'),
  ('authorization', '#D35400'),
  ('caching', '#F1C40F'),
  ('database', '#34495E'),
  ('api', '#16A085'),
  ('ui', '#E91E63'),
  ('ux', '#9C27B0'),
  ('performance', '#FF9800'),
  ('security', '#F44336'),
  ('testing', '#4CAF50'),
  ('documentation', '#2196F3'),
  ('refactoring', '#607D8B'),
  ('bugfix', '#E91E63'),
  ('feature', '#4CAF50'),
  ('enhancement', '#00BCD4'),
  ('migration', '#795548')
ON DUPLICATE KEY UPDATE name=name;

-- Category Tags (分类标签)
INSERT INTO tags (name, color) VALUES
  ('backend', '#3B82F6'),
  ('frontend', '#10B981'),
  ('mobile', '#EF4444'),
  ('desktop', '#8B5CF6'),
  ('infrastructure', '#F59E0B'),
  ('devops', '#06B6D4'),
  ('monitoring', '#EC4899'),
  ('logging', '#84CC16')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- 插入 50 个有意义的 Tickets
-- ============================================

INSERT INTO tickets (title, description, status) VALUES
  -- iOS 相关 tickets (1-4)
  ('iOS 应用启动性能优化', '优化 iOS 应用的冷启动时间，目标从 3.5 秒降低到 2 秒以内', 'pending'),
  ('iOS 深色模式支持', '为 iOS 应用添加完整的深色模式支持，包括所有界面和自定义组件', 'completed'),
  ('iOS 推送通知集成', '集成 Firebase Cloud Messaging，实现推送通知功能', 'pending'),
  ('iOS 应用内购买功能', '实现应用内购买功能，支持订阅和一次性购买', 'pending'),
  
  -- Android 相关 tickets (5-8)
  ('Android 12 适配', '适配 Android 12 的新特性，包括 Material You 设计语言', 'completed'),
  ('Android 后台任务优化', '优化 Android 后台任务执行，减少电池消耗', 'pending'),
  ('Android 多语言支持', '添加 10 种语言的本地化支持', 'pending'),
  ('Android 无障碍功能改进', '改进应用的无障碍功能，提升视障用户的使用体验', 'pending'),
  
  -- Web 相关 tickets (9-12)
  ('Web 端响应式设计优化', '优化移动端和桌面端的响应式布局，提升用户体验', 'completed'),
  ('Web 端 SEO 优化', '改进 SEO，包括 meta 标签、结构化数据和 sitemap', 'pending'),
  ('Web 端 PWA 支持', '将 Web 应用转换为 PWA，支持离线访问和安装', 'pending'),
  ('Web 端性能监控', '集成性能监控工具，实时追踪页面加载时间和 Core Web Vitals', 'completed'),
  
  -- 搜索和自动完成功能 (13-16)
  ('全局搜索功能实现', '实现全局搜索功能，支持全文检索和高级筛选', 'pending'),
  ('搜索自动完成优化', '优化搜索自动完成功能，提升搜索准确性和响应速度', 'pending'),
  ('搜索历史记录', '添加搜索历史记录功能，方便用户快速访问之前的搜索', 'completed'),
  ('搜索建议算法改进', '改进搜索建议算法，使用机器学习提升相关性', 'pending'),
  
  -- 通知系统 (17-19)
  ('实时通知系统', '构建实时通知系统，支持 WebSocket 和推送通知', 'completed'),
  ('通知偏好设置', '允许用户自定义通知偏好，包括通知类型和时间', 'pending'),
  ('通知中心 UI 设计', '设计并实现通知中心界面，展示所有通知', 'completed'),
  
  -- 认证和授权 (20-23)
  ('OAuth 2.0 集成', '集成 OAuth 2.0 认证，支持 Google、GitHub 等第三方登录', 'completed'),
  ('多因素认证 (MFA)', '实现多因素认证功能，提升账户安全性', 'pending'),
  ('角色权限管理系统', '构建完整的角色和权限管理系统，支持细粒度权限控制', 'pending'),
  ('会话管理优化', '优化会话管理，包括自动续期和安全退出', 'completed'),
  
  -- 性能优化 (24-28)
  ('数据库查询优化', '优化慢查询，添加必要的索引，提升查询性能', 'completed'),
  ('API 响应时间优化', '优化 API 响应时间，目标 P95 延迟降低到 200ms 以内', 'pending'),
  ('前端代码分割', '实施前端代码分割，减少初始加载时间', 'completed'),
  ('CDN 集成', '集成 CDN 加速静态资源加载', 'completed'),
  ('缓存策略实施', '实施多级缓存策略，包括 Redis 和浏览器缓存', 'pending'),
  
  -- 监控和分析 (29-32)
  ('用户行为分析', '集成用户行为分析工具，追踪用户操作路径', 'completed'),
  ('错误监控系统', '集成错误监控系统，实时捕获和报告应用错误', 'completed'),
  ('性能指标仪表板', '创建性能指标仪表板，展示关键性能指标', 'pending'),
  ('A/B 测试框架', '构建 A/B 测试框架，支持功能实验和数据分析', 'pending'),
  
  -- Viking 项目相关 (33-36)
  ('Viking 项目数据迁移', '将 Viking 项目数据迁移到新数据库架构', 'completed'),
  ('Viking API 兼容层', '创建 API 兼容层，确保现有客户端正常工作', 'pending'),
  ('Viking 用户界面重构', '重构 Viking 项目的用户界面，采用新的设计系统', 'pending'),
  ('Viking 性能基准测试', '对 Viking 项目进行性能基准测试，识别瓶颈', 'completed'),
  
  -- 基础设施和 DevOps (37-41)
  ('Docker 容器化部署', '将应用容器化，使用 Docker 进行部署', 'completed'),
  ('CI/CD 流水线优化', '优化 CI/CD 流水线，缩短构建和部署时间', 'pending'),
  ('基础设施监控', '设置基础设施监控，包括服务器、数据库和网络', 'completed'),
  ('日志聚合系统', '实施日志聚合系统，统一管理和查询日志', 'pending'),
  ('灾难恢复计划', '制定并测试灾难恢复计划，确保数据安全', 'pending'),
  
  -- 测试和质量保证 (42-45)
  ('单元测试覆盖率提升', '将单元测试覆盖率从 60% 提升到 85%', 'pending'),
  ('集成测试自动化', '自动化集成测试流程，减少手动测试时间', 'completed'),
  ('端到端测试框架', '建立端到端测试框架，覆盖主要用户流程', 'pending'),
  ('性能测试套件', '创建性能测试套件，定期进行负载测试', 'completed'),
  
  -- 文档和开发体验 (46-49)
  ('API 文档自动生成', '设置 API 文档自动生成，使用 Swagger/OpenAPI', 'completed'),
  ('开发环境一键搭建', '创建开发环境一键搭建脚本，简化新成员入职', 'completed'),
  ('代码审查指南', '编写代码审查指南，统一代码质量标准', 'pending'),
  ('技术债务清理', '清理技术债务，重构遗留代码', 'pending'),
  
  -- 安全和合规 (50-52)
  ('安全漏洞扫描', '实施自动化安全漏洞扫描，定期检查依赖项', 'completed'),
  ('GDPR 合规性检查', '进行 GDPR 合规性检查，确保数据处理符合要求', 'pending'),
  ('数据加密增强', '增强数据传输和存储的加密强度', 'pending');

-- ============================================
-- 为 Tickets 分配 Tags
-- ============================================

-- Ticket 1: iOS 应用启动性能优化
INSERT INTO ticket_tags (ticket_id, tag_id) 
SELECT 1, id FROM tags WHERE name IN ('ios', 'performance', 'mobile');

-- Ticket 2: iOS 深色模式支持  
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 2, id FROM tags WHERE name IN ('ios', 'ui', 'ux', 'feature');

-- Ticket 3: iOS 推送通知集成
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 3, id FROM tags WHERE name IN ('ios', 'notification', 'mobile', 'api');

-- Ticket 4: iOS 应用内购买功能
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 4, id FROM tags WHERE name IN ('ios', 'feature', 'mobile');

-- Ticket 5: Android 12 适配
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 5, id FROM tags WHERE name IN ('android', 'ui', 'feature');

-- Ticket 6: Android 后台任务优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 6, id FROM tags WHERE name IN ('android', 'performance', 'mobile');

-- Ticket 7: Android 多语言支持
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 7, id FROM tags WHERE name IN ('android', 'feature', 'mobile');

-- Ticket 8: Android 无障碍功能改进
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 8, id FROM tags WHERE name IN ('android', 'ux', 'mobile');

-- Ticket 9: Web 端响应式设计优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 9, id FROM tags WHERE name IN ('web', 'ui', 'ux', 'frontend');

-- Ticket 10: Web 端 SEO 优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 10, id FROM tags WHERE name IN ('web', 'frontend');

-- Ticket 11: Web 端 PWA 支持
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 11, id FROM tags WHERE name IN ('web', 'frontend', 'feature');

-- Ticket 12: Web 端性能监控
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 12, id FROM tags WHERE name IN ('web', 'monitoring', 'performance');

-- Ticket 13: 全局搜索功能实现
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 13, id FROM tags WHERE name IN ('search', 'backend', 'feature', 'database');

-- Ticket 14: 搜索自动完成优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 14, id FROM tags WHERE name IN ('autocomplete', 'search', 'performance', 'frontend');

-- Ticket 15: 搜索历史记录
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 15, id FROM tags WHERE name IN ('search', 'feature', 'ux');

-- Ticket 16: 搜索建议算法改进
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 16, id FROM tags WHERE name IN ('search', 'autocomplete', 'enhancement');

-- Ticket 17: 实时通知系统
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 17, id FROM tags WHERE name IN ('notification', 'backend', 'api');

-- Ticket 18: 通知偏好设置
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 18, id FROM tags WHERE name IN ('notification', 'feature', 'ux');

-- Ticket 19: 通知中心 UI 设计
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 19, id FROM tags WHERE name IN ('notification', 'ui', 'frontend');

-- Ticket 20: OAuth 2.0 集成
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 20, id FROM tags WHERE name IN ('authentication', 'api', 'backend');

-- Ticket 21: 多因素认证 (MFA)
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 21, id FROM tags WHERE name IN ('authentication', 'security', 'feature');

-- Ticket 22: 角色权限管理系统
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 22, id FROM tags WHERE name IN ('authorization', 'backend', 'security', 'feature');

-- Ticket 23: 会话管理优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 23, id FROM tags WHERE name IN ('authentication', 'security', 'backend');

-- Ticket 24: 数据库查询优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 24, id FROM tags WHERE name IN ('database', 'performance', 'backend');

-- Ticket 25: API 响应时间优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 25, id FROM tags WHERE name IN ('api', 'performance', 'backend');

-- Ticket 26: 前端代码分割
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 26, id FROM tags WHERE name IN ('frontend', 'performance');

-- Ticket 27: CDN 集成
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 27, id FROM tags WHERE name IN ('infrastructure', 'performance');

-- Ticket 28: 缓存策略实施
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 28, id FROM tags WHERE name IN ('caching', 'performance', 'backend');

-- Ticket 29: 用户行为分析
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 29, id FROM tags WHERE name IN ('analytics', 'backend', 'monitoring');

-- Ticket 30: 错误监控系统
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 30, id FROM tags WHERE name IN ('monitoring', 'backend');

-- Ticket 31: 性能指标仪表板
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 31, id FROM tags WHERE name IN ('monitoring', 'frontend', 'analytics');

-- Ticket 32: A/B 测试框架
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 32, id FROM tags WHERE name IN ('analytics', 'backend', 'feature');

-- Ticket 33: Viking 项目数据迁移
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 33, id FROM tags WHERE name IN ('viking', 'migration', 'database');

-- Ticket 34: Viking API 兼容层
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 34, id FROM tags WHERE name IN ('viking', 'api', 'backend');

-- Ticket 35: Viking 用户界面重构
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 35, id FROM tags WHERE name IN ('viking', 'ui', 'refactoring', 'frontend');

-- Ticket 36: Viking 性能基准测试
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 36, id FROM tags WHERE name IN ('viking', 'performance', 'testing');

-- Ticket 37: Docker 容器化部署
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 37, id FROM tags WHERE name IN ('devops', 'infrastructure');

-- Ticket 38: CI/CD 流水线优化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 38, id FROM tags WHERE name IN ('devops', 'infrastructure');

-- Ticket 39: 基础设施监控
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 39, id FROM tags WHERE name IN ('monitoring', 'infrastructure', 'devops');

-- Ticket 40: 日志聚合系统
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 40, id FROM tags WHERE name IN ('logging', 'infrastructure', 'devops', 'backend');

-- Ticket 41: 灾难恢复计划
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 41, id FROM tags WHERE name IN ('infrastructure', 'devops', 'security');

-- Ticket 42: 单元测试覆盖率提升
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 42, id FROM tags WHERE name IN ('testing', 'backend');

-- Ticket 43: 集成测试自动化
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 43, id FROM tags WHERE name IN ('testing', 'backend');

-- Ticket 44: 端到端测试框架
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 44, id FROM tags WHERE name IN ('testing', 'frontend');

-- Ticket 45: 性能测试套件
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 45, id FROM tags WHERE name IN ('testing', 'performance');

-- Ticket 46: API 文档自动生成
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 46, id FROM tags WHERE name IN ('documentation', 'api', 'backend');

-- Ticket 47: 开发环境一键搭建
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 47, id FROM tags WHERE name IN ('documentation', 'devops');

-- Ticket 48: 代码审查指南
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 48, id FROM tags WHERE name IN ('documentation');

-- Ticket 49: 技术债务清理
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 49, id FROM tags WHERE name IN ('refactoring', 'backend');

-- Ticket 50: 安全漏洞扫描
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 50, id FROM tags WHERE name IN ('security', 'devops');

-- Ticket 51: GDPR 合规性检查
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 51, id FROM tags WHERE name IN ('security');

-- Ticket 52: 数据加密增强
INSERT INTO ticket_tags (ticket_id, tag_id)
SELECT 52, id FROM tags WHERE name IN ('security', 'backend');

-- ============================================
-- 验证数据
-- ============================================

SELECT 'Tags count:' as info, CAST(COUNT(*) AS CHAR) as count FROM tags
UNION ALL
SELECT 'Tickets count:', CAST(COUNT(*) AS CHAR) FROM tickets
UNION ALL
SELECT 'Ticket-Tag relations:', CAST(COUNT(*) AS CHAR) FROM ticket_tags;
