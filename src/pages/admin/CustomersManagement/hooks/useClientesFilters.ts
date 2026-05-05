import { useState } from 'react';

export interface ClientesFilters {
  zone?: string | number;
  truck?: string | number;
  day?: string | number;
  saldo?: string;
}

export const useClientesFilters = () => {
  const [filters, setFilters] = useState<ClientesFilters>({
    zone: '',
    truck: '',
    day: '',
    saldo: '',
  });

  const handleZoneChange = (zoneId: string | number) => {
    setFilters((prev) => ({ ...prev, zone: zoneId === 'Zona' ? '' : zoneId }));
  };

  const handleTruckChange = (truckId: string | number) => {
    setFilters((prev) => ({ ...prev, truck: truckId === 'Camión' ? '' : truckId }));
  };

  const handleDayChange = (dayId: string | number) => {
    setFilters((prev) => ({ ...prev, day: dayId === 'Día' ? '' : dayId }));
  };

  const handleSaldoChange = (saldo: string) => {
    setFilters((prev) => ({ ...prev, saldo: saldo === 'Saldo' ? '' : saldo }));
  };

  const resetFilters = () => {
    setFilters({
      zone: '',
      truck: '',
      day: '',
      saldo: '',
    });
  };

  // Retorna solo los filtros activos (no vacíos)
  const getActiveFilters = (): ClientesFilters => {
    return Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== ''),
    ) as ClientesFilters;
  };

  return {
    filters,
    handleZoneChange,
    handleTruckChange,
    handleDayChange,
    handleSaldoChange,
    resetFilters,
    getActiveFilters,
  };
};
