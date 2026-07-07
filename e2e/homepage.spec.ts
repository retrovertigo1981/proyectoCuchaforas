import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/Cucháforas/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=Explorar la Cartografía')).toBeVisible();
  });

  test('should navigate to creadoras page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.click('text=Explorar la Cartografía');
    await expect(page).toHaveURL('/creadoras');
  });
});
