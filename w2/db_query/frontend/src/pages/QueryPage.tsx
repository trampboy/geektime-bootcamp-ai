/**
 * Query Page component - Combine SqlEditor and QueryResultTable
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SqlEditor } from '../components/SqlEditor';
import { QueryResultTable } from '../components/QueryResultTable';
import { NaturalLanguageInput } from '../components/NaturalLanguageInput';
import {
  fetchDatabases,
  executeQuery,
  executeNaturalLanguageQuery,
} from '../services/api';
import type {
  DatabaseInfo,
  QueryResult,
  NaturalLanguageQueryResponse,
} from '../types/api-types';

export function QueryPage(): JSX.Element {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string | undefined>(
    name
  );
  const [sql, setSql] = useState<string>('');
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState<string>('');
  const [generatedSQL, setGeneratedSQL] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSQL, setIsGeneratingSQL] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sql' | 'natural'>('sql');

  // Load databases on mount
  useEffect(() => {
    loadDatabases();
  }, []);

  // Update selected database when URL param changes
  useEffect(() => {
    if (name) {
      setSelectedDatabase(name);
    }
  }, [name]);

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

  const handleExecute = async (): Promise<void> => {
    if (!selectedDatabase) {
      setError('请先选择数据库');
      return;
    }

    if (!sql.trim()) {
      setError('请输入SQL查询语句');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setGeneratedSQL(null);

    try {
      const queryResult = await executeQuery(selectedDatabase, { sql });
      setResult(queryResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('查询执行失败');
      }
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaturalLanguageExecute = async (): Promise<void> => {
    if (!selectedDatabase) {
      setError('请先选择数据库');
      return;
    }

    if (!naturalLanguagePrompt.trim()) {
      setError('请输入自然语言查询描述');
      return;
    }

    setIsGeneratingSQL(true);
    setIsLoading(true);
    setError(null);
    setResult(null);
    setGeneratedSQL(null);

    try {
      const response: NaturalLanguageQueryResponse =
        await executeNaturalLanguageQuery(selectedDatabase, {
          prompt: naturalLanguagePrompt.trim(),
        });
      setGeneratedSQL(response.sql);
      setSql(response.sql); // Also update SQL editor with generated SQL
      setResult(response.result);
      setActiveTab('sql'); // Switch to SQL tab to show generated SQL
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('自然语言查询失败');
      }
      setResult(null);
      setGeneratedSQL(null);
    } finally {
      setIsGeneratingSQL(false);
      setIsLoading(false);
    }
  };

  const handleDatabaseChange = (dbName: string): void => {
    setSelectedDatabase(dbName);
    setResult(null);
    setError(null);
    navigate(`/query/${encodeURIComponent(dbName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SQL 查询
          </h1>
          <div className="flex items-center gap-4">
            <select
              value={selectedDatabase || ''}
              onChange={(e) => handleDatabaseChange(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">选择数据库</option>
              {databases.map((db) => (
                <option key={db.name} value={db.name}>
                  {db.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleExecute}
              disabled={isLoading || !selectedDatabase || !sql.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '执行中...' : '执行查询'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Tabs for SQL and Natural Language */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'sql'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                SQL 查询
              </button>
              <button
                onClick={() => setActiveTab('natural')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'natural'
                    ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                自然语言查询
              </button>
            </div>

            {activeTab === 'sql' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  SQL 编辑器
                </h2>
                {generatedSQL && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                      生成的 SQL:
                    </div>
                    <code className="text-sm text-green-800 dark:text-green-300">
                      {generatedSQL}
                    </code>
                  </div>
                )}
                <SqlEditor
                  value={sql}
                  onChange={setSql}
                  onExecute={handleExecute}
                  height="300px"
                />
              </div>
            )}

            {activeTab === 'natural' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  自然语言查询
                </h2>
                <NaturalLanguageInput
                  value={naturalLanguagePrompt}
                  onChange={setNaturalLanguagePrompt}
                  onExecute={handleNaturalLanguageExecute}
                  isLoading={isGeneratingSQL || isLoading}
                  disabled={!selectedDatabase}
                />
              </div>
            )}
          </div>

          {/* Query Results */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              查询结果
            </h2>
            <QueryResultTable
              result={result}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
