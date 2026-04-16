import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (loading || redirect) return; // Si está cargando o ya va a redirigir, esperamos

    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para acceder a esta página", {
        duration: 1500,
      });
      setTimeout(() => setRedirect("/login"), 1500);
    } else if (currentUser && !allowedRoles.includes(currentUser.role)) {
      toast.error("No tienes permiso para acceder a esta página", {
        duration: 1500,
      });
      setTimeout(() => setRedirect("/"), 1500);
    }
  }, [loading, isAuthenticated, currentUser, allowedRoles, redirect]);

  // Mientras verifica el token por primera vez en el backend
  if (loading) return null;

  // Ejecutamos la redirección si se seteó
  if (redirect) return <Navigate to={redirect} replace />;

  // Ocultamos la vista mientras se muestra el toast
  if (
    !isAuthenticated ||
    (currentUser && !allowedRoles.includes(currentUser.role))
  ) {
    return null;
  }

  return <Outlet />;
};
