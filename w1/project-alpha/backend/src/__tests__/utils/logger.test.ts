/**
 * Project Alpha - Logger 单元测试
 */
import logger from '../../utils/logger';

describe('Logger', () => {
  let originalEnv: string | undefined;
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NODE_ENV = originalEnv;
  });

  describe('info', () => {
    it('应该记录信息日志', () => {
      logger.info('Test message');

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.mock.calls[0][0]).toContain('[INFO]');
      expect(consoleLogSpy.mock.calls[0][0]).toContain('Test message');
    });

    it('应该包含时间戳', () => {
      logger.info('Test message');

      const logMessage = consoleLogSpy.mock.calls[0][0];
      expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('应该包含额外参数', () => {
      logger.info('Test message', { key: 'value' });

      const logMessage = consoleLogSpy.mock.calls[0][0];
      expect(logMessage).toContain('{"key":"value"}');
    });
  });

  describe('warn', () => {
    it('应该记录警告日志', () => {
      logger.warn('Warning message');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
      expect(consoleWarnSpy.mock.calls[0][0]).toContain('Warning message');
    });
  });

  describe('error', () => {
    it('应该记录错误日志', () => {
      logger.error('Error message');

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Error message');
    });
  });

  describe('debug', () => {
    it('应该在开发环境记录调试日志', () => {
      process.env.NODE_ENV = 'development';
      logger.debug('Debug message');

      expect(consoleDebugSpy).toHaveBeenCalled();
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
      expect(consoleDebugSpy.mock.calls[0][0]).toContain('Debug message');
    });

    it('不应该在生产环境记录调试日志', () => {
      process.env.NODE_ENV = 'production';
      logger.debug('Debug message');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });
  });
});
