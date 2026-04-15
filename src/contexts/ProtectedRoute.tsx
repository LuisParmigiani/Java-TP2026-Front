import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const currentUser = useAuth().currentUser;
  const isAuthenticated = useAuth().isAuthenticated;
  const [redirect, setRedirect] = useState<null | string>(null);
  const toastShown = useRef(false);
  const loading = useAuth().loading;

  useEffect(() => {
    if (redirect || toastShown.current || loading) return; // Evita duplicados
    toastShown.current = true;

    if (!isAuthenticated) {
      toastShown.current = true;
      toast.error(`Debes iniciar sesión para acceder a esta página`, {
        duration: 1500,
      });
      setTimeout(() => setRedirect("/login"), 1500);
    } else if (!allowedRoles.includes(currentUser?.role!)) {
      toastShown.current = true;
      toast.error("No tienes permiso para acceder a esta página", {
        duration: 1500,
      });
      setTimeout(() => setRedirect("/"), 1500);
    }
  }, [isAuthenticated, allowedRoles, currentUser, loading, redirect]);

  if (redirect) return <Navigate to={redirect} replace />;

  if (!isAuthenticated || !allowedRoles.includes(currentUser?.role!)) {
    // Mientras espera, puedes mostrar un loader o null
    return null;
  }

  return <Outlet />;
};
