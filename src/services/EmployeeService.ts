import { apiGet, apiDelete, apiPut } from './baseClient.ts';
import type { ErrorResponse, UserRequest, UserResponse } from './Interfaces.ts';
import { formatErrorResponse } from '../lib/utils.ts';

export async function fetchEmployees(
  token: string,
  populate?: string[],
  nivelAcceso?: string,
  estado?: string,
  conCargas?: 'si' | 'no',
): Promise<UserResponse[]> {
  let query = '';
  if (populate && populate.length > 0) {
    query = '?nivelAcceso=' + nivelAcceso + '&populate=' + populate.join(',');
  }
  if (estado === 'Habilitado' || estado === 'Todos') {
    query += (query ? '&' : '?') + 'estado=' + estado;
  }
  if (conCargas) {
    query += (query ? '&' : '?') + 'conCargas=' + conCargas;
  }
  try {
    console.log('Fetching employees with query:', query);
    return await apiGet<UserResponse[]>(`/usuario/empleados${query}`, token);
  } catch (error) {
    const err = error as ErrorResponse;
    const formatted = formatErrorResponse(err);
    console.log('Error fetching employees:', formatted);
    throw err;
  }
}

// AGREGADO: Parámetro token
export async function deleteEmployee(id: number, token: string): Promise<void> {
  try {
    console.log(`Deleting employee with ID: ${id}`);
    await apiDelete(`/usuario/${id}`, token); // Pasamos el token
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    const formattedError = formatErrorResponse(errorResponse);
    console.log('Error deleting employee:', formattedError);
    throw errorResponse;
  }
}

// AGREGADO: Parámetro token
export async function UpdateEmployee(
  empId: number,
  persId: number,
  employeeData: UserResponse,
  token: string,
): Promise<void> {
  try {
    const userRequest: UserRequest = {
      nombreUsuario: employeeData.nombreUsuario,
      email: employeeData.email,
      nivelAcceso: employeeData.nivelAcceso,
      personaId: employeeData.personaId,
      persona: {
        tipoDoc: employeeData.persona?.tipoDoc || '',
        nroDocumento: employeeData.persona?.nroDocumento || '',
        nombre: employeeData.persona?.nombre || '',
        apellido: employeeData.persona?.apellido || '',
        telefono: employeeData.persona?.telefono || '',
        email: employeeData.email,
      },
    };
    console.log('Updating employee with data:', userRequest);
    // Pasamos el token a apiPut (asumiendo que la firma de tu apiPut es url, body, token)
    await apiPut(
      `/usuario/update/withPersona/${empId}/${persId}`,
      userRequest,
      token,
    );
    console.log('Employee updated successfully');
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    const formattedError = formatErrorResponse(errorResponse);
    console.log('Error updating employee:', formattedError);
    throw errorResponse;
  }
}
