/**
 * API client service
 */
import type {
  DatabaseConnection,
  DatabaseInfo,
  DatabaseMetadata,
  DatabasesResponse,
  ErrorResponse,
} from '../types/api-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiError extends Error {
  public code?: string;
  public statusCode: number;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new ApiError(
      error.error.message,
      response.status,
      error.error.code
    );
  }

  return data as T;
}

/**
 * Fetch all databases
 */
export async function fetchDatabases(): Promise<DatabaseInfo[]> {
  const response = await request<DatabasesResponse>('/api/v1/dbs');
  return response.databases;
}

/**
 * Add or update database
 */
export async function addDatabase(
  name: string,
  connection: DatabaseConnection
): Promise<DatabaseInfo> {
  return request<DatabaseInfo>(`/api/v1/dbs/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: JSON.stringify(connection),
  });
}

/**
 * Get database metadata
 */
export async function getDatabaseMetadata(
  name: string
): Promise<DatabaseMetadata> {
  return request<DatabaseMetadata>(`/api/v1/dbs/${encodeURIComponent(name)}`);
}
