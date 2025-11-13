# Bug Tracker REST API

A production-ready Bug Tracker REST API built with Node.js, Express, and MongoDB. This backend server emphasizes testing, debugging, and maintainability with comprehensive test coverage and professional code organization.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Debugging](#debugging)
- [Error Handling](#error-handling)

## Features

- **Complete CRUD Operations** for bug management
- **Advanced Filtering & Pagination** for efficient data retrieval
- **Comprehensive Validation** using express-validator
- **Professional Error Handling** with custom error classes
- **Structured Logging** using Winston
- **Security Features** including Helmet, CORS, and rate limiting
- **70%+ Test Coverage** with Jest and Supertest
- **MongoDB Integration** with Mongoose ODM
- **Production-Ready** code structure and best practices

## Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Testing:** Jest + Supertest + MongoDB Memory Server
- **Validation:** Express-validator
- **Logging:** Winston
- **Security:** Helmet, CORS, express-rate-limit
- **Environment:** dotenv

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection configuration
│   │   ├── logger.js            # Winston logger setup
│   │   └── constants.js         # Application constants
│   ├── models/
│   │   └── Bug.js               # Mongoose Bug schema
│   ├── controllers/
│   │   └── bugController.js     # Business logic
│   ├── routes/
│   │   └── bugRoutes.js         # API endpoints
│   ├── middleware/
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── validator.js         # Input validation
│   │   └── requestLogger.js     # Request logging
│   ├── utils/
│   │   ├── validateBug.js       # Bug validation utilities
│   │   └── apiResponse.js       # Standardized API responses
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── tests/
│   ├── unit/
│   │   ├── validateBug.test.js  # Unit tests for validation
│   │   └── apiResponse.test.js  # Unit tests for responses
│   ├── integration/
│   │   └── bugRoutes.test.js    # Integration tests for API
│   └── setup.js                 # Test configuration
├── logs/                        # Application logs (generated)
├── .env.example                 # Environment variables template
├── .env.test                    # Test environment variables
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Configuration](#configuration))

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas connection string in .env
   ```

## Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bug-tracker

# Application Configuration
API_PREFIX=/api

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Bug Schema

```javascript
{
  title: String (required, 3-100 chars),
  description: String (required, 10-1000 chars),
  status: Enum ['open', 'in-progress', 'resolved', 'closed'],
  priority: Enum ['low', 'medium', 'high', 'critical'],
  severity: Enum ['minor', 'major', 'critical'],
  createdBy: String (required, 2-50 chars),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Running the Server

### Development Mode
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

### Health Check
```bash
curl http://localhost:5000/health
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Create Bug
```http
POST /api/bugs
Content-Type: application/json

{
  "title": "Bug title here",
  "description": "Detailed bug description",
  "priority": "high",
  "severity": "major",
  "createdBy": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Bug created successfully",
  "data": {
    "_id": "...",
    "title": "Bug title here",
    "status": "open",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### 2. Get All Bugs
```http
GET /api/bugs?status=open&priority=high&page=1&limit=10&sortBy=createdAt&order=desc
```

**Query Parameters:**
- `status` - Filter by status (open, in-progress, resolved, closed)
- `priority` - Filter by priority (low, medium, high, critical)
- `severity` - Filter by severity (minor, major, critical)
- `createdBy` - Filter by creator name (partial match)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sortBy` - Sort field (createdAt, updatedAt, priority, severity, status)
- `order` - Sort order (asc, desc)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bugs retrieved successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### 3. Get Bug by ID
```http
GET /api/bugs/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bug retrieved successfully",
  "data": { ... }
}
```

#### 4. Update Bug
```http
PUT /api/bugs/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "critical",
  "status": "in-progress"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bug updated successfully",
  "data": { ... }
}
```

#### 5. Partial Update (Status Change)
```http
PATCH /api/bugs/:id
Content-Type: application/json

{
  "status": "resolved"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bug updated successfully",
  "data": { ... }
}
```

#### 6. Delete Bug
```http
DELETE /api/bugs/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Bug deleted successfully",
  "data": { "id": "..." }
}
```

#### 7. Get Bug Statistics
```http
GET /api/bugs/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 100,
    "byStatus": {
      "open": 45,
      "in-progress": 30,
      "resolved": 20,
      "closed": 5
    },
    "byPriority": {
      "low": 20,
      "medium": 40,
      "high": 30,
      "critical": 10
    },
    "bySeverity": {
      "minor": 30,
      "major": 50,
      "critical": 20
    }
  }
}
```

### Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

## Testing

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run Integration Tests Only
```bash
npm run test:integration
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage
```bash
npm test
```
The coverage report will be generated in `coverage/` directory.

### Testing Strategy

#### Unit Tests
- **validateBug.test.js**: Tests all validation functions in isolation
  - Title validation
  - Description validation
  - Status, priority, severity validation
  - CreatedBy validation
  - Complete bug data validation
  - Data sanitization

- **apiResponse.test.js**: Tests response formatter utilities
  - Success responses
  - Error responses
  - Pagination responses
  - All HTTP status code variations

#### Integration Tests
- **bugRoutes.test.js**: Tests complete API workflows
  - All CRUD operations
  - Query filtering and pagination
  - Validation error handling
  - Database operations
  - HTTP status codes
  - Response formats

### Test Database

Tests use **MongoDB Memory Server** for:
- Isolated test environment
- Fast execution
- No external dependencies
- Clean state between tests

## Code Quality

### Best Practices Implemented

1. **Separation of Concerns**
   - Models handle data structure
   - Controllers handle business logic
   - Routes handle HTTP routing
   - Middleware handles cross-cutting concerns

2. **DRY Principle**
   - Reusable utility functions
   - Consistent error handling
   - Standardized API responses

3. **Input Validation**
   - Express-validator middleware
   - Custom validation utilities
   - Mongoose schema validation
   - Sanitization of user input

4. **Error Handling**
   - Custom error classes
   - Global error handler
   - Consistent error responses
   - Proper error logging

5. **Security**
   - Helmet for HTTP headers
   - CORS configuration
   - Rate limiting
   - Input sanitization
   - NoSQL injection prevention

## Debugging

### Logging

Winston logger is configured with multiple levels:
- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages
- `debug` - Debug messages

**Log Files:**
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

**Console Output:**
Formatted with colors and timestamps in development mode.

### Debug Techniques

1. **Request Logging**
   - Every request is logged with method, path, and duration
   - Failed requests include error details

2. **Error Stack Traces**
   - Development mode includes full stack traces
   - Production mode shows sanitized errors

3. **Database Query Logging**
   - Connection events logged
   - Error events captured

4. **Health Monitoring**
   - `/health` endpoint for server status
   - `/api/bugs/stats` for data insights

### Common Debugging Scenarios

**Database Connection Issues:**
```bash
# Check MongoDB is running
mongod --version

# Test connection
mongo mongodb://localhost:27017
```

**Environment Variable Issues:**
```bash
# Verify .env file exists and is loaded
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

**Test Failures:**
```bash
# Run tests with verbose output
npm run test:verbose

# Run specific test file
npx jest tests/unit/validateBug.test.js
```

## Error Handling

### Custom Error Classes

- **AppError**: Base error class for operational errors
- **ValidationError**: Input validation failures (400)
- **NotFoundError**: Resource not found (404)
- **DatabaseError**: Database operation failures (500)

### Error Handling Flow

1. Error occurs in controller/middleware
2. Error passed to global error handler via `next(error)`
3. Error handler identifies error type
4. Appropriate HTTP status code assigned
5. Error logged with Winston
6. Standardized error response sent to client

### Mongoose Error Handling

Automatically handles:
- Validation errors
- Cast errors (invalid ObjectId)
- Duplicate key errors
- Connection errors

## Performance Optimization

1. **Database Indexing**
   - Indexes on status, priority, severity
   - Compound indexes for common queries

2. **Query Optimization**
   - Lean queries for read operations
   - Projection to limit returned fields
   - Efficient filtering and sorting

3. **Pagination**
   - Limits result set size
   - Reduces memory usage
   - Faster response times

4. **Connection Pooling**
   - MongoDB connection pool configured
   - Efficient connection reuse

## Production Deployment

### Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB connection string
- [ ] Set appropriate rate limits
- [ ] Configure CORS origins
- [ ] Set secure LOG_LEVEL
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure log rotation
- [ ] Set up backups
- [ ] Configure environment variables

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bugtracker
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100
```

## Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Maintain 70%+ code coverage
4. Use meaningful commit messages
5. Update documentation

## License

MIT License

## Support

For issues and questions, please open an issue in the repository.

---

