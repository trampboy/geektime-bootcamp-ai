/**
 * Jest test setup file
 */
import path from 'path';
import fs from 'fs';
import { initializeDatabase, resetDatabaseInstance } from '../db/init';

const TEST_DB_PATH = path.join(__dirname, '../../../data/test_db_query.db');

// Initialize test database before all tests
beforeAll(() => {
  // Reset any existing database instance
  resetDatabaseInstance();
  
  // Clean up test database if exists
  if (fs.existsSync(TEST_DB_PATH)) {
    try {
      fs.unlinkSync(TEST_DB_PATH);
    } catch (error) {
      // Ignore if file is locked
    }
  }
  
  // Set test database path
  process.env.DB_PATH = TEST_DB_PATH;
  
  // Initialize database
  initializeDatabase();
});

// Clean up after all tests
afterAll(() => {
  // Close database connections
  resetDatabaseInstance();
  
  try {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  } catch (error) {
    // Ignore cleanup errors
  }
});
