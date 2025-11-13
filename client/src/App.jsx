/**
 * App Component
 * Root application component with routing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { BugProvider } from './context/BugContext';
import ErrorBoundary from './components/error/ErrorBoundary';
import Layout from './components/layout/Layout';
import BugBoard from './components/bugs/BugBoard';

function App() {
  return (
    <ErrorBoundary>
      <BugProvider>
        <Router>
          <Layout>
            {({ toggleMobileMenu }) => (
              <Routes>
                <Route
                  path="/"
                  element={<BugBoard toggleMobileMenu={toggleMobileMenu} />}
                />
                <Route
                  path="/stats"
                  element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold text-text-primary">
                        Statistics
                      </h1>
                      <p className="text-text-secondary mt-2">
                        Coming soon...
                      </p>
                    </div>
                  }
                />
              </Routes>
            )}
          </Layout>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#141414',
                color: '#FFFFFF',
                border: '1px solid #262626',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </Router>
      </BugProvider>
    </ErrorBoundary>
  );
}

export default App;
