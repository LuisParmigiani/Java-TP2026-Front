import { apiGet, apiPut } from "./baseClient";

import type { VentaRequest, VentaResponse } from "./Interfaces";

export async function getByUserId(token: string): Promise<VentaResponse[]> {
  return await apiGet<VentaResponse[]>(`/venta/token/ByUserId`, token);
}

export async function updateSale(
  id: number,
  sales: VentaRequest,
  token: string,
): Promise<VentaResponse> {
  return await apiPut<VentaResponse>(`/venta/${id}`, sales, token);
}
