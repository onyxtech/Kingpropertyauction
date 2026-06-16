import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo,
  allowCanListProperties = false,
  loginIntent,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  allowCanListProperties?: boolean;
  loginIntent?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    // Pass intent to login page so it shows relevant content
    const loginUrl = loginIntent ? `/login?intent=${loginIntent}` : "/login";
    return <Navigate to={loginUrl} replace />;
  }

  const hasRole = allowedRoles.length === 0 || allowedRoles.includes(user.role);
  const hasPermission = allowCanListProperties && (user as any)?.permissions?.canListProperties === true;

  if (!hasRole && !hasPermission) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    if (["buyer", "investor"].includes(user.role) && !["admin", "agent", "seller"].includes(user.role)) {
      return <Navigate to="/register" replace state={{ message: "Want to list properties? Register as an Owner to get started." }} />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}