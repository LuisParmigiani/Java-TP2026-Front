import { useAuth } from "../../hooks/useAuth.ts";

export default function DailyRoute() {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || currentUser?.role !== 'driver') {
    return <div>Acceso denegado. Solo choferes.</div>;
  }
  return (

    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ruta del Conductor</h1>
      <p>Aquí se mostrarán las rutas asignadas al conductor.</p>
    </div>
  );
}