# KTI Planner

A dedicated content management system for planning classes organized by the Department of Computer Communications at the Gdańsk University of Technology.

## Development setup

1. Install dependencies

    ```bash
    npm install
    ```

2. Make a `.env` file in the root of the project for database credentials (example values below):

    ```ini
    POSTGRES_DB=kti_planner
    POSTGRES_USER=webapp
    POSTGRES_PASSWORD=secret-password
    ```

3. Start the database and Redis (needs to be restarted when files in the [db](db) directory change):

    ```bash
    docker compose up --build postgres redis
    ```

4. Start the Astro.js development server

    ```bash
    npm run dev
    ```

## Build for production

In production we use Express.js as the server handling the website.
You can run the entire app with Docker Compose:

```bash
docker compose up --build -d
```

## Run unit tests

This repository uses the `Vitest` library for unit tests, you can run them like so:

```bash
# make sure db is available
docker compose up postgres --build
npm run test-unit
```

## Run E2E tests

Make sure you install the necessary binaries for your system:

```bash
npx playwright install
```

Then when the app is running with Docker Compose run the following command:

```bash
npm run test-e2e
```
