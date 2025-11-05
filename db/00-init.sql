CREATE TYPE user_role AS ENUM ('admin', 'teacher');

CREATE TABLE users (
    id            uuid PRIMARY KEY,
    name          text NOT NULL,
    email         text UNIQUE,
    password_hash text,
    role          user_role NOT NULL
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

CREATE TYPE study_mode_type AS ENUM ('full-time', 'part-time');

CREATE TYPE study_cycle_type AS ENUM ('first-cycle', 'second-cycle');

CREATE TABLE subjects (
    id                 uuid PRIMARY KEY,
    name               text NOT NULL,
    semester_id        uuid NOT NULL REFERENCES semesters ON DELETE NO ACTION,
    teacher_ids        uuid[] NOT NULL,
    description        text NOT NULL,
    moodle_course_id   text NOT NULL,
    duration_minutes   integer,
    class_repeat_weeks integer NOT NULL,
    semester_number    integer NOT NULL,
    study_mode         study_mode_type NOT NULL,
    study_cycle        study_cycle_type NOT NULL
);

CREATE TABLE exercises (
    id              uuid PRIMARY KEY,
    name            text NOT NULL,
    subject_id      uuid NOT NULL REFERENCES subjects ON DELETE CASCADE,
    exercise_number integer NOT NULL,
    classroom_id    uuid REFERENCES classrooms ON DELETE SET NULL,
    teacher_id      uuid REFERENCES users ON DELETE SET NULL,
    UNIQUE (subject_id, exercise_number)
);

CREATE TABLE laboratory_groups (
    id              uuid PRIMARY KEY,
    name            text NOT NULL,
    subject_id      uuid NOT NULL REFERENCES subjects ON DELETE CASCADE,
    UNIQUE (subject_id, name)
);

CREATE TABLE laboratory_classes (
    id                  uuid PRIMARY KEY,
    exercise_id         uuid NOT NULL REFERENCES exercises ON DELETE CASCADE,
    laboratory_group_id uuid NOT NULL REFERENCES laboratory_groups ON DELETE CASCADE,
    start_date          timestamptz NOT NULL,
    end_date            timestamptz NOT NULL,
    teacher_id          uuid REFERENCES users ON DELETE SET NULL
);

CREATE TABLE calendar_events (
    id           uuid PRIMARY KEY,
    name         text NOT NULL,
    user_id      uuid REFERENCES users ON DELETE SET NULL,
    classroom_id uuid REFERENCES classrooms ON DELETE SET NULL,
    semester_id  uuid NOT NULL REFERENCES semesters ON DELETE CASCADE,
    start_date   timestamptz NOT NULL,
    end_date     timestamptz NOT NULL
);
