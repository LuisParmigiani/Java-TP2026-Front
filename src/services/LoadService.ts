
import { apiGet,apiPut,apiPost,apiDelete } from "./baseClient";
import type { CargaRequest, CargaResponse,ErrorResponse } from "./Interfaces";
import { formatErrorResponse } from "../lib/utils.ts";

export async function fetchCargas(pupulate?: string[],token?: string): Promise<CargaResponse[]> {
    try{
        console.log('Fetching cargas with populate:', pupulate);
        const response  = await apiGet('/carga/hoy/?populate=' + (pupulate?.join(',') || ''), token);
        console.log('Fetched cargas:', response);
        return response as CargaResponse[];
    }catch(error){
        const errorResponse = error as ErrorResponse;
        const formattedError = formatErrorResponse(error as ErrorResponse);
        console.log('Error fetching cargas:', formattedError);
        throw errorResponse;
    }
}
export async function addCarga(
  carga: CargaRequest,
  populate: string[],
  token: string
): Promise<CargaResponse> {
  try {
    if (populate) {
      const query = '?populate=' + populate.join(',');
      const response = await apiPost(`/carga${query}`, carga, token);
      return response as CargaResponse;
    } else {
    const response = await apiPost(`/carga`, carga, token); 
    return response as CargaResponse;}
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    const formattedError = formatErrorResponse(error as ErrorResponse);
    console.log('Error adding zone:', formattedError);
    throw errorResponse;
  }
}

export async function updateCarga(
  id: number,
  carga: CargaRequest,
  populate: string[],
  token: string
): Promise<CargaResponse> {
  try {
      let query = `/${id}?`;
      if (populate) {
        query += 'populate=' + populate.join(',');
      }
      console.log(`carga/withCargaProductos${query}`);
      const response = await apiPut(`/carga/withCargaProductos${query}`, carga, token);
      console.log('Updated carga:', response);
      return response as CargaResponse;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    const formattedError = formatErrorResponse(error as ErrorResponse);
    console.log('Error updating carga:', formattedError);
    throw errorResponse;
  }
}
