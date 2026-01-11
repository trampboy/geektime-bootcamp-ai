# AGENTS.md

This file provides guidance to neovate when working with code in this repository.

## WHY: Purpose and Goals

Project Alpha is a production-ready ticket management system with tag-based organization. It provides complete CRUD operations for tickets, flexible tag categorization, and efficient search/filtering capabilities. The system emphasizes performance, security, and modern UI design.

## WHAT: Technical Stack

- **Backend**: Node.js + Express.js with TypeScript, MySQL database, Jest for testing
- **Frontend**: React + TypeScript with Vite, Tailwind CSS, Shadcn/ui components, Zustand state management
- **Key Dependencies**: MySQL2, compression, rate limiting, Axios, Radix UI primitives
- **Testing**: Jest (backend), Vitest (frontend), Supertest for API testing

## HOW: Core Development Workflow

```bash
# Backend development
cd backend && yarn dev

# Frontend development  
cd frontend && yarn dev

# Backend testing
cd backend && yarn test

# Frontend testing
cd frontend && yarn test
```

## Progressive Disclosure

For detailed information, consult these documents as needed:

- `docs/agent/development_commands.md` - All build, test, lint, and database commands
- `docs/agent/architecture.md` - Project structure and architectural patterns
- `docs/agent/testing.md` - Test setup, frameworks, and conventions

**When working on a task, first determine which documentation is relevant, then read only those files.**
