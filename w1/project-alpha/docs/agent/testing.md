# Testing

This document describes the testing setup, frameworks, and conventions for Project Alpha.

## Testing Philosophy

Project Alpha emphasizes comprehensive testing with:
- **Integration tests** for API endpoints
- **Unit tests** for business logic and utilities
- **Component tests** for UI interactions
- **Test coverage** reporting for quality assurance

## Backend Testing

### Test Framework
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for API testing
- **ts-jest**: TypeScript support for Jest

### Test Structure
```
backend/src/__tests__/
├── api.integration.test.ts     # Full API integration tests
├── controllers/                # Controller unit tests
│   └── ticket.controller.test.ts
├── services/                   # Service unit tests
│   ├── ticket.service.test.ts
│   └── tag.service.test.ts
├── middlewares/                # Middleware tests
│   └── error.middleware.test.ts
└── utils/                      # Utility tests
    ├── logger.test.ts
    └── response.test.ts
```

### Running Backend Tests

```bash
cd backend

# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
```

### Test Configuration
- **Jest config**: `backend/jest.config.js`
- **Setup file**: `backend/jest.setup.js`
- **Test environment**: Node.js with isolated database

### Backend Test Patterns

#### API Integration Tests
- Test full request/response cycle
- Mock database where appropriate
- Test error scenarios and edge cases

```typescript
// Example API test pattern
describe('GET /api/tickets', () => {
  it('should return all tickets', async () => {
    const response = await request(app).get('/api/tickets');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

#### Service Unit Tests
- Test business logic in isolation
- Mock database dependencies
- Test validation and error handling

#### Middleware Tests
- Test error handling middleware
- Test request validation
- Test authentication (if implemented)

## Frontend Testing

### Test Framework
- **Vitest**: Test runner with Vite integration
- **React Testing Library**: Component testing utilities
- **jsdom**: Simulated browser environment

### Test Structure
```
frontend/src/__tests__/
├── components/                # Component tests
│   ├── ticket/
│   │   └── TicketCard.test.tsx
│   └── tag/
│       └── Tag.test.tsx
├── hooks/                    # Custom hook tests
│   └── useDebounce.test.tsx
├── services/                 # Service tests
│   ├── ticket.service.test.ts
│   └── tag.service.test.ts
├── utils/                    # Utility tests
│   ├── cn.test.ts
│   └── format.test.ts
└── setup.ts                  # Test setup configuration
```

### Running Frontend Tests

```bash
cd frontend

# Run all tests
yarn test

# Run tests with UI interface
yarn test:ui

# Generate coverage report
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

### Test Configuration
- **Vitest config**: `frontend/vitest.config.ts`
- **Setup file**: `frontend/src/__tests__/setup.ts`
- **Test environment**: jsdom with React Testing Library

### Frontend Test Patterns

#### Component Tests
- Test user interactions and UI behavior
- Mock API calls and external dependencies
- Test component states and props

```typescript
// Example component test pattern
describe('TicketCard', () => {
  it('should display ticket title', () => {
    const ticket = { id: 1, title: 'Test Ticket', status: 'pending' };
    render(<TicketCard ticket={ticket} />);
    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
  });
});
```

#### Hook Tests
- Test custom React hooks
- Test state updates and side effects
- Use `renderHook` from Testing Library

#### Service Tests
- Test API service functions
- Mock HTTP requests with Vitest
- Test error handling and loading states

## Test Data & Mocking

### Backend Mocking Strategy
- **Database mocking**: Mock MySQL connections for unit tests
- **Environment mocking**: Mock environment variables
- **Request/Response mocking**: Mock Express request/response objects

### Frontend Mocking Strategy
- **API mocking**: Mock Axios requests with Vitest
- **Store mocking**: Mock Zustand stores for isolated testing
- **Component mocking**: Mock child components when needed

### Test Data Management
- Use factory functions to create test data
- Keep test data consistent across tests
- Clean up test data after each test

## Coverage Requirements

### Backend Coverage Goals
- **API endpoints**: 100% coverage
- **Business logic**: 90%+ coverage
- **Error handling**: 100% coverage
- **Utilities**: 80%+ coverage

### Frontend Coverage Goals
- **Components**: 80%+ coverage for critical paths
- **Hooks**: 90%+ coverage
- **Services**: 90%+ coverage
- **Utilities**: 80%+ coverage

## Test Conventions

### Naming Conventions
- Test files: `*.test.ts` or `*.test.tsx`
- Describe blocks: Describe the component/function being tested
- It blocks: Describe the expected behavior

### Organization
- Group related tests in describe blocks
- Use beforeEach/afterEach for setup/teardown
- Keep tests focused and independent

### Best Practices
1. **Arrange-Act-Assert**: Clear test structure
2. **Minimal mocking**: Only mock what's necessary
3. **Meaningful assertions**: Test behavior, not implementation
4. **Clean test data**: Reset state between tests
5. **Readable test names**: Describe what the test verifies

## Common Test Scenarios

### Backend Test Scenarios
1. **Happy path**: Successful API requests
2. **Error handling**: Invalid inputs, missing data
3. **Edge cases**: Empty results, pagination limits
4. **Validation**: Request body validation
5. **Security**: Rate limiting, SQL injection prevention

### Frontend Test Scenarios
1. **User interactions**: Clicks, form submissions, filtering
2. **API integration**: Loading states, error handling
3. **State management**: Store updates, derived state
4. **UI behavior**: Conditional rendering, responsive design
5. **Accessibility**: Keyboard navigation, screen reader support

## Debugging Tests

### Backend Test Debugging
- Use `console.log` in test files
- Check Jest output for detailed error messages
- Run single test files: `yarn test path/to/test.file.ts`

### Frontend Test Debugging
- Use Vitest UI for interactive debugging
- Check component rendering with `screen.debug()`
- Use `--reporter=verbose` for detailed output

## Continuous Integration

### Test Execution in CI
- Run backend tests before frontend tests
- Generate coverage reports
- Fail build on test failures
- Cache dependencies for faster runs

### Quality Gates
- Minimum test coverage thresholds
- No skipped or disabled tests
- All tests must pass before deployment
