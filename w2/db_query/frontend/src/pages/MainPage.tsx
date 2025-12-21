/**
 * Main page component - Combine DatabaseList, AddDatabaseForm, MetadataView
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DatabaseList } from '../components/DatabaseList';
import { AddDatabaseForm } from '../components/AddDatabaseForm';
import { MetadataView } from '../components/MetadataView';
import { fetchDatabases, getDatabaseMetadata } from '../services/api';
import type { DatabaseInfo, DatabaseMetadata } from '../types/api-types';

export function MainPage(): JSX.Element {
  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | undefined>();
  const [metadata, setMetadata] = useState<DatabaseMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load databases on mount
  useEffect(() => {
    loadDatabases();
  }, []);

  // Load metadata when database is selected
  useEffect(() => {
    if (selectedDatabase) {
      loadMetadata(selectedDatabase);
    } else {
      setMetadata(null);
    }
  }, [selectedDatabase]);

  const loadDatabases = async (): Promise<void> => {
    try {
      const data = await fetchDatabases();
      setDatabases(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const loadMetadata = async (name: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDatabaseMetadata(name);
      setMetadata(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setMetadata(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Database Query Tool</h1>
          <div className="flex gap-4">
            {selectedDatabase && (
              <Link
                to={`/query/${encodeURIComponent(selectedDatabase)}`}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                SQL 查询
              </Link>
            )}
            <Link
              to="/query"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              查询页面
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Database list and add form */}
          <div className="lg:col-span-1 space-y-6">
            <AddDatabaseForm onDatabaseAdded={setDatabases} />
            <DatabaseList
              databases={databases}
              onSelectDatabase={setSelectedDatabase}
              selectedDatabase={selectedDatabase}
            />
          </div>

          {/* Right column: Metadata view */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <MetadataView metadata={metadata} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
