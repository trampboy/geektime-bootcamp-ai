/**
 * Query Result Table component
 * Display query results as table
 */
import type { QueryResult } from '../types/api-types';

interface QueryResultTableProps {
  result: QueryResult | null;
  isLoading?: boolean;
  error?: string | null;
}

export function QueryResultTable({
  result,
  isLoading = false,
  error = null,
}: QueryResultTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg">
        <div className="text-gray-500">执行查询中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="text-red-700 dark:text-red-400 font-semibold">
          查询错误
        </div>
        <div className="text-red-600 dark:text-red-300 mt-1">{error}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg text-gray-500">
        暂无查询结果
      </div>
    );
  }

  if (result.rowCount === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg text-gray-500">
        查询成功，但没有返回数据
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b flex justify-between items-center">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          查询结果
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          共 {result.rowCount} 行 | 执行时间: {result.executionTime}ms
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900">
              {result.columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b"
              >
                {result.columns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
                  >
                    {row[column] !== null && row[column] !== undefined
                      ? String(row[column])
                      : 'NULL'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
