import type { Role } from "@/context/auth/auth.context";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useLocation } from "react-router-dom";

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        Loading authentication...
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  // Logged in but role not allowed
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
