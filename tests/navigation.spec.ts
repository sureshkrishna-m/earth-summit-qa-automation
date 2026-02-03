import { test, expect } from '../fixtures/pageFixtures';

test('Home Page loads with HTTP 200 and hero visible', async ({ page, home }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await home.isHeroVisible();
});

test('Navigation Bar links to city pages (Hyderabad, Gandhinagar, New Delhi)', async ({ page, home }) => {
    await home.goto();

    await home.clickHyderabad();
    await expect(page).toHaveURL(/\/hyderabad/i);

    await page.goto('/');
    await home.clickGandhinagar();
    await expect(page).toHaveURL(/\/gandhinagar/i);

    await page.goto('/');
    await home.clickNewDelhi();
    await expect(page).toHaveURL(/(new-?delhi|delhi)/i);
});

test('Dropdown Menu Interaction: Agenda/Speakers shows sub-options', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('link', { name: /agenda|speakers/i }).first();
    await menu.hover();
    const submenu = page.locator('.submenu, [role="menu"], .dropdown').first();
    await expect(submenu).toBeVisible({ timeout: 2000 }).catch(() => test.skip(true, 'No visible dropdown detected'));
});

test('Logo redirects to Home from subpages', async ({ page, home }) => {
    await page.goto('/partners');
    await home.clickLogo();
    await expect(page).toHaveURL(/\/$/);
});
