import { describe, it, expect } from 'vitest';

describe('App 初始化', () => {
  it('应用入口文件存在', () => {
    expect(() => import('../App')).not.toThrow();
  });
});
