/**
 * OpenAI service wrapper
 * Initialize OpenAI client and generate SQL from natural language
 */
import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
      });
    }
  }

  /**
   * Check if OpenAI is configured
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Generate SQL from natural language prompt
   * @param prompt Natural language query description
   * @param metadata Database metadata context (tables, views, columns)
   * @returns Generated SQL query
   */
  async generateSQL(
    prompt: string,
    metadata: {
      tables: Array<{
        name: string;
        type: string;
        columns: Array<{
          name: string;
          type: string;
          nullable: boolean;
          key: string;
        }>;
      }>;
      views: Array<{
        name: string;
        type: string;
        columns: Array<{
          name: string;
          type: string;
          nullable: boolean;
          key: string;
        }>;
      }>;
    }
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI API key is not configured');
    }

    // Build context from metadata
    const schemaDescription = this.buildSchemaDescription(metadata);

    // Build prompt for OpenAI
    const systemPrompt = `You are a SQL expert. Generate SQL SELECT queries based on natural language descriptions.
You have access to the following database schema:

${schemaDescription}

Rules:
1. Only generate SELECT queries
2. Use proper SQL syntax
3. Use table and column names exactly as shown in the schema
4. Do not include LIMIT clause unless explicitly requested
5. Return only the SQL query, no explanations or markdown formatting
6. If the query is ambiguous, make reasonable assumptions based on the schema`;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const generatedSQL = completion.choices[0]?.message?.content?.trim();
      if (!generatedSQL) {
        throw new Error('Failed to generate SQL from OpenAI');
      }

      // Remove markdown code blocks if present
      const cleanedSQL = generatedSQL
        .replace(/^```sql\n?/i, '')
        .replace(/^```\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();

      return cleanedSQL;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw new Error('OpenAI API error');
    }
  }

  /**
   * Build schema description from metadata
   */
  private buildSchemaDescription(metadata: {
    tables: Array<{
      name: string;
      type: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        key: string;
      }>;
    }>;
    views: Array<{
      name: string;
      type: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
        key: string;
      }>;
    }>;
  }): string {
    const parts: string[] = [];

    // Add tables
    if (metadata.tables.length > 0) {
      parts.push('Tables:');
      for (const table of metadata.tables) {
        const columns = table.columns
          .map((col) => {
            const constraints: string[] = [];
            if (col.key === 'PRI') constraints.push('PRIMARY KEY');
            if (col.key === 'UNI') constraints.push('UNIQUE');
            if (!col.nullable) constraints.push('NOT NULL');
            const constraintStr =
              constraints.length > 0 ? ` (${constraints.join(', ')})` : '';
            return `  - ${col.name}: ${col.type}${constraintStr}`;
          })
          .join('\n');
        parts.push(`\n${table.name}:\n${columns}`);
      }
    }

    // Add views
    if (metadata.views.length > 0) {
      parts.push('\nViews:');
      for (const view of metadata.views) {
        const columns = view.columns
          .map((col) => {
            return `  - ${col.name}: ${col.type}`;
          })
          .join('\n');
        parts.push(`\n${view.name}:\n${columns}`);
      }
    }

    return parts.join('\n');
  }
}
