import { test, expect } from '@playwright/test';

test.describe('Creadoras Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/creadoras', { waitUntil: 'domcontentloaded' });
  });

  test('should load creadoras page', async ({ page }) => {
    await expect(page).toHaveURL('/creadoras');
    await expect(page.locator('text=Cartografía')).toBeVisible();
  });

  test('should display constellation map', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should switch to gallery view', async ({ page }) => {
    await page.click('text=Galería');
    await expect(page.locator('text=Artesanas')).toBeVisible();
  });

  test('should filter by disciplina', async ({ page }) => {
    await page.click('text=Galería');
    await page.selectOption('select', { label: 'Cerámica' });
    await expect(page.locator('text=Cerámica').first()).toBeVisible();
  });

  test('should filter by region', async ({ page }) => {
    await page.click('text=Galería');
    await page.selectOption('select >> nth=1', { label: 'Central' });
    await expect(page.locator('text=Central').first()).toBeVisible();
  });

  test('should clear filters', async ({ page }) => {
    await page.click('text=Galería');
    await page.selectOption('select', { label: 'Cerámica' });
    await page.click('text=Limpiar filtros');
    await expect(page.locator('select').first()).toHaveValue('');
  });
});
