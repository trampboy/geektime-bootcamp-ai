/**
 * Queries API controller
 */
import { Request, Response, NextFunction } from 'express';
import { SqliteService } from '../services/sqlite.service';
import { QueryExecutorService } from '../services/query-executor.service';
import { NLToSQLService } from '../services/nl-to-sql.service';
import { AppError } from '../middleware/error-handler';
import {
  QueryRequest,
  NaturalLanguageQueryRequest,
  NaturalLanguageQueryResponse,
} from '../models/query';

const sqliteService = new SqliteService();
const queryExecutorService = new QueryExecutorService();
const nlToSQLService = new NLToSQLService();

/**
 * POST /api/v1/dbs/{name}/query
 * Execute SQL query
 */
export async function executeQuery(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = req.params;
    const { sql } = req.body as QueryRequest;

    // Validate database exists
    const databaseInfo = sqliteService.getDatabaseByName(name);
    if (!databaseInfo) {
      throw new AppError('Database not found', 404, 'DATABASE_NOT_FOUND');
    }

    // Validate SQL
    if (!sql || typeof sql !== 'string') {
      throw new AppError('SQL query is required', 400, 'INVALID_SQL');
    }

    // Execute query
    const result = await queryExecutorService.executeQuery(
      databaseInfo.url,
      sql
    );

    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      // Check if it's a SQL validation error
      if (
        error.message.includes('Invalid SQL') ||
        error.message.includes('Only SELECT statements')
      ) {
        next(
          new AppError(error.message, 400, 'INVALID_SQL')
        );
      } else if (error.message.includes('Query execution failed')) {
        next(
          new AppError(error.message, 500, 'QUERY_FAILED')
        );
      } else {
        next(
          new AppError(
            `Query execution failed: ${error.message}`,
            500,
            'QUERY_FAILED'
          )
        );
      }
    } else {
      next(
        new AppError('Query execution failed', 500, 'QUERY_FAILED')
      );
    }
  }
}

/**
 * POST /api/v1/dbs/{name}/query/natural
 * Execute natural language query
 */
export async function executeNaturalLanguageQuery(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = req.params;
    const { prompt } = req.body as NaturalLanguageQueryRequest;

    // Validate database exists
    const databaseInfo = sqliteService.getDatabaseByName(name);
    if (!databaseInfo) {
      throw new AppError('Database not found', 404, 'DATABASE_NOT_FOUND');
    }

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new AppError('Prompt is required', 400, 'INVALID_REQUEST');
    }

    // Check if OpenAI is configured
    if (!nlToSQLService.isConfigured()) {
      throw new AppError(
        'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.',
        500,
        'LLM_NOT_CONFIGURED'
      );
    }

    // Get database metadata
    const databaseId = sqliteService.getDatabaseId(name);
    if (!databaseId) {
      throw new AppError('Database not found', 404, 'DATABASE_NOT_FOUND');
    }

    const metadataJson = sqliteService.getLatestMetadata(databaseId);
    if (!metadataJson) {
      throw new AppError(
        'Metadata not found. Please update the database connection to fetch metadata.',
        404,
        'METADATA_NOT_FOUND'
      );
    }

    const metadata = {
      name: databaseInfo.name,
      tables: metadataJson.tables,
      views: metadataJson.views,
      updatedAt:
        sqliteService.getLatestMetadataUpdatedAt(databaseId) ||
        databaseInfo.updatedAt,
    };

    // Generate SQL from natural language
    let generatedSQL: string;
    try {
      generatedSQL = await nlToSQLService.generateSQL(prompt.trim(), metadata);
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(
          `Failed to generate SQL: ${error.message}`,
          400,
          'LLM_GENERATION_FAILED'
        );
      }
      throw new AppError(
        'Failed to generate SQL from natural language',
        500,
        'LLM_GENERATION_FAILED'
      );
    }

    // Execute the generated SQL query
    let queryResult;
    try {
      queryResult = await queryExecutorService.executeQuery(
        databaseInfo.url,
        generatedSQL
      );
    } catch (error) {
      // Even if execution fails, return the generated SQL
      if (error instanceof Error) {
        throw new AppError(
          `Generated SQL execution failed: ${error.message}. Generated SQL: ${generatedSQL}`,
          500,
          'QUERY_FAILED'
        );
      }
      throw new AppError(
        `Generated SQL execution failed. Generated SQL: ${generatedSQL}`,
        500,
        'QUERY_FAILED'
      );
    }

    // Return response with generated SQL and result
    const response: NaturalLanguageQueryResponse = {
      sql: generatedSQL,
      result: queryResult,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
}
