-- CREATE TABLES

--psql freezing-ringtail < schema.sql

DROP TABLE IF EXISTS books;

CREATE TABLE books
(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  img_url VARCHAR(255) NOT NULL DEFAULT ''
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres
(
  book_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  img_url VARCHAR(255) NOT NULL DEFAULT ''
);

DROP TABLE IF EXISTS book_authors;
CREATE TABLE book_authors
(
  book_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL
);
