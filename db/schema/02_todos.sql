-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS todos CASCADE;
CREATE TABLE todos (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  catagory_id INTEGER REFERENCES catagories(id),
  description VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT TRUE
);
