import type { Database as DatabaseType } from 'better-sqlite3';

// Singleton database instance that can be imported directly by models
let dbInstance: DatabaseType;


export const setDbInstance = (db: DatabaseType): void => {
  dbInstance = db;
};

export const getDbInstance = (): DatabaseType => {
  if (!dbInstance) {
    throw new Error('Movie database instance not initialized. Call setDbInstance first.');
  }
  return dbInstance;
};
