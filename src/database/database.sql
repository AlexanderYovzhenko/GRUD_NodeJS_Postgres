CREATE DATABASE node_postgres;

CREATE TABLE movie
(
  id SERIAL UNIQUE PRIMARY KEY,
  title VARCHAR(64) NOT NULL,
  year int NOT NULL
);

CREATE TABLE genre 
(
  id SERIAL UNIQUE PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  movie_id int NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movie(id)
);


INSERT INTO movie(title, year)
VALUES 
('Destroyer', 2018),
('Holmes and Watson', 2018),
('Kingsman: The Golden Circle', 2017),
('Brad''s Status', 2017),
('Rock of Ages', 2012);

INSERT INTO genre(name, movie_id)
VALUES
('thriller', 1),
('comedy', 2),
('action', 2),
('action', 3),
('comedy', 3),
('thriller', 3),
('comedy', 4),
('drama', 4),
('music', 4),
('music', 5),
('drama', 5),
('comedy', 5);
