CREATE TABLE users (
    id            uuid PRIMARY KEY,
    name          text NOT NULL,
    email         text UNIQUE,
    password_hash text
);

CREATE TYPE semester_type AS ENUM ('winter', 'summer');

CREATE TABLE semesters (
    id         uuid PRIMARY KEY,
    year       integer NOT NULL,
    type       semester_type NOT NULL,
    start_date date NOT NULL,
    end_date   date NOT NULL,
    UNIQUE (year, type)
);

CREATE TABLE classrooms (
    id   uuid PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE subjects (
    id          uuid PRIMARY KEY,
    name        text NOT NULL,
    semester_id uuid REFERENCES semesters NOT NULL
);

CREATE TABLE exercises (
    id              uuid PRIMARY KEY,
    name            text NOT NULL,
    subject_id      uuid REFERENCES subjects NOT NULL,
    exercise_number integer NOT NULL,
    classroom_id    uuid REFERENCES classrooms NOT NULL,
    UNIQUE (subject_id, exercise_number)
);
