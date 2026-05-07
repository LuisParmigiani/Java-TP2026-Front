import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  fetchPersonas,
  searchPersonas,
  addPersona,
  updatePersona,
  deletePersona,
} from '../../../../services/PersonaService';
import type {
  PersonaResponse,
  ErrorResponse,
} from '../../../../services/Interfaces';
import { formatErrorResponse } from '../../../../lib/utils';
import type { ClientesFilters } from './useClientesFilters.ts';
import { useNavigate } from 'react-router-dom';

export const useCustomers = (
  onError?: (error: { errorTitle: string; errorMessage: string }) => void,
  filters?: ClientesFilters,
  page: number = 1,
  pageSize: number = 10,
) => {
  const [customers, setCustomers] = useState<PersonaResponse[]>([]);
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const loadData = async () => {
        try {
          // Si hay búsqueda o filtros activos, usa searchPersonas
          if (
            search.trim() !== '' ||
            Object.values(filters || {}).some((v) => v)
          ) {
            const results = await searchPersonas(
              search || undefined,
              filters?.zone ? String(filters.zone) : undefined,
              filters?.truck ? String(filters.truck) : undefined,
              filters?.day ? String(filters.day) : undefined,
              filters?.saldo ? String(filters.saldo) : undefined,
              page - 1, // ← Convertir a 0-indexed para el backend
              pageSize,
              ['zona', 'camion', 'dia'],
            );
            setCustomers(results.content);
            setTotalItems(results.totalElements); // ← Usar totalElements
          } else {
            // Sin filtros, traer todos con paginación
            const data = await fetchPersonas(page - 1, pageSize); // ← Convertir a 0-indexed
            setCustomers(data.content);
            setTotalItems(data.totalElements); // ← Usar totalElements
          }
        } catch (error) {
          const errorResponse = error as ErrorResponse;
          const formattedError = formatErrorResponse(errorResponse);
          onError?.(formattedError);
        }
      };

      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filters?.zone, filters?.truck, filters?.day, filters?.saldo, page, pageSize]);

  const handleDelete = async (id: number): Promise<boolean> => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) {
      return false;
    }

    try {
      await deletePersona(id);
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      toast.success('Cliente dado de baja');
      return true;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      onError?.(formattedError);
      toast.error(errorResponse.mensaje);
      return false;
    }
  };
  const handleDetails = (customer: PersonaResponse) => {
    navigate(`/admin/customers/${customer.id}/directions`);
  };
  const handleSaveCustomer = async (
    newCustomer: PersonaResponse,
    isEditing: boolean,
  ): Promise<boolean> => {
    try {
      if (isEditing) {
        await updatePersona(newCustomer.id, newCustomer);
        toast.success('Cliente actualizado correctamente.');
      } else {
        await addPersona(newCustomer);
        toast.success('Cliente agregado correctamente.');
      }
      // Recargar datos (no cambiamos página, se recargan en el useEffect)
      return true;
    } catch (error) {
      const errorResponse = error as ErrorResponse;
      const formattedError = formatErrorResponse(errorResponse);
      onError?.(formattedError);
      toast.error(errorResponse.mensaje);
      return false;
    }
  };

  return {
    customers,
    search,
    setSearch,
    totalItems,
    handleDelete,
    handleSaveCustomer,
    handleDetails,
  };
};
