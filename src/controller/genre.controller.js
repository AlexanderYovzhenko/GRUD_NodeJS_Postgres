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
        const { genre_name, movie_id } = JSON.parse(data);

        const isHasGenreToMovie_id = await db.query('SELECT * FROM genre WHERE genre_name = $1 and movie_id = $2', [genre_name, movie_id]);

        if (isHasGenreToMovie_id.rows.length) {
          res.writeHead(statusCode.BAD_REQUEST, JSON_HEADER);
          res.write(JSON.stringify({ message: 'The genre of the film already exists!' }));
        } else {
          const newGenre = await db.query('INSERT INTO genre (genre_name, movie_id) VALUES ($1, $2) RETURNING *', [genre_name, movie_id]);

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

    const genreMoviesId = await db.query('SELECT movie_id FROM genre WHERE genre_name = $1', [genre]);
    
    if (genreMoviesId.rows.length) {

      for (const elemMovie_id of genreMoviesId.rows) {
        const movie = await db.query('SELECT * FROM movie WHERE movie_id = $1', [elemMovie_id.movie_id]);

        if (movie.rows.length) {
          genreMovies.push(movie.rows[0]);
        } else {
          res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
          res.write(JSON.stringify({ message: 'Movies genre not found!' }));
          res.end();
        }
    
      }

      res.writeHead(statusCode.OK, JSON_HEADER);
      res.write(JSON.stringify(genreMovies));

    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Genre not found!' }));
    }

    res.end();
  }

  async updateGenre(req, res) {
    const url = req.url;
    const id = +url.slice(url.indexOf(':') + 1);
    let data = '';

    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', async () => {
      
      try {
        const { genre_name, movie_id } = JSON.parse(data);
        const updateGenre = await db.query('UPDATE genre SET genre_name = $1, movie_id = $2 WHERE genre_id = $3 RETURNING *', [genre_name, movie_id, id]);

        if (updateGenre.rows.length) {
          res.writeHead(statusCode.CREATED, JSON_HEADER);
          res.write(JSON.stringify(updateGenre.rows[0]));
        } else {
          res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
          res.write(JSON.stringify({ message: 'Genre not found!' }));
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

    if ((await db.query('SELECT * FROM genre WHERE genre_id = $1', [id])).rows.length) {
      await db.query('DELETE FROM genre WHERE genre_id = $1', [id]);
      res.writeHead(statusCode.NO_CONTENT, JSON_HEADER);
    } else {
      res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
      res.write(JSON.stringify({ message: 'Genre not found!' }));
    }

    res.end();
  }
}

export default new GenreController();
