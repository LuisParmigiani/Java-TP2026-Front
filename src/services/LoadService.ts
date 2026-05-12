
import { apiGet, apiPut, apiPost } from "./baseClient";
import type { CargaRequest, CargaResponse, ErrorResponse } from "./Interfaces";
import { formatErrorResponse } from "../lib/utils.ts";

export async function fetchCargas(pupulate?: string[], token?: string): Promise<CargaResponse[]> {
  try {
    const response = await apiGet('/carga/hoy/?populate=' + (pupulate?.join(',') || ''), token);
    return response as CargaResponse[];
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    formatErrorResponse(error as ErrorResponse);
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
      return response as CargaResponse;
    }
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    formatErrorResponse(error as ErrorResponse);
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
    const response = await apiPut(`/carga/withCargaProductos${query}`, carga, token);
    return response as CargaResponse;
  } catch (error) {
    const errorResponse = error as ErrorResponse;
    formatErrorResponse(error as ErrorResponse);
    throw errorResponse;
  }
}
