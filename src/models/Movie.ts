import type { Database as DatabaseType } from 'better-sqlite3';
import { getDbInstance } from '../config/dbContext';
import { Genre, Movie, MovieDetails, MovieListResponse, SortOrder } from '../types';

export class MovieModel {
  private db: DatabaseType;

  constructor() {
    this.db = getDbInstance();
  }

  public async getAllMovies(page: number = 1, limit: number = 50): Promise<MovieListResponse[]> {
    const offset = (page - 1) * limit;
    const query = `
        SELECT 
          movieId as id,
          imdbId,
          title,
          genres,
          releaseDate,
          budget
        FROM movies 
        ORDER BY title
        LIMIT ? OFFSET ?
      `;

    try {
      const rows = this.db.prepare(query).all(limit, offset) as any[];
      
      const formattedRows: MovieListResponse[] = rows.map(row => ({
        ...row,
        budget: row.budget ? `$${row.budget.toLocaleString()}` : null,
        genres: JSON.parse(row.genres) as Genre[],
        releaseDate: row.releaseDate ? new Date(row.releaseDate).toISOString().split('T')[0] : null
      }));
      
      return formattedRows;
    } catch (err) {
      throw err;
    }
  }

  public async getMovieById(movieId: string): Promise<MovieDetails | null> {
    const query = `
      SELECT 
        movieId as id,
        imdbId,
        title,
        releaseDate,
        budget,
        runtime,
        productionCompanies,
        language,
        genres
      FROM movies 
      WHERE movieId = ?
    `;

    try {
      const movie = this.db.prepare(query).get(movieId) as any;
      
      if (!movie) {
        return null;
      }
      
      const avgerageRating = await this.getAverageRating(movieId);
      
      const movieDetails: MovieDetails = {
        ...movie,
        budget: movie.budget ? `$${movie.budget.toLocaleString()}` : null,
        genres: JSON.parse(movie.genres) as Genre[],
        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : null,
        productionCompanies: JSON.parse(movie.productionCompanies) as string[],
        avgerageRating
      };
      
      return movieDetails;
    } catch (err) {
      throw err;
    }
  }

  private async getAverageRating(movieId: string): Promise<string | null> {
    const ratingQuery = `
      SELECT AVG(rating) as avgRating 
      FROM ratingsDB.ratings 
      WHERE movieId = ?
    `;

    try {
      const result = this.db.prepare(ratingQuery).get(movieId) as any;
      return result?.avgRating ? parseFloat(result.avgRating).toFixed(2) : null;
    } catch (err) {
      throw err;
    }
  }

  public async getMoviesByYear(
    year: string,
    page: number = 1,
    limit: number = 50,
    sortOrder: SortOrder = 'ASC'
  ): Promise<MovieListResponse[]> {
    const offset = (page - 1) * limit;
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const query = `
      SELECT 
        movieId as id,
        imdbId,
        title,
        genres,
        releaseDate,
        budget
      FROM movies 
      WHERE strftime('%Y', releaseDate) = ?
      ORDER BY releaseDate ${order}
      LIMIT ? OFFSET ?
    `;

    try {
      const movies = this.db.prepare(query).all(year, limit, offset) as any[];
      
      const formattedRows: MovieListResponse[] = movies.map(movie => ({
        ...movie,
        budget: movie.budget ? `$${movie.budget.toLocaleString()}` : null,
        genres: JSON.parse(movie.genres) as Genre[],
        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : null,
      }));
      
      return formattedRows;
    } catch (err) {
      throw err;
    }
  }

  public async getMoviesByGenre(
    genre: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MovieListResponse[]> {
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        movieId as id,
        imdbId,
        title,
        genres,
        releaseDate,
        budget
      FROM movies 
      WHERE genres LIKE ?
      ORDER BY title
      LIMIT ? OFFSET ?
    `;

    try {
      const movies = this.db.prepare(query).all(`%${genre}%`, limit, offset) as any[];
      
      const formattedRows: MovieListResponse[] = movies.map(movie => ({
        ...movie,
        budget: movie.budget ? `$${movie.budget.toLocaleString()}` : null,
        genres: JSON.parse(movie.genres) as Genre[],
        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : null,
      }));
      
      return formattedRows;
    } catch (err) {
      throw err;
    }
  }
}