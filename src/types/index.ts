export interface Movie {
  id?: number;
  imdbId: string;
  title: string;
  genres: Genre[];
  releaseDate: string;
  budget: number | null;
}

export interface MovieDetails extends Movie {
  description: string;
  runtime: number | null;
  average_rating: string | null;
  original_language: string;
  production_companies: string;
}

export interface MovieListResponse {
  imdbId: string;
  title: string;
  genres: Genre[];
  releaseDate: string;
  budget: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo & {
    year?: string;
    genre?: string;
    sort_order?: string;
  };
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export type SortOrder = 'ASC' | 'DESC';