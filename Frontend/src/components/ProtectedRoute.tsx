import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/User';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }: { allowedRole: UserRole[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading....</p>;

  if (!user) return <Navigate to={'/auth/signin'} replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={'/auth/signin'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
