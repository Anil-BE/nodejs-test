import request from 'supertest';

// Mock database for testing
process.env.DB_PATH = ':memory:';
process.env.NODE_ENV = 'test';

import app from '../src/app';

describe('Movie API Endpoints', () => {
  beforeAll(async () => {
    // Wait a bit for database to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/movies', () => {
    it('should return paginated movies list', async () => {
      const response = await request(app)
        .get('/api/movies')
        .expect(200);
      
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(50);
    });

    it('should handle page parameter correctly', async () => {
      const response = await request(app)
        .get('/api/movies?page=2')
        .expect(200);
      
      expect(response.body.pagination.page).toBe(2);
    });

    it('should reject invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/movies?page=0')
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('page');
    });
  });

  describe('GET /api/movies/:id', () => {
    it('should return movie details for valid ID', async () => {
      // Using a known movie ID that should exist in the test database
      const response = await request(app)
        .get('/api/movies/55245')
        .expect(200);
      
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(55245);
    });

    it('should return 404 for non-existent movie ID', async () => {
      await request(app)
        .get('/api/movies/nonexistentid')
        .expect(404);
    });
  });

  describe('GET /api/movies/year/:year', () => {
    it('should return movies from specific year', async () => {
      const response = await request(app)
        .get('/api/movies/year/1988')
        .expect(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data[0].releaseDate).toContain('1988');
    });

    it('should reject invalid year format', async () => {
      const response = await request(app)
        .get('/api/movies/year/20')
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('year');
    });

    it('should handle sort parameter correctly', async () => {
      const response = await request(app)
        .get('/api/movies/year/2020?sort=DESC')
        .expect(200);
      
      expect(response.body.pagination.sort_order).toBe('DESC');
    });

    it('should reject invalid sort parameter', async () => {
      const response = await request(app)
        .get('/api/movies/year/2020?sort=INVALID')
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('sort');
    });
  });

  describe('GET /api/movies/genre/:genre', () => {
    it('should return movies by genre', async () => {
      const response = await request(app)
        .get('/api/movies/genre/Action')
        .expect(200);
      
      expect(response.body.data).toBeDefined();
      expect(JSON.stringify(response.body.data[0].genres)).toContain('Action');
    });

    it('should handle page parameter correctly', async () => {
      const response = await request(app)
        .get('/api/movies/genre/Action?page=2')
        .expect(200);
      
      expect(response.body.pagination.page).toBe(2);
    });

    it('should reject invalid page parameter', async () => {
      const response = await request(app)
        .get('/api/movies/genre/Action?page=0')
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].path).toBe('page');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown endpoints', async () => {
      await request(app)
        .get('/api/unknown')
        .expect(404);
    });
  });
});