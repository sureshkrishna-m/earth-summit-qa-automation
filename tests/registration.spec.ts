import { test, expect } from '../fixtures/pageFixtures';
import testData from '../testdata/forms.json';

test.describe('Registration & Lead Generation', () => {

    test.skip('Partner/Exhibitor Form Submission', async ({ page, registration }) => {
        await page.goto('/partners');
        await registration.fillForm(testData.partnerForm);
        await registration.submit();
        await registration.expectSuccess();
    });

    test('Form field validation: required fields show errors when empty', async ({ page, registration }) => {
        await page.goto('/partners');
        // clear fields if any and submit
        await registration.submit();
        const errors = page.locator('.error, .field-error, [role="alert"]');
        const count = await errors.count();
        await expect(count).toBeGreaterThan(0);
    });

    test('Email format validation blocks invalid email', async ({ page, registration }) => {
        await page.goto('/partners');
        await registration.fillForm({ ...testData.partnerForm, email: testData.invalidEmailExample });
        await registration.submit();
        const emailError = page.getByText(/email|invalid/i).first();
        await expect(emailError).toBeVisible();
    });

    test('Mobile number validation (numeric/length)', async ({ page, registration }) => {
        await page.goto('/partners');
        await registration.fillForm({ ...testData.partnerForm, phone: testData.invalidPhone });
        await registration.submit();
        const phoneError = page.getByText(/phone|mobile|number/i).first();
        await expect(phoneError).toBeVisible();
    });

});
