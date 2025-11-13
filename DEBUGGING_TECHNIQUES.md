# Debugging Techniques - Bug Tracker Application

## Overview

This document outlines comprehensive debugging strategies, tools, and techniques used in the Bug Tracker application to identify, diagnose, and resolve issues efficiently.

## Table of Contents

1. [Server-Side Debugging](#server-side-debugging)
2. [Client-Side Debugging](#client-side-debugging)
3. [Database Debugging](#database-debugging)
4. [Network Debugging](#network-debugging)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Performance Debugging](#performance-debugging)
7. [Tools & Extensions](#tools--extensions)

---

## Server-Side Debugging

### 1. Winston Logging

The application uses Winston for structured logging with multiple log levels.

**Log Levels**:
- `error`: Application errors and exceptions
- `warn`: Warning messages for potential issues
- `info`: Informational messages (user actions, API calls)
- `debug`: Detailed debugging information

**Usage**:
```javascript
const logger = require('./config/logger');

// Log different levels
logger.info('User logged in', { userId: user.id, email: user.email });
logger.warn('Invalid login attempt', { email, ip: req.ip });
logger.error('Database connection failed', { error: err.message });
```

**Log Files**:
- `logs/error.log`: Error-level logs only
- `logs/combined.log`: All logs
- `logs/app-%DATE%.log`: Daily rotating logs

**Configuration** (`server/src/config/logger.js`):
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

### 2. Node.js Debugger

**VS Code Launch Configuration** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/src/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

**Using Breakpoints**:
1. Click on the left margin in VS Code to set breakpoints
2. Press F5 to start debugging
3. Use debugging controls to step through code

**Debug Console Commands**:
```javascript
// Inspect variables
> user
{ id: '123', email: 'test@example.com' }

// Evaluate expressions
> user.id === '123'
true
```

### 3. Request Logging Middleware

Log all incoming requests with details:

```javascript
// server/src/middleware/requestLogger.js
const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
};
```

### 4. Error Handling Middleware

Centralized error handler with detailed logging:

```javascript
const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

---

## Client-Side Debugging

### 1. React DevTools

**Installation**: Install React Developer Tools browser extension

**Features**:
- Inspect component hierarchy
- View props and state
- Track component re-renders
- Profile performance

**Usage**:
1. Open browser DevTools
2. Navigate to "Components" tab
3. Select a component to inspect
4. View props, state, and hooks

**Profiler Tab**:
- Record component render times
- Identify performance bottlenecks
- Optimize unnecessary re-renders

### 2. Browser Developer Tools

**Console**:
```javascript
// Debug logging
console.log('User data:', user);
console.table(bugs); // Display array as table
console.group('API Call');
console.log('Request:', request);
console.log('Response:', response);
console.groupEnd();

// Performance timing
console.time('fetchBugs');
await fetchBugs();
console.timeEnd('fetchBugs'); // fetchBugs: 245.3ms
```

**Network Tab**:
- Inspect API requests and responses
- Check request headers (Authorization token)
- View response status codes
- Monitor request timing

**Tips**:
1. Filter by type (XHR, JS, CSS)
2. Use search to find specific requests
3. Check "Preserve log" to keep logs across page reloads
4. Use "Disable cache" during development

**Application Tab**:
- Inspect localStorage (auth token, user data)
- View sessionStorage
- Check cookies
- Monitor service workers

### 3. Error Boundaries

Catch React component errors and display fallback UI:

```javascript
// client/src/components/error/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 4. Redux/Context DevTools

**For Context API**:
```javascript
// Add context debugging
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Debug context changes
  useEffect(() => {
    console.log('Auth state changed:', state);
  }, [state]);

  // ...
};
```

---

## Database Debugging

### 1. MongoDB Query Debugging

**Enable Query Logging**:
```javascript
mongoose.set('debug', process.env.NODE_ENV === 'development');
```

**Explain Queries**:
```javascript
// Check query performance
const explain = await Bug.find({ status: 'open' }).explain('executionStats');
console.log('Query stats:', explain);
```

**Common Queries**:
```javascript
// Find slow queries
db.system.profile.find({ millis: { $gt: 100 } }).sort({ millis: -1 });

// Check indexes
db.bugs.getIndexes();

// Analyze collection stats
db.bugs.stats();
```

### 2. Mongoose Middleware Debugging

```javascript
// Debug save operations
bugSchema.pre('save', function(next) {
  console.log('Saving bug:', this);
  next();
});

// Debug queries
bugSchema.pre(/^find/, function(next) {
  console.log('Query:', this.getQuery());
  next();
});
```

---

## Network Debugging

### 1. Axios Interceptors

**Request Interceptor**:
```javascript
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);
```

**Response Interceptor**:
```javascript
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
    });
    return Promise.reject(error);
  }
);
```

### 2. CORS Issues

**Symptoms**:
- "Access to fetch blocked by CORS policy" error
- Preflight OPTIONS request fails

**Debug Steps**:
1. Check server CORS configuration
2. Verify allowed origins
3. Check request headers
4. Verify credentials setting

**Solution**:
```javascript
// server/src/app.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
```

---

## Common Issues & Solutions

### 1. Authentication Issues

**Issue**: "Token expired" or "Invalid token" errors

**Debug Steps**:
1. Check token in localStorage
   ```javascript
   const token = localStorage.getItem('token');
   console.log('Token:', token);
   ```

2. Decode JWT token
   ```javascript
   const decoded = jwt.decode(token);
   console.log('Token payload:', decoded);
   console.log('Expires at:', new Date(decoded.exp * 1000));
   ```

3. Verify token is sent in requests
   ```javascript
   // Check Authorization header in Network tab
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

**Solution**:
- Implement token refresh logic
- Handle expired tokens gracefully
- Clear storage and redirect to login

### 2. State Management Issues

**Issue**: Component not re-rendering when state changes

**Debug Steps**:
1. Check if state is being mutated directly
   ```javascript
   // ❌ Wrong - mutates state
   state.bugs.push(newBug);

   // ✅ Correct - creates new array
   setState({ ...state, bugs: [...state.bugs, newBug] });
   ```

2. Use React DevTools to inspect state
3. Add console.logs to track state changes

**Solution**:
- Always use immutable updates
- Use useEffect to track dependencies
- Consider using Immer for complex state

### 3. API 401 Errors

**Issue**: Getting 401 Unauthorized errors

**Debug Checklist**:
- [ ] Token exists in localStorage
- [ ] Token is valid and not expired
- [ ] Token is sent in Authorization header
- [ ] Server middleware is correctly verifying token
- [ ] User exists in database

**Quick Test**:
```javascript
// Test auth endpoint
const response = await api.get('/auth/me');
console.log('Auth check:', response.data);
```

### 4. Component Not Re-rendering

**Issue**: UI doesn't update after state change

**Common Causes**:
1. Direct state mutation
2. Missing dependency in useEffect
3. Comparing objects by reference

**Debug**:
```javascript
useEffect(() => {
  console.log('Effect running, bugs:', bugs);
}, [bugs]); // Make sure bugs is in dependency array
```

### 5. Slow Database Queries

**Issue**: API endpoints taking too long

**Debug Steps**:
1. Enable mongoose debug mode
2. Check query execution time
3. Analyze query with explain()
4. Check for missing indexes

**Solution**:
```javascript
// Add index for frequently queried fields
bugSchema.index({ status: 1, createdAt: -1 });
```

---

## Performance Debugging

### 1. React Performance

**Identify Unnecessary Re-renders**:
```javascript
// Add to component
useEffect(() => {
  console.log('Component rendered');
});

// Track specific prop changes
useEffect(() => {
  console.log('Bugs changed:', bugs);
}, [bugs]);
```

**Use React Profiler**:
1. Open React DevTools
2. Go to Profiler tab
3. Click record button
4. Perform actions
5. Stop recording and analyze

**Optimization Techniques**:
```javascript
// Memoize expensive calculations
const filteredBugs = useMemo(() => {
  return bugs.filter(bug => bug.status === filter);
}, [bugs, filter]);

// Memoize callbacks
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

// Memoize components
const MemoizedBugCard = React.memo(BugCard);
```

### 2. Network Performance

**Check API Response Times**:
```javascript
const start = Date.now();
const response = await api.get('/bugs');
console.log(`Request took: ${Date.now() - start}ms`);
```

**Use Performance API**:
```javascript
performance.mark('fetchStart');
await fetchBugs();
performance.mark('fetchEnd');
performance.measure('fetchBugs', 'fetchStart', 'fetchEnd');
const measure = performance.getEntriesByName('fetchBugs')[0];
console.log(`Fetch duration: ${measure.duration}ms`);
```

---

## Tools & Extensions

### Development Tools

1. **VS Code Extensions**:
   - ESLint: Catch code issues
   - Prettier: Code formatting
   - REST Client: Test API endpoints
   - MongoDB for VS Code: Query database

2. **Browser Extensions**:
   - React Developer Tools
   - Redux DevTools
   - JSON Viewer
   - Wappalyzer (detect technologies)

3. **Standalone Tools**:
   - Postman/Insomnia: API testing
   - MongoDB Compass: Database GUI
   - Chrome DevTools: Network, Performance
   - Lighthouse: Performance audits

### Debugging Commands

```bash
# Start server with debug logging
LOG_LEVEL=debug npm run dev

# Run tests with verbose output
npm run test:verbose

# Enable Node.js inspector
node --inspect server/src/server.js

# Memory profiling
node --inspect --expose-gc server/src/server.js
```

---

## Best Practices

### 1. Logging Best Practices
- Use appropriate log levels
- Include context (user ID, request ID)
- Don't log sensitive data (passwords, tokens)
- Use structured logging (JSON format)

### 2. Error Handling Best Practices
- Always catch async errors
- Provide meaningful error messages
- Log errors with stack traces
- Return appropriate HTTP status codes

### 3. Development Workflow
- Use debugger instead of console.log for complex issues
- Write tests to reproduce bugs
- Document known issues and workarounds
- Keep development and production environments similar

---

## Troubleshooting Checklist

When debugging an issue, go through this checklist:

- [ ] Check browser console for errors
- [ ] Check server logs for errors
- [ ] Verify API requests in Network tab
- [ ] Check authentication token validity
- [ ] Verify database connection
- [ ] Check environment variables
- [ ] Review recent code changes
- [ ] Test in incognito mode (clear cache)
- [ ] Check CORS configuration
- [ ] Verify dependencies are installed

---

## Resources

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [MongoDB Performance](https://www.mongodb.com/docs/manual/administration/analyzing-mongodb-performance/)

---

## Conclusion

Effective debugging is a crucial skill for maintaining and improving the Bug Tracker application. By using these techniques and tools, you can quickly identify and resolve issues, leading to a more stable and reliable application.
