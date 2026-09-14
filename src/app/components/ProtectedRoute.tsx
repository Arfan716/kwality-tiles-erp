import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles = [],
  allowedPermissions = [],
}: ProtectedRouteProps) {
  const role = localStorage.getItem("userRole");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const permissions = (() => {
    try {
      const storedPermissions = localStorage.getItem("permissions");
      const parsedPermissions = storedPermissions
        ? JSON.parse(storedPermissions)
        : [];

      return Array.isArray(parsedPermissions) ? parsedPermissions : [];
    } catch {
      return [];
    }
  })();

  const hasPermission =
    allowedPermissions.length === 0
      ? true
      : permissions.includes("all") ||
        allowedPermissions.some((permission) => permissions.includes(permission));

  const hasRoleAccess =
    allowedRoles.length === 0 || allowedRoles.includes(role);

  const isAuthorized = hasPermission && hasRoleAccess;

  if (!isAuthorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold">Access denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}