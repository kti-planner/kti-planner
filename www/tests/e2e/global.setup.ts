import { test as setup } from '@playwright/test';
import { dumpDb } from './db-utils';

setup('Save database before running tests', async () => {
    // This will be run once before all tests (all files)
    await dumpDb('setup.sql');
});
