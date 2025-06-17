import child_process from 'node:child_process';
import crypto from 'node:crypto';
import net from 'node:net';
import { test as base } from '@playwright/test';

declare global {
    interface Window {
        langId: LangId;
    }
}

async function getFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.listen(0, () => {
            const address = server.address();

            if (address === null || typeof address === 'string') {
                reject(new Error('Failed to get port'));
                return;
            }

            server.close(error => resolve(address.port));
        });
    });
}

const projectName = `kti-planner-tests-e2e-${Date.now()}-${crypto.randomInt(1e8)}`;
const appHostPort = await getFreePort();
const postgresHostPort = await getFreePort();

process.env.APP_HOST_PORT = appHostPort.toString();
process.env.POSTGRES_HOST_PORT = postgresHostPort.toString();

export const test = base.extend({
    baseURL: `http://localhost:${appHostPort}`,
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

test.beforeEach(async () => {
    await new Promise<void>((resolve, reject) => {
        child_process.exec(`docker compose -p ${projectName} up -d --wait`, (error, stdout, stderr) => {
            if (!error) {
                resolve();
                return;
            }

            reject(error);
        });
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
});

test.afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
        child_process.exec(`docker compose -p ${projectName} down`, (error, stdout, stderr) => {
            if (!error) {
                resolve();
                return;
            }

            reject(error);
        });
    });
});
