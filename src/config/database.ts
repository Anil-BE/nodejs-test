import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { setDbInstance } from './dbContext';

class DatabaseConnection {
  private db: DatabaseType | null = null;

  public async connect(): Promise<DatabaseType> {
    try {
      const movieDbPath = process.env.MOVIE_DB_PATH || path.join(__dirname, '../../db/movies.db');
      const ratingsDBPath = process.env.RATINGS_DB_PATH || path.join(__dirname, '../../db/ratings.db');

      this.db = new Database(movieDbPath);
      this.db.exec(`ATTACH DATABASE '${ratingsDBPath}' AS ratingsDB`);

      console.log('Connected to SQLite database');

      // Set the database instance in the context for direct access by models
      setDbInstance(this.db);

      return this.db;
    } catch (err) {
      console.error('Error connecting to database:', err);
      throw err;
    }
  }

  public getConnection(): DatabaseType {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  public async close(): Promise<void> {
    try {
      this.db?.close();
    } catch (err) {
      console.error('Error closing database:', err);
    }
  }
}

export default new DatabaseConnection();