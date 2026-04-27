import { apiGet, apiPost, apiPut } from "./baseClient";
import type { PaginationResponse } from "./Interfaces";
import type { VentaRequest, VentaResponse } from "./Interfaces";

export async function getByUserId(token: string, populate: string[], orderBy: string, state: string, size: number, page: number): Promise<PaginationResponse<VentaResponse>> {
  return await apiGet<PaginationResponse<VentaResponse>>(`/venta/token/ByUserId?populate=${populate.join(',')}&orderBy=${orderBy}&state=${state}&size=${size}&page=${page}`, token);
}

export async function updateSale(
  id: number,
  sales: VentaRequest,
): Promise<VentaResponse> {
  return await apiPut<VentaResponse>(`/venta/${id}`, sales);
}

export async function createSale(
  sales: VentaRequest,
): Promise<VentaResponse> {
  return await apiPost<VentaResponse>(`/venta`, sales);
}