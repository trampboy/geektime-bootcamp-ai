/**
 * AddDatabaseForm component - Form to add database connection
 */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { addDatabase, fetchDatabases } from '../services/api';
import type { DatabaseInfo } from '../types/api-types';

interface AddDatabaseFormProps {
  onDatabaseAdded: (databases: DatabaseInfo[]) => void;
}

export function AddDatabaseForm({
  onDatabaseAdded,
}: AddDatabaseFormProps): JSX.Element {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate database name format
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setError('Database name can only contain letters, numbers, underscore, and hyphen');
      return;
    }

    setLoading(true);

    try {
      await addDatabase(name, { url });
      setSuccess(true);
      setName('');
      setUrl('');
      // Refresh database list
      const databases = await fetchDatabases();
      onDatabaseAdded(databases);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add database');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Add Database</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Database Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., my-database"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Only letters, numbers, underscore, and hyphen allowed"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            Connection URL
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="mysql://user:password@host:port/database"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            Database added successfully!
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Database'}
        </button>
      </form>
    </div>
  );
}
