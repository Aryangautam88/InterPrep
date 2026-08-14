import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/ui/Skeleton';

export default function ProtectedRoute() {
  const { user, bootstrapping } = useAuth();
  const location = useLocation();

  if (bootstrapping) {
    return (
      <div style={{ padding: 40, display: 'grid', gap: 12 }}>
        <Skeleton height={28} width="200px" />
        <Skeleton height={160} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
