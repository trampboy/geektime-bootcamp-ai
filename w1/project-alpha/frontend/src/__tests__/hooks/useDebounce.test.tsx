import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该立即返回初始值', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('应该在延迟后更新值', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    expect(result.current).toBe('initial');

    // 更新值
    rerender({ value: 'updated', delay: 300 });

    // 值应该还没有更新
    expect(result.current).toBe('initial');

    // 快进时间并执行所有待处理的回调
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 值应该已经更新
    expect(result.current).toBe('updated');
  });

  it('应该在延迟时间内多次更新时只触发最后一次', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 300 },
      }
    );

    // 快速连续更新
    act(() => {
      rerender({ value: 'update1', delay: 300 });
    });
    
    act(() => {
      rerender({ value: 'update2', delay: 300 });
    });
    
    act(() => {
      rerender({ value: 'update3', delay: 300 });
    });

    // 此时值应该还是初始值（因为定时器还没执行）
    expect(result.current).toBe('initial');

    // 快进时间，执行最后一次的定时器
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 应该只更新为最后一次的值
    expect(result.current).toBe('update3');
  });

  it('应该支持自定义延迟时间', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    act(() => {
      rerender({ value: 'updated', delay: 500 });
    });

    // 300ms 后应该还没更新
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // 再等待 200ms 应该更新了
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('应该处理数字类型', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 300 },
      }
    );

    act(() => {
      rerender({ value: 100, delay: 300 });
    });

    // 值应该还没有更新
    expect(result.current).toBe(0);

    // 快进时间执行定时器
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(100);
  });
});
