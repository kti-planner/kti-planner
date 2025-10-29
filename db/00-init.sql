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

CREATE TABLE subjects (
    id               uuid PRIMARY KEY,
    name             text NOT NULL,
    semester_id      uuid NOT NULL REFERENCES semesters ON DELETE NO ACTION,
    teacher_ids      uuid[] NOT NULL,
    description      text NOT NULL,
    moodle_course_id text NOT NULL
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
    semester_id  uuid NOT NULL REFERENCES semesters ON DELETE NO ACTION,
    start_date   timestamptz NOT NULL,
    end_date     timestamptz NOT NULL
);

INSERT INTO users (id, name, email, password_hash, role)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@admin.com',
  '$2b$10$RRdybUw9Ypxd.HR38l8UGORzd36eE.KbVXMUq1ICwBXnoxjAw8g8S', -- bcrypt hash of word kti
  'admin'
);
