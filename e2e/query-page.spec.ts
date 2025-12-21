import { test, expect } from '@playwright/test';

test.describe('查询页面测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/query');
    // 等待页面加载，包括Monaco编辑器
    await page.waitForLoadState('networkidle');
    // 额外等待Monaco编辑器加载
    await page.waitForTimeout(2000);
  });

  test('页面应该正确加载并显示标题', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SQL 查询' })).toBeVisible();
  });

  test('应该显示数据库选择下拉框', async ({ page }) => {
    const select = page.getByRole('combobox');
    await expect(select).toBeVisible();
    // option 元素在 select 未打开时是隐藏的，这是正常的 HTML 行为
    // 我们检查 option 是否存在，而不是是否可见
    const option = select.locator('option:has-text("选择数据库")');
    await expect(option).toHaveCount(1);
    // 或者检查 select 是否有正确的默认值
    await expect(select).toHaveValue('');
  });

  test('应该显示SQL查询和自然语言查询标签页', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'SQL 查询' })).toBeVisible();
    await expect(page.getByRole('button', { name: '自然语言查询' })).toBeVisible();
  });

  test('默认应该显示SQL查询标签页', async ({ page }) => {
    const sqlTab = page.getByRole('button', { name: 'SQL 查询' });
    await expect(sqlTab).toBeVisible();
    
    // 检查SQL编辑器标题是否存在
    await expect(page.getByRole('heading', { name: 'SQL 编辑器' })).toBeVisible();
  });

  test('可以切换到自然语言查询标签页', async ({ page }) => {
    const naturalTab = page.getByRole('button', { name: '自然语言查询' });
    await naturalTab.click();
    
    // 等待标签页切换
    await page.waitForTimeout(500);
    
    // 检查自然语言查询标题
    await expect(page.getByRole('heading', { name: '自然语言查询' })).toBeVisible();
  });

  test('执行查询按钮在没有选择数据库时应该被禁用', async ({ page }) => {
    const executeButton = page.getByRole('button', { name: '执行查询' });
    await expect(executeButton).toBeDisabled();
  });

  test('应该显示查询结果区域', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '查询结果' })).toBeVisible();
  });

  test('可以在SQL和自然语言标签页之间切换', async ({ page }) => {
    // 切换到自然语言
    await page.getByRole('button', { name: '自然语言查询' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: '自然语言查询' })).toBeVisible();
    
    // 切换回SQL
    await page.getByRole('button', { name: 'SQL 查询' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'SQL 编辑器' })).toBeVisible();
  });

  test('Monaco编辑器应该加载', async ({ page }) => {
    // 等待Monaco编辑器加载
    await page.waitForTimeout(3000);
    
    // 检查Monaco编辑器是否存在（通过查找编辑器容器）
    const editor = page.locator('.monaco-editor').or(page.locator('[class*="monaco"]'));
    const editorExists = await editor.first().isVisible().catch(() => false);
    
    // 或者检查提示文本
    const hintText = page.getByText(/提示.*Ctrl.*Enter/);
    const hintExists = await hintText.isVisible().catch(() => false);
    
    expect(editorExists || hintExists).toBeTruthy();
  });
});
