INSERT INTO users (id, name, email, password_hash)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@admin.com',
  '$2a$10$mtVk6oNmvc6T7E9tsxJdd.D3.a8JlvVkIsj/v0qjmqzLDExMoTkYK' -- bcrypt hash of word admin
);
