INSERT INTO users (id, name, email, password_hash)
VALUES (
  '9f4eacbf-9cfc-4a08-8c35-fb8eabcdd897',
  'Admin',
  'admin@admin.com',
  '$2b$10$RRdybUw9Ypxd.HR38l8UGORzd36eE.KbVXMUq1ICwBXnoxjAw8g8S' -- bcrypt hash of word kti
);

INSERT INTO semesters (id, year, type, start_date, end_date)
VALUES
  ( gen_random_uuid(), 2023, 'winter', '2023-10-01', '2024-02-18' ),
  ( gen_random_uuid(), 2024, 'winter', '2024-10-01', '2025-02-18' ),
  ( gen_random_uuid(), 2023, 'summer', '2024-02-24', '2024-06-29' ),
  ( gen_random_uuid(), 2024, 'summer', '2025-02-24', '2025-06-29' );
