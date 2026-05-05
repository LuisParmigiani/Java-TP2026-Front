import { useState, useEffect } from 'react';
import { fetchDomiciliosByCalleAndNumero } from '../../../../services/DirectionService';
import type {
  DomicilioResponse,
  ErrorResponse,
} from '../../../../services/Interfaces';
import { formatErrorResponse } from '../../../../lib/utils';

export const useDomicilios = (
  onError?: (error: { errorTitle: string; errorMessage: string }) => void,
) => {
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
          const errorResponse = error as ErrorResponse;
          const formattedError = formatErrorResponse(errorResponse);
          onError?.(formattedError);
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
