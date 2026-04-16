import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ErrorResponse } from '../services/Interfaces.ts';


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// Función auxiliar para formatear errores de validación
export function formatErrorResponse(errorResponse: ErrorResponse): {errorTitle: string, errorMessage: string} {
  const errorTitle = errorResponse.mensaje;
  
  let fieldErrors = '';
  if (errorResponse.errores && Object.keys(errorResponse.errores).length > 0) {
    fieldErrors = Object.entries(errorResponse.errores)
      .map(([field, message]) => `${field}: ${message}`)
      .join('\n');
  }
  
  return {
    errorTitle,
    errorMessage: fieldErrors
  };
}
