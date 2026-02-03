import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class GandhinagarPage extends BasePage {
    readonly venueText: Locator;
    constructor(page: Page) {
        super(page);
        this.venueText = page.getByText(/gandhinagar/i).first();
    }

    async goto() {
        await this.page.goto('/gandhinagar');
    }

    async hasVenue(expected: string) {
        await expect(this.venueText).toContainText(expected, { timeout: 5000 });
    }
}
