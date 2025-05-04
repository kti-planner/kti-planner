CREATE TABLE users (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE,
    password_hash text
);

CREATE TABLE semesters (
    id uuid PRIMARY KEY,
    year integer NOT NULL,
    type varchar(32) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);

CREATE TABLE counter (
    i integer
);
