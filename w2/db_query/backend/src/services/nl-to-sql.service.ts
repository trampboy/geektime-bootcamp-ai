/**
 * Natural language to SQL generator service
 * Build prompt with metadata context, call OpenAI, validate generated SQL
 */
import { OpenAIService } from './openai.service';
import { DatabaseMetadata } from '../models/metadata';
import { parseAndValidateSQL } from '../utils/sql-parser';

export class NLToSQLService {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService();
  }

  /**
   * Check if OpenAI is configured
   */
  isConfigured(): boolean {
    return this.openaiService.isConfigured();
  }

  /**
   * Generate SQL from natural language prompt
   * @param prompt Natural language query description
   * @param metadata Database metadata context
   * @returns Generated SQL query
   */
  async generateSQL(
    prompt: string,
    metadata: DatabaseMetadata
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.'
      );
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('Prompt is required');
    }

    try {
      // Generate SQL using OpenAI
      const generatedSQL = await this.openaiService.generateSQL(
        prompt.trim(),
        {
          tables: metadata.tables,
          views: metadata.views,
        }
      );

      // Validate generated SQL
      try {
        parseAndValidateSQL(generatedSQL);
        return generatedSQL;
      } catch (validationError) {
        throw new Error(
          `Generated SQL is invalid: ${
            validationError instanceof Error
              ? validationError.message
              : 'Unknown error'
          }`
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate SQL from natural language');
    }
  }
}
