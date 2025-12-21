# 测试文档

## 测试结构

```
src/__tests__/
├── api.integration.test.ts          # API 集成测试
├── services/
│   ├── tag.service.test.ts          # Tag Service 单元测试
│   └── ticket.service.test.ts       # Ticket Service 单元测试
├── controllers/
│   └── ticket.controller.test.ts    # Ticket Controller 单元测试
├── middlewares/
│   └── error.middleware.test.ts     # 错误处理中间件测试
└── utils/
    ├── response.test.ts             # 响应工具测试
    └── logger.test.ts               # 日志工具测试
```

## 运行测试

```bash
# 运行所有测试
yarn test

# 运行测试并生成覆盖率报告
yarn test:coverage

# 监听模式（开发时使用）
yarn test:watch

# 运行特定测试文件
yarn test src/__tests__/services/tag.service.test.ts
```

## 测试覆盖

### ✅ 已完成的测试

1. **集成测试** (`api.integration.test.ts`)
   - ✅ Tag API 端点测试
   - ✅ Ticket API 端点测试
   - ✅ 边界情况和错误处理测试

2. **Service 层单元测试**
   - ✅ Tag Service - 所有方法测试
   - ⚠️ Ticket Service - 部分测试需要修复 mock 顺序

3. **Controller 层单元测试**
   - ✅ Ticket Controller - 所有方法测试

4. **中间件测试**
   - ✅ 错误处理中间件测试
   - ✅ 404 处理测试

5. **工具函数测试**
   - ✅ 响应工具测试
   - ✅ 日志工具测试

## 测试说明

### Mock 策略

- **Service 层**: Mock 数据库连接 (`pool.execute`)
- **Controller 层**: Mock Service 层方法
- **中间件**: 直接测试，无需 mock
- **工具函数**: 直接测试

### 注意事项

1. **数据库 Mock**: Service 测试需要正确 mock `pool.execute` 的调用顺序
2. **事务测试**: 涉及事务的方法需要 mock `getConnection` 和 connection 对象
3. **错误处理**: 确保测试覆盖所有错误场景

## 测试覆盖率目标

- 目标覆盖率: 80%+
- 当前覆盖率: 运行 `yarn test:coverage` 查看

## 待修复问题

部分 Ticket Service 测试需要修复 mock 顺序，确保：
1. `getTicketById` 的两次 `pool.execute` 调用顺序正确
2. 事务相关测试的 connection mock 完整
