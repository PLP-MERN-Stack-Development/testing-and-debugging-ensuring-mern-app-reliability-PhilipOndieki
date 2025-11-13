/**
 * App Component
 * Root application component with routing
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BugProvider } from './context/BugContext';
import ErrorBoundary from './components/error/ErrorBoundary';
import Layout from './components/layout/Layout';
import BugBoard from './components/bugs/BugBoard';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BugProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      {({ toggleMobileMenu }) => (
                        <BugBoard toggleMobileMenu={toggleMobileMenu} />
                      )}
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <Layout>
                      {() => (
                        <div className="p-6">
                          <h1 className="text-2xl font-bold text-text-primary">
                            Statistics
                          </h1>
                          <p className="text-text-secondary mt-2">
                            Coming soon...
                          </p>
                        </div>
                      )}
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* 404 - Redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

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
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
