import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly hero: Locator;
    readonly navHyderabad: Locator;
    readonly navGandhinagar: Locator;
    readonly navNewDelhi: Locator;
    readonly logo: Locator;

    constructor(page: Page) {
        super(page);
        this.hero = page.locator('header, [role="banner"], .hero').first();
        this.navHyderabad = page.getByRole('link', { name: /hyderabad/i });
        this.navGandhinagar = page.getByRole('link', { name: /gandhinagar/i });
        this.navNewDelhi = page.getByRole('link', { name: /(new\s*delhi|delhi)/i });
        this.logo = page.getByRole('link', { name: /earth summit|home/i }).first();
    }

    async goto() {
        await this.page.goto('/');
    }

    async isHeroVisible() {
        await expect(this.hero).toBeVisible();
    }

    async clickHyderabad() {
        await this.navHyderabad.click();
    }

    async clickGandhinagar() {
        await this.navGandhinagar.click();
    }

    async clickNewDelhi() {
        await this.navNewDelhi.click();
    }

    async clickLogo() {
        await this.logo.click();
    }
}
