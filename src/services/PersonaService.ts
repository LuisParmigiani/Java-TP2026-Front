
import { apiDelete, apiGet, apiPost, apiPut } from './baseClient.ts';
import type {PersonaResponse,ErrorResponse,PersonaRequest} from './Interfaces.ts';

export async function fetchPersonas(): Promise<PersonaResponse[]> {
  try {
    const response = await apiGet<PersonaResponse[]>("/persona");
    console.log("Fetched personas:", response);
    //! Por ahora el backend no devuelve un campo "estado", así que asignamos "activo" a cada persona para que se muestre correctamente en la tabla. --- IGNORE ---
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error("Error fetching personas:", errorResponse);
    throw errorResponse;
  }
}
export async function fetchPersonasByName(query:string): Promise<PersonaResponse[]> {
  try {
    const response = await apiGet<PersonaResponse[]>(`/persona/search/${query}`);
    console.log('Fetched personas:', response);
    //! Por ahora el backend no devuelve un campo "estado", así que asignamos "activo" a cada persona para que se muestre correctamente en la tabla. --- IGNORE ---
    return response;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    console.error('Error fetching personas:', errorResponse);
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
