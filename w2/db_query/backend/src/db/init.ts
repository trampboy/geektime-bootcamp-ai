/**
 * SQLite database initialization script
 */
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(__dirname, '../../../data');
const DB_PATH = path.join(DB_DIR, 'db_query.db');

/**
 * Initialize SQLite database and create tables
 */
export function initializeDatabase(): Database.Database {
  // Ensure data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Open or create database
  const db = new Database(DB_PATH);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create databases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS databases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Create metadata table
  db.exec(`
    CREATE TABLE IF NOT EXISTS metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      databaseId INTEGER NOT NULL REFERENCES databases(id) ON DELETE CASCADE,
      metadata TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  // Create indexes
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_databases_name ON databases(name);
    CREATE INDEX IF NOT EXISTS idx_metadata_databaseId ON metadata(databaseId);
  `);

  return db;
}

/**
 * Get database instance (singleton pattern)
 */
let dbInstance: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    dbInstance = initializeDatabase();
  }
  return dbInstance;
}
