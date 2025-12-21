/**
 * Natural Language Input component
 * Text input for natural language query
 */
import { useState } from 'react';

interface NaturalLanguageInputProps {
  value: string;
  onChange: (value: string) => void;
  onExecute?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function NaturalLanguageInput({
  value,
  onChange,
  onExecute,
  isLoading = false,
  disabled = false,
}: NaturalLanguageInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onExecute && !disabled && !isLoading) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        自然语言查询
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isLoading}
        placeholder="例如: 查询用户表的所有信息"
        className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
        rows={3}
      />
      {onExecute && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            提示: 按 Ctrl+Enter (Windows/Linux) 或 Cmd+Enter (Mac) 执行查询
          </div>
          <button
            onClick={onExecute}
            disabled={disabled || isLoading || !value.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? '生成中...' : '生成并执行 SQL'}
          </button>
        </div>
      )}
    </div>
  );
}
