import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchDomiciliosByCalleAndNumero } from '../../../../services/DirectionService';
import type { DomicilioResponse } from '../../../../services/Interfaces';

export const useDomicilios = () => {
  const [domicilios, setDomicilios] = useState<DomicilioResponse[] | null>(
    null,
  );
  const [searchDomicilio, setSearchDomicilio] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const loadData = async () => {
        try {
          if (searchDomicilio.trim() === '') {
            setDomicilios(null);
          } else {
            const results = await fetchDomiciliosByCalleAndNumero(
              ['persona'],
              searchDomicilio,
            );
            setDomicilios(results);
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('Error al buscar domicilios.');
        }
      };

      loadData();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchDomicilio]);

  return {
    domicilios,
    searchDomicilio,
    setSearchDomicilio,
  };
};
