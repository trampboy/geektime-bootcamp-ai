# Development Commands

This document contains all development, build, test, and database commands for Project Alpha.

## Backend Commands

### Development
```bash
cd backend
yarn dev          # Start development server with nodemon
```

### Build & Production
```bash
cd backend
yarn build        # Compile TypeScript to JavaScript
yarn start        # Start production server
```

### Testing
```bash
cd backend
yarn test         # Run all tests
yarn test:watch   # Run tests in watch mode
yarn test:coverage # Run tests with coverage report
```

## Frontend Commands

### Development
```bash
cd frontend
yarn dev          # Start Vite development server
yarn preview      # Preview production build
```

### Build & Production
```bash
cd frontend
yarn build        # Build for production
```

### Testing
```bash
cd frontend
yarn test         # Run all tests
yarn test:ui      # Run tests with UI interface
yarn test:coverage # Run tests with coverage report
yarn test:watch   # Run tests in watch mode
```

### Linting
```bash
cd frontend
yarn lint         # Run ESLint
```

## Database Commands

### Initialization
```bash
# Create database and tables
mysql -u root -p < database/init.sql

# Import test data
mysql -u root -p ticket_manager < database/seed.sql
```

### Performance Analysis
```bash
# Run performance checks
mysql -u root -p ticket_manager < database/performance-check.sql
```

## Environment Setup

### Backend Environment Variables
Create `.env` file in `backend/` directory:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ticket_manager
DB_PORT=3306

PORT=3000
NODE_ENV=development

FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration
- API base URL is configured in `frontend/src/services/api.ts`
- Tailwind CSS configuration in `frontend/tailwind.config.js`
- Vite configuration in `frontend/vite.config.ts`

## Full Development Workflow

1. **Start database**: `mysql.server start`
2. **Initialize database**: `mysql -u root -p < database/init.sql`
3. **Start backend**: `cd backend && yarn dev`
4. **Start frontend**: `cd frontend && yarn dev`
5. **Access application**: http://localhost:5173

## Testing Workflow

### Backend Testing
- Tests are in `backend/src/__tests__/`
- Integration tests in `api.integration.test.ts`
- Unit tests organized by module (controllers, services, utils)
- Uses Jest + Supertest for API testing

### Frontend Testing
- Tests are in `frontend/src/__tests__/`
- Component tests use React Testing Library
- Service tests for API integration
- Uses Vitest + Testing Library

## Common Issues & Solutions

### Database Connection Issues
- Verify MySQL is running: `mysql.server status`
- Check `.env` file configuration
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Conflicts
- Backend default: 3000
- Frontend default: 5173
- Update ports in `.env` or `vite.config.ts` if needed

### TypeScript Errors
- Run `yarn build` in backend to check compilation
- Run `yarn lint` in frontend to check code quality
