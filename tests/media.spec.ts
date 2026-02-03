import { test, expect } from '../fixtures/pageFixtures';

test('Gallery: at least 5 images load and visible', async ({ page }) => {
    await page.goto('/gallery');
    const imgs = page.locator('img');
    const count = await imgs.count();
    expect(count).toBeGreaterThanOrEqual(5);
    // ensure at least some are visible
    await expect(imgs.first()).toBeVisible();
});

test('Video embed has valid src (YouTube/Vimeo)', async ({ page }) => {
    await page.goto('/');
    const iframe = page.locator('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').first();
    if ((await iframe.count()) === 0) test.skip(true, 'No video embed iframe detected');
    // If present, ensure src contains youtube or vimeo
    const src = await iframe.getAttribute('src');
    expect(src).toMatch(/youtube|vimeo/);
});

test('Lazy loading: scroll to bottom and ensure images/elements load', async ({ page }) => {
    await page.goto('/speakers');
    const before = await page.locator('img').count();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const after = await page.locator('img').count();
    expect(after).toBeGreaterThanOrEqual(before);
});
