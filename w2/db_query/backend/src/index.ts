import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler';
import {
  listDatabases,
  addOrUpdateDatabase,
  getDatabaseMetadata,
} from './api/databases.controller';
import { initializeDatabase } from './db/init';

// Initialize database
initializeDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// API routes
app.get('/api/v1/dbs', listDatabases);
app.put('/api/v1/dbs/:name', addOrUpdateDatabase);
app.get('/api/v1/dbs/:name', getDatabaseMetadata);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
