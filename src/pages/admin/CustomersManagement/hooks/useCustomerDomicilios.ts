import { useState, useEffect } from 'react';
import { getPersona } from '../../../../services/PersonaService.ts';
import { type PersonaResponse, type DomicilioResponse, } from '../../../../services/Interfaces';
import { useAuth } from '../../../../hooks/useAuth.ts';
export const useCustomerDirections = (customerId: string) => {
  const [directions, setDirections] = useState<DomicilioResponse[]>([]);
  const [persona, setPersona] = useState<PersonaResponse | null>(null);
  // const [filter, setFilter] = useState({ status: '', deliveryDay: '' });
  // const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  // const [searchTerm, setSearchTerm] = useState('');
  // const [orderBy, setOrderBy] = useState('Nombre A-Z');
  // const [enabledStatus, setEnabledStatus] = useState('Habilitados');
  // const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const { token } = useAuth();
  // const [totalItems, setTotalItems] = useState(0);
  // const size = 5;

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const persona = await getPersona(token, parseInt(customerId), ['domicilioCompleto']);
        setDirections(persona.domicilios || []);
        setPersona(persona);
      } catch (error) {
        setError('Error al cargar domicilios');
        console.error('Error fetching persona:', error);
      }
    }
    if (customerId) {
      fetchPersona();
    }

  }, [customerId, token]);

  const handleSaveDirection = (updatedDirection: DomicilioResponse) => {
    // Validar que el ID coincida
    if (!updatedDirection?.id) {
      console.error('Invalid direction response');
      setError('Error al actualizar la dirección');
      return;
    }

    setDirections((current) =>
      current.map((direction) =>
        direction.id === updatedDirection.id
          ? { ...updatedDirection }
          : direction,
      ),
    );
    // Limpiar error si la actualización fue exitosa
    setError('');
  };



  // const hasActiveFilters =
  //   (filter.status !== '' && filter.status !== 'Mostrar Todas') ||
  //   appliedSearchTerm !== '' ||
  //   enabledStatus !== 'Todos';

  // const handleSearch = () => {
  //   setAppliedSearchTerm(searchTerm);
  //   setPage(1);
  // };

  // useEffect(() => {

  //   const fetchDirections = async () => {
  //     try {
  //       const result = await getAllByUserId(
  //         customerId,
  //         filter.status,
  //         null,
  //         orderBy,
  //         appliedSearchTerm,
  //         enabledStatus,
  //         ['diaDomicilio'],
  //         page - 1,
  //         size,
  //       );
  //       setDirections(result.content);
  //       setTotalItems(result.totalElements);
  //     } catch (err) {
  //       console.error('Error fetching directions:', err);
  //       setError('Error al cargar domicilios');
  //     }
  //   };

  //   if (customerId) {
  //     fetchDirections();
  //   }
  // }, [customerId, filter, orderBy, appliedSearchTerm, page, enabledStatus]);

  return {
    directions,
    persona,
    error,
    handleSaveDirection

    // filter,
    // setFilter,
    // appliedSearchTerm,
    // searchTerm,
    // setSearchTerm,
    // orderBy,
    // setOrderBy,
    // enabledStatus,
    // setEnabledStatus,
    // page,
    // setPage,
    // error,
    // totalItems,
    // size,
    // hasActiveFilters,
    // handleSearch,
  };
};
