import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/Toaster';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './components/landing/LandingPage';
import AuthPage from './pages/AuthPage';
import UnifiedHealthDashboard from './components/dashboard/UnifiedHealthDashboard';
import FloatingChatWidget from './components/ui/FloatingChatWidget';
import OfflineIndicator from './components/ui/OfflineIndicator';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <div className="w-8 h-8 text-white">⚡</div>
          </div>
          <div className="space-y-2">
            <div className="text-xl font-semibold text-slate-900 dark:text-white">Loading Biowell</div>
            <div className="text-slate-600 dark:text-slate-400">Preparing your health dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <LandingPage onShowAuth={() => window.location.href = '/auth'} />
        } 
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            <UnifiedHealthDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen">
              <AppContent />
              <FloatingChatWidget />
              <OfflineIndicator />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;