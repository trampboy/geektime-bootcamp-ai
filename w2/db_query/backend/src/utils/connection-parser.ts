/**
 * MySQL connection string parser utility
 * Parses mysql:// URL format
 */
export interface ConnectionConfig {
  host: string;
  port: number;
  user?: string;
  password?: string;
  database?: string;
}

/**
 * Parse MySQL connection URL
 * Format: mysql://[user[:password]@]host[:port][/database]
 */
export function parseConnectionUrl(url: string): ConnectionConfig {
  try {
    const urlObj = new URL(url);

    if (urlObj.protocol !== 'mysql:') {
      throw new Error('Invalid protocol. Expected mysql://');
    }

    const config: ConnectionConfig = {
      host: urlObj.hostname,
      port: urlObj.port ? parseInt(urlObj.port, 10) : 3306,
    };

    if (urlObj.username) {
      config.user = decodeURIComponent(urlObj.username);
    }

    if (urlObj.password) {
      config.password = decodeURIComponent(urlObj.password);
    }

    if (urlObj.pathname && urlObj.pathname.length > 1) {
      config.database = urlObj.pathname.slice(1); // Remove leading '/'
    }

    if (!config.host) {
      throw new Error('Host is required');
    }

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid connection URL: ${error.message}`);
    }
    throw new Error('Invalid connection URL format');
  }
}

/**
 * Validate database name
 * - Length: 1-100 characters
 * - Characters: letters, numbers, underscore, hyphen
 * - Cannot be empty or whitespace only
 */
export function validateDatabaseName(name: string): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }
  if (name.length > 100) {
    return false;
  }
  // Only allow letters, numbers, underscore, and hyphen
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(name);
}
