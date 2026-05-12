import { apiGet, apiPost, apiPut } from "./baseClient";
import type { PaginationResponse } from "./Interfaces";
import type { VentaRequest, VentaResponse, productosDomicilioRequest } from "./Interfaces";

export async function getByUserId(token: string, populate: string[], orderBy: string, state: string, size: number, page: number): Promise<PaginationResponse<VentaResponse>> {
  return await apiGet<PaginationResponse<VentaResponse>>(`/venta/token/ByUserId?populate=${populate.join(',')}&orderBy=${orderBy}&state=${state}&size=${size}&page=${page}`, token);
}

export async function updateSale(
  id: number,
  sales: VentaRequest,
  token: string
): Promise<VentaResponse> {
  return await apiPut<VentaResponse>(`/venta/${id}`, sales, token);
}

export async function createSale(
  sales: VentaRequest,
  token: string
): Promise<VentaResponse> {
  return await apiPost<VentaResponse>(`/venta`, sales, token);
}

export async function getVentasHoyByDomicilioId(
  domicilioId: number,
  token,
  populate?: string[],
): Promise<VentaResponse> {
  const params = populate && populate.length > 0
    ? '?' + populate.map(p => `populate=${p}`).join('&')
    : '';
  return await apiGet<VentaResponse>(`/venta/ventaHoy/${domicilioId}${params}`, token);
}


export async function getPending(
  token: string,
  zona: string,
  ordenBy: string = "Mas Recientes",
  populate: string[],
  page: number = 0,
  size: number = 10
) {
  const query = `?ordenBy=${ordenBy}&zona=${zona}&populate=${populate.join(',')}&page=${page}&size=${size}`;
  return await apiGet<PaginationResponse<VentaResponse>>(`/venta/pending${query}`, token);
}

export async function createDriverSale(
  sales: VentaRequest,
  montoPagado: string,
  vaciosQty: productosDomicilioRequest[],
  token: string
): Promise<VentaResponse> {
  let query = '';
  if (montoPagado) {
    query = `?monto=${montoPagado}`;
  }
  const creatVentaDriverDTORequest = {
    venta: sales,
    productoDomicilio: vaciosQty,

  };
  return await apiPost<VentaResponse>(`/venta/driver${query}`, creatVentaDriverDTORequest, token);
}