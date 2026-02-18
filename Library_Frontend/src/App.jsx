import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import IssuesPage from './pages/IssuesPage';
import StudentPage from './pages/StudentPage';
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Check token on mount
    setToken(localStorage.getItem('token'));

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === null) {
        setToken(localStorage.getItem('token'));
      }
    };

    // Listen for custom events from same tab
    const handleTokenUpdate = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tokenUpdated', handleTokenUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenUpdated', handleTokenUpdate);
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/books" element={
          <ProtectedRoute>
            <BooksPage />
          </ProtectedRoute>
        } />
        <Route path="/issues" element={
          <ProtectedRoute>
            <IssuesPage />
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute>
            <StudentPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
