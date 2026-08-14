import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestOnly({ children }) {
  const { user, bootstrapping } = useAuth();
  if (bootstrapping) return null;
  if (user) return <Navigate to="/app/dashboard" replace />;
  return children;
}
