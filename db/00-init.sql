CREATE TYPE user_role AS ENUM ('admin', 'teacher');

CREATE TABLE users (
    id                 uuid PRIMARY KEY,
    name               text NOT NULL,
    email              text UNIQUE,
    password_hash      text,
    role               user_role NOT NULL
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

CREATE TYPE schedule_change_type AS ENUM ('holiday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

CREATE TABLE schedule_changes (
    date date PRIMARY KEY,
    type schedule_change_type
);

CREATE TABLE classrooms (
    id   uuid PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE subjects (
    id          uuid PRIMARY KEY,
    name        text NOT NULL,
    semester_id uuid REFERENCES semesters NOT NULL,
    teacher_ids uuid[] NOT NULL
);

CREATE TABLE exercises (
    id              uuid PRIMARY KEY,
    name            text NOT NULL,
    subject_id      uuid REFERENCES subjects NOT NULL,
    exercise_number integer NOT NULL,
    classroom_id    uuid REFERENCES classrooms NOT NULL,
    teacher_id      uuid REFERENCES users NOT NULL,
    UNIQUE (subject_id, exercise_number)
);

CREATE TABLE laboratory_groups (
    id              uuid PRIMARY KEY,
    name            text NOT NULL,
    subject_id      uuid REFERENCES subjects NOT NULL,
    UNIQUE (subject_id, name)
);

CREATE TABLE laboratory_classes (
    id                  uuid PRIMARY KEY,
    exercise_id         uuid REFERENCES exercises NOT NULL,
    laboratory_group_id uuid REFERENCES laboratory_groups NOT NULL,
    start_date          timestamptz NOT NULL,
    end_date            timestamptz NOT NULL,
    teacher_id          uuid REFERENCES users NOT NULL
);
