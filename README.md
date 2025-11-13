# Professional MERN Bug Tracker

A production-ready full-stack Bug Tracker application built with the MERN stack (MongoDB, Express, React, Node.js), featuring JWT authentication, comprehensive testing (70%+ coverage), and professional debugging techniques. This application showcases industry best practices for testing, debugging, and maintaining reliable software.

![Bug-tracker dashboard](image.png)
![Creating a new bug](image-1.png)
![New Bug](image-2.png)
![updated bug](image-3.png)
## Features

### Core Functionality
- **JWT Authentication**: Secure user registration, login, and session management
- **Protected Routes**: Role-based access control with protected routes
- **Kanban Board**: Visual bug tracking with 4 status columns (Open, In Progress, Resolved, Closed)
- **CRUD Operations**: Create, read, update, and delete bugs with full validation
- **Advanced Filtering**: Search by title/description, filter by priority, severity, and status
- **Real-time Updates**: Optimistic UI updates with toast notifications
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Theme**: Professional dark theme with carefully chosen color palette

### Technical Highlights
- **JWT Authentication**: Secure token-based authentication with bcrypt password hashing
- **Comprehensive Testing**: 70%+ code coverage with unit, integration, and E2E tests
- **Type-Safe Validation**: Zod schemas with React Hook Form
- **Error Boundary**: Graceful error handling with user-friendly fallbacks
- **Performance Optimized**: Code splitting, lazy loading, memoization
- **Accessibility**: WCAG AA compliant, keyboard navigation, ARIA labels
- **Professional Logging**: Winston logging with multiple levels and daily rotation
- **API Security**: Rate limiting, helmet security headers, CORS configuration

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Winston** - Logging library
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18.2** - UI library with hooks
- **Vite 5.0** - Fast build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first styling
- **Context API** - Global state management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Headless UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **@dnd-kit** - Drag and drop utilities

### Testing & Debugging
- **Jest** - Testing framework (Backend & Frontend)
- **Supertest** - HTTP assertion library
- **React Testing Library** - Component testing
- **MongoDB Memory Server** - In-memory test database
- **Cypress** - E2E testing framework (configured)
- **Winston** - Structured logging
- **React Error Boundaries** - Error handling

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server
- **VS Code Debugger** - Breakpoint debugging

## Project Structure

```
client/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── layout/       # Layout components (Sidebar, Header)
│   │   ├── bugs/         # Bug-specific components (BugBoard, BugCard)
│   │   ├── common/       # Reusable components (Button, Input, Modal)
│   │   └── error/        # Error handling components
│   ├── context/          # State management (BugContext, reducer)
│   ├── hooks/            # Custom hooks (useBugs, useDebounce)
│   ├── services/         # API layer (axios, bugService)
│   ├── utils/            # Utilities (validators, formatters, helpers)
│   ├── styles/           # Global styles and Tailwind
│   ├── tests/            # Test files
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── .env                  # Environment variables
├── .env.example          # Environment template
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── jest.config.js        # Jest configuration
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas connection)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd testing-and-debugging-ensuring-mern-app-reliability-PhilipOndieki
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables:**

   **Backend** (`server/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/bug-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_NODE_ENV=development
   ```

5. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

7. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```
   Application will open at http://localhost:3000

### Available Scripts

#### Backend (`server/`)
```bash
# Development
npm start            # Start server (production)
npm run dev          # Start server with nodemon

# Testing
npm test             # Run all tests with coverage
npm run test:unit    # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch   # Run tests in watch mode
npm run test:verbose # Run tests with verbose output

# Code Quality
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
```

#### Frontend (`client/`)
```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run all tests with coverage
npm run test:unit    # Run unit tests only
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Cypress E2E tests (when installed)

# Code Quality
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
```

## Architecture & Design Patterns

### State Management
Uses Context API with useReducer for predictable state updates:
- **BugContext**: Global bug state and filters
- **Reducer Pattern**: Pure functions for state transitions
- **Custom Hooks**: Encapsulated business logic (useBugs)

### Component Patterns
- **Presentational/Container**: Separation of concerns
- **Compound Components**: Modal with Dialog from Headless UI
- **Render Props**: Layout component for flexible rendering
- **Memoization**: React.memo for expensive components

### API Layer
Centralized API management with interceptors:
```javascript
// api.js - Axios instance with interceptors
// bugService.js - All bug-related API methods
```

### Form Handling
React Hook Form + Zod for type-safe forms:
```javascript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(bugSchema),
  mode: 'onBlur',
});
```

## Design System

### Color Palette
```css
/* Backgrounds */
--bg-primary: #0A0A0A      /* Main background */
--bg-secondary: #141414    /* Cards, modals */
--bg-tertiary: #1F1F1F     /* Hover states */

/* Status Colors */
--status-open: #EF4444     /* Red */
--status-progress: #3B82F6 /* Blue */
--status-resolved: #10B981 /* Green */
--status-closed: #6B7280   /* Gray */

/* Priority Colors */
--priority-low: #10B981
--priority-medium: #F59E0B
--priority-high: #F97316
--priority-critical: #DC2626
```

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: 0.75rem - 1.875rem
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## Testing Strategy

This application implements a comprehensive testing strategy covering unit, integration, and E2E tests. For detailed information, see [TESTING_STRATEGY.md](./TESTING_STRATEGY.md).

### Test Coverage

**Backend:**
- **Unit Tests**: User model, auth middleware, validation utilities, API response formatters
- **Integration Tests**: Auth routes, bug CRUD routes, database operations

**Frontend:**
- **Unit Tests**: Components (Button, Badge, Input), hooks (useDebounce), utilities (formatters, helpers)
- **Integration Tests**: Component interactions with Context API
- **E2E Tests**: Authentication flows, bug CRUD operations, navigation (Cypress)

### Coverage Goals
- Statements: ≥70%
- Branches: ≥60%
- Functions: ≥70%
- Lines: ≥70%

### Running Tests

**Backend:**
```bash
cd server

# Run all tests with coverage
npm test

# Run specific test types
npm run test:unit
npm run test:integration

# Watch mode for development
npm run test:watch
```

**Frontend:**
```bash
cd client

# Run all tests with coverage
npm test

# Watch mode for development
npm run test:watch

# E2E tests (when Cypress is installed)
npm run cypress:open
```

### Test Examples

**Backend Unit Test:**
```javascript
describe('User Model', () => {
  it('should hash password on save', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const userWithPassword = await User.findById(user._id).select('+password');
    expect(userWithPassword.password).not.toBe('password123');
    expect(userWithPassword.password).toMatch(/^\$2[aby]\$\d{1,2}\$/);
  });
});
```

**Backend Integration Test:**
```javascript
describe('POST /api/auth/login', () => {
  it('should login user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
  });
});
```

**Frontend Component Test:**
```javascript
test('renders bug card with correct information', () => {
  render(<BugCard bug={mockBug} />);
  expect(screen.getByText('Test Bug')).toBeInTheDocument();
});
```

**Cypress E2E Test:**
```javascript
describe('Authentication', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });
});
```

## Debugging

This application implements professional debugging techniques for both server and client-side code. For detailed information, see [DEBUGGING_TECHNIQUES.md](./DEBUGGING_TECHNIQUES.md).

### Key Debugging Features

**Backend:**
- **Winston Logging**: Structured logging with multiple levels (error, warn, info, debug)
- **Request Logging**: All HTTP requests logged with duration and status
- **Error Handling**: Centralized error handler with detailed logging
- **VS Code Debugger**: Configured launch settings for breakpoint debugging

**Frontend:**
- **React DevTools**: Inspect components, props, and state
- **Browser DevTools**: Console logging, network monitoring, localStorage inspection
- **Error Boundaries**: Catch and display React errors gracefully
- **Axios Interceptors**: Log all API requests and responses

### Common Debugging Scenarios

**Authentication Issues:**
```javascript
// Check token in localStorage
const token = localStorage.getItem('token');
console.log('Token:', token);

// Verify token is sent in requests (Network tab)
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Performance Issues:**
```javascript
// Track component renders
useEffect(() => {
  console.log('Component rendered');
});

// Measure API response time
const start = Date.now();
await fetchBugs();
console.log(`Request took: ${Date.now() - start}ms`);
```

## Performance Optimization

### Implemented Optimizations
1. **Code Splitting**: Route-based splitting with React.lazy
2. **Memoization**: React.memo for BugCard, BugColumn
3. **Debouncing**: Search input with 300ms delay
4. **Optimistic Updates**: Immediate UI feedback
5. **Tree Shaking**: ES modules for smaller bundles
6. **Image Optimization**: WebP format, lazy loading

### Bundle Analysis
```bash
npm run build
# Check dist/ folder size
# Main bundle: ~150KB gzipped
```

## Accessibility

### Features
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper labels for screen readers
- **Focus Management**: Trapped focus in modals
- **Color Contrast**: WCAG AA compliant (4.5:1)
- **Semantic HTML**: Proper use of HTML5 elements

### Testing Accessibility
- Use screen readers (NVDA, VoiceOver)
- Test keyboard-only navigation
- Check color contrast ratios

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Environment
VITE_NODE_ENV=development

# Application
VITE_APP_NAME=Bug Tracker
VITE_APP_VERSION=1.0.0
```

## Deployment

### Production Build
```bash
# Build optimized bundle
npm run build

# Output: dist/ folder
# Size: ~150KB gzipped
# Supports: All modern browsers
```

### Deployment Options
1. **Vercel**: `vercel deploy`
2. **Netlify**: `netlify deploy`
3. **Static Hosting**: Upload `dist/` folder

## Troubleshooting

### Common Issues

**1. API Connection Errors**
```bash
# Check backend is running
curl http://localhost:5000/api/bugs

# Verify VITE_API_URL in .env
echo $VITE_API_URL
```

**2. Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

**3. Test Failures**
```bash
# Clear Jest cache
npx jest --clearCache
npm test
```

## Contributing

### Code Style
- Use ESLint rules (enforced)
- Follow Prettier formatting
- Write PropTypes for components
- Add JSDoc comments for utilities

### Commit Messages
```
feat: Add bug filtering functionality
fix: Resolve modal focus issue
docs: Update README with deployment info
test: Add tests for BugCard component
```

## License

MIT License - see LICENSE file for details

## Author

**Philip Ondieki**
- MERN Stack Developer
- Specialized in Testing & Debugging

## Acknowledgments

- React Team for excellent documentation
- Tailwind CSS for the utility-first approach
- Headless UI for accessible components
- Community for open-source contributions

---

**Need Help?** Open an issue or contact the development team.
**Found a Bug?** That's ironic! Please report it.
