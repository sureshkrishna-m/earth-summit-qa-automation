import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HyderabadPage extends BasePage {
    readonly venueText: Locator;
    readonly agendaLink: Locator;

    constructor(page: Page) {
        super(page);
        this.venueText = page.getByText(/hitex exhibition centre|hitex/i).first();
        this.agendaLink = page.getByRole('link', { name: /agenda/i }).first();
    }

    async goto() {
        await this.page.goto('/hyderabad');
    }

    async hasVenue(venue = 'HITEX Exhibition Centre') {
        await expect(this.venueText).toContainText(venue, { timeout: 5000 });
    }
}
