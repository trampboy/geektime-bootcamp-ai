import { describe, it, expect } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn', () => {
  it('应该合并多个类名', () => {
    const result = cn('foo', 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('应该处理条件类名', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toContain('foo');
    expect(result).toContain('baz');
    expect(result).not.toContain('bar');
  });

  it('应该处理对象形式的类名', () => {
    const result = cn({ foo: true, bar: false, baz: true });
    expect(result).toContain('foo');
    expect(result).toContain('baz');
    expect(result).not.toContain('bar');
  });

  it('应该合并 Tailwind 冲突的类名', () => {
    // tailwind-merge 应该保留最后一个冲突的类
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('应该处理空值和 undefined', () => {
    const result = cn('foo', null, undefined, 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });
});
