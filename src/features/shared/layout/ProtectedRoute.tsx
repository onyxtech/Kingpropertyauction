import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo,
  allowCanListProperties = false,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  allowCanListProperties?: boolean;
}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.length === 0 || allowedRoles.includes(user.role);
  const hasPermission = allowCanListProperties && (user as any)?.permissions?.canListProperties === true;

  if (!hasRole && !hasPermission) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    if (["buyer", "investor"].includes(user.role) && !["admin", "agent", "seller"].includes(user.role)) {
      return <Navigate to="/register" replace state={{ message: "Want to list properties? Register as a seller to get started." }} />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}