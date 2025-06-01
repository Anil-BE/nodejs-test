import { Router, Request, Response } from 'express';
import { MovieController } from '../controllers/MovieController';
import { query, param, validationResult } from 'express-validator';

export function createMovieRoutes(): Router {
  const router = Router();
  const movieController = new MovieController();

  // List all movies (paginated)
  router.get('/',
    // query params validations using express-validator
    [
      query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
    ], (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return movieController.getAllMovies(req, res);
    });

  // Get movies by year
  router.get('/year/:year',
    // query params validations using express-validator
    [
      param('year').isLength({ min: 4, max: 4 }).isNumeric().withMessage('Valid 4-digit year is required'),
      query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
      query('sort').optional().isIn(['ASC', 'DESC', 'asc', 'desc']).withMessage('Sort order must be ASC or DESC')
    ], (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return movieController.getMoviesByYear(req, res);
    });

  // Get movies by genre
  router.get('/genre/:genre',
    // query params validations using express-validator
    [
      param('genre').notEmpty().withMessage('Genre is required'),
      query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
    ], (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return movieController.getMoviesByGenre(req, res);
    });

  // Get movie details by ID
  router.get('/:id',
    // query params validations using express-validator
    [
      param('id').notEmpty().withMessage('Movie ID is required')
    ], (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      return movieController.getMovieDetails(req, res);
    });

  return router;
}