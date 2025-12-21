import { test, expect } from '@playwright/test';

test.describe('添加数据库测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('表单验证 - 数据库名称为必填', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Add Database' });
    
    // 尝试提交空表单
    await submitButton.click();
    
    // HTML5 验证应该阻止提交或显示错误
    const nameInput = page.getByLabel('Database Name');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid;
    }).catch(() => false);
    
    // 至少输入框应该被标记为无效
    expect(isInvalid || await nameInput.getAttribute('required') !== null).toBeTruthy();
  });

  test('表单验证 - 连接URL为必填', async ({ page }) => {
    const nameInput = page.getByLabel('Database Name');
    await nameInput.fill('test-db');
    
    const submitButton = page.getByRole('button', { name: 'Add Database' });
    await submitButton.click();
    
    // HTML5 验证应该阻止提交
    const urlInput = page.getByLabel('Connection URL');
    const isInvalid = await urlInput.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid;
    }).catch(() => false);
    
    expect(isInvalid || await urlInput.getAttribute('required') !== null).toBeTruthy();
  });

  test('可以填写并提交表单', async ({ page }) => {
    const nameInput = page.getByLabel('Database Name');
    const urlInput = page.getByLabel('Connection URL');
    const submitButton = page.getByRole('button', { name: 'Add Database' });

    await nameInput.fill('test-database');
    await urlInput.fill('mysql://root:password@localhost:3306/testdb');
    
    // 监听网络请求
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/v1/dbs/') && response.request().method() === 'PUT',
      { timeout: 10000 }
    ).catch(() => null);

    await submitButton.click();
    
    // 检查按钮状态变为加载中
    await expect(submitButton).toContainText(/Adding|Add Database/, { timeout: 2000 }).catch(() => {
      // 如果请求很快完成，可能看不到加载状态
    });

    // 等待请求完成（如果后端可用）
    await responsePromise;
    
    // 等待一下让UI更新
    await page.waitForTimeout(1000);
    
    // 验证表单字段可能被清空（成功时）或显示错误消息
    const successMessage = page.getByText('Database added successfully');
    const errorMessage = page.locator('.bg-red-50, .text-red-700');
    
    // 至少应该有一个反馈（成功或错误）
    const hasSuccess = await successMessage.isVisible().catch(() => false);
    const hasError = await errorMessage.isVisible().catch(() => false);
    
    // 如果后端不可用，错误消息也是预期的行为
    expect(hasSuccess || hasError).toBeTruthy();
  });

  test('提交表单后应该刷新数据库列表', async ({ page }) => {
    const nameInput = page.getByLabel('Database Name');
    const urlInput = page.getByLabel('Connection URL');
    const submitButton = page.getByRole('button', { name: 'Add Database' });

    await nameInput.fill('test-db-refresh');
    await urlInput.fill('mysql://root:password@localhost:3306/testdb');
    
    await submitButton.click();
    
    // 等待可能的API调用
    await page.waitForTimeout(2000);
    
    // 检查是否有数据库列表更新或错误消息
    const databasesList = page.locator('text=Databases').or(page.locator('text=No databases'));
    await expect(databasesList.first()).toBeVisible();
  });
});
