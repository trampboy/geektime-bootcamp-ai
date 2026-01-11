# Architecture

This document describes the architectural patterns and project structure of Project Alpha.

## Project Structure Philosophy

Project Alpha follows a clean separation of concerns with distinct backend and frontend applications. The architecture emphasizes:

1. **Modularity**: Clear separation between controllers, services, and data access
2. **Type Safety**: Full TypeScript implementation with strict mode
3. **Performance**: Optimized database queries, gzip compression, and efficient rendering
4. **Security**: API rate limiting, SQL injection protection, and proper error handling

## Backend Architecture

### Directory Structure
```
backend/
├── src/
│   ├── config/          # Configuration (database, environment)
│   ├── controllers/     # Request handlers (ticket.controller.ts, tag.controller.ts)
│   ├── services/        # Business logic (ticket.service.ts, tag.service.ts)
│   ├── routes/         # API route definitions
│   ├── middlewares/    # Express middleware (error handling, validation)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (logger, response helpers)
│   └── app.ts          # Application entry point
```

### Key Architectural Patterns

#### 1. Layered Architecture
- **Controllers**: Handle HTTP requests/responses, input validation
- **Services**: Contain business logic, database operations
- **Models/Entities**: TypeScript interfaces representing data structures

#### 2. Error Handling Strategy
- Centralized error middleware in `error.middleware.ts`
- Consistent error response format using `response.ts` utilities
- Request logging with structured logger

#### 3. Database Access
- MySQL with connection pooling
- Prepared statements for SQL injection protection
- Database configuration in `config/database.ts`

#### 4. Performance Optimizations
- gzip compression middleware
- API rate limiting (100 requests/15 minutes)
- Database indexing for common queries

### API Design
- RESTful endpoints under `/api/` prefix
- JSON request/response format
- Consistent error codes and messages
- Health check endpoint at `/api/health`

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── layout/    # Layout components (Header, Sidebar, Layout)
│   │   ├── ticket/    # Ticket-related components
│   │   ├── tag/       # Tag-related components
│   │   ├── search/    # Search and filter components
│   │   └── ui/        # Reusable UI components (Shadcn/ui based)
│   ├── services/      # API service layer
│   ├── store/         # Zustand state management
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── App.tsx        # Application root component
```

### Key Architectural Patterns

#### 1. Component Architecture
- **Container Components**: Manage state and business logic (TicketList, TicketForm)
- **Presentational Components**: Focus on UI rendering (TicketCard, Tag)
- **Layout Components**: Provide page structure (Layout, Header, Sidebar)

#### 2. State Management
- **Zustand stores**: Separate stores for tickets and tags
- **Local component state**: For form inputs, dialog visibility
- **URL state**: Search and filter parameters

#### 3. Data Flow
1. User interaction triggers state updates
2. Zustand store updates trigger component re-renders
3. API calls are made through service layer
4. Responses update store state
5. UI updates reflect new state

#### 4. Performance Optimizations
- **React.memo**: For expensive component rendering
- **useCallback/useMemo**: To prevent unnecessary re-renders
- **Debounced search**: 300ms delay to reduce API calls
- **Error boundaries**: Graceful error handling

### UI/UX Patterns
- **Shadcn/ui components**: Consistent, accessible UI components
- **Toast notifications**: For user feedback on actions
- **Confirm dialogs**: For destructive actions
- **Loading states**: Skeleton loaders and spinners
- **Responsive design**: Mobile-first approach with Tailwind CSS

## Database Architecture

### Schema Design
- **Tickets table**: Core ticket data with status tracking
- **Tags table**: Tag definitions with color coding
- **Ticket_Tags table**: Many-to-many relationship between tickets and tags

### Performance Considerations
- Indexes on frequently queried columns (status, created_at)
- Foreign key constraints for data integrity
- Connection pooling for efficient database access

## Configuration Management

### Backend Configuration
- Environment variables via `.env` file
- Database configuration with connection pooling
- CORS configuration for frontend integration

### Frontend Configuration
- Vite build configuration
- Tailwind CSS with custom design tokens
- API base URL configuration

## Build & Deployment

### Development Build
- Backend: TypeScript compilation with `tsc`
- Frontend: Vite development server with HMR

### Production Build
- Backend: Compiled JavaScript in `dist/` directory
- Frontend: Optimized static assets with code splitting

### Deployment Considerations
- Database migrations should be handled separately
- Environment-specific configuration
- Reverse proxy configuration for production

## Key Design Decisions

1. **Separate Backend/Frontend**: Allows independent scaling and deployment
2. **TypeScript Everywhere**: Ensures type safety across the entire stack
3. **MySQL over NoSQL**: Structured data with relationships benefits from SQL
4. **Zustand over Redux**: Simpler state management with less boilerplate
5. **Shadcn/ui over Material UI**: More control over styling and bundle size

## Extension Points

1. **Authentication**: JWT-based auth can be added to existing middleware
2. **File Uploads**: Can be added to ticket creation/editing
3. **Real-time Updates**: WebSocket integration for collaborative features
4. **Export Functionality**: CSV/PDF export of ticket data
5. **Advanced Analytics**: Dashboard with ticket metrics and trends
