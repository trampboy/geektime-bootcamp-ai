/**
 * SQL Editor component using Monaco Editor
 */
import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute?: () => void;
  readOnly?: boolean;
  height?: string;
}

export function SqlEditor({
  value,
  onChange,
  onExecute,
  readOnly = false,
  height = '400px',
}: SqlEditorProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onExecute) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden" onKeyDown={handleKeyDown}>
      <Editor
        height={height}
        defaultLanguage="sql"
        value={value}
        onChange={handleEditorChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
        theme="vs-dark"
      />
      {onExecute && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t text-sm text-gray-600 dark:text-gray-400">
          提示: 按 Ctrl+Enter (Windows/Linux) 或 Cmd+Enter (Mac) 执行查询
        </div>
      )}
    </div>
  );
}
