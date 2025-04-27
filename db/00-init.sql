CREATE TABLE users (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE,
    password_hash text
);

CREATE TABLE counter (
    i integer
);
