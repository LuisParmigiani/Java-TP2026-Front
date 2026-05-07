import { apiGet, apiPost, apiPut } from "./baseClient";
import type { PaginationResponse } from "./Interfaces";
import type { VentaRequest, VentaResponse, productosDomicilioRequest } from "./Interfaces";

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
  console.log("Creating sale with data:", sales);
  return await apiPost<VentaResponse>(`/venta`, sales);
}

export async function getVentasHoyByDomicilioId(
  domicilioId: number,
  populate?: string[],
): Promise<VentaResponse> {
  const params = populate && populate.length > 0
    ? '?' + populate.map(p => `populate=${p}`).join('&')
    : '';
  return await apiGet<VentaResponse>(`/venta/ventaHoy/${domicilioId}${params}`);
}

export async function createDriverSale(
  sales: VentaRequest,
  montoPagado: string,
  vaciosQty: productosDomicilioRequest[]
): Promise<VentaResponse> {
  console.log("Creating driver sale with data:", sales);
  let query = '';
  if (montoPagado) {
    query = `?monto=${montoPagado}`;
  }
  const creatVentaDriverDTORequest = {
    venta: sales,
    productoDomicilio: vaciosQty
  };
  console.log("Request body for creating driver sale:", creatVentaDriverDTORequest);
  console.log("Query string for creating driver sale:", query);
  return await apiPost<VentaResponse>(`/venta/driver${query}`, creatVentaDriverDTORequest);
}