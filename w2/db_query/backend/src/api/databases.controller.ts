/**
 * Databases API controller
 */
import { Request, Response, NextFunction } from 'express';
import { SqliteService } from '../services/sqlite.service';
import { MysqlService } from '../services/mysql.service';
import { MetadataFetcherService } from '../services/metadata-fetcher.service';
import { validateDatabaseName } from '../utils/connection-parser';
import { AppError } from '../middleware/error-handler';
import { DatabaseConnection, DatabaseInfo } from '../models/database';
import { DatabaseMetadata } from '../models/metadata';

const sqliteService = new SqliteService();
const mysqlService = new MysqlService();
const metadataFetcherService = new MetadataFetcherService();

/**
 * GET /api/v1/dbs
 * List all databases
 */
export async function listDatabases(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const databases = sqliteService.getAllDatabases();
    res.json({ databases });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/dbs/{name}
 * Add or update database connection
 */
export async function addOrUpdateDatabase(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = req.params;
    const { url } = req.body as DatabaseConnection;

    // Validate database name
    if (!validateDatabaseName(name)) {
      throw new AppError(
        'Invalid database name. Must be 1-100 characters, letters, numbers, underscore, or hyphen only.',
        400,
        'INVALID_DATABASE_NAME'
      );
    }

    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new AppError('URL is required', 400, 'INVALID_CONNECTION');
    }

    // Test MySQL connection
    const isConnected = await mysqlService.testConnection(url);
    if (!isConnected) {
      throw new AppError(
        'Failed to connect to MySQL database',
        400,
        'INVALID_CONNECTION'
      );
    }

    // Save database connection
    const databaseInfo = sqliteService.upsertDatabase(name, url);

    // Fetch and save metadata
    try {
      const metadata = await metadataFetcherService.fetchMetadata(url);
      const databaseId = sqliteService.getDatabaseId(name);
      if (databaseId) {
        sqliteService.saveMetadata(databaseId, metadata);
      }
    } catch (error) {
      // Log error but don't fail the request
      console.error('Failed to fetch metadata:', error);
    }

    res.json(databaseInfo);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/dbs/{name}
 * Get database metadata
 */
export async function getDatabaseMetadata(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = req.params;

    // Get database info
    const databaseInfo = sqliteService.getDatabaseByName(name);
    if (!databaseInfo) {
      throw new AppError('Database not found', 404, 'DATABASE_NOT_FOUND');
    }

    // Get database ID
    const databaseId = sqliteService.getDatabaseId(name);
    if (!databaseId) {
      throw new AppError('Database not found', 404, 'DATABASE_NOT_FOUND');
    }

    // Get latest metadata
    const metadataJson = sqliteService.getLatestMetadata(databaseId);
    if (!metadataJson) {
      throw new AppError(
        'Metadata not found. Please update the database connection to fetch metadata.',
        404,
        'METADATA_NOT_FOUND'
      );
    }

    // Get the latest metadata updatedAt
    const metadataUpdatedAt = sqliteService.getLatestMetadataUpdatedAt(databaseId) || databaseInfo.updatedAt;

    const databaseMetadata: DatabaseMetadata = {
      name: databaseInfo.name,
      tables: metadataJson.tables,
      views: metadataJson.views,
      updatedAt: metadataUpdatedAt,
    };

    res.json(databaseMetadata);
  } catch (error) {
    next(error);
  }
}
