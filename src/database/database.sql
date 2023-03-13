-- Creation of a database for storing films and film genres
CREATE DATABASE node_postgres;


-- Create tables
CREATE TABLE movie
(
  movie_id serial PRIMARY KEY,
  movie_name varchar(64) NOT NULL,
  year smallint NOT NULL
);

CREATE TABLE genre 
(
  genre_id serial PRIMARY KEY,
  genre_name varchar(64) NOT NULL
);

CREATE TABLE movie_genre
(
  movie_genre_id serial PRIMARY KEY,
  movie_id int NOT NULL,
  genre_id int NOT NUll,
  FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genre(genre_id) ON DELETE CASCADE
);


-- Insert tables
INSERT INTO movie(movie_name, year)
VALUES 
('Destroyer', 2018),
('Holmes and Watson', 2018),
('Kingsman: The Golden Circle', 2017),
('Brad''s Status', 2017),
('Rock of Ages', 2012);

INSERT INTO genre(genre_name)
VALUES
('thriller'),
('comedy'),
('action'),
('drama'),
('music');

INSERT INTO movie_genre(movie_id, genre_id) 
VALUES
(1, 1),
(2, 2),
(2, 3),
(3, 2),
(3, 3),
(3, 1),
(4, 2),
(4, 4),
(4, 5),
(5, 5),
(5, 4);


-- Delete tables
DROP TABLE movie_genre;
DROP TABLE genre;
DROP TABLE movie;
