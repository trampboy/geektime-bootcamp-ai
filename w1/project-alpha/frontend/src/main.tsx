/**
 * Project Alpha - 应用入口文件
 * 初始化 React 应用并配置全局状态和错误处理
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TicketProvider } from './store/ticket.store'
import { TagProvider } from './store/tag.store'
import { ThemeProvider } from './store/theme.store'
import ErrorBoundary from './components/ui/error-boundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <TagProvider>
          <TicketProvider>
            <App />
          </TicketProvider>
        </TagProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
