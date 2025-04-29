INSERT INTO users (id, name, email, password_hash)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@admin.com',
  '$2b$10$RRdybUw9Ypxd.HR38l8UGORzd36eE.KbVXMUq1ICwBXnoxjAw8g8S' -- bcrypt hash of word kti
);
