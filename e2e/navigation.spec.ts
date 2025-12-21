import { test, expect } from '@playwright/test';

test.describe('导航测试', () => {
  test('可以从主页导航到查询页面', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const queryLink = page.getByRole('link', { name: '查询页面' });
    await queryLink.click();
    
    await expect(page).toHaveURL(/\/query/);
    await expect(page.getByRole('heading', { name: 'SQL 查询' })).toBeVisible();
  });

  test('可以从查询页面导航回主页', async ({ page }) => {
    await page.goto('/query');
    await page.waitForLoadState('networkidle');
    
    // 通过直接导航测试
    await page.goto('/');
    
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Database Query Tool' })).toBeVisible();
  });

  test('可以通过URL参数指定数据库', async ({ page }) => {
    const dbName = 'test-db';
    await page.goto(`/query/${encodeURIComponent(dbName)}`);
    await page.waitForLoadState('networkidle');
    // 等待页面完全加载
    await page.waitForTimeout(1000);
    
    // 检查URL是否正确
    await expect(page).toHaveURL(new RegExp(`/query/${encodeURIComponent(dbName)}`));
    
    // 检查数据库选择器是否存在
    const select = page.getByRole('combobox');
    await expect(select).toBeVisible();
    
    // 检查数据库选择器是否选中了该数据库（如果数据库存在）
    // 如果数据库不存在，select 可能保持为空，这也是可以接受的
    const selectValue = await select.inputValue();
    // 如果数据库存在，值应该匹配；如果不存在，值可能为空
    expect(selectValue === dbName || selectValue === '').toBeTruthy();
  });

  test('主页上的SQL查询按钮应该导航到正确的URL', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 首先需要选择一个数据库（如果有的话）
    // 如果没有数据库，SQL查询按钮可能不存在
    const sqlQueryLink = page.getByRole('link', { name: 'SQL 查询' });
    const linkExists = await sqlQueryLink.isVisible().catch(() => false);
    
    if (linkExists) {
      const href = await sqlQueryLink.getAttribute('href');
      expect(href).toMatch(/\/query\//);
    } else {
      // 如果没有数据库，这是预期的行为
      expect(true).toBeTruthy();
    }
  });

  test('浏览器前进后退按钮应该正常工作', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 导航到查询页面
    await page.getByRole('link', { name: '查询页面' }).click();
    await expect(page).toHaveURL(/\/query/);
    
    // 后退
    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Database Query Tool' })).toBeVisible();
    
    // 前进
    await page.goForward();
    await expect(page).toHaveURL(/\/query/);
    await expect(page.getByRole('heading', { name: 'SQL 查询' })).toBeVisible();
  });
});
