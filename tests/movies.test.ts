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
      await request(app)
        .get('/api/movies?page=0')
        .expect(400);
    });
  });

  describe('GET /api/movies/year/:year', () => {
    it('should return movies from specific year', async () => {
      const response = await request(app)
        .get('/api/movies/year/2020')
        .expect(200);
      
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination.year).toBe('2020');
    });

    it('should reject invalid year format', async () => {
      await request(app)
        .get('/api/movies/year/20')
        .expect(400);
    });
  });

  describe('GET /api/movies/genre/:genre', () => {
    it('should return movies by genre', async () => {
      const response = await request(app)
        .get('/api/movies/genre/Action')
        .expect(200);
      
      expect(response.body.data).toBeDefined();
      expect(response.body.pagination.genre).toBe('Action');
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