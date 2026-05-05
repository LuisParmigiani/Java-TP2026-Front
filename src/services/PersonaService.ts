
import { apiDelete, apiGet, apiPost, apiPut } from './baseClient.ts';
import type {PersonaResponse,ErrorResponse,PersonaRequest, PaginationResponse} from './Interfaces.ts';

export async function fetchPersonas(
  currentPage: number = 0,
  pageSize: number = 10,
  populate?: string[],
): Promise<PaginationResponse<PersonaResponse>> {
  try {
    const params = new URLSearchParams();

    // Paginación
    params.append('page', currentPage.toString());
    params.append('size', pageSize.toString());

    // Populate (relaciones)
    if (populate && populate.length > 0) {
      populate.forEach((pop) => {
        params.append('populate', pop);
      });
    }

    const url = `/persona?${params.toString()}`;
    console.log('Fetching personas with URL:', url);

    const response = await apiGet<PaginationResponse<PersonaResponse>>(url);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error fetching personas:', errorResponse);
    throw errorResponse;
  }
}
export async function searchPersonas(
  query?: string,
  zona?: string,
  camion?: string,
  dia?: string,
  ordenSaldo: string = 'ascendente',
  currentPage: number = 0,
  pageSize: number = 10,
  populate?: string[],
): Promise<PaginationResponse<PersonaResponse>> {
  try {
    const params = new URLSearchParams();

    // Agregar parámetros opcionales
    if (query) {
      params.append('query', query);
    }
    if (zona) {
      params.append('zona', zona);
    }
    if (camion) {
      params.append('camion', camion);
    }
    if (dia) {
      params.append('dia', dia);
    }
    if (ordenSaldo) {
      params.append('ordenSaldo', ordenSaldo);
    }

    // Paginación
    params.append('page', currentPage.toString());
    params.append('size', pageSize.toString());

    // Populate (relaciones)
    if (populate && populate.length > 0) {
      populate.forEach((pop) => {
        params.append('populate', pop);
      });
    }

    const url = `/persona/search?${params.toString()}`;
    console.log('Fetching personas with URL:', url);

    const response = await apiGet<PaginationResponse<PersonaResponse>>(url);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error searching personas:', errorResponse);
    throw errorResponse;
  }
}


export async function updatePersona(id: number, updatedData: Partial<Omit<PersonaRequest, 'id'>>): Promise<PersonaResponse> {
  try {
    const response = await apiPut<PersonaResponse>(`/persona/${id}`, updatedData);
    console.log('Updated persona:', response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error updating persona:', errorResponse);
    throw errorResponse;
  }
}

export async function addPersona(personaData: Omit<PersonaRequest, 'id'>): Promise<PersonaResponse> {
  try {
    const response = await apiPost<PersonaResponse>('/persona', personaData);
    console.log('Created persona:', response);
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error creating persona:', errorResponse);
    throw errorResponse;
  
  
  }}
export async function deletePersona(id: number): Promise<void> {
  try {
    await apiDelete(`/persona/${id}/disable`);
    console.log(`Disabled persona with ID ${id}`);
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error(`Error disabling persona with ID ${id}:`, errorResponse);
    throw errorResponse;
  }
}
