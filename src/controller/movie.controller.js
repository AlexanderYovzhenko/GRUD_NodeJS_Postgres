import { JSON_HEADER } from '../common/headers.js';
import statusCode from '../common/status_code.js';
import { pool as db } from '../database/database.config.js';

class MovieController {
  async createMovie(req, res) {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {

      try {
        const { movie_name, year, genres } = JSON.parse(data);

        const movie = await db.query('SELECT * FROM movie WHERE movie_name = $1 AND year = $2', [movie_name, year]);

        if (movie.rows.length) {
          res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
          res.write(JSON.stringify({ message: 'This movie already exists!'}));
        } else {
          const newMovie = await db.query('INSERT INTO movie (movie_name, year) VALUES ($1, $2) RETURNING *', [movie_name, year]);

          if (genres.length) {

            for (const genre of genres) {
              const isHasGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [genre]);
  
              if (isHasGenre.rows.length) {
                await db.query('INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2) RETURNING *', [newMovie.rows[0].movie_id, isHasGenre.rows[0].genre_id]);
              } else {
                const newGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [genre]);
                await db.query('INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2) RETURNING *', [newMovie.rows[0].movie_id, newGenre.rows[0].genre_id]);
              }
  
            }

          }

          const arrGenres = await this.#getGenresToMovie(newMovie.rows[0].movie_id);

          res.writeHead(statusCode.CREATED, JSON_HEADER);
          res.write(JSON.stringify({ ...newMovie.rows[0], genres: [ ...arrGenres ] }));
        }

        res.end();

      } catch (error) {
        res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
        res.write(JSON.stringify({ message: 'Not correct request!' }));
        res.end();
      }
      
    });
  }

  async getMovies(_, res) {
    const movies = await db.query('SELECT * FROM movie');

    const moviesResult = [];

    for (const movie of movies.rows) {
      const arrGenres = await this.#getGenresToMovie(movie.movie_id);
      moviesResult.push({ ...movie, genres: [ ...arrGenres ]});      
    }

    res.writeHead(statusCode.OK, JSON_HEADER);
    res.write(JSON.stringify(moviesResult));
    res.end();
  }

  async getOneMovie(req, res) {
    const url = req.url; 
    const id = +url.slice(url.indexOf(':') + 1);

    if (!Number.isInteger(id)) {
      throw new Error('Id is not number!');
    }

    const movie = await db.query('SELECT * FROM movie WHERE movie_id = $1', [id]);
    

    if (movie.rows.length) {
      const arrGenres = await this.#getGenresToMovie(movie.rows[0].movie_id);

      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify({ ...movie.rows[0], genres: [ ...arrGenres ]}));
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Movie not found!' }));
    }

    res.end();
  }

  async getMovieGenres(req, res) {
    const url = req.url; 
    const id = +url.slice(url.indexOf(':') + 1);

    if (!Number.isInteger(id)) {
      throw new Error('Id is not number!');
    }

    const genresId = await db.query('SELECT genre_id FROM movie_genre WHERE movie_id = $1', [id]);

    if (genresId.rows.length) {
      const movieGenres = [];

      for (const genreId of genresId.rows) {
        const movieGenre = await db.query('SELECT genre_name FROM genre WHERE genre_id = $1', [genreId.genre_id]);
        movieGenres.push(movieGenre.rows[0].genre_name);
      }
      
      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify(movieGenres));
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Movie genres are not found!' }));
    }

    res.end();
  }

  async getMoviesYear(req, res) {
    const url = req.url; 
    const year = +url.slice(url.lastIndexOf('/') + 1);

    if (!Number.isInteger(year)) {
      throw new Error('Year is not number!');
    }

    try {
      const moviesYear = await db.query('SELECT * FROM movie WHERE year = $1', [year]);

      const moviesResult = [];

      for (const movie of moviesYear.rows) {
        const arrGenres = await this.#getGenresToMovie(movie.movie_id);
        moviesResult.push({ ...movie, genres: [ ...arrGenres ]});      
      }

      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify(moviesResult));
      res.end();

    } catch (error) {
      res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Not correct year!' }));
      res.end();
    }

  }

  async updateMovie(req, res) {
    const url = req.url;
    const id = +url.slice(url.indexOf(':') + 1);

    if (!Number.isInteger(id)) {
      throw new Error('Id is not number!');
    }

    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {
      
      try {
        const { movie_name, year, genres } = JSON.parse(data);

        const updateMovie = await db.query('UPDATE movie SET movie_name = $1, year = $2 WHERE movie_id = $3 RETURNING *', [movie_name, year, id]);

        if (updateMovie.rows.length) {

          await db.query('DELETE FROM movie_genre WHERE movie_id = $1', [updateMovie.rows[0].movie_id]);

          if (genres.length) {

            for (const genre of genres) {
              const isHasGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [genre]);
  
              if (isHasGenre.rows.length) {
                await db.query('INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2) RETURNING *', [updateMovie.rows[0].movie_id, isHasGenre.rows[0].genre_id]);
              } else {
                const newGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [genre]);
                await db.query('INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2) RETURNING *', [updateMovie.rows[0].movie_id, newGenre.rows[0].genre_id]);
              }

            }

          }

          const arrGenres = await this.#getGenresToMovie(updateMovie.rows[0].movie_id);

          res.writeHead(statusCode.CREATED, JSON_HEADER);
          res.write(JSON.stringify({ ...updateMovie.rows[0], genres: [ ...arrGenres ]}));
        } else {
          res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
          res.write(JSON.stringify({ message: 'Movie not found!' }));
        }

        res.end();

      } catch (error) {
        res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
        res.write(JSON.stringify({ message: 'Not correct request!' }));
        res.end();
      }
      
    });
  }

  async deleteMovie(req, res) { 
    const url = req.url;
    const id = +url.slice(url.indexOf(':') + 1);

    if (!Number.isInteger(id)) {
      throw new Error('Id is not number!');
    }

    if ((await db.query('SELECT * FROM movie WHERE movie_id = $1', [id])).rows.length) {
      await db.query('DELETE FROM movie WHERE movie_id = $1', [id]);
      res.writeHead(statusCode.NO_CONTENT, JSON_HEADER);
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Movie not found!' }));
    }
  
    res.end();
  }

  async #getGenresToMovie(movieId) {
    const genresId = await db.query('SELECT genre_id FROM movie_genre WHERE movie_id = $1', [movieId]);
    const movieGenres = [];

    if (!genresId.rows.length) {
      return movieGenres;
    }

    for (const genreId of genresId.rows) {
      const movieGenre = await db.query('SELECT genre_name FROM genre WHERE genre_id = $1', [genreId.genre_id]);
      movieGenres.push(movieGenre.rows[0].genre_name);
    }
    
    return movieGenres;
  }
}

export default new MovieController();
