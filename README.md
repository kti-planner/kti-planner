# KTI Planner

A dedicated content management system for planning classes organized by the Department of Computer Communications at the Gdańsk University of Technology.

## Development

### Setting up the database

1. Make a `.env` file in the root of the project for database credentials:

    ```
    POSTGRES_PASSWORD=secret-password
    ```

2. Build the Docker image (needs to be rebuilt when [db/init.sql](db/init.sql) changes):

    ```bash
    docker build db -t kti-planner-db
    ```

3. Start a database container (the below command does not persist data when recreating the container):

    ```bash
    docker run -p 5432:5432 --env-file .env -d kti-planner-db
    ```

You can start a db container with data persistence like so (**db/init.sql will not rerun if the db is already initialized**):

```bash
docker run -p 5432:5432 --env-file .env -v <path to a data directory>:/var/lib/postgresql/data -d kti-planner-db
```

You can inspect the database using the cli with the following command:

```bash
docker exec -it <name-of-container> psql -d kti_planner -U webapp
```

### Running the web app

Install dependencies and run the dev server:

```bash
npm i
npm run dev
```

## Building for production

Install dependencies then build the website and server:

```bash
npm i
npm run build
```

Run the server:

```bash
node build/main.js
```

## Run as a Docker container

The app can be run as a Docker container using the provided [Dockerfile](./Dockerfile).
