import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type PartnerFormData = {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
    country?: string;
    agreeTerms?: boolean;
}

export class RegistrationForm extends BasePage {
    readonly name: Locator;
    readonly company: Locator;
    readonly email: Locator;
    readonly phone: Locator;
    readonly country: Locator;
    readonly submitBtn: Locator;
    readonly successMsg: Locator;

    constructor(page: Page) {
        super(page);
        this.name = page.locator('[name="name"], [id*="name"], input[placeholder*="Name"]');
        this.company = page.locator('[name="company"], input[placeholder*="Company"]');
        this.email = page.locator('[name="email"], input[type="email"]');
        this.phone = page.locator('[name="phone"], input[type="tel"]');
        this.country = page.locator('select[name="country"]');
        this.submitBtn = page.getByRole('button', { name: /submit|register|send/i }).first();
        this.successMsg = page.getByText(/thank you|success|submitted/i).first();
    }

    async fillForm(data: PartnerFormData) {
        if (data.name) await this.name.fill(data.name);
        if (data.company) await this.company.fill(data.company);
        if (data.email) await this.email.fill(data.email);
        if (data.phone) await this.phone.fill(data.phone);
        if (data.country) await this.country.selectOption({ label: data.country }).catch(() => { });
        if (data.agreeTerms) {
            const checkbox = this.page.locator('input[type="checkbox"], input[name*="terms"]');
            await checkbox.check().catch(() => { });
        }
    }

    async submit() {
        await this.submitBtn.click();
    }

    async expectSuccess() {
        await expect(this.successMsg).toBeVisible({ timeout: 5000 });
    }
}
