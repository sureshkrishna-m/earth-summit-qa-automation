import { test as base, expect, PlaywrightTestArgs, PlaywrightTestOptions } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { HyderabadPage } from '../page-objects/HyderabadPage';
import { GandhinagarPage } from '../page-objects/GandhinagarPage';
import { NewDelhiPage } from '../page-objects/NewDelhiPage';
import { RegistrationForm } from '../page-objects/RegistrationForm';

type MyFixtures = {
    home: HomePage;
    hyderabad: HyderabadPage;
    gandhinagar: GandhinagarPage;
    newdelhi: NewDelhiPage;
    registration: RegistrationForm;
};

export const test = base.extend<MyFixtures & PlaywrightTestArgs & PlaywrightTestOptions>({
    home: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    hyderabad: async ({ page }, use) => {
        await use(new HyderabadPage(page));
    },
    gandhinagar: async ({ page }, use) => {
        await use(new GandhinagarPage(page));
    },
    newdelhi: async ({ page }, use) => {
        await use(new NewDelhiPage(page));
    },
    registration: async ({ page }, use) => {
        await use(new RegistrationForm(page));
    },
});

export { expect };
export default test;
