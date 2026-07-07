import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate through main pages', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Navigate to Proyecto
    await page.click('text=Menú');
    await page.click('text=El Proyecto');
    await expect(page).toHaveURL('/proyecto');
    
    // Navigate to Equipo
    await page.click('text=Menú');
    await page.click('text=Quiénes Somos');
    await expect(page).toHaveURL('/equipo');
    
    // Navigate to Contacto
    await page.click('text=Menú');
    await page.click('text=Contacto');
    await expect(page).toHaveURL('/contacto');
    
    // Navigate back to home
    await page.click('text=Menú');
    await page.click('text=Inicio');
    await expect(page).toHaveURL('/');
  });

  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/pagina-que-no-existe', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Página no encontrada')).toBeVisible();
  });

  test('should navigate from 404 to home', async ({ page }) => {
    await page.goto('/pagina-que-no-existe', { waitUntil: 'domcontentloaded' });
    await page.click('text=Volver al inicio');
    await expect(page).toHaveURL('/');
  });
});
