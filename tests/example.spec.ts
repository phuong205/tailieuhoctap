import { test, expect } from '@playwright/test';
import path from 'path';

test('Test đăng nhập local', async ({ page }) => {
  const filePath = path.join(__dirname, '../demo.html');
  await page.goto('file://' + filePath);

  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Mật khẩu').fill('123456');
  await page.getByRole('button', { name: 'Đăng nhập' }).click();

  await expect(page.getByText('Chào mừng bạn trở lại!')).toBeVisible();
});
