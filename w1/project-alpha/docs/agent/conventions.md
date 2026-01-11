# Conventions

This document describes the coding conventions, naming patterns, and organizational rules specific to Project Alpha.

## TypeScript Conventions

### Strict Mode
- All TypeScript files use strict mode
- No implicit `any` types allowed
- Strict null checks enabled

### Type Definitions
- Types are defined in `types/` directories
- Use `interface` for object shapes
- Use `type` for unions, intersections, and aliases
- Export types from `types/index.ts`

```typescript
// Example type definition
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}
```

### Import Organization
1. External dependencies (React, Express, etc.)
2. Internal modules (relative imports)
3. Type imports
4. Style imports (CSS, etc.)

```typescript
// Example import order
import React from 'react';
import { useTicketStore } from '../store/ticket.store';
import { Ticket } from '../types';
import './TicketCard.css';
```

## Naming Conventions

### Files and Directories
- **kebab-case** for directory names: `ticket-form`, `error-boundary`
- **PascalCase** for React components: `TicketCard.tsx`, `TagForm.tsx`
- **camelCase** for utility files: `format.ts`, `cn.ts`
- **kebab-case** for test files: `ticket.service.test.ts`

### Variables and Functions
- **camelCase** for variables and functions: `getTickets`, `formatDate`
- **UPPER_SNAKE_CASE** for constants: `API_BASE_URL`, `MAX_ITEMS`
- **PascalCase** for classes and React components

### Database Entities
- **snake_case** for database columns: `created_at`, `ticket_id`
- **PascalCase** for TypeScript interfaces mapping to tables

## Component Conventions

### React Component Structure
1. Import statements
2. Type definitions (if needed)
3. Component function
4. Internal state and hooks
5. Event handlers
6. JSX return

```typescript
// Example component structure
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
}

export function TicketCard({ ticket, onEdit }: TicketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="ticket-card">
      {/* JSX content */}
    </div>
  );
}
```

### Prop Naming
- Use descriptive prop names: `onSubmit`, `isLoading`, `initialValue`
- Boolean props should start with `is`, `has`, or `should`: `isOpen`, `hasError`
- Event handlers should start with `on`: `onClick`, `onChange`

## State Management Conventions

### Zustand Store Patterns
- Store files named `*.store.tsx`
- Use `create` function from Zustand
- Define state, actions, and selectors
- Use TypeScript for type safety

```typescript
// Example store pattern
import { create } from 'zustand';
import { Ticket } from '../types';

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  fetchTickets: () => Promise<void>;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: number, updates: Partial<Ticket>) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  loading: false,
  fetchTickets: async () => {
    set({ loading: true });
    // API call
    set({ loading: false, tickets: data });
  },
  // ... other actions
}));
```

## API Conventions

### Backend API Patterns
- RESTful endpoints with consistent naming
- Use HTTP methods appropriately: GET, POST, PUT, PATCH, DELETE
- Return consistent response format

```typescript
// Example controller pattern
export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketService.getAllTickets();
    successResponse(res, tickets);
  } catch (error) {
    errorResponse(res, error);
  }
};
```

### Response Format
- Success responses use `successResponse` utility
- Error responses use `errorResponse` utility
- Include status codes and meaningful messages

## Styling Conventions

### Tailwind CSS
- Use utility classes directly in JSX
- Extract repeated patterns to CSS variables when needed
- Follow mobile-first responsive design

### Component Styling
- Use `cn` utility for conditional class names
- Extract complex styles to separate CSS files if needed
- Follow BEM-like naming for custom CSS

```typescript
// Example styling with cn utility
import { cn } from '../utils/cn';

function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        'base-button',
        variant === 'primary' && 'primary-button',
        variant === 'secondary' && 'secondary-button',
        className
      )}
      {...props}
    />
  );
}
```

## Error Handling Conventions

### Backend Error Handling
- Use centralized error middleware
- Log errors with context
- Return user-friendly error messages
- Don't expose stack traces in production

### Frontend Error Handling
- Use error boundaries for component errors
- Show user-friendly error messages
- Provide recovery options when possible
- Log errors for debugging

## Testing Conventions

### Test File Organization
- Test files colocated with source files or in `__tests__/`
- Use `.test.ts` or `.test.tsx` extension
- Group related tests in describe blocks

### Test Naming
- Describe what is being tested
- Use "should" pattern: `should render ticket title`
- Be specific about expected behavior

## Documentation Conventions

### Code Comments
- Use JSDoc for public APIs
- Comment complex logic, not obvious code
- Keep comments up to date with code changes

### README and Documentation
- Keep documentation in `docs/` directory
- Update documentation when making significant changes
- Include examples for complex features

## Git Conventions

### Commit Messages
- Use conventional commit format
- Start with type: `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- Be descriptive but concise

### Branch Naming
- Feature branches: `feature/ticket-export`
- Bug fix branches: `fix/login-error`
- Documentation branches: `docs/api-update`

## Performance Conventions

### Backend Performance
- Use database indexes for frequent queries
- Implement caching where appropriate
- Use connection pooling
- Monitor and optimize slow queries

### Frontend Performance
- Use React.memo for expensive components
- Implement virtualization for long lists
- Lazy load non-critical components
- Optimize bundle size with code splitting

## Security Conventions

### Input Validation
- Validate all user input
- Use prepared statements for SQL queries
- Sanitize output to prevent XSS

### Authentication & Authorization
- Implement proper authentication (when added)
- Use environment variables for secrets
- Follow least privilege principle

## File Organization Rules

### Backend File Structure
- One class/function per file (when appropriate)
- Group related functionality in directories
- Keep files focused and manageable

### Frontend File Structure
- One component per file (except for small, related components)
- Group by feature, not by type
- Keep imports clean and organized

## Development Workflow

### Local Development
1. Start database
2. Start backend server
3. Start frontend server
4. Run tests before committing

### Code Review
1. Self-review before submitting
2. Check for TypeScript errors
3. Verify tests pass
4. Ensure documentation is updated
