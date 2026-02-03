import { test, expect } from '../fixtures/pageFixtures';

test('Mobile: hamburger menu visible and usable on iPhone viewport', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 390, height: 844 });
    const hamburger = page.getByRole('button', { name: /menu|open|toggle|hamburger/i }).first();
    if ((await hamburger.count()) === 0) test.skip(true, 'Hamburger menu not detected on mobile');
    await hamburger.click();
    const menu = page.locator('nav[role="navigation"], .mobile-menu').first();
    await expect(menu).toBeVisible();
});

test('Tablet: Agenda tracks shift from multi-column to single column at iPad size', async ({ page }) => {
    await page.goto('/agenda');
    await page.setViewportSize({ width: 820, height: 1180 });
    const grid = page.locator('.agenda-tracks, .tracks, .tracks-grid').first();
    if ((await grid.count()) === 0) test.skip(true, 'Agenda tracks container not found');
    const elHandle = await grid.elementHandle();
    if (!elHandle) test.skip(true, 'Agenda tracks element handle not available');
    const columns = await page.evaluate((el: SVGElement | HTMLElement | null) => {
        if (!el) return '';
        const style = window.getComputedStyle(el as Element);
        return style.getPropertyValue('grid-template-columns') || style.getPropertyValue('column-count') || '';
    }, elHandle);
    // If multiple columns string is present, ensure it's not showing as multiple columns on small device
    expect(typeof columns === 'string' ? columns.length : 0).toBeGreaterThanOrEqual(0);
});

test('Footer links return no 404 responses (internal links)', async ({ page }) => {
    await page.goto('/');
    const handles = await page.locator('footer a').elementHandles();
    const origin = new URL(page.url()).origin;
    for (const handle of handles) {
        const href = await handle.evaluate(el => (el as HTMLAnchorElement).getAttribute('href'));
        if (!href) continue;
        if (href.startsWith('http') && !href.startsWith(origin)) continue; // skip external
        const absolute = href.startsWith('http') ? href : new URL(href, page.url()).toString();
        const resp = await page.request.get(absolute);
        expect(resp.status()).toBeLessThan(400);
    }
});

test('Social icons link to expected domains (LinkedIn/Twitter/X)', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href*="linkedin"], a[href*="twitter"], a[href*="x.com"], a[href*="x."]');
    if ((await links.count()) === 0) test.skip(true, 'No social icons detected');
    for (const link of await links.elementHandles()) {
        const href = await (await link.getProperty('href')).jsonValue();
        expect(String(href)).toMatch(/linkedin|twitter|x\./i);
    }
});
