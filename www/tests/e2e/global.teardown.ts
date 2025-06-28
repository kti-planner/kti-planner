import { test as teardown } from '@playwright/test';
import { restoreDb } from './db-utils';

teardown('Restore database from before tests', async () => {
    // This will be run once all tests are finished (from all files)
    await restoreDb('setup.sql');
});
