# Testing Strategy - Bug Tracker Application

## Overview

This document outlines the comprehensive testing approach for the Bug Tracker application, a full-stack MERN (MongoDB, Express, React, Node.js) application with JWT authentication.

## Testing Pyramid

Our testing strategy follows the testing pyramid principle:

```
           /\
          /E2E\ (10%)
         /______\
        /        \
       /Integration\ (30%)
      /______________\
     /                \
    /   Unit Tests     \ (60%)
   /____________________\
```

### Distribution:
- **Unit Tests (60%)**: Test individual functions, components, and modules in isolation
- **Integration Tests (30%)**: Test API endpoints, database operations, and component interactions
- **E2E Tests (10%)**: Test complete user flows and critical paths

## Test Structure

### Backend Testing (`server/tests/`)

#### 1. Unit Tests (`server/tests/unit/`)

**Purpose**: Test individual functions, utilities, and middleware in isolation

**Test Files**:
- `apiResponse.test.js` - API response formatter utility tests
- `validateBug.test.js` - Bug validation utility tests
- `User.test.js` - User model methods and validation tests
- `authMiddleware.test.js` - Authentication middleware tests

**Coverage Goals**:
- Functions: ≥80%
- Statements: ≥80%
- Branches: ≥70%

**Example Test**:
```javascript
// User model password hashing test
it('should hash password on save', async () => {
  const plainPassword = 'password123';
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: plainPassword,
  });

  const userWithPassword = await User.findById(user._id).select('+password');
  expect(userWithPassword.password).not.toBe(plainPassword);
  expect(userWithPassword.password).toMatch(/^\$2[aby]\$\d{1,2}\$/);
});
```

#### 2. Integration Tests (`server/tests/integration/`)

**Purpose**: Test API endpoints with real database operations

**Test Files**:
- `bugRoutes.test.js` - Bug CRUD endpoints integration tests
- `authRoutes.test.js` - Authentication endpoints integration tests

**Test Database**: MongoDB Memory Server (in-memory database for fast, isolated tests)

**Coverage Goals**:
- API endpoints: 100%
- HTTP methods: All (GET, POST, PUT, PATCH, DELETE)
- Response codes: All expected codes (200, 201, 400, 401, 403, 404, 500)

**Example Test**:
```javascript
describe('POST /api/auth/login', () => {
  it('should login user with valid credentials', async () => {
    const credentials = {
      email: testUser.email,
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user.email).toBe(testUser.email);
  });
});
```

### Frontend Testing (`client/src/tests/`)

#### 1. Unit Tests (`client/src/tests/unit/`)

**Purpose**: Test React components, hooks, and utilities in isolation

**Test Files**:
- `components/Button.test.jsx` - Button component tests
- `components/Badge.test.jsx` - Badge component tests
- `hooks/useDebounce.test.js` - Custom hook tests
- `utils/formatters.test.js` - Utility function tests
- `utils/helpers.test.js` - Helper function tests

**Testing Library**: React Testing Library + Jest

**Best Practices**:
- Test user interactions, not implementation details
- Use screen queries (`getByRole`, `getByLabelText`, etc.)
- Mock external dependencies
- Test accessibility

**Example Test**:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. Integration Tests

**Purpose**: Test component interactions with APIs and state management

**Focus Areas**:
- AuthContext integration
- BugContext integration
- Form submissions with API calls
- Component state management

#### 3. E2E Tests (`client/cypress/e2e/`)

**Purpose**: Test complete user workflows from browser perspective

**Test Files**:
- `auth.cy.js` - Authentication flows (signup, login, logout)
- `bugCrud.cy.js` - Bug CRUD operations
- `navigation.cy.js` - Application navigation

**Tool**: Cypress

**Test Scenarios**:
1. **Authentication Flow**:
   - User signup with validation
   - User login with valid/invalid credentials
   - Protected route access
   - Session persistence
   - Logout

2. **Bug Management Flow**:
   - Create new bug
   - Edit existing bug
   - Delete bug with confirmation
   - Filter and search bugs
   - Drag-and-drop status change (if implemented)

3. **Navigation Flow**:
   - Navigate between routes
   - 404 handling
   - Breadcrumb navigation

**Example Cypress Test**:
```javascript
describe('Bug Creation Flow', () => {
  beforeEach(() => {
    cy.loginViaAPI('test@example.com', 'password123');
    cy.visit('/');
  });

  it('should create a new bug', () => {
    cy.createBug({
      title: 'Test Bug',
      description: 'This is a test bug',
      priority: 'high',
    });

    cy.contains('Test Bug').should('be.visible');
    cy.contains('Bug created successfully').should('be.visible');
  });
});
```

## Test Execution

### Running Tests

```bash
# Backend Tests
cd server

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose

# Frontend Tests
cd client

# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run cypress:open     # Interactive mode
npm run cypress:run      # Headless mode
```

### CI/CD Integration

Tests are automatically run on:
- Every commit (pre-commit hook)
- Pull request creation
- Merge to main branch

## Coverage Requirements

### Global Coverage Goals
- **Statements**: ≥70%
- **Branches**: ≥60%
- **Functions**: ≥70%
- **Lines**: ≥70%

### Critical Path Coverage
- Authentication routes: 100%
- Bug CRUD operations: 100%
- Error handling middleware: 100%
- Validation utilities: 100%

## Test Data Management

### Test Fixtures

**Backend** (`server/tests/fixtures/`):
- Sample bug data
- Sample user data
- Mock JWT tokens

**Frontend** (`client/cypress/fixtures/`):
- User credentials
- Bug test data
- API response mocks

### Database Seeding

For integration tests, we use:
- MongoDB Memory Server (in-memory database)
- Fresh database for each test file
- Cleanup between tests

## Mocking Strategy

### Backend
- **External APIs**: Mock with Jest
- **Database**: Use MongoDB Memory Server
- **Logger**: Mock to reduce test noise

### Frontend
- **API calls**: Mock with MSW (Mock Service Worker) or jest.mock()
- **Router**: Mock with react-router-dom test utilities
- **Context**: Provide test wrappers

## Continuous Improvement

### Code Review Checklist
- [ ] All new features have tests
- [ ] Tests cover happy path and edge cases
- [ ] Tests are readable and maintainable
- [ ] Coverage meets requirements
- [ ] No skipped or pending tests without justification

### Test Maintenance
- Review and update tests when requirements change
- Remove obsolete tests
- Refactor duplicate test code
- Keep test data realistic

## Common Testing Patterns

### 1. Arrange-Act-Assert (AAA)
```javascript
it('should do something', () => {
  // Arrange
  const input = 'test';

  // Act
  const result = functionUnderTest(input);

  // Assert
  expect(result).toBe('expected');
});
```

### 2. Given-When-Then (BDD)
```javascript
describe('User Login', () => {
  // Given
  beforeEach(() => {
    // Setup
  });

  it('should login successfully when credentials are valid', async () => {
    // When
    const response = await login(validCredentials);

    // Then
    expect(response.success).toBe(true);
  });
});
```

## Testing Tools

### Backend
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library
- **MongoDB Memory Server**: In-memory MongoDB
- **faker**: Generate test data

### Frontend
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **Cypress**: E2E testing
- **MSW**: API mocking

## Performance Testing

### Load Testing
- Use tools like Artillery or k6
- Test API endpoints under load
- Measure response times
- Identify bottlenecks

### Frontend Performance
- Lighthouse CI integration
- Measure Core Web Vitals
- Test component render performance

## Security Testing

### Backend
- Test authentication flows
- Test authorization rules
- Validate input sanitization
- Test rate limiting

### Frontend
- Test XSS prevention
- Test CSRF protection
- Validate form input
- Test secure data storage

## Troubleshooting Tests

### Common Issues

1. **Flaky Tests**:
   - Add proper waits for async operations
   - Use stable selectors
   - Avoid hardcoded delays

2. **Slow Tests**:
   - Mock external dependencies
   - Use test database
   - Run tests in parallel

3. **Test Isolation**:
   - Clean up after each test
   - Avoid shared state
   - Use fresh test data

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://testingjavascript.com/)

## Conclusion

This testing strategy ensures high quality, reliability, and maintainability of the Bug Tracker application. By following these guidelines, we can catch bugs early, refactor with confidence, and deliver a robust product to users.
