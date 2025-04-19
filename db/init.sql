CREATE TABLE users (
    id uuid PRIMARY KEY,
    email text UNIQUE,
    password_hash text NOT NULL
);
