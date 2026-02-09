import { test, expect } from '@playwright/test';

test.describe('Gantt Chart E2E', () => {
  test('should render the timeline and navigate', async ({ page }) => {
    await page.goto('/');

    // Check if the main SVG container is present
    const gantt = page.locator('svg.gantt-main');
    await expect(gantt).toBeVisible();

    // Test zooming: simulate scroll with Ctrl key
    await page.mouse.move(500, 500);
    await page.keyboard.down('Control');
    await page.mouse.wheel(0, -100);
    await page.keyboard.up('Control');

    // Verify if some task labels are still visible after zoom
    const task = page.locator('.task-bar').first();
    await expect(task).toBeVisible();
  });
});
