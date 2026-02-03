import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewDelhiPage extends BasePage {
    readonly venueText: Locator;
    constructor(page: Page) {
        super(page);
        this.venueText = page.getByText(/delhi|new delhi/i).first();
    }

    async goto() {
        await this.page.goto('/new-delhi');
    }

    async hasVenue(expected: string) {
        await expect(this.venueText).toContainText(expected, { timeout: 5000 });
    }
}
