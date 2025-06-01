import { Request, Response } from 'express';
import { MovieModel } from '../models/Movie';
import { ApiResponse, MovieListResponse, MovieDetails, SortOrder } from '../types';

export class MovieController {
  private movieModel: MovieModel;

  constructor() {
    this.movieModel = new MovieModel();
  }

  public async getAllMovies(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 50;

      const movies = await this.movieModel.getAllMovies(page, limit);
      
      const response: ApiResponse<MovieListResponse[]> = {
        data: movies,
        pagination: {
          page,
          limit,
          hasMore: movies.length === limit
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getMovieDetails(req: Request, res: Response): Promise<void> {
    try {
      const movieId = req.params.id;
      const movie = await this.movieModel.getMovieById(String(movieId));
      
      if (!movie) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }

      const response: ApiResponse<MovieDetails> = { data: movie };
      res.json(response);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getMoviesByYear(req: Request, res: Response): Promise<void> {
    try {
      const year = req.params.year;
      const page = parseInt(req.query.page as string) || 1;
      const sortOrder = (req.query.sort as SortOrder) || 'ASC';
      const limit = 50;

      const movies = await this.movieModel.getMoviesByYear(String(year), page, limit, sortOrder);
      
      const response: ApiResponse<MovieListResponse[]> = {
        data: movies,
        pagination: {
          page,
          limit,
          sort_order: sortOrder.toUpperCase(),
          hasMore: movies.length === limit
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching movies by year:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getMoviesByGenre(req: Request, res: Response): Promise<void> {
    try {
      const genre = req.params.genre;
      const page = parseInt(req.query.page as string) || 1;
      const limit = 50;

      const movies = await this.movieModel.getMoviesByGenre(String(genre), page, limit);
      
      const response: ApiResponse<MovieListResponse[]> = {
        data: movies,
        pagination: {
          page,
          limit,
          hasMore: movies.length === limit
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}