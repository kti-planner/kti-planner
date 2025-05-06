CREATE TABLE users (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE,
    password_hash text
);

CREATE TYPE semester_type AS ENUM ('winter', 'summer');

CREATE TABLE semesters (
    id uuid PRIMARY KEY,
    year integer NOT NULL,
    type semester_type NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    UNIQUE (year, type)
);

CREATE TABLE counter (
    i integer
);
