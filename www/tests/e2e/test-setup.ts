import { test as base } from '@playwright/test';

declare global {
    interface Window {
        langId: LangId;
    }
}

export const test = base.extend({
    page: async ({ page }, use) => {
        // Fail tests on exceptions or console errors
        page.on('pageerror', err => {
            throw new Error(`Unhandled page exception: ${err.stack ?? err}`);
        });

        page.on('console', msg => {
            if (msg.type() === 'error') {
                throw new Error(`Console error: ${msg.text()} ${JSON.stringify(msg.location())}`);
            }
        });

        await use(page);
    },
});
