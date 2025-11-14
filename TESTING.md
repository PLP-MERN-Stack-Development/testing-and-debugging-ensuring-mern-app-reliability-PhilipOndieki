# Testing Documentation - MERN Bug Tracker

## Table of Contents
1. [Testing Strategy Overview](#testing-strategy-overview)
2. [Tools and Frameworks](#tools-and-frameworks)
3. [Running Tests Locally](#running-tests-locally)
4. [Writing New Tests](#writing-new-tests)
5. [Debugging Guide](#debugging-guide)
6. [Drag-and-Drop Bug Resolution](#drag-and-drop-bug-resolution)
7. [Coverage Requirements](#coverage-requirements)
8. [CI/CD Integration](#cicd-integration)

---

## Testing Strategy Overview

This project follows a comprehensive testing pyramid approach to ensure >80% code coverage on both server and client sides:

```
          /\
         /E2E\           10-20% (End-to-End Tests)
        /------\
       /        \
      /Integration\ 30-40% (API + Component Integration)
     /------------\
    /              \
   /  Unit Tests    \    40-50% (Functions, Components, Hooks)
  /------------------\
```

### Testing Principles

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how it does it
2. **AAA Pattern** - Arrange, Act, Assert structure for all tests
3. **Isolation** - Each test should be independent and not rely on others
4. **Fast Feedback** - Unit tests should run in <100ms each
5. **Comprehensive Coverage** - Aim for 80%+ coverage with meaningful tests

### Coverage Goals

- **Global Target**: 80% coverage (lines, statements, functions, branches)
- **Critical Paths**: 90% coverage (services, business logic)
- **UI Components**: 85% coverage (including user interactions)

---

## Tools and Frameworks

### Server-Side Testing Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Jest | 30.2.0 | Test runner and assertion library |
| Supertest | 7.1.4 | HTTP integration testing |
| MongoDB Memory Server | 10.3.0 | In-memory database for isolated tests |
| @faker-js/faker | Latest | Test data generation |
| cross-env | Latest | Cross-platform environment variables |

### Client-Side Testing Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Jest | 29.7.0 | Test runner and assertion library |
| @testing-library/react | 14.1.2 | React component testing utilities |
| @testing-library/jest-dom | 6.1.5 | Custom Jest matchers for DOM |
| @testing-library/user-event | 14.5.1 | User interaction simulation |
| MSW (Mock Service Worker) | Latest | API mocking for integration tests |
| @faker-js/faker | Latest | Test data generation |

### E2E Testing Stack

| Tool | Purpose |
|------|---------|
| Cypress | End-to-end browser testing |
| @testing-library/cypress | Cypress testing utilities |

---

## Running Tests Locally

### Prerequisites

1. Node.js 18+ installed
2. MongoDB (for integration tests with real database)
3. All dependencies installed: `npm install` in both server and client directories

### Server Tests

```bash
# Navigate to server directory
cd server

# Run all tests with coverage
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode (re-runs on file changes)
npm run test:watch

# Verbose output with full details
npm run test:verbose
```

### Client Tests

```bash
# Navigate to client directory
cd client

# Run all tests with coverage
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode
npm run test:watch
```

### End-to-End Tests

```bash
# Navigate to client directory
cd client

# Run Cypress in headless mode
npm run test:e2e

# Open Cypress Test Runner (interactive)
npm run cypress:open
```

### Run All Tests

From the root directory:

```bash
# Run both server and client tests
npm test
```

### Viewing Coverage Reports

After running tests with coverage:

```bash
# Server coverage report
open server/coverage/lcov-report/index.html

# Client coverage report
open client/coverage/lcov-report/index.html
```

### Troubleshooting Common Issues

#### Issue: "Jest command not found"

**Solution**: Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

#### Issue: "MongoDB Memory Server download timeout"

**Solution**: Increase timeout or download manually
```bash
# In test file, increase timeout
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
}, 60000); // 60 second timeout
```

#### Issue: "Port already in use" during integration tests

**Solution**: The tests use ephemeral ports, but if issues persist:
```bash
# Kill processes on port 3000 (example)
lsof -ti:3000 | xargs kill -9
```

#### Issue: "React/JSX syntax error" in client tests

**Solution**: Ensure Babel is configured correctly
```bash
# Check babel.config.cjs exists in client directory
# Should include @babel/preset-react
```

---

## Writing New Tests

### Unit Test Structure (Given-When-Then Pattern)

```javascript
describe('Feature or Component Name', () => {
  // Setup
  beforeEach(() => {
    // Arrange - Set up test data and mocks
  });

  // Cleanup
  afterEach(() => {
    // Clean up mocks and state
  });

  describe('Specific Functionality', () => {
    it('should [expected behavior] when [condition]', () => {
      // GIVEN (Arrange) - Set up test data
      const input = { /* test data */ };

      // WHEN (Act) - Execute the code under test
      const result = functionUnderTest(input);

      // THEN (Assert) - Verify the outcome
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Server-Side Unit Test Example

```javascript
// tests/unit/utils/validateBug.test.js
const { validateTitle } = require('../../src/utils/validateBug');

describe('validateTitle', () => {
  it('should return valid for a proper title', () => {
    // Given
    const title = 'Valid Bug Title';

    // When
    const result = validateTitle(title);

    // Then
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should return invalid for title that is too short', () => {
    // Given
    const shortTitle = 'AB';

    // When
    const result = validateTitle(shortTitle);

    // Then
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('at least 3 characters');
  });
});
```

### Server-Side Integration Test Example

```javascript
// tests/integration/bugRoutes.test.js
const request = require('supertest');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');

describe('POST /api/bugs', () => {
  it('should create a new bug with valid data', async () => {
    // Given
    const bugData = {
      title: 'Test Bug',
      description: 'Test bug description',
      priority: 'high',
      severity: 'major',
      createdBy: 'Test User',
    };

    // When
    const res = await request(app)
      .post('/api/bugs')
      .send(bugData);

    // Then
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(bugData.title);

    // Verify database state
    const savedBug = await Bug.findById(res.body.data._id);
    expect(savedBug).toBeDefined();
  });
});
```

### Client-Side Component Test Example

```javascript
// tests/unit/components/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../components/common/Button';

describe('Button Component', () => {
  it('should call onClick when clicked', () => {
    // Given
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    // When
    fireEvent.click(screen.getByText('Click Me'));

    // Then
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    // Given & When
    render(<Button disabled>Disabled Button</Button>);

    // Then
    expect(screen.getByText('Disabled Button')).toBeDisabled();
  });
});
```

### Client-Side Hook Test Example

```javascript
// tests/unit/hooks/useBugs.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBugs } from '../../../hooks/useBugs';

describe('useBugs Hook', () => {
  it('should fetch bugs successfully', async () => {
    // Given
    const mockBugs = [{ _id: '1', title: 'Bug 1' }];
    bugService.getAllBugs.mockResolvedValue({ data: { data: mockBugs } });

    // When
    const { result } = renderHook(() => useBugs(), { wrapper });
    await act(async () => {
      await result.current.fetchBugs();
    });

    // Then
    await waitFor(() => {
      expect(result.current.bugs).toEqual(mockBugs);
      expect(result.current.loading).toBe(false);
    });
  });
});
```

### Integration Test with MSW Example

```javascript
// tests/integration/BugBoard.test.jsx
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import BugBoard from '../../../components/bugs/BugBoard';

const server = setupServer(
  rest.get('/api/bugs', (req, res, ctx) => {
    return res(ctx.json({ data: mockBugs }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('BugBoard Integration', () => {
  it('should fetch and display bugs', async () => {
    // When
    render(<BugBoard />);

    // Then
    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
    });
  });
});
```

### E2E Test Example (Cypress)

```javascript
// cypress/e2e/dragAndDrop.cy.js
describe('Drag and Drop Functionality', () => {
  beforeEach(() => {
    cy.login(); // Custom command
    cy.visit('/board');
  });

  it('should move card from Open to Resolved and persist', () => {
    // Given - Verify card exists in Open column
    cy.get('[data-testid="open-column"]')
      .find('[data-testid="card-123"]')
      .should('exist');

    // When - Drag card to Resolved column
    cy.get('[data-testid="card-123"]')
      .drag('[data-testid="resolved-column"]');

    // Then - Verify card appears in Resolved column
    cy.get('[data-testid="resolved-column"]')
      .find('[data-testid="card-123"]')
      .should('exist');

    // And - Verify persistence after refresh
    cy.reload();
    cy.get('[data-testid="resolved-column"]')
      .find('[data-testid="card-123"]')
      .should('exist');
  });
});
```

### Best Practices

1. **One Assertion Per Test** (generally) - Makes failures easier to diagnose
2. **Use Descriptive Test Names** - `should [behavior] when [condition]`
3. **Mock External Dependencies** - Database calls, API requests, third-party services
4. **Test Edge Cases** - Empty arrays, null values, error conditions
5. **Avoid Testing Implementation Details** - Test public API, not internal state
6. **Use Test Data Builders** - Create reusable factory functions for test data

```javascript
// Good: Test builder pattern
const createMockBug = (overrides = {}) => ({
  _id: '123',
  title: 'Test Bug',
  description: 'Test description',
  priority: 'medium',
  severity: 'major',
  status: 'open',
  createdBy: 'Test User',
  ...overrides,
});

// Usage
const highPriorityBug = createMockBug({ priority: 'high' });
```

---

## Debugging Guide

### Step-by-Step Debugging Process

This debugging workflow was used successfully to identify and fix the drag-and-drop state persistence bug.

#### Phase 1: Reproduce and Document

1. **Record exact steps to reproduce the bug**
   ```
   1. User logs in
   2. Navigates to bug board
   3. Drags a card from "Open" to "Resolved"
   4. Card visually moves during drag
   5. On drop, card snaps back to original position
   6. Refresh page - card still in "Open" column
   ```

2. **Test in different browsers**
   - Chrome: Bug present ✓
   - Firefox: Bug present ✓
   - Safari: Bug present ✓
   - Conclusion: Not browser-specific

3. **Check browser console for errors**
   ```bash
   # Open DevTools -> Console
   # Look for JavaScript errors during drag operation
   ```

4. **Verify network requests**
   ```bash
   # Open DevTools -> Network tab
   # Filter: XHR/Fetch
   # Perform drag-and-drop
   # Check if API call is made
   ```

#### Phase 2: Frontend Investigation

Add strategic logging to understand the data flow:

```javascript
// client/src/components/bugs/BugBoard.jsx
const handleDragEnd = useCallback(
  async (event) => {
    const { active, over } = event;

    console.log('🎯 DROP EVENT TRIGGERED', {
      bugId: active.id,
      targetColumn: over.id,
      timestamp: new Date().toISOString()
    });

    // Check state before update
    console.log('📦 State before update:', bugs);

    // ... rest of handler
  },
  [bugs, updateBug]  // ❌ ISSUE: Using updateBug instead of patchBug
);
```

**Checklist for Frontend:**
- ✅ Drag event listeners properly attached
- ✅ onDragEnd callback is firing
- ✅ State update is dispatched
- ❌ **ISSUE FOUND**: Using `updateBug` (PUT) instead of `patchBug` (PATCH)

#### Phase 3: Backend Investigation

Add logging to track request processing:

```javascript
// server/src/controllers/bugController.js
const updateBug = async (req, res, next) => {
  console.log('🔄 UPDATE BUG REQUEST', {
    bugId: req.params.id,
    body: req.body,
    method: req.method, // PUT
    timestamp: new Date().toISOString()
  });

  // ... rest of handler
};
```

**Checklist for Backend:**
- ✅ API endpoint route is correct
- ✅ Middleware isn't blocking request
- ✅ Database query executes successfully
- ❌ **VALIDATION ERROR**: PUT requires all fields, only receiving status

#### Phase 4: Network Layer Investigation

Using Chrome DevTools:

```
1. Network Tab -> XHR/Fetch
2. Perform drag-and-drop
3. Find PUT request to /api/bugs/:id
4. Check request payload: { status: "resolved" }
5. Check response status: 400 (Validation Error)
6. Response body: "Missing required fields: title, description, priority, severity"
```

**Root Cause Identified:**
- Frontend calls `updateBug` → Uses PUT method
- PUT endpoint expects complete bug object
- Only sending `{ status: "resolved" }`
- Validation fails → Update rejected

#### Phase 5: Solution Implementation

**The Fix:**

```javascript
// client/src/components/bugs/BugBoard.jsx

// BEFORE (Bug):
const handleDragEnd = useCallback(
  async (event) => {
    // ...
    await updateBug(bugId, { status: newStatus }); // ❌ Uses PUT
  },
  [bugs, updateBug]
);

// AFTER (Fixed):
const handleDragEnd = useCallback(
  async (event) => {
    // ...
    await patchBug(bugId, { status: newStatus }); // ✅ Uses PATCH
  },
  [bugs, patchBug]
);
```

**Why This Works:**
- `patchBug` uses PATCH method (partial update)
- PATCH endpoint only requires status field
- Validation passes
- Database updates successfully
- State persists correctly

#### Phase 6: Add Error Boundaries

```javascript
// client/src/components/error/ErrorBoundary.jsx
class DragDropErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('🚨 Drag-Drop Error:', error, errorInfo);
    // Log to error tracking service (Sentry, LogRocket)
  }

  render() {
    if (this.state.hasError) {
      return <div>Drag-and-drop error. Please refresh.</div>;
    }
    return this.props.children;
  }
}
```

#### Phase 7: Enhanced Error Handling

```javascript
// client/src/hooks/useBugs.js
export const patchBug = useCallback(async (id, bugData) => {
  try {
    const response = await bugService.patchBug(id, bugData);
    dispatch({ type: ACTIONS.UPDATE_BUG, payload: response.data.data });
    toast.success('Bug updated successfully');
    return response.data.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update bug';
    console.error('❌ Patch bug error:', {
      bugId: id,
      data: bugData,
      error: errorMessage,
      stack: error.stack
    });
    toast.error(errorMessage);
    throw error;
  }
}, [dispatch]);
```

#### Phase 8: Debugging Tools Used

1. **Redux DevTools** - Track state changes
2. **React DevTools** - Inspect component tree
3. **Chrome Network Tab** - Monitor API calls
4. **Console Logging** - Strategic debug points
5. **Jest Tests** - Verify fix doesn't break existing functionality

### Common Debugging Patterns

#### Pattern 1: "Works in Dev, Fails in Production"

```javascript
// Check environment-specific configuration
console.log('Environment:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);
```

#### Pattern 2: "Intermittent Failures"

```javascript
// Add timing logs to detect race conditions
console.time('bugUpdate');
await patchBug(id, data);
console.timeEnd('bugUpdate');
```

#### Pattern 3: "State Not Updating"

```javascript
// Use useEffect to track state changes
useEffect(() => {
  console.log('Bugs state changed:', bugs);
}, [bugs]);
```

### Professional Debugging Tips from 5+ Years Experience

1. **Use debugger statements** - More powerful than console.log
   ```javascript
   debugger; // Execution pauses here in DevTools
   ```

2. **Read error messages carefully** - They often tell you exactly what's wrong

3. **Test in isolation first** - Narrow down the problem area

4. **Leverage browser DevTools** - Network, Console, React DevTools are essential

5. **Document your debugging process** - Helps others and future you

6. **Don't assume** - Verify your assumptions with logging/testing

7. **Use git bisect** - Find which commit introduced a bug
   ```bash
   git bisect start
   git bisect bad HEAD
   git bisect good v1.0.0
   ```

8. **Rubber duck debugging** - Explain the problem out loud

---

## Drag-and-Drop Bug Resolution

### Problem Statement

**Observed Behavior:**
When a bug card was dragged from one column (e.g., "Open") to another (e.g., "Resolved"), the card would:
1. Visually move during the drag operation
2. Snap back to its original position on drop
3. Not persist in the new column after page refresh
4. Show no error messages to the user

**Expected Behavior:**
The card should:
1. Move smoothly during drag operation
2. Immediately persist in the new column upon drop
3. Update the backend state via API call
4. Reflect the change on page refresh or re-render
5. Show appropriate success/error feedback

### Root Cause Analysis

After systematic debugging using the process outlined above, the root cause was identified:

**Technical Details:**
1. **Frontend Issue**: `BugBoard.jsx` line 226 was calling `updateBug(bugId, { status: newStatus })`
2. **Service Method**: `updateBug` uses `PUT` request to `/api/bugs/:id`
3. **Backend Validation**: The PUT endpoint requires ALL bug fields (title, description, priority, severity, createdBy)
4. **Partial Data**: Only `{ status: newStatus }` was being sent
5. **Validation Failure**: Express-validator rejected the request (400 status)
6. **Silent Failure**: No error was displayed to the user, card just snapped back

**Why It Happened:**
- Confusion between full update (PUT) and partial update (PATCH) semantics
- The `useBugs` hook has both `updateBug` and `patchBug` methods
- The drag-and-drop handler was using the wrong method for a status-only update

### Solution Implemented

**Files Changed:**

1. **client/src/components/bugs/BugBoard.jsx** (Lines 31-42, 172-192, 204-236)

```javascript
// CHANGE 1: Import patchBug from useBugs hook
const {
  bugs,
  loading,
  filters,
  fetchBugs,
  createBug,
  updateBug,
  patchBug,  // ✅ Added
  deleteBug,
  setFilters,
  clearFilters,
} = useBugs();

// CHANGE 2: Use patchBug for mobile status changes
const handleMobileStatusChange = useCallback(
  async (newStatus) => {
    if (!bugForStatusChange) return;
    const bugId = bugForStatusChange._id || bugForStatusChange.id;

    try {
      await patchBug(bugId, { status: newStatus }); // ✅ Changed from updateBug
      toast.success(`Bug moved to ${newStatus.replace('-', ' ')}`);
      setIsMobileStatusOpen(false);
      setBugForStatusChange(null);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update bug status');
    }
  },
  [bugForStatusChange, patchBug]  // ✅ Changed dependency
);

// CHANGE 3: Use patchBug for drag-and-drop status changes
const handleDragEnd = useCallback(
  async (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const bugId = active.id;
    const newStatus = over.id;
    const bug = bugs.find((b) => (b._id || b.id) === bugId);

    if (!bug) return;
    if (bug.status === newStatus) return;

    try {
      await patchBug(bugId, { status: newStatus }); // ✅ Changed from updateBug
      toast.success(`Bug moved to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update bug status');
    }
  },
  [bugs, patchBug]  // ✅ Changed dependency
);
```

**API Comparison:**

| Method | HTTP Verb | Endpoint | Required Fields | Use Case |
|--------|-----------|----------|-----------------|----------|
| `updateBug` | PUT | `/api/bugs/:id` | ALL fields (title, description, priority, severity, status, createdBy) | Full bug update (edit form) |
| `patchBug` | PATCH | `/api/bugs/:id` | ONLY status | Status change (drag-and-drop) |

### Tests Added to Prevent Regression

1. **Unit Test**: `client/src/tests/unit/hooks/useBugs.test.js`
   ```javascript
   describe('patchBug', () => {
     it('should patch a bug status successfully', async () => {
       // Test ensures patchBug works for status-only updates
     });
   });
   ```

2. **Integration Test**: `server/tests/integration/bugRoutes.test.js`
   ```javascript
   describe('PATCH /api/bugs/:id', () => {
     it('should update bug status', async () => {
       // Verifies PATCH endpoint accepts partial data
     });
   });
   ```

3. **E2E Test**: `client/cypress/e2e/dragAndDrop.cy.js`
   ```javascript
   it('should move card from Open to Resolved and persist', () => {
     // Full user flow test including persistence
   });
   ```

### Verification Steps

✅ **1. Manual Testing**
```
1. Start server: cd server && npm start
2. Start client: cd client && npm run dev
3. Navigate to bug board
4. Drag card from "Open" to "Resolved"
5. Verify card stays in "Resolved" column
6. Refresh page
7. Verify card still in "Resolved" column
```

✅ **2. Check Network Request**
```
Open DevTools → Network → XHR/Fetch
Drag card
Verify: PATCH request to /api/bugs/:id
Verify: Status code 200
Verify: Response contains updated bug with new status
```

✅ **3. Check Database State**
```bash
# Connect to MongoDB
mongo

# Query the bug
db.bugs.findOne({ _id: ObjectId("...") })

# Verify status field is updated
```

✅ **4. Run Automated Tests**
```bash
npm test  # All tests should pass
```

### Impact and Benefits

**Before Fix:**
- ❌ Drag-and-drop feature unusable
- ❌ Poor user experience (no feedback)
- ❌ Users manually editing bugs instead
- ❌ Increased support tickets

**After Fix:**
- ✅ Drag-and-drop works reliably
- ✅ Immediate visual feedback
- ✅ Changes persist correctly
- ✅ Improved user workflow efficiency
- ✅ Comprehensive test coverage prevents regression

### Lessons Learned

1. **Use Proper HTTP Methods**: Understand the difference between PUT (full update) and PATCH (partial update)
2. **Add Comprehensive Logging**: Strategic console.logs made debugging much faster
3. **Test Error Scenarios**: Validation errors should show user-friendly messages
4. **Monitor Network Traffic**: DevTools Network tab is invaluable for debugging API issues
5. **Write Tests First**: TDD would have caught this bug before it reached production

---

## Coverage Requirements

### Minimum Thresholds

The project enforces minimum 80% coverage across all metrics:

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
```

### Coverage Reports

After running tests, coverage reports are generated in multiple formats:

1. **Terminal Summary** - Immediate feedback
2. **HTML Report** - Interactive browser-based view
   - Server: `coverage/server/lcov-report/index.html`
   - Client: `coverage/client/lcov-report/index.html`
3. **LCOV Format** - For CI/CD integration
4. **Clover Format** - For additional tooling

### Interpreting Coverage Metrics

**Lines Coverage**: Percentage of code lines executed during tests
```javascript
function calculateTotal(a, b) {
  return a + b; // ✅ Covered if test calls this function
}
```

**Statements Coverage**: Percentage of statements executed
```javascript
const total = calculateTotal(1, 2); // ✅ Covered
console.log(total);                  // ❌ Not covered if test doesn't reach here
```

**Branches Coverage**: Percentage of conditional branches executed
```javascript
function isAdult(age) {
  if (age >= 18) {     // ✅ Need tests for both true and false
    return true;       // ✅ Branch 1
  }
  return false;        // ✅ Branch 2
}
```

**Functions Coverage**: Percentage of functions called
```javascript
function usedFunction() { }    // ✅ Covered
function unusedFunction() { }  // ❌ Not covered
```

### Areas Excluded from Coverage

Some files are intentionally excluded from coverage requirements:

```javascript
collectCoverageFrom: [
  'src/**/*.{js,jsx}',
  '!src/main.jsx',           // Entry point
  '!src/tests/**',           // Test files themselves
  '!**/node_modules/**',     // Dependencies
  '!src/config/**',          // Configuration files
]
```

### What Good Coverage Looks Like

✅ **Good**: Tests cover functionality, edge cases, and error paths
```javascript
describe('divide', () => {
  it('should divide two numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should throw error when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
  });

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });
});
```

❌ **Bad**: Tests that just increase coverage without adding value
```javascript
it('should exist', () => {
  expect(divide).toBeDefined(); // Not useful
});
```

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-server:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd server && npm ci
      - name: Run tests
        run: cd server && npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./server/coverage/lcov.info
          flags: server

  test-client:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd client && npm ci
      - name: Run tests
        run: cd client && npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./client/coverage/lcov.info
          flags: client

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Start server
        run: cd server && npm start &
      - name: Start client
        run: cd client && npm run dev &
      - name: Wait for services
        run: npx wait-on http://localhost:3000 http://localhost:5173
      - name: Run E2E tests
        run: cd client && npm run test:e2e
```

### Pre-commit Hooks

Use Husky to run tests before commits:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test",
      "pre-push": "npm run test:coverage:check"
    }
  }
}
```

### Coverage Badges

Add badges to README.md:

```markdown
![Server Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg?flag=server)
![Client Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg?flag=client)
```

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Test-Driven Development](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

**Last Updated**: November 14, 2025
**Author**: Philip Ondieki
**Project**: MERN Bug Tracker with Testing & Debugging
