import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test('should display mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Mobile menu should be visible
    await expect(page.locator('text=Menú')).toBeVisible();
  });

  test('should navigate using mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    await page.click('text=Menú');
    await page.click('text=El Proyecto');
    await expect(page).toHaveURL('/proyecto');
  });

  test('should display creadoras page correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/creadoras', { waitUntil: 'domcontentloaded' });
    
    // Canvas should be visible
    await expect(page.locator('canvas')).toBeVisible();
    
    // Toggle buttons should be visible
    await expect(page.locator('text=Cartografía')).toBeVisible();
    await expect(page.locator('text=Galería')).toBeVisible();
  });

  test('should allow filtering on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/creadoras', { waitUntil: 'domcontentloaded' });
    
    await page.click('text=Galería');
    await page.selectOption('select', { label: 'Cerámica' });
    await expect(page.locator('text=Cerámica').first()).toBeVisible();
  });
});
