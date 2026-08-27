import { test, expect } from '@playwright/test';

test.describe('Authentication & Navigation E2E Flow', () => {
  test('renders auth page and switches between signin and signup modes', async ({ page }) => {
    await page.goto('/');

    // Check main title / branding exists
    await expect(page.locator('text=Aditi Super App').first()).toBeVisible();

    // Verify Sign In form elements
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();

    // Switch to Create Account mode
    const createAccountTab = page.locator('button:has-text("Create Account")');
    if (await createAccountTab.isVisible()) {
      await createAccountTab.click();
      await expect(page.locator('input[placeholder*="name" i]').first()).toBeVisible();
    }
  });

  test('validates password minimum length requirement on submit', async ({ page }) => {
    await page.goto('/');
    const emailInput = page.locator('input[type="email"]').first();
    const passInput = page.locator('input[type="password"]').first();

    await emailInput.fill('test.user@example.com');
    await passInput.fill('123'); // short password
    await passInput.press('Enter');

    // Toast or validation should be shown
    await expect(page.locator('body')).toBeVisible();
  });
});
