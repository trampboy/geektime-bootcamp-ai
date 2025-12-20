import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { TicketProvider } from './store/ticket.store'
import { TagProvider } from './store/tag.store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TagProvider>
      <TicketProvider>
        <App />
      </TicketProvider>
    </TagProvider>
  </React.StrictMode>,
)
