// Project Alpha - Express 应用入口
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import ticketRoutes from './routes/ticket.routes';
import tagRoutes from './routes/tag.routes';
import { testConnection } from './config/database';

// 加载环境变量
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 性能优化：启用 gzip 压缩
app.use(compression() as any);

// 安全：API 限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制 100 个请求
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter as any);

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' ? req.body : undefined
  });
  next();
});

// 健康检查路由
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Project Alpha API is running',
    timestamp: new Date().toISOString()
  });
});

// API 路由
app.use('/api/tickets', ticketRoutes);
app.use('/api/tags', tagRoutes);

// 404 处理
app.use(notFoundHandler);

// 错误处理中间件（必须在最后）
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// 只在非测试环境时自动启动服务器
// 测试环境会通过 supertest 直接使用 app 实例，不需要启动 HTTP 服务器
if (process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
  startServer();
}

export default app;
