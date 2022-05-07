-- Drop and recreate catagories table 

DROP TABLE IF EXISTS catagories CASCADE;
CREATE TABLE catagories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);
