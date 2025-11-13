# Professional MERN Bug Tracker - Frontend

A production-ready Bug Tracker frontend built with React, optimized for scalability, maintainability, and performance. This application connects to an Express/MongoDB backend API and features a beautiful dark-themed Kanban board interface.

![Bug Tracker](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan)
![Tests](https://img.shields.io/badge/Coverage-70%25+-green)

## Features

### Core Functionality
- **Kanban Board**: Visual bug tracking with 4 status columns (Open, In Progress, Resolved, Closed)
- **CRUD Operations**: Create, read, update, and delete bugs with full validation
- **Advanced Filtering**: Search by title/description, filter by priority, severity, and status
- **Real-time Updates**: Optimistic UI updates with toast notifications
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Theme**: Professional dark theme with carefully chosen color palette

### Technical Highlights
- **Type-Safe Validation**: Zod schemas with React Hook Form
- **Error Boundary**: Graceful error handling with user-friendly fallbacks
- **Performance Optimized**: Code splitting, lazy loading, memoization
- **Accessibility**: WCAG AA compliant, keyboard navigation, ARIA labels
- **Testing**: 70%+ code coverage with Jest and React Testing Library

## Technology Stack

### Core
- **React 18.2** - UI library with hooks
- **Vite 5.0** - Fast build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first styling

### State & Data
- **Context API** - Global state management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### UI Components
- **Headless UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **React Testing Library** - Component testing

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
- Backend server running on http://localhost:5000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default: http://localhost:5000/api)
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Application will open at http://localhost:3000

### Available Scripts

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

### Test Coverage
- **Utilities**: Helper functions, formatters, validators
- **Hooks**: Custom hooks like useDebounce
- **Components**: Button, Badge, Input, and other UI components
- **Integration**: End-to-end user flows

### Running Tests
```bash
# Run tests with coverage report
npm test

# Watch mode for development
npm run test:watch

# Verbose output
npm run test:verbose
```

### Test Examples
```javascript
// Component test
test('renders bug card with correct information', () => {
  render(<BugCard bug={mockBug} />);
  expect(screen.getByText('Test Bug')).toBeInTheDocument();
});

// Hook test
test('debounces value changes', () => {
  const { result, rerender } = renderHook(() => useDebounce('test', 500));
  // ...
});
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
