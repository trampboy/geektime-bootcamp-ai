/**
 * MetadataView component - Display tables and views metadata
 */
import { Link } from 'react-router-dom';
import type { DatabaseMetadata, TableMetadata, ColumnMetadata } from '../types/api-types';

interface MetadataViewProps {
  metadata: DatabaseMetadata | null;
  loading?: boolean;
}

export function MetadataView({
  metadata,
  loading,
}: MetadataViewProps): JSX.Element {
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading metadata...</div>
    );
  }

  if (!metadata) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Select a database to view metadata
      </div>
    );
  }

  const renderColumns = (columns: ColumnMetadata[]): JSX.Element => {
    if (columns.length === 0) {
      return <div className="text-sm text-gray-400">No columns</div>;
    }

    return (
      <div className="space-y-1">
        {columns.map((col) => (
          <div key={col.name} className="text-sm">
            <span className="font-medium">{col.name}</span>
            <span className="text-gray-500 ml-2">{col.type}</span>
            {col.nullable && (
              <span className="text-gray-400 ml-2">nullable</span>
            )}
            {col.key && (
              <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                {col.key}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTable = (table: TableMetadata): JSX.Element => (
    <div key={table.name} className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{table.name}</h3>
        <span
          className={`px-2 py-1 rounded text-xs ${
            table.type === 'BASE TABLE'
              ? 'bg-green-100 text-green-700'
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {table.type}
        </span>
      </div>
      <div className="mt-3">
        <div className="text-sm font-medium text-gray-600 mb-2">Columns:</div>
        {renderColumns(table.columns)}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Metadata: {metadata.name}</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Updated: {new Date(metadata.updatedAt).toLocaleString()}
          </div>
          <Link
            to={`/query/${encodeURIComponent(metadata.name)}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            执行 SQL 查询
          </Link>
        </div>
      </div>

      {metadata.tables.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3">Tables ({metadata.tables.length})</h3>
          <div>{metadata.tables.map(renderTable)}</div>
        </div>
      )}

      {metadata.views.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-3">Views ({metadata.views.length})</h3>
          <div>{metadata.views.map(renderTable)}</div>
        </div>
      )}

      {metadata.tables.length === 0 && metadata.views.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No tables or views found in this database
        </div>
      )}
    </div>
  );
}
