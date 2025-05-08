CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  first_login BOOLEAN DEFAULT TRUE
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id)
);

-- Create default admin user
INSERT INTO users (username, password_hash, is_admin, first_login) VALUES ('admin', '$2b$10$W1hFfVjVnXq3zY7uI9KZYe3z4Z8vY6U0Q1w2x3y4z5A6B7C8D9E0F', TRUE, TRUE);