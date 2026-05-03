import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  fetchPersonas,
  fetchPersonasByName,
  addPersona,
  updatePersona,
  deletePersona,
} from '../../../../services/PersonaService';
import type { PersonaResponse } from '../../../../services/Interfaces';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<PersonaResponse[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPersonas()
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Failed to fetch customers:', error));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const loadData = async () => {
        try {
          if (search.trim() === '') {
            const data = await fetchPersonas();
            setCustomers(data);
          } else {
            const results = await fetchPersonasByName(search);
            setCustomers(results);
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('Error al buscar clientes.');
        }
      };

      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: number) => {
    try {
      await deletePersona(id);
      toast.success('Cliente dado de baja');
      const updatedCustomers = await fetchPersonas();
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Error al dar de baja el cliente.');
    }
  };

  const handleAddCustomer = async (newCustomer: PersonaResponse) => {
    try {
      await addPersona(newCustomer);
      toast.success('Cliente agregado correctamente.');
      const updatedCustomers = await fetchPersonas();
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Error al agregar el cliente.');
    }
  };

  const handleUpdateCustomer = async (
    id: number,
    updatedCustomer: PersonaResponse,
  ) => {
    try {
      await updatePersona(id, updatedCustomer);
      toast.success('Cliente actualizado correctamente.');
      const updatedCustomers = await fetchPersonas();
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Error al actualizar el cliente.');
    }
  };

  return {
    customers,
    search,
    setSearch,
    handleDelete,
    handleAddCustomer,
    handleUpdateCustomer,
  };
};
