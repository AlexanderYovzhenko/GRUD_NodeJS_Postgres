import { JSON_HEADER } from '../common/headers.js';
import statusCode from '../common/status_code.js';
import genreController from '../controller/genre.controller.js';
import movieController from '../controller/movie.controller.js';

const routes = async (req, res) => {
  try {
    const { method, url } = req;

    switch (true) {
      case method === 'GET' && url === '/':
        res.writeHead(statusCode.OK, JSON_HEADER);
        res.write(JSON.stringify({ message: 'This is a vanilla node.js API!' }));
        res.end();
  
        break;
  
      // routes movies
      case method === 'POST' && url === '/movies':
        await movieController.createMovie(req, res);
  
        break;
  
      case method === 'GET' && url === '/movies':
        await movieController.getMovies(req, res);
  
        break;
  
      case method === 'GET' && url.includes('/movies/:'):
        await movieController.getOneMovie(req, res);
  
        break;
  
      case method === 'GET' && url.includes('/movies/genres'):
        await movieController.getMovieGenres(req, res);
  
        break;
  
      case method === 'GET' && url.includes('/movies/year'):
        await movieController.getMoviesYear(req, res);
  
        break;
  
      case method === 'PUT' && url.includes('/movies'):
        await movieController.updateMovie(req, res);
  
        break;
  
      case method === 'DELETE' && url.includes('/movies'):
        await movieController.deleteMovie(req, res);
  
        break;
  
      // routes genres
      case method === 'POST' && url === '/genres':
        await genreController.createGenre(req, res);
  
        break;
  
      case method === 'GET' && url === '/genres':
        await genreController.getGenres(req, res);
  
        break;
  
      case method === 'GET' && url.includes('/genres/:'):
        await genreController.getOneGenre(req, res);
  
        break;
  
      case method === 'GET' && url.includes('/genres/movies'):
        await genreController.getGenreMovies(req, res);
  
        break;
  
      case method === 'PUT' && url.includes('/genres'):
        await genreController.updateGenre(req, res);
  
        break;
  
      case method === 'DELETE' && url.includes('/genres'):
        await genreController.deleteGenre(req, res);
  
        break;
  
      default:
        res.writeHead(statusCode.NOT_FOUND, JSON_HEADER);
        res.end(JSON.stringify({ message: 'Route not found!' }));
  
        break;
    }

  } catch (error) {
    res.writeHead(statusCode.INTERNAL_SERVER_ERROR, JSON_HEADER);
    res.end(JSON.stringify({ message: `Server ERROR: ${error.message}` }));
  }

}

export default routes;
