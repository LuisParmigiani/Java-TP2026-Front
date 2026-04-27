
import { apiGet } from './baseClient.ts';
import type {PersonaResponse,ErrorResponse} from './Interfaces.ts';

export async function fetchPersonas(): Promise<PersonaResponse[]> {
  try {
    const response = await apiGet<PersonaResponse[]>('/persona');
    console.log('Fetched personas:', response);
    //! Por ahora el backend no devuelve un campo "estado", así que asignamos "activo" a cada persona para que se muestre correctamente en la tabla. --- IGNORE ---
    response.forEach((persona) => {
      persona.estado = 'activo'; // Asignar estado "activo" a cada persona
    });

    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error fetching personas:', errorResponse);
    throw errorResponse;
  }
}