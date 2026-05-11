// src/pages/admin/CustomersManagement/hooks/useCustomersFilterOptions.ts

import { useState, useEffect, useMemo } from "react";
import { fetchZones } from "../../../../services/ZoneService";
import { fetchTrucks } from "../../../../services/TruckService";
import { getDias } from "../../../../services/DiaService";
import type {
  ZonaResponse,
  CamionResponse,
  DiaResponse,
} from "../../../../services/Interfaces";
import { useAuth } from "../../../../hooks/useAuth";

export interface FilterOption {
  id: string | number;
  nombre: string;
}

export const useCustomersFilterOptions = () => {
  const [zones, setZones] = useState<FilterOption[]>([]);
  const [trucks, setTrucks] = useState<FilterOption[]>([]);
  const [days, setDays] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !token) return;
    const loadFilterOptions = async () => {
      try {
        setLoading(true);

        // Traer zonas
        const zonasData = await fetchZones(token, []);
        setZones(
          zonasData.map((zona: ZonaResponse) => ({
            id: zona.id,
            nombre: zona.nombre,
          })),
        );

        // Traer camiones
        const camionesData = await fetchTrucks(token);
        setTrucks(
          camionesData.map((camion: CamionResponse) => ({
            id: camion.id,
            nombre: camion.patente,
          })),
        );

        // Traer días
        const diasData = await getDias();
        setDays(
          diasData.map((dia: DiaResponse) => ({
            id: dia.id,
            nombre: dia.nombre,
          })),
        );

        setError(null);
      } catch (err) {
        console.error("Error loading filter options:", err);
        setError("Error al cargar opciones de filtro");
        // Fallbacks mínimos
        setZones([]);
        setTrucks([]);
        setDays([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadFilterOptions();
    }
  }, [token, authLoading]);

  // Memoizar para evitar recrear arrays en cada render
  const memoizedZones = useMemo(() => zones, [zones]);
  const memoizedTrucks = useMemo(() => trucks, [trucks]);
  const memoizedDays = useMemo(() => days, [days]);

  return {
    zones: memoizedZones,
    trucks: memoizedTrucks,
    days: memoizedDays,
    loading,
    error,
  };
};
