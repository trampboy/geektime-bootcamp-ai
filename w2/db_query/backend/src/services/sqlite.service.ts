/**
 * SQLite database service - CRUD operations for databases and metadata tables
 */
import Database from 'better-sqlite3';
import { getDatabase } from '../db/init';
import { DatabaseRow, DatabaseInfo } from '../models/database';
import { MetadataRow, MetadataJson } from '../models/metadata';

export class SqliteService {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  /**
   * Get all databases
   */
  getAllDatabases(): DatabaseInfo[] {
    const stmt = this.db.prepare('SELECT * FROM databases ORDER BY createdAt DESC');
    const rows = stmt.all() as DatabaseRow[];
    return rows.map(this.mapToDatabaseInfo);
  }

  /**
   * Get database by name
   */
  getDatabaseByName(name: string): DatabaseInfo | null {
    const stmt = this.db.prepare('SELECT * FROM databases WHERE name = ?');
    const row = stmt.get(name) as DatabaseRow | undefined;
    return row ? this.mapToDatabaseInfo(row) : null;
  }

  /**
   * Create or update database
   */
  upsertDatabase(name: string, url: string): DatabaseInfo {
    const now = new Date().toISOString();
    const existing = this.getDatabaseByName(name);

    if (existing) {
      // Update existing
      const stmt = this.db.prepare(
        'UPDATE databases SET url = ?, updatedAt = ? WHERE name = ?'
      );
      stmt.run(url, now, name);
      return this.getDatabaseByName(name)!;
    } else {
      // Insert new
      const stmt = this.db.prepare(
        'INSERT INTO databases (name, url, createdAt, updatedAt) VALUES (?, ?, ?, ?)'
      );
      stmt.run(name, url, now, now);
      return this.getDatabaseByName(name)!;
    }
  }

  /**
   * Delete database
   */
  deleteDatabase(name: string): boolean {
    const stmt = this.db.prepare('DELETE FROM databases WHERE name = ?');
    const result = stmt.run(name);
    return result.changes > 0;
  }

  /**
   * Get latest metadata for a database
   */
  getLatestMetadata(databaseId: number): MetadataJson | null {
    const stmt = this.db.prepare(
      'SELECT * FROM metadata WHERE databaseId = ? ORDER BY updatedAt DESC LIMIT 1'
    );
    const row = stmt.get(databaseId) as MetadataRow | undefined;
    if (!row) {
      return null;
    }
    return JSON.parse(row.metadata) as MetadataJson;
  }

  /**
   * Save metadata for a database
   */
  saveMetadata(databaseId: number, metadata: MetadataJson): void {
    const now = new Date().toISOString();
    const metadataJson = JSON.stringify(metadata);
    const stmt = this.db.prepare(
      'INSERT INTO metadata (databaseId, metadata, updatedAt) VALUES (?, ?, ?)'
    );
    stmt.run(databaseId, metadataJson, now);
  }

  /**
   * Get database ID by name
   */
  getDatabaseId(name: string): number | null {
    const stmt = this.db.prepare('SELECT id FROM databases WHERE name = ?');
    const row = stmt.get(name) as { id: number } | undefined;
    return row ? row.id : null;
  }

  /**
   * Get latest metadata updatedAt for a database
   */
  getLatestMetadataUpdatedAt(databaseId: number): string | null {
    const stmt = this.db.prepare(
      'SELECT updatedAt FROM metadata WHERE databaseId = ? ORDER BY updatedAt DESC LIMIT 1'
    );
    const row = stmt.get(databaseId) as { updatedAt: string } | undefined;
    return row ? row.updatedAt : null;
  }

  /**
   * Map database row to DatabaseInfo
   */
  private mapToDatabaseInfo(row: DatabaseRow): DatabaseInfo {
    return {
      name: row.name,
      url: row.url,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
