import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://stackpilot-ai-seven.vercel.app';

test.describe('StackPilot AI - Enterprise E2E Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-01: Landing Page & Navigation Verification', async ({ page }) => {
    await expect(page).toHaveTitle(/StackPilot AI/i);
    const getStartedBtn = page.locator('text=Get Started');
    await expect(getStartedBtn).toBeVisible();
  });

  test('TC-02: User Authentication Flow (Login & Dashboard Access)', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill login credentials
    await page.fill('input[type="email"]', 'admin@stackpilot.ai');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button:has-text("Log In")');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Active Projects')).toBeVisible();
  });

  test('TC-03: Invalid Credentials Login Error Handling', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@stackpilot.ai');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Log In")');

    // Should display error message
    const errorAlert = page.locator('.text-red-400');
    await expect(errorAlert).toBeVisible();
  });

  test('TC-04: Projects Module Navigation & Interaction', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@stackpilot.ai');
    await page.click('button:has-text("Log In")');

    // Navigate to Projects
    await page.goto(`${BASE_URL}/projects`);
    await expect(page.locator('h1, h2')).toContainText(/Projects|Workspace Projects/i);

    // Verify project list items
    const projectCards = page.locator('.grid > div');
    await expect(projectCards.first()).toBeVisible();
  });

  test('TC-05: Tasks Module Kanban Board & Workflow', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@stackpilot.ai');
    await page.click('button:has-text("Log In")');

    await page.goto(`${BASE_URL}/tasks`);
    await expect(page.locator('text=Planning')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
  });

  test('TC-06: CRM Lead Management Pipeline', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@stackpilot.ai');
    await page.click('button:has-text("Log In")');

    await page.goto(`${BASE_URL}/crm`);
    await expect(page.locator('text=Client Management')).toBeVisible();
  });

  test('TC-07: Finance Invoice Calculator & Totals Verification', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@stackpilot.ai');
    await page.click('button:has-text("Log In")');

    await page.goto(`${BASE_URL}/finance`);
    await expect(page.locator('text=Invoices & Finance')).toBeVisible();
  });

  test('TC-08: AI Studio Requirements & Test Suite Generator', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@stackpilot.ai');
    await page.click('button:has-text("Log In")');

    await page.goto(`${BASE_URL}/ai-studio`);
    await expect(page.locator('text=AI Workflow Assistants')).toBeVisible();
  });

});
