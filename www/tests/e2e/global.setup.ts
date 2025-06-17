import { test as setup } from '@playwright/test';
import { dumpDb } from './db-utils';

setup('Reset database to mock data', async () => {
    // This will be run once before all tests (all files)
    await dumpDb('setup.sql');
});
