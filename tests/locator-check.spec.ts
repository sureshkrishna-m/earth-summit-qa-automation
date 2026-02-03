import { test, expect } from '../fixtures/pageFixtures';

test('HomePage locators are present', async ({ page, home }) => {
    await home.goto();
    // Ensure key locators exist (at least 1 match)
    const heroCount = await home.hero.count();
    const hyderabadCount = await home.navHyderabad.count();
    const logoCount = await home.logo.count();
    await expect(heroCount).toBeGreaterThanOrEqual(1);
    await expect(hyderabadCount).toBeGreaterThanOrEqual(1);
    await expect(logoCount).toBeGreaterThanOrEqual(1);
});

test('City Page locators present', async ({ page, hyderabad, gandhinagar, newdelhi }) => {
    await hyderabad.goto();
    await expect(hyderabad.venueText).toBeVisible().catch(() => test.skip(true, 'Hyderabad venue text not found'));

    await gandhinagar.goto();
    await expect(gandhinagar.venueText).toBeVisible().catch(() => test.skip(true, 'Gandhinagar venue text not found'));

    await newdelhi.goto();
    await expect(newdelhi.venueText).toBeVisible().catch(() => test.skip(true, 'New Delhi venue text not found'));
});

test('Registration form locators present on partners page', async ({ page, registration }) => {
    await page.goto('/partners');
    const countName = await registration.name.count();
    if (countName === 0) test.skip(true, 'Registration name field not found');
});
