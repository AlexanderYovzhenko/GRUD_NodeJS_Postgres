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
        const { title, year } = JSON.parse(data);
        const newMovie = await db.query('INSERT INTO movie (title, year) VALUES ($1, $2) RETURNING *', [title, year]);

        res.writeHead(statusCode.CREATED, JSON_HEADER);
        res.write(JSON.stringify(newMovie.rows[0]));
        res.end();

      } catch (error) {
        res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
        res.write(JSON.stringify({ message: 'Not correct request!' })); 
        res.end();
      }
      
    });
  }

  async getMovies(req, res) {
    const movies = await db.query('SELECT * FROM movie');

    res.writeHead(statusCode.OK, JSON_HEADER);
    res.write(JSON.stringify(movies.rows));
    res.end();
  }

  async getOneMovie(req, res) {
    const url = req.url; 
    const id = +url.slice(url.indexOf(':') + 1);
    const movie = await db.query('SELECT * FROM movie WHERE id = $1', [id]);
    

    if (movie.rows.length) {
      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify(movie.rows[0]));
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Movie not found!' }));
    }

    res.end();
  }

  async getMovieGenres(req, res) {
    const url = req.url; 
    const id = +url.slice(url.indexOf(':') + 1);
    const movieGenres = await db.query('SELECT name FROM genre WHERE movie_id = $1', [id]);

    if (movieGenres.rows.length) {
      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify(movieGenres.rows.map(el => el.name)));
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Movie genres not found!' }));
    }

    res.end();
  }

  async getMoviesYear(req, res) {
    const url = req.url; 
    const year = +url.slice(url.lastIndexOf('/') + 1);

    try {
      const moviesYear = await db.query('SELECT * FROM movie WHERE year = $1', [year]);

      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify(moviesYear.rows));
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
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {
      
      try {
        const { title, year } = JSON.parse(data);
        const updateMovie = await db.query('UPDATE movie SET title = $1, year = $2 WHERE id = $3 RETURNING *', [title, year, id]);

        if (updateMovie.rows.length) {
          res.writeHead(statusCode.CREATED, JSON_HEADER);
          res.write(JSON.stringify(updateMovie.rows[0]));
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

    try {
      if ((await db.query('SELECT * FROM movie WHERE id = $1', [id])).rows.length) {
        await db.query('DELETE FROM movie WHERE id = $1', [id]);
        res.writeHead(statusCode.NO_CONTENT, JSON_HEADER);
      } else {
        res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
        res.write(JSON.stringify({ message: 'Movie not found!' }));
      }
  
      res.end();

    } catch (error) {
      res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Movie is has in table "genre"!' }));
      res.end();
    }

  }
}

export default new MovieController();
