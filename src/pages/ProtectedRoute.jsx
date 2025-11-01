import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a loading screen while checking for a session
    return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  }

  if (!user) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, show the requested page
  return children;
};