import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import database from './config/database';
import { createMovieRoutes } from './routes/movies';
import { errorHandler } from './middleware/errorHandler';
import { HealthResponse } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const response: HealthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

// Initialize database and routes
async function initializeApp(): Promise<void> {
  try {
    await database.connect();
    
    // Setup routes
    app.use('/api/movies', createMovieRoutes());
    
    // 404 handler
    app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });
    
    // Error handler
    app.use(errorHandler);
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`Movie API server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await database.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  initializeApp();
}

export default app;