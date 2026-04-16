// src/hooks/usePermission.ts
import { useAuth } from "./useAuth";

export const usePermission = () => {
  const { currentUser } = useAuth();

  const isAdmin = () => currentUser?.role === "Administrador";
  const isDriver = () => currentUser?.role === "Conductor";
  const isCustomer = () => currentUser?.role === "Usuario";
  const isEmployee = () => currentUser?.role === "Empleado";

  return {
    isAdmin,
    isDriver,
    isCustomer,
    isEmployee,
  };
};
