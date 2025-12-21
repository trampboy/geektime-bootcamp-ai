/**
 * DatabaseList component - Display list of databases
 */
import type { DatabaseInfo } from '../types/api-types';

interface DatabaseListProps {
  databases: DatabaseInfo[];
  onSelectDatabase: (name: string) => void;
  selectedDatabase?: string;
}

export function DatabaseList({
  databases,
  onSelectDatabase,
  selectedDatabase,
}: DatabaseListProps): JSX.Element {
  if (databases.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No databases added yet. Add a database to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Databases</h2>
      <div className="space-y-2">
        {databases.map((db) => (
          <div
            key={db.name}
            onClick={() => onSelectDatabase(db.name)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedDatabase === db.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{db.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              Updated: {new Date(db.updatedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
