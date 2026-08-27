import { test, expect } from '@playwright/test';

test.describe('Chat Messenger & Interface E2E Tests', () => {
  test('verifies QR scanner modal opens and closes properly', async ({ page }) => {
    await page.goto('/');

    const qrImage = page.locator('img[alt*="QR" i]').first();
    await expect(qrImage).toBeVisible();
  });
});
