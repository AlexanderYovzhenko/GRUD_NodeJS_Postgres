import { JSON_HEADER } from '../common/headers.js';
import statusCode from '../common/status_code.js';
import { pool as db } from '../database/database.config.js';

class GenreController {
  async createGenre(req, res) {
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {

      try {
        const { genre_name } = JSON.parse(data);

        const isHasGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [genre_name]);

        if (isHasGenre.rows.length) {
          res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
          res.write(JSON.stringify({ message: 'The genre already exists!' }));
        } else {
          const newGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [genre_name]);

          res.writeHead(statusCode.CREATED, JSON_HEADER);
          res.write(JSON.stringify(newGenre.rows[0]));
        } 

        res.end();

      } catch (error) {
        res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
        res.write(JSON.stringify({ message: 'Not correct request!' }));
        res.end();
      }
      
    });
  }

  async getGenres(_, res) {
    const genres = await db.query('SELECT * FROM genre');

    res.writeHead(statusCode.OK, JSON_HEADER);
    res.write(JSON.stringify(genres.rows));
    res.end();
  }

  async getOneGenre(req, res) {
    const url = req.url; 
    const id = +url.slice(url.indexOf(':') + 1);

    if (!Number.isInteger(id)) {
      throw new Error('Id is not number!');
    }

    const genre = await db.query('SELECT * FROM genre WHERE genre_id = $1', [id]);
    

    if (genre.rows.length) {
      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify(genre.rows[0]));
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Genre not found!' }));
    }

    res.end();
  }

  async getGenreMovies(req, res) {
    const url = req.url; 
    const genre = url.slice(url.lastIndexOf('/') + 1);
  
    const genreMovies = [];

    const genreIdObj = await db.query('SELECT genre_id FROM genre WHERE genre_name = $1', [genre]);
    
    if (genreIdObj.rows.length) {
      const genreId = genreIdObj.rows[0];
      const moviesId = await db.query('SELECT movie_id FROM movie_genre WHERE genre_id = $1', [genreId.genre_id]);

        if (moviesId.rows.length) {

          for (const movieId of moviesId.rows) {
            const movie = await db.query('SELECT * FROM movie WHERE movie_id = $1', [movieId.movie_id]);
            genreMovies.push(movie.rows[0]);
          }

          const genreMoviesResult = [];

          for (const movie of genreMovies) {
            const arrGenres = await this.#getGenresToMovie(movie.movie_id);
            genreMoviesResult.push({ ...movie, genres: [ ...arrGenres ]});      
          }

          res.writeHead(statusCode.OK, JSON_HEADER);
          res.write(JSON.stringify(genreMoviesResult));
          
        } else {
          res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
          res.write(JSON.stringify({ message: 'Movies of genre not found!' }));
        }

    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Genre not found!' }));
    }

    res.end();
  }

  async updateGenre(req, res) {
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
        const { genre_name } = JSON.parse(data);
        
        if (!genre_name) {
          throw new Error('Bad request!');
        }

        const isHasGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [genre_name]);

        if (isHasGenre.rows.length) {
          res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
          res.write(JSON.stringify({ message: 'The genre already exists!' }));
        } else {
          const updateGenre = await db.query('UPDATE genre SET genre_name = $1 WHERE genre_id = $2 RETURNING *', [genre_name, id]);

          if (updateGenre.rows.length) {
            res.writeHead(statusCode.CREATED, JSON_HEADER);
            res.write(JSON.stringify(updateGenre.rows[0]));
          } else {
            res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
            res.write(JSON.stringify({ message: 'Genre not found!' }));
          }

        }

        res.end();

      } catch (error) {
        res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
        res.write(JSON.stringify({ message: 'Not correct request!' }));
        res.end();
      }
      
    });
  }

  async deleteGenre(req, res) { 
    const url = req.url;
    const id = +url.slice(url.indexOf(':') + 1);

    if (!Number.isInteger(id)) {
      throw new Error('Id is not number!');
    }

    if ((await db.query('SELECT * FROM genre WHERE genre_id = $1', [id])).rows.length) {
      await db.query('DELETE FROM genre WHERE genre_id = $1', [id]);
      res.writeHead(statusCode.NO_CONTENT, JSON_HEADER);
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Genre not found!' }));
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

export default new GenreController();
