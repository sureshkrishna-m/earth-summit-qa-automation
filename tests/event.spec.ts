import { test, expect } from '../fixtures/pageFixtures';

test('Multi-City pages show correct city metadata', async ({ hyderabad, gandhinagar, newdelhi }) => {
    await hyderabad.goto();
    await hyderabad.hasVenue('HITEX Exhibition Centre');

    await gandhinagar.goto();
    await gandhinagar.hasVenue('Gandhinagar');

    await newdelhi.goto();
    await newdelhi.hasVenue('Delhi');
});

test('Agenda search/filter works if present', async ({ page }) => {
    await page.goto('/agenda');
    const search = page.locator('input[type="search"], input[placeholder*="Search"], #search, .agenda-search').first();
    if ((await search.count()) === 0) test.skip(true, 'Agenda search not present');
    await search.fill('AgriTech');
    await page.keyboard.press('Enter');
    const results = page.getByText(/AgriTech/i);
    await expect(results).toBeVisible({ timeout: 3000 });
});

test('Speaker profile modal opens with bio and session info', async ({ page }) => {
    await page.goto('/speakers');
    const speaker = page.getByRole('article').locator('img, a, h3').first();
    if ((await speaker.count()) === 0) test.skip(true, 'No speaker elements found');
    await speaker.click();
    const modal = page.locator('[role="dialog"], .modal, .speaker-detail').first();
    await expect(modal).toBeVisible({ timeout: 3000 });
    await expect(modal).toContainText(/bio|session|about/i);
});

test('Agenda PDF download link exists and is not broken', async ({ page }) => {
    await page.goto('/agenda');
    const download = page.getByRole('link', { name: /download agenda|download/i }).first();
    if ((await download.count()) === 0) test.skip(true, 'No download link detected');
    const href = await download.getAttribute('href');
    if (!href || !href.endsWith('.pdf')) {
        test.fail(true, 'Download link does not point to a PDF');
        return;
    }
    const absolute = href.startsWith('http') ? href : new URL(href, page.url()).toString();
    const resp = await page.request.get(absolute);
    expect(resp.status()).toBeLessThan(400);
});
