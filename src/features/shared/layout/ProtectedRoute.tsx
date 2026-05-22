import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [],
  redirectTo,
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[];
  redirectTo?: string;
}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Custom redirect for add-property page - guide to register
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    // Default redirect for other protected pages
    if (["buyer", "investor"].includes(user.role) && !["admin", "agent", "seller"].includes(user.role)) {
      return <Navigate to="/register" replace state={{ message: "Want to list properties? Register as a seller to get started." }} />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}