import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDate, formatDateTime } from '@/utils/format';

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该显示"刚刚"当时间少于1分钟', () => {
    const now = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(now);
    
    const dateString = new Date('2024-01-01T11:59:30Z').toISOString();
    expect(formatDate(dateString)).toBe('刚刚');
  });

  it('应该显示分钟数当时间少于1小时', () => {
    const now = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(now);
    
    const dateString = new Date('2024-01-01T11:30:00Z').toISOString();
    expect(formatDate(dateString)).toBe('30 分钟前');
  });

  it('应该显示小时数当时间少于24小时', () => {
    const now = new Date('2024-01-01T12:00:00Z');
    vi.setSystemTime(now);
    
    const dateString = new Date('2024-01-01T10:00:00Z').toISOString();
    expect(formatDate(dateString)).toBe('2 小时前');
  });

  it('应该显示天数当时间少于7天', () => {
    const now = new Date('2024-01-05T12:00:00Z');
    vi.setSystemTime(now);
    
    const dateString = new Date('2024-01-03T12:00:00Z').toISOString();
    expect(formatDate(dateString)).toBe('2 天前');
  });

  it('应该显示完整日期当时间超过7天', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);
    
    const dateString = new Date('2024-01-01T12:00:00Z').toISOString();
    const result = formatDate(dateString);
    expect(result).toContain('2024');
    expect(result).toContain('1');
  });
});

describe('formatDateTime', () => {
  it('应该正确格式化日期时间', () => {
    const dateString = '2024-01-15T14:30:00Z';
    const result = formatDateTime(dateString);
    
    expect(result).toContain('2024');
    expect(result).toContain('01');
    expect(result).toContain('15');
  });

  it('应该包含时分信息', () => {
    const dateString = '2024-01-15T14:30:00Z';
    const result = formatDateTime(dateString);
    
    // 根据时区可能不同，但应该包含时间部分
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});
